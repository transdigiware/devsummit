import { get, set, del } from 'idb-keyval';

const listeners = new Set();
export async function onLoginStateChange(cb) {
  // New subscribers get the lastest state immediately to catch up.
  cb(await get('user'));
  listeners.add(cb);
}

export function login() {
  location.href = '/backend/auth/google/login';
}

export async function logout() {
  await del('user');
  location.href = '/backend/auth/logout';
}

export async function putRealLoginStateIntoIDB() {
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
  await putRealLoginStateIntoIDB();
  notify(await get('user'));
}
init();
