const profileListService = require('../../core/services/ProfileListService');
const cleanService = require('../../core/services/PermissionSetCleanService');
const profileRetrieveService = require('../../core/services/ProfileRetrieveService');
const profileConvertService = require('../../core/services/ProfileConvertService');
const tempCleanService = require('../../core/services/TempCleanService');
const pluginValidationService = require('../../core/services/PluginValidationService');
const pathResolver = require('../../core/infra/PathResolver');
const prompts = require('../../core/cli/prompts');

// Import sub-command registration functions
const registerList = require('./list-profiles');
const registerRetrieve = require('./retrieve');
const registerConvert = require('./convert');
const registerClean = require('./clean');

module.exports = (program) => {
    // Main Orchestrator Command
    const profileToPs = program.command('profile-to-ps')
        .alias('p2ps')
        .description('Migra Profiles para Permission Sets e limpa XMLs (Fluxo Completo)')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo')
        .option('-d, --source-dir <path>', 'Diretório de metadados', './force-app/main/default/')
        .option('--skip-query', 'Pula a etapa de listagem')
        .option('--skip-retrieve', 'Pula a etapa de retrieve')
        .action(async (options) => {
            const tempBaseDir = 'temp';
            try {
                await pluginValidationService.validate();
                const targetOrg = await prompts.resolveTargetOrg(options.targetOrg);
                const tempJson = pathResolver.resolveFromCwd('temp/profiles_to_migrate.json');
                const sourceDir = pathResolver.resolveFromCwd(options.sourceDir);
                const profilesDir = pathResolver.join(sourceDir, 'profiles');
                
                let profiles = [];
                if (!options.skipQuery) {
                    profiles = await profileListService.execute(targetOrg, tempJson);
                }
                
                if (!options.skipRetrieve) {
                    await profileRetrieveService.execute(targetOrg, tempJson, sourceDir);
                }

                await profileConvertService.execute(profilesDir, sourceDir);

                await cleanService.execute(sourceDir);
                
                console.log('\n✅ Processo concluído com sucesso!');
            } catch (error) {
                console.error(`\n❌ Falha na execução: ${error.message}`);
                process.exit(1);
            } finally {
                await tempCleanService.execute(tempBaseDir);
            }
        });

    // Register Sub-commands
    registerList(profileToPs);
    registerRetrieve(profileToPs);
    registerConvert(profileToPs);
    registerClean(profileToPs);
};