import { onLoginStateChange } from '../auth/auth.js';

import vapidPublicKeyURL from 'asset-url:../../../vapid.public.key';

async function init() {
  const vapidPublicKey = await fetch(vapidPublicKeyURL).then(r =>
    r.arrayBuffer(),
  );
  console.log(vapidPublicKey);
  await new Promise(resolve => {
    onLoginStateChange(userBlob => {
      if (!userBlob) {
        return;
      }
      resolve(userBlob);
    });
  });
  const sw = await navigator.serviceWorker.ready;
  sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  });
}
init();
