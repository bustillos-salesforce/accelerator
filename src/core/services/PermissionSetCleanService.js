const fs = require('fs-extra');
const path = require('path');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver'); // Importar PathResolver
const cleanRules = require('../../config/permission-set-clean-rules.json');

class PermissionSetCleanService {
    constructor() {
        this.parser = new XMLParser({ ignoreAttributes: false, parseNodeValue: false });
        this.builder = new XMLBuilder({ ignoreAttributes: false, format: true, indentBy: '    ' });
    }

    /**
     * Orquestra o processo de limpeza de todos os arquivos de Permission Set em um diretório.
     * @param {string} sourceDir - O diretório raiz do projeto Salesforce (ex: 'force-app/main/default/').
     */
    async execute(sourceDir) {
        logger.info('Etapa 4: Limpando Permission Sets gerados...');
        const psDir = pathResolver.join(sourceDir, 'permissionsets');

        if (!(await fs.pathExists(psDir))) {
            logger.warn('Diretório de Permission Sets não encontrado.');
            return;
        }

        const files = await this._getPermissionSetFiles(psDir);

        for (const file of files) {
            await this._processPermissionSetFile(pathResolver.join(psDir, file));
        }
    }

    /**
     * Obtém a lista de arquivos de Permission Set em um diretório.
     * @param {string} psDir - O caminho para o diretório de Permission Sets.
     * @returns {Promise<string[]>} Uma lista de nomes de arquivos de Permission Set.
     */
    async _getPermissionSetFiles(psDir) {
        return (await fs.readdir(psDir)).filter(f => f.endsWith('.permissionset-meta.xml'));
    }

    /**
     * Processa um único arquivo de Permission Set: lê, limpa, loga estatísticas e escreve de volta.
     * @param {string} filePath - O caminho completo para o arquivo de Permission Set.
     */
    async _processPermissionSetFile(filePath) {
        const file = path.basename(filePath);
        const xmlContent = await fs.readFile(filePath, 'utf-8');
        const jsonObj = this.parser.parse(xmlContent);

        if (jsonObj.PermissionSet) {
            const stats = this._applyCleaningRules(jsonObj.PermissionSet);
            this._logCleaningStats(file, stats);
        }

        const cleanedXml = this.builder.build(jsonObj);
        await fs.writeFile(filePath, cleanedXml);
    }

    /**
     * Aplica as regras de limpeza a um objeto JSON de Permission Set.
     * @param {object} permissionSetJson - O objeto JSON que representa o Permission Set.
     * @returns {object} Um objeto com as estatísticas de remoção por tipo de nó.
     */
    _applyCleaningRules(permissionSetJson) {
        const stats = {};
        for (const [nodeKey, accessKeys] of Object.entries(cleanRules)) {
            stats[nodeKey] = this.cleanNode(permissionSetJson, nodeKey, accessKeys);
        }
        return stats;
    }

    /**
     * Gera e loga as estatísticas de limpeza para um arquivo.
     * @param {string} fileName - O nome do arquivo de Permission Set.
     * @param {object} stats - O objeto com as estatísticas de remoção.
     */
    _logCleaningStats(fileName, stats) {
        const totalRemoved = Object.values(stats).reduce((a, b) => a + b, 0);
        const details = Object.entries(stats)
            .filter(([_, count]) => count > 0)
            .map(([key, count]) => `${key}: ${count}`)
            .join(', ');

        logger.info(`Otimizado: ${fileName} | Entradas removidas: ${totalRemoved}${totalRemoved > 0 ? ` (${details})` : ''}`);
    }

    /**
     * Limpa um nó específico dentro do Permission Set, removendo itens que não concedem acesso.
     * @param {object} parent - O objeto pai (geralmente `jsonObj.PermissionSet`).
     * @param {string} key - A chave do nó a ser limpo (ex: 'fieldPermissions').
     * @param {string[]} accessKeys - As chaves de acesso a serem verificadas (ex: ['readable', 'editable']).
     * @returns {number} O número de itens removidos.
     */
    cleanNode(parent, key, accessKeys) {
        if (!parent[key]) return 0;

        let items = Array.isArray(parent[key]) ? parent[key] : [parent[key]];
        const originalCount = items.length;
        
        const filtered = items.filter(item => {
            // Mantém se QUALQUER uma das chaves de acesso for 'true'
            return accessKeys.some(k => {
                const val = String(item[k]).toLowerCase(); // Garante que o valor é uma string para comparação
                return val === 'true' || val === 'available' || val === 'visible';
            });
        });

        const removedCount = originalCount - filtered.length;

        if (filtered.length === 0) {
            delete parent[key];
        } else {
            parent[key] = filtered;
        }

        return removedCount;
    }
}

module.exports = new PermissionSetCleanService();