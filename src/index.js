const registerProfileToPs = require('./commands/profile-to-ps');
const registerAllRetrieve = require('./commands/all-retrieve');
const { createCommanderInstance } = require('./core/cli/commander-factory');

function init() {
    const program = createCommanderInstance();

    // Registra todos os comandos relacionados ao profile-to-ps
    registerProfileToPs(program);
    registerAllRetrieve(program);

    program.parse(process.argv);
}

module.exports = { init };