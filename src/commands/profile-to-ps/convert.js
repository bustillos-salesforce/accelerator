const profileConvertService = require('../../core/services/ProfileConvertService');
const pathResolver = require('../../core/infra/PathResolver');

module.exports = (parent) => {
    parent.command('convert')
        .description('Converte os perfis baixados em Permission Sets utilizando o plugin Shane')
        .option('-d, --source-dir <path>', 'Diretório de metadados', './force-app/main/default/')
        .action(async (opts) => {
            const sourceDir = pathResolver.resolveFromCwd(opts.sourceDir);
            const profilesDir = pathResolver.join(sourceDir, 'profiles');
            await profileConvertService.execute(profilesDir, sourceDir);
        });
};