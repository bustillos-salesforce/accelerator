const path = require('path');

class PathResolver {
    getProjectRoot() {
        return path.resolve(__dirname, '../../../..');
    }

    resolveFromCwd(...segments) {
        return path.resolve(this.getProjectRoot(), ...segments);
    }

    resolveFromProjectRoot(...segments) {
        return path.resolve(this.getProjectRoot(), ...segments);
    }

    join(base, ...segments) {
        return path.join(base, ...segments);
    }
}

module.exports = new PathResolver();