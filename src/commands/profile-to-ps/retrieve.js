const profileRetrieveService = require('../../core/services/ProfileRetrieveService');
const pathResolver = require('../../core/infra/PathResolver');
const prompts = require('../../core/cli/prompts');

module.exports = (parent) => {
    parent.command('retrieve [targetOrg]')
        .description('Realiza o retrieve dos perfis da Org baseando-se no arquivo JSON')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo')
        .option('-d, --source-dir <path>', 'Diretório de metadados', './force-app/main/default/')
        .action(async (targetOrgArg, opts, cmd) => {
            const targetOrg = await prompts.resolveTargetOrg(targetOrgArg || opts.targetOrg || cmd.parent.opts().targetOrg);
            const sourceDir = opts.sourceDir || cmd.parent.opts().sourceDir || './force-app/main/default/';
            const tempJson = pathResolver.resolveFromCwd('temp/profiles_to_migrate.json');
            await profileRetrieveService.execute(targetOrg, tempJson, pathResolver.resolveFromCwd(sourceDir));
        });
};