export async function getUserData() {
  const r = await fetch('/backend/user');
  if (!r.ok) {
    return null;
  }
  return r.json();
}

export function login() {
  location.href = '/backend/auth/login';
}

export function logout() {
  location.href = '/backend/auth/logout';
}
