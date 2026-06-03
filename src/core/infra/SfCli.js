const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class SfCli {
    async run(command, options = {}) {
        try {
            const { stdout, stderr } = await execPromise(command, {
                cwd: options.cwd || process.cwd(),
                maxBuffer: 1024 * 1024 * 10 // 10MB
            });
            return {
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                exitCode: 0
            };
        } catch (error) {
            return {
                stdout: error.stdout ? error.stdout.trim() : '',
                stderr: error.stderr ? error.stderr.trim() : error.message,
                exitCode: error.code || 1
            };
        }
    }
}

module.exports = new SfCli();