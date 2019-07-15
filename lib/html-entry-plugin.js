import fs from 'fs';
import { join, relative, resolve } from 'path';

import { minify as minifyHTML } from 'html-minifier';

/**
 * When given a path like /foo/bar.jpg, it'll look for it in .build-tmp first, then fall back to src
 * if it doesn't exist in .build-tmp
 *
 * @param {string} path
 */
function getAsset(path) {
  try {
    return fs.readFileSync(path);
  } catch (err) {
    const relativePath = relative('.build-tmp', path);
    const absoluteSrcPath = resolve('src', relativePath);
    return fs.readFileSync(absoluteSrcPath);
  }
}

function processHTML(rollup, htmlPath, assetCache) {
  let html = fs.readFileSync(htmlPath, { encoding: 'utf8' });

  // Find assets
  html = html.replace(
    /confboxAsset\((['"]?)(.*?)\1\)/g,
    (fullMatch, p1, path) => {
      if (!path.startsWith('/')) {
        throw new TypeError(
          `confboxAsset must be absolute (start with /): ${path}`,
        );
      }
      const filePath = join(...('.build-tmp' + path).split('/'));
      const targetPath = path.slice(1);

      if (!assetCache.has(targetPath)) {
        const source = getAsset(filePath);
        const id = rollup.emitAsset(targetPath, source);
        assetCache.set(targetPath, id);
      }

      // This will be replaced with the real URL in generateBundle.
      return `confboxAsset#${assetCache.get(targetPath)}#`;
    },
  );

  // Find scripts
  html = html.replace(
    /confboxScript\((['"]?)(.*?)\1\)/g,
    (fullMatch, p1, path) => {
      if (!path.startsWith('/')) {
        throw new TypeError(
          `confboxScript must be absolute (start with /): ${path}`,
        );
      }
      const filePath = join(...('src' + path).split('/'));
      // Remove leading slash and extension (else rollup adds another extension)
      const targetPath = path.slice(1).replace(/\.[^\.]+$/, '');
      const id = rollup.emitChunk(filePath, { name: targetPath });

      // This will be replaced with the real URL in generateBundle.
      return `confboxScript#${id}#`;
    },
  );

  return html;
}

const defaultOptions = {
  minifyOptions: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  },
};

export default function htmlEntryPlugin(userOptions = {}) {
  let htmlOutput;
  let assetCache;
  const options = { ...defaultOptions, ...userOptions };

  return {
    name: 'html-entry-plugin',
    async buildStart() {
      htmlOutput = new Map();
      assetCache = new Map();
    },
    load(id) {
      if (!id.endsWith('.html')) return;
      const html = processHTML(this, id, assetCache);
      const targetPath = relative('.build-tmp', id);
      htmlOutput.set(id, { html, targetPath });
      return `export default 'this will be transformed later';`;
    },
    generateBundle(_, bundle) {
      for (const [key, item] of Object.entries(bundle)) {
        if (!htmlOutput.has(item.facadeModuleId)) continue;
        const { html, targetPath } = htmlOutput.get(item.facadeModuleId);
        delete bundle[key];
        bundle[targetPath] = item;
        item.fileName = targetPath;
        item.code = html;

        // Set final URLs for assets
        item.code = item.code.replace(
          /confboxAsset#([^#]+)#/g,
          (_, id) => '/' + this.getAssetFileName(id),
        );
        // Set final URLs for scripts
        item.code = item.code.replace(
          /confboxScript#([^#]+)#/g,
          (_, id) => '/' + this.getChunkFileName(id),
        );
        // Minify HTML
        if (options.minifyOptions) {
          item.code = minifyHTML(item.code, options.minifyOptions);
        }
      }
    },
  };
}
