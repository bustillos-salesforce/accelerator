const logger = require('../../core/infra/Logger');
const packageManifestCleanupService = require('../../core/services/PackageManifestCleanupService');

async function runCleanManifestStep() {
    try {
        logger.info('Removendo itens inválidos do package.xml...');
        const result = await packageManifestCleanupService.execute({
            manifestFilePath: 'manifest/package.xml',
        });

        if (result.removedCount > 0) {
            console.log(`[OK] Itens removidos do manifest: ${result.removedCount}`);
        } else {
            console.log('[OK] Nenhum item inválido foi removido do manifest.');
        }
    } catch (error) {
        logger.error(`Falha na limpeza do manifest: ${error.message}`);
        process.exit(1);
    }
}

module.exports = (parentCommand) => {
    parentCommand.command('cleanManifest')
        .description('Remove itens inválidos do manifest package.xml')
        .action(async () => {
            await runCleanManifestStep();
        });
};

module.exports.run = runCleanManifestStep;
