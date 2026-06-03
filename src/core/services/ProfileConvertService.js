const fs = require('fs-extra');
const path = require('path');
const sfCli = require('../infra/SfCli');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver');

class ProfileConvertService {
    async execute(profilesDir, sourceDir) {
        logger.info('Etapa 3: Convertendo Profiles para Permission Sets (Plugin Shane)...');

        const resolvedProfilesDir = pathResolver.resolveFromCwd(profilesDir);
        const resolvedSourceDir = pathResolver.resolveFromCwd(sourceDir);

        if (!await fs.pathExists(resolvedProfilesDir)) {
            logger.warn(`Diretório de profiles não encontrado: ${resolvedProfilesDir}`);
            return;
        }

        const files = (await fs.readdir(resolvedProfilesDir)).filter(f => f.endsWith('.profile-meta.xml'));
        
        if (files.length === 0) {
            logger.warn('Nenhum arquivo de profile encontrado para conversão.');
            return;
        }

        const projectRoot = this.findProjectRoot(resolvedSourceDir);

        for (const file of files) {
            const profileName = file.replace('.profile-meta.xml', '');
            const permSetName = `PS_${profileName.replace(/\s+/g, '_')}`;
            
            logger.info(`Convertendo: ${profileName} -> ${permSetName}`);

            // sf shane profile convert -p <profile> -n <name> -e (keep existing)
            const command = `sf shane profile convert -p "${profileName}" -n "${permSetName}" -e`;
            const result = await sfCli.run(command, { cwd: projectRoot });

            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error(result.stderr);

            if (result.exitCode !== 0) {
                await logger.errorWithStack(`ProfileConvertService: ${profileName}`, result.stderr);
            } else {
                logger.info(`Sucesso: ${permSetName} criado.`);
            }
        }
    }

    findProjectRoot(startPath) {
        let dir = startPath;
        while (dir !== path.parse(dir).root) {
            if (fs.existsSync(pathResolver.join(dir, 'sfdx-project.json'))) {
                return dir;
            }
            dir = path.dirname(dir);
        }
        return process.cwd();
    }
}

module.exports = new ProfileConvertService();