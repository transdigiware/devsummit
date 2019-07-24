import { promises as fsp } from 'fs';
import { join } from 'path';

const defaultOpts = {
  prefix: 'classname',
  cssFileDir: '',
};

export default function(opts) {
  opts = Object.assign({}, defaultOpts, opts);
  if (!opts.cssFileDir) {
    this.error('Must have `cssFileDir` set');
  }
  const PREFIX = opts.prefix + ':';

  return {
    name: 'classname-loader',
    resolveId(source) {
      if (!source.startsWith(PREFIX)) {
        return;
      }
      // Don’t do anything here
      return source;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return;
      }
      const [, path, classname] = id.split(':');
      const realPath = join(opts.cssFileDir, path) + '.json';
      const contents = await fsp.readFile(realPath, 'utf-8');
      const data = JSON.parse(contents);
      return `export default "${data[classname]}"`;
    },
  };
}
