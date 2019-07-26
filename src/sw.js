addEventListener('install', ev => {
  skipWaiting();
  clients.claim();
});
// addEventListener('activate', ev => {
// });

addEventListener('push', ev => {
  console.log(ev);
  if (!Notification) {
    return;
  }
  if (Notification.permission !== 'granted') {
    return;
  }
  registration.showNotification('Got a push!', {
    body: JSON.stringify(ev.data.text()),
  });
});
