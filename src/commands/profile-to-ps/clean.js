const cleanService = require('../../core/services/PermissionSetCleanService');
const pathResolver = require('../../core/infra/PathResolver');

module.exports = (parent) => {
    parent.command('clean')
        .description('Limpa e otimiza os XMLs dos Permission Sets gerados')
        .option('-d, --source-dir <path>', 'Diretório de metadados', './force-app/main/default/')
        .action(async (opts) => {
            await cleanService.execute(pathResolver.resolveFromCwd(opts.sourceDir));
        });
};