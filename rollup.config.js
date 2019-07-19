import { terser } from 'rollup-plugin-terser';

import htmlCSSPlugin from './lib/html-css-plugin.js';
import postCSSBuild from './lib/postcss-build.js';
import eleventyBuild from './lib/11ty-build.js';
import globInputPlugin from './lib/glob-input-plugin';
import httpServer from './lib/http-server';
import ejs from './lib/ejs';

export default async function({ watch }) {
  await Promise.all([postCSSBuild('src/**/*.css', '.build-tmp', { watch })]);
  await eleventyBuild({ watch });
  if (watch) {
    httpServer();
  }

  return {
    input: {
      'nuke-sw': 'src/nuke-sw.js',
    },
    output: {
      dir: 'build',
      format: 'esm',
      assetFileNames: '[name]-[hash][extname]',
    },
    watch: { clearScreen: false },
    plugins: [
      {
        resolveFileUrl({ fileName }) {
          return JSON.stringify('/' + fileName);
        },
      },
      globInputPlugin('.build-tmp/**/*.html'),
      htmlCSSPlugin(),
      terser({ ecma: 8, module: true }),
      ejs('netlify.toml.ejs', 'netlify.toml'),
      // Not great, but firebase.json is inside the deploy folder,
      // so we have to break out the build folder here.
      ejs('firebase.json.ejs', '../firebase.json'),
    ],
  };
}
