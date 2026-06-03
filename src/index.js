const registerProfileToPs = require('./commands/profile-to-ps');
const { createCommanderInstance } = require('./core/cli/commander-factory');

function init() {
    const program = createCommanderInstance();

    // Registra todos os comandos relacionados ao profile-to-ps
    registerProfileToPs(program);

    program.parse(process.argv);
}

module.exports = { init };