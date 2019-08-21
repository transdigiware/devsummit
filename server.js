const fsp = require('fs').promises;
const express = require('express');

const { backend } = require('./functions');

const app = express();

app.use('/devsummit/backend/', backend);

app.use(
  '/',
  express.static('./build/', {
    setHeaders(res, path, stat) {
      // Files with hashes get far-future caching.
      if (/-[0-9a-f]{8}\.[^.]+$/.test(path)) {
        res.set('Cache-Control', `max-age=${365 * 24 * 60 * 60}`);
        return;
      }
      // The rest must revalidate.
      res.set('Cache-Control', 'no-cache');
    },
  }),
);

app.get('*', async (req, res) => {
  // Every JS file request that doesn’t match a static file
  // will get the SW nuke file.
  if (req.url.endsWith('.js')) {
    res.set('Content-Type', 'text/javascript');
    res.set('Cache-Control', 'no-cache');
    res.send(await fsp.readFile('./build/devsummit/nuke-sw.js'));
    return;
  }
  // TODO: Insert quirky 404 page here.
  res.statusCode = 404;
  res.send('Not found');
});

const port = process.env.PORT || 8080;
console.log(`Server listening on port ${port}...`);
app.listen(port);
