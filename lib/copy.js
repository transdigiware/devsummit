import { promisify } from 'util';
import path from 'path';
import { promises as fsp } from 'fs';

import glob from 'glob';

const globP = promisify(glob);

export default function copy(config) {
  return {
    name: 'copy',
    async generateBundle(options, bundle) {
      for (const [glob, { stripPrefix, dest }] of Object.entries(config)) {
        const files = await globP(glob);
        for (const file of files) {
          if (!file.startsWith(stripPrefix)) {
            continue;
          }
          const fileName = path.join(dest, file.slice(stripPrefix.length));
          const source = await fsp.readFile(file);
          bundle[fileName] = { fileName, source, type: 'asset' };
        }
      }
    },
  };
}
