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
    const r = await fetch('/backend/user/info');
    if (!r.ok) {
      throw null;
    }
    const userData = await r.json();
    set('user', userData);
    notify(userData);
  } catch (e) {
    notify(null);
  }
}

async function notify(userData) {
  for (const listener of listeners) {
    listener(userData);
  }
}

async function init() {
  const userData = await get('user');
  if (userData) {
    notify(userData);
  }
  checkRealLoginState();
}
init();
