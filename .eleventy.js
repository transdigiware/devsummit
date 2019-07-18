const fs = require('fs');

const date = require('date-and-time');

const { utcOffset } = require('./lib/confbox-config');

const watch = process.argv.includes('--watch');

class ModularClassName {
  constructor(output) {
    this._output = output;
    this._cache = new Map();
  }
  getClassName(css, className) {
    if (!css.startsWith('/')) {
      throw new TypeError('CSS path must be absolute (starts with /)');
    }

    if (!this._cache.has(css)) {
      const file = this._output + css + '.json';
      const json = fs.readFileSync(file, {
        encoding: 'utf8',
      });
      this._cache.set(css, JSON.parse(json));

      if (watch) {
        const watcher = fs.watch(file);
        watcher.on('change', () => {
          this._cache.delete(css);
          watcher.close();
        });
      }
    }

    const data = this._cache.get(css);

    if (!(className in data)) {
      throw new TypeError(`Cannot find className "${className}" in ${css}`);
    }

    return data[className];
  }
}

module.exports = function(eleventyConfig) {
  const config = {
    dir: {
      input: 'src',
      output: '.build-tmp',
    },
  };

  const modCSS = new ModularClassName(config.dir.output);

  /** Get a class name from a CSS module */
  eleventyConfig.addShortcode('className', (css, className) => {
    return modCSS.getClassName(css, className);
  });

  /** Format a date in the timezone of the conference */
  eleventyConfig.addShortcode('confDate', (timestamp, format) => {
    const offsetTime = new Date(timestamp.valueOf() + utcOffset);
    return date.format(offsetTime, format);
  });

  return config;
};
