const webpush = require('web-push');
const { promises: fsp } = require('fs');

async function run() {
  const { privateKey, publicKey } = webpush.generateVAPIDKeys();

  const publicKeyRaw = Buffer.from(publicKey, 'base64');
  const privateKeyRaw = Buffer.from(privateKey, 'base64');
  await fsp.writeFile('vapid.private.key', privateKeyRaw);
  await fsp.writeFile('vapid.public.key', publicKeyRaw);
}
run();
