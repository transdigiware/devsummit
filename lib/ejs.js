import ejs from 'ejs';
import { promisify } from 'util';

const renderP = promisify(ejs.renderFile);

export default function(fin, fileName) {
  return {
    async buildStart() {
      this.addWatchFile(fin);
    },
    async generateBundle(_options, bundle) {
      const code = await renderP(fin, { bundle });
      bundle[fileName] = {
        code,
        fileName,
      };
    },
  };
}
