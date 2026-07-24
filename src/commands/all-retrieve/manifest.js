const sfCli = require('../../core/infra/SfCli');
const prompts = require('../../core/cli/prompts');
const logger = require('../../core/infra/Logger');
const pathResolver = require('../../core/infra/PathResolver');

async function runManifestStep(options = {}) {
    try {
        logger.info('Etapa 1: Resolvendo org alvo...');
        const targetOrg = await prompts.resolveTargetOrg(options.targetOrg);
        console.log(`[OK] Org selecionada: ${targetOrg}`);

        logger.info(`Etapa 2: Gerando manifest a partir da org ${targetOrg}...`);
        const manifestDir = pathResolver.resolveFromProjectRoot('manifest');
        const command = `sf project generate manifest --output-dir ${manifestDir} --from-org ${targetOrg}`;
        console.log(`[RUN] ${command}`);
        const result = await sfCli.run(command);

        if (result.exitCode !== 0) {
            throw new Error(result.stderr || 'Falha ao gerar o manifest.');
        }

        console.log('[OK] Manifest gerado com sucesso');
        console.log('✅ Arquivo gerado em ./manifest/package.xml');
    } catch (error) {
        logger.error(`Falha ao gerar o manifest: ${error.message}`);
        process.exit(1);
    }
}

module.exports = (parentCommand) => {
    parentCommand.command('manifest')
        .description('Gera o manifest package.xml a partir da org')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo')
        .action(async (options) => {
            await runManifestStep(options);
        });
};

module.exports.run = runManifestStep;
