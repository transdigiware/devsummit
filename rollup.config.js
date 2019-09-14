import { promises as fsp } from 'fs';

import { terser } from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import htmlCSSPlugin from './lib/html-css-plugin.js';
import postCSSBuild from './lib/postcss-build.js';
import eleventyPlugin from './lib/11ty-plugin.js';
import globInputPlugin from './lib/glob-input-plugin';
import httpServer from './lib/http-server';
import buildStartSequencePlugin from './lib/build-start-sequence-plugin';
import classnamePlugin from './lib/classname-plugin';
import assetPlugin from './lib/asset-plugin';
import confboxConfigPlugin from './lib/confbox-config-plugin';

const confboxConfig = require('./confbox.config.js');

export default async function({ watch }) {
  await Promise.all([postCSSBuild('src/**/*.css', '.build-tmp', { watch })]);
  if (watch) {
    httpServer();
  }

  return {
    input: {
      'nuke-sw': 'src/nuke-sw.js',
    },
    output: {
      dir: 'build' + confboxConfig.path,
      format: 'esm',
      assetFileNames: '[name]-[hash][extname]',
    },
    watch: {
      clearScreen: false,
      // Avoid watching intermediate files, else watch gets stuck in a loop.
      // 11ty source files are watched by eleventyPlugin.
      exclude: '.build-tmp/**/*.html',
    },
    plugins: [
      nodeResolve(),
      {
        resolveFileUrl({ fileName }) {
          return JSON.stringify(confboxConfig.path + fileName);
        },
      },
      buildStartSequencePlugin(),
      eleventyPlugin(),
      globInputPlugin('.build-tmp/**/*.html'),
      htmlCSSPlugin(),
      assetPlugin(),
      classnamePlugin('.build-tmp'),
      confboxConfigPlugin(),
      babel({
        exclude: 'node_modules/**',
      }),
      terser({ ecma: 8, module: true }),
      {
        // This is a dirty hack to copy /devsummit/404.html to /404.html, which is where
        // Firebase hosting will look for the 404 page.
        async writeBundle(bundle) {
          const notFound = Object.values(bundle).find(entry =>
            entry.fileName.endsWith('404.html'),
          );
          await fsp.writeFile('build/404.html', notFound.code);
        },
      },
    ],
  };
}
