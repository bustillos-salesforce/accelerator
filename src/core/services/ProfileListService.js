const fs = require('fs-extra');
const path = require('path');
const sfCli = require('../infra/SfCli');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver'); // Importar PathResolver

class ProfileListService {
    async execute(targetOrg, outputFilePath) {
        logger.info('Etapa 1: Listando Profiles Customizados...');
        
        const query = "SELECT Profile.Name FROM PermissionSet WHERE IsCustom = true AND ProfileId != null";
        const command = `sf data query -q "${query}" -o ${targetOrg} --json`;
        
        const result = await sfCli.run(command);
        
        if (result.exitCode !== 0) {
            await logger.errorWithStack('ProfileListService', result.stderr);
            const detailedErrorMsg = `Falha ao consultar profiles na Org. Detalhes: ${result.stderr}`;
            throw new Error(detailedErrorMsg);
        }

        const data = JSON.parse(result.stdout);
        const profiles = data.result.records.map(r => r.Profile.Name);

        if (profiles.length > 0) {
            logger.info('Perfis customizados identificados:');
            console.table(profiles.map(name => ({ 'Nome do Perfil': name })));
        }

        await fs.ensureDir(pathResolver.join(path.dirname(outputFilePath))); // Usar pathResolver.join
        await fs.writeJson(outputFilePath, { profiles }, { spaces: 2 });

        logger.info(`Total de profiles encontrados: ${profiles.length}`);
        logger.info(`Lista salva em: ${outputFilePath}`);
        
        return profiles;
    }
}

module.exports = new ProfileListService();