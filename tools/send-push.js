const webpush = require('web-push');
const { promises: fsp } = require('fs');

async function run() {
  const privateKey = await fsp.readFile('vapid.private.key');
  const publicKey = await fsp.readFile('vapid.public.key');

  webpush.setVapidDetails(
    'mailto:surma@google.com',
    publicKey.toString('base64'),
    privateKey.toString('base64'),
  );
  const pushSubscription = require('./subscription.json');

  webpush.sendNotification(pushSubscription, 'Oh look shit is happening!');
}
run();
