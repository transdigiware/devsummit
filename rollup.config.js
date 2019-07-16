import { terser } from 'rollup-plugin-terser';

import htmlCSSPlugin from './lib/html-css-plugin.js';
import postCSSBuild from './lib/postcss-build.js';
import eleventyBuild from './lib/11ty-build.js';
import globInputPlugin from './lib/glob-input-plugin';
import httpServer from './lib/http-server';

export default async function({ watch }) {
  await Promise.all([postCSSBuild('src/**/*.css', '.build-tmp', { watch })]);
  await eleventyBuild({ watch });
  if (watch) {
    httpServer();
  }

  return {
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
    ],
  };
}
