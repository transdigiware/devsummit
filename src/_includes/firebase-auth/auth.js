import { get, set, del } from 'idb-keyval';

const listeners = new Set();
export async function onLoginStateChange(cb) {
  listeners.add(cb);
}

export function login() {
  location.href = '/backend/auth/login';
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
    notify(null);
  }
}

async function notify(userBlob) {
  for (const listener of listeners) {
    listener(userBlob);
  }
}

async function init() {
  const userBlob = await get('user');
  if (userBlob) {
    notify(userBlob);
  }
  checkRealLoginState();
}
init();
