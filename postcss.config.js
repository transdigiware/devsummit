const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-modules')({
      getJSON: function(cssFileName, json, outputFileName) {
        const parsedPath = path.parse(outputFileName);
        mkdirp.sync(parsedPath.dir);
        fs.writeFileSync(outputFileName + '.json', JSON.stringify(json));
      },
    }),
    require('cssnano')({
      preset: ['default', { normalizeUrl: false }],
    }),
  ],
};
