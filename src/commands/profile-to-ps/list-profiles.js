const profileListService = require('../../core/services/ProfileListService');
const pathResolver = require('../../core/infra/PathResolver');
const prompts = require('../../core/cli/prompts');

module.exports = (parent) => {
    parent.command('list [targetOrg]')
        .description('Lista os Profiles customizados da Org e gera o arquivo JSON temporário')
        .option('-o, --target-org <alias>', 'Alias ou Username da Org alvo')
        .action(async (targetOrgArg, opts, cmd) => {
            const targetOrg = await prompts.resolveTargetOrg(targetOrgArg || opts.targetOrg || cmd.parent.opts().targetOrg);
            const tempJson = pathResolver.resolveFromCwd('temp/profiles_to_migrate.json');
            await profileListService.execute(targetOrg, tempJson);
        });
};