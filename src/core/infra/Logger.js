const fs = require('fs-extra');
const path = require('path');
const pathResolver = require('./PathResolver'); // Importar PathResolver

const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

class Logger {
    constructor() {
        this.logPath = pathResolver.resolveFromCwd('error.log');
    }

    info(message) {
        if (message.startsWith('Etapa')) {
            // Adiciona espaçamento e cor magenta para destacar novas fases do processo
            console.log(`\n${COLORS.magenta}[INFO] ${message}${COLORS.reset}`);
        } else {
            // Info padrão em ciano para logs de rotina
            console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${message}`);
        }
    }

    warn(message) {
        console.warn(`${COLORS.yellow}[WARN] ${message}${COLORS.reset}`);
    }

    error(message) {
        console.error(`${COLORS.red}[ERROR] ${message}${COLORS.reset}`);
    }

    async errorWithStack(context, error) {
        const timestamp = new Date().toISOString();
        const errorMessage = error instanceof Error ? error.stack : error;
        const logEntry = `[${timestamp}] CONTEXT: ${context}\n${errorMessage}\n${'-'.repeat(50)}\n`;
        
        this.error(`${context}: ${error.message || error}`);
        await fs.appendFile(this.logPath, logEntry);
    }
}

module.exports = new Logger();