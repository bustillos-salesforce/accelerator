const { Command } = require('commander');

/**
 * Cria e configura a instância inicial do Commander.
 * @returns {Command} A instância configurada do Commander.
 */
function createCommanderInstance() {
    const program = new Command();

    program
        .name('accelerator')
        .description('CLI para automação de migração Salesforce')
        .version('1.0.0'); // A versão pode ser lida do package.json se necessário
    return program;
}
module.exports = { createCommanderInstance };