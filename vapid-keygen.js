const webpush = require('web-push');
const { promises: fsp } = require('fs');

async function run() {
  const asyncTasks = [];
  const { privateKey, publicKey } = webpush.generateVAPIDKeys();

  asyncTasks.push(fsp.writeFile('vapid.private.base64.key', privateKey));
  asyncTasks.push(fsp.writeFile('vapid.public.base64.key', publicKey));

  const publicKeyRaw = Buffer.from(publicKey, 'base64');
  const privateKeyRaw = Buffer.from(privateKey, 'base64');
  asyncTasks.push(fsp.writeFile('vapid.private.key', privateKeyRaw));
  asyncTasks.push(fsp.writeFile('vapid.public.key', publicKeyRaw));

  await Promise.all(asyncTasks);
}
run();
