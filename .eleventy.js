const fs = require('fs');

const date = require('date-and-time');
const nunjucks = require('nunjucks');

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

    if (!this._cache.has(css)) {
      const file = this._output + css + '.json';
      const json = fs.readFileSync(file, {
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

  const cssPerPage = new Map();

  /** Add some CSS, deduping anything along the way */
  eleventyConfig.addShortcode('css', (page, url) => {
    if (!cssPerPage.has(page.url)) {
      cssPerPage.set(page.url, new Set());
    }

    const set = cssPerPage.get(page.url);

    if (set.has(url)) return '';
    set.add(url);
    return new nunjucks.runtime.SafeString(
      `<link rel="stylesheet" href="confboxAsset(${url})">`,
    );
  });

  /** Format a date in the timezone of the conference */
  eleventyConfig.addShortcode('confDate', (timestamp, format) => {
    const offsetTime = new Date(timestamp.valueOf() + utcOffset);
    return date.format(offsetTime, format);
  });

  eleventyConfig.addCollection('faqs', collection => {
    const faqs = collection
      .getFilteredByTag('faq')
      .sort((a, b) => (a.inputPath < b.inputPath ? -1 : 1));

    const sections = [];
    let section;

    for (const faq of faqs) {
      if (!section || section.title !== faq.data.sectionTitle) {
        section = {
          title: faq.data.sectionTitle,
          items: [],
        };
        sections.push(section);
      }

      section.items.push(faq);
    }

    return sections;
  });

  return config;
};
