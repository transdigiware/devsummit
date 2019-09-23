import { promisify } from 'util';
import path from 'path';
import { promises as fsp } from 'fs';

import glob from 'glob';

const globP = promisify(glob);

export default function copy(config) {
  return {
    name: 'copy',
    async generateBundle(options, bundle) {
      for (const [glob, { prefix, dest }] of Object.entries(config)) {
        const files = await globP(glob);
        for (const file of files) {
          if (!file.startsWith(prefix)) {
            continue;
          }
          const fileName = path.join(dest, file.slice(prefix.length));
          bundle[fileName] = {
            fileName,
            code: await fsp.readFile(file, 'utf-8'),
          };
        }
      }
      // const entries = paths.map(inputPath => [
      //   inputPath
      //     .split(path.sep)
      //     .slice(1)
      //     .join(path.sep)
      //     // Remove extension from name.
      //     // Otherwise, Rollup seems to branch on html/css vs js extensions.
      //     // This way we can normalise it.
      //     // It's added again in html-css-plugin's generateBundle.
      //     .replace(/\.[^\.]+$/, ''),
      //   inputPath,
      // ]);
      // options.input = { ...options.input, ...Object.fromEntries(entries) };
    },
  };
}
