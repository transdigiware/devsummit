const confboxConfig = require('./lib/confbox-config.js');

const moduleName = 'confbox-config:';

export default function() {
  return {
    name: 'confbox-config-loader',
    resolveId(source) {
      if (source === moduleName) return source;
    },
    async load(id) {
      if (id !== moduleName) return;

      const outputExports = Object.entries(confboxConfig).map(
        ([key, val]) => `export const ${key} = ${JSON.stringify(val)}`,
      );
      return outputExports.join(';');
    },
  };
}
