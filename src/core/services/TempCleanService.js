const fs = require('fs-extra');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver');

class TempCleanService {
    /**
     * Remove o diretório temporário.
     * @param {string} tempDirPath - O caminho para o diretório temporário a ser limpo.
     */
    async execute(tempDirPath) {
        logger.info('Iniciando limpeza do diretório temporário...');
        const resolvedTempDirPath = pathResolver.resolveFromCwd(tempDirPath);
        if (await fs.pathExists(resolvedTempDirPath)) {
            await fs.remove(resolvedTempDirPath);
            logger.info(`Diretório temporário removido: ${resolvedTempDirPath}`);
        } else {
            logger.info(`Diretório temporário não encontrado: ${resolvedTempDirPath}. Nenhuma limpeza necessária.`);
        }
    }
}

module.exports = new TempCleanService();