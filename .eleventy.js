const fs = require('fs');

const date = require('date-and-time');
const nunjucks = require('nunjucks');
const { dirname, basename } = require('path');

const { utcOffset, path: confboxPath } = require('./lib/confbox-config');

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
    pathPrefix: confboxPath,
  };

  const modCSS = new ModularClassName(config.dir.output);

  /** Get a class name from a CSS module */
  eleventyConfig.addShortcode('className', (css, className) => {
    return modCSS.getClassName(css, className);
  });

  const cssPerPage = new Map();

  // This is to hack around https://github.com/11ty/eleventy/issues/638
  eleventyConfig.addShortcode('pageStart', page => {
    cssPerPage.set(page.url, new Set());
    return '';
  });

  /** Add some CSS, deduping anything along the way */
  eleventyConfig.addShortcode('css', (page, url) => {
    if (!cssPerPage.has(page.url)) {
      cssPerPage.set(page.url, new Set());
    }

    const set = cssPerPage.get(page.url);

    if (set.has(url)) return '';
    set.add(url);

    return new nunjucks.runtime.SafeString(
      `<style>confboxInline(confboxAsset(${url}))</style>`,
    );
  });

  eleventyConfig.addShortcode('headingSlug', str => {
    return new nunjucks.runtime.SafeString(
      str.replace(
        /\s/g,
        () =>
          `<span class=${modCSS.getClassName(
            '/_includes/module.css',
            'slug-dash',
          )}></span>`,
      ),
    );
  });

  eleventyConfig.addShortcode('idify', str => {
    return str.toLowerCase().replace(/\s/g, '-');
  });

  /** Format a date in the timezone of the conference */
  eleventyConfig.addShortcode('confDate', (timestamp, format) => {
    const offsetTime = new Date(timestamp.valueOf() + utcOffset);
    return date.format(offsetTime, format);
  });

  /** Get an ISO 8601 version of a date */
  eleventyConfig.addShortcode('isoDate', timestamp => {
    return new Date(timestamp.valueOf()).toISOString();
  });

  eleventyConfig.addCollection('faqs', collection => {
    const faqs = collection
      .getFilteredByTag('faq')
      .sort((a, b) => (a.inputPath < b.inputPath ? -1 : 1));

    const sections = [];
    let section;

    for (const faq of faqs) {
      const folder = basename(dirname(faq.data.page.inputPath));
      if (!section || section.folder !== folder || faq.data.question) {
        section = {
          title: faq.data.question ? faq.data.title : faq.data.sectionTitle,
          question: faq.data.question
            ? faq.data.question
            : faq.data.sectionQuestion,
          answer: faq.data.question ? faq.data.answer : faq.data.sectionAnswer,
          folder,
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
