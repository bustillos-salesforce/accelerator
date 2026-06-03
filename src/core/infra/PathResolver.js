const path = require('path');

class PathResolver {
    resolveFromCwd(...segments) {
        return path.resolve(process.cwd(), ...segments);
    }

    join(base, ...segments) {
        return path.join(base, ...segments);
    }
}

module.exports = new PathResolver();