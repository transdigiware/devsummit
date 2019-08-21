const fsp = require('fs').promises;
const express = require('express');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const program = require('commander');

const { instantiate: instantiateBackend } = require('./functions');

const execP = promisify(exec);

function ObjectFromEntries(entries) {
  return entries.reduce(
    (obj, [key, val]) => Object.assign(obj, { [key]: val }),
    {},
  );
}

async function startDataStore() {
  const dataStoreProcess = spawn(
    'gcloud',
    'beta emulators datastore start'.split(' '),
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  // Wait for any output
  await new Promise(resolve => {
    dataStoreProcess.stderr.on('data', resolve);
    dataStoreProcess.stdout.on('data', resolve);
  });
  // This command returns a set of environment variable definitions to connect
  // to the datastore emulator.
  const { stdout } = await execP('gcloud beta emulators datastore env-init');
  // Parse env definitions
  return ObjectFromEntries(
    stdout
      .split('\n')
      .map(line => line.replace(/^export\s*/i, ''))
      .map(line => line.split('='))
      .filter(([key]) => key),
  );
}

function startWebServer() {
  const app = express();

  app.use('/devsummit/backend/', instantiateBackend());

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
}

async function init() {
  program.option('--no-emulator', 'Don’t start the DataStore emulator');

  program.parse(process.argv);

  if (program.emulator) {
    const dataStoreEnv = await startDataStore();
    console.log('Started DataStore emulator:', dataStoreEnv);
    Object.assign(process.env, dataStoreEnv);
  }
  startWebServer();
}
init();
