export async function getUserData() {
  try {
    const r = await fetch('/backend/user/info');
    if (!r.ok) {
      return null;
    }
    return r.json();
  } catch (e) {
    return null;
  }
}

export function login() {
  location.href = '/backend/auth/login';
}

export function logout() {
  location.href = '/backend/auth/logout';
}
