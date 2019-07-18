const fs = require('fs');

const date = require('date-and-time');

const { utcOffset } = require('./lib/confbox-config');

class ModularClassName {
  constructor(output) {
    this._output = output;
    this._cache = new Map();
  }
  getClassName(css, className) {
    if (!css.startsWith('/')) {
      throw new TypeError('CSS path must be absolute (starts with /)');
    }

    // TODO: for watch mode, watch for changes to CSS JSON
    if (!this._cache.has(css)) {
      const json = fs.readFileSync(this._output + css + '.json', {
        encoding: 'utf8',
      });
      this._cache.set(css, JSON.parse(json));
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
