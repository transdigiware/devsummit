import { promisify } from 'util';

import glob from 'glob';

const globP = promisify(glob);

export default function globInputPlugin(globInput) {
  return {
    name: 'glob-input-plugin',
    async buildStart(options) {
      const files = await globP(globInput);
      options.input.push(...files);
    },
  };
}
