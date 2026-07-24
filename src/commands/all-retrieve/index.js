const sfCli = require('../../core/infra/SfCli');
const prompts = require('../../core/cli/prompts');
const logger = require('../../core/infra/Logger');
const pathResolver = require('../../core/infra/PathResolver');
const packageManifestCleanupService = require('../../core/services/PackageManifestCleanupService');
const manifestService = require('./manifest');
const cleanManifestService = require('./clean-manifest');

async function runFullFlow(options = {}) {
    try {
        logger.info('Etapa 1: Resolvendo org alvo...');
        const targetOrg = await prompts.resolveTargetOrg(options.targetOrg);
        console.log(`[OK] Org selecionada: ${targetOrg}`);

        logger.info(`Etapa 2: Gerando manifest a partir da org ${targetOrg}...`);
        const manifestDir = pathResolver.resolveFromProjectRoot('manifest');
        const generateCommand = `sf project generate manifest --output-dir ${manifestDir} --from-org ${targetOrg}`;
        console.log(`[RUN] ${generateCommand}`);
        const generateResult = await sfCli.run(generateCommand);

        if (generateResult.exitCode !== 0) {
            throw new Error(generateResult.stderr || 'Falha ao gerar o manifest.');
        }
        console.log('[OK] Manifest gerado com sucesso');

        logger.info('Etapa 3: Removendo itens inválidos do package.xml...');
        const cleanupResult = await packageManifestCleanupService.execute({
            manifestFilePath: 'manifest/package.xml',
        });

        if (cleanupResult.removedCount > 0) {
            console.log(`[OK] Itens removidos do manifest: ${cleanupResult.removedCount}`);
        } else {
            console.log('[OK] Nenhum item inválido foi removido do manifest.');
        }

        console.log(`\n➡️  Execute: sf project retrieve start -x manifest/package.xml -o ${targetOrg}`);
    } catch (error) {
        logger.error(`Falha na execução do allRetrieve: ${error.message}`);
        process.exit(1);
    }
}

module.exports = (program) => {
    const allRetrieve = program.command('allRetrieve')
        .alias('ar')
        .description('Gera manifest da org, limpa package.xml e sugere retrieve')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo');

    allRetrieve.action(async (options) => {
        await runFullFlow(options);
    });

    allRetrieve.command('manifest')
        .description('Gera o manifest package.xml a partir da org')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo')
        .action(async (options) => {
            const targetOrg = options.targetOrg || allRetrieve.opts()?.targetOrg;
            await manifestService.run({ ...options, targetOrg });
        });

    allRetrieve.command('cleanManifest')
        .description('Remove itens inválidos do manifest package.xml')
        .action(async () => {
            await cleanManifestService.run();
        });
};
