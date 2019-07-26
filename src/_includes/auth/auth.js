import { get, set, del } from 'idb-keyval';

const listeners = new Set();
export async function onLoginStateChange(cb) {
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
    if (!r.ok) {
      // Go to catch handler
      throw null;
    }
    const userBlob = await r.json();
    set('user', userBlob);
    notify(userBlob);
  } catch (e) {
    await del('user');
    notify(null);
  }
}

function notify(userBlob) {
  for (const listener of listeners) {
    listener(userBlob);
  }
}

async function init() {
  const userBlob = await get('user');
  notify(userBlob);
  checkRealLoginState();
}
init();
