async function init() {
  if (!navigator.serviceWorker) {
    return;
  }
  navigator.serviceWorker.register('/sw.js');
}
init();
