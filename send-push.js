const webpush = require('web-push');
const { promises: fsp } = require('fs');

async function run() {
  const privateKey = await fsp.readFile('vapid.private.base64.key', 'utf-8');
  const publicKey = await fsp.readFile('vapid.public.base64.key', 'utf-8');

  webpush.setVapidDetails('mailto:surma@google.com', publicKey, privateKey);
  const pushSubscription = require('./subscription.json');

  webpush.sendNotification(pushSubscription, 'Oh look shit is happening!');
}
run();
