import { get, set, del } from 'idb-keyval';

const listeners = new Set();
export function onLoginStateChange(cb) {
  listeners.add(cb);
}

export function login() {
  location.href = '/backend/auth/google/login';
}

export async function logout() {
  await del('user');
  location.href = '/backend/auth/logout';
}

export async function checkRealLoginState() {
  try {
    const r = await fetch('/backend/user/blob');
    if (r.status === 403) {
      // We are logged out
      await del('user');
      return;
    }
    if (!r.ok) {
      return;
    }
    const userBlob = await r.json();
    await set('user', userBlob);
  } catch (e) {}
}

function notify(userBlob) {
  for (const listener of listeners) {
    listener(userBlob);
  }
}

async function init() {
  // Notify immediately with whatever we have in the cache.
  notify(await get('user'));
  // Now hit the network
  await checkRealLoginState();
  // And notify again in case the user profile got updated.
  notify(await get('user'));
}
init();
