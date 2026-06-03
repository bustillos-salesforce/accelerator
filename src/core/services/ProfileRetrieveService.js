const fs = require('fs-extra');
const path = require('path');
const sfCli = require('../infra/SfCli');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver'); // Importar PathResolver

const BATCH_SIZE = 10; // Número de perfis por lote

/**
 * Serviço responsável por recuperar os metadados dos Profiles da Org Salesforce.
 * Utiliza o plugin 'sfdx-plugin-source-read' (comando 'sf crud-mdapi read')
 * para baixar os arquivos XML dos perfis em lotes e armazená-los temporariamente.
 */
class ProfileRetrieveService {
    /**
     * Executa o processo de recuperação de perfis da Org.
     *
     * @param {string} targetOrg - O alias ou username da Org Salesforce alvo.
     * @param {string} profilesJsonPath - O caminho completo para o arquivo JSON contendo a lista de nomes dos perfis a serem recuperados.
     * @param {string} projectSourceDir - O caminho completo para o diretório de metadados do projeto Salesforce (ex: 'force-app/main/default/').
     * @returns {Promise<{retrievedCount: number, errorCount: number}>} Um objeto com a contagem de perfis recuperados e falhas.
     * @throws {Error} Se o arquivo JSON de perfis não for encontrado ou se não houver perfis para recuperar.
     */
    async execute(targetOrg, profilesJsonPath, projectSourceDir) {
        logger.info('Etapa 2: Recuperando Profiles da Org em lotes...');

        // 1. Validar a existência do arquivo JSON de perfis
        if (!await fs.pathExists(profilesJsonPath)) {
            throw new Error(`Arquivo de profiles não encontrado: ${profilesJsonPath}. Execute a etapa de listagem primeiro.`);
        }

        const { profiles } = await fs.readJson(profilesJsonPath);

        if (!profiles || profiles.length === 0) {
            logger.warn('Nenhum profile encontrado para recuperar.');
            return { retrievedCount: 0, errorCount: 0 };
        }

        let retrievedCount = 0;
        let errorCount = 0;

        // 4. Processar perfis em lotes
        for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
            const batchProfiles = profiles.slice(i, i + BATCH_SIZE);
            const metadataFlags = batchProfiles.map(p => `--metadata "Profile:${p}"`).join(' ');
            const command = `sf crud-mdapi read ${metadataFlags} -o ${targetOrg}`;

            logger.info(`Recuperando lote de profiles via crud-mdapi read (${i + 1}-${Math.min(i + BATCH_SIZE, profiles.length)}/${profiles.length})...`);

            const result = await sfCli.run(command);

            // Exibe o retorno nativo do Salesforce CLI (tabelas de sucesso/erro)
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error(result.stderr);

            if (result.exitCode !== 0) {
                errorCount += batchProfiles.length;
                await logger.errorWithStack(`ProfileRetrieveService (Lote ${Math.floor(i / BATCH_SIZE) + 1})`, result.stderr);
                logger.error(`Falha ao recuperar lote: ${batchProfiles.join(', ')}. Detalhes: ${result.stderr}`);
                // Continua para o próximo lote, mesmo em caso de falha de um lote.
            } else {
                retrievedCount += batchProfiles.length;
                logger.info(`Lote recuperado com sucesso: ${batchProfiles.join(', ')}`);
            }
        }

        logger.info(`Resumo da recuperação: ${retrievedCount} profiles recuperados, ${errorCount} falhas.`);
        return { retrievedCount, errorCount };
    }
}

module.exports = new ProfileRetrieveService();