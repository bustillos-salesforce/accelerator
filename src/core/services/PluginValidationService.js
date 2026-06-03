const sfCli = require('../infra/SfCli');
const logger = require('../infra/Logger');

class PluginValidationService {
    /**
     * Valida se os plugins necessários do Salesforce CLI estão instalados.
     */
    async validate() {
        logger.info('Validando plugins do Salesforce CLI...');
        const result = await sfCli.run('sf plugins --json');

        if (result.exitCode !== 0) {
            const errorMsg = `Falha ao listar plugins do Salesforce CLI: ${result.stderr}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        const plugins = JSON.parse(result.stdout);
        const pluginNames = plugins.map(p => p.name);

        const requiredPlugins = [
            'shane-sfdx-plugins',
            'sfdx-plugin-source-read'
        ];

        const missingPlugins = requiredPlugins.filter(p => !pluginNames.includes(p));

        if (missingPlugins.length > 0) {
            const errorMsg = `Plugins obrigatórios ausentes: ${missingPlugins.join(', ')}. Instale-os usando "sf plugins install <plugin>".`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        logger.info('Plugins validados com sucesso.');
    }
}

module.exports = new PluginValidationService();