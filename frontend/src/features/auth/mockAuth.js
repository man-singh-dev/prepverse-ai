// ---------------------------------------------------------------------------
// MOCK AUTH LAYER — frontend-only simulation. No network requests are made.
//
// This exists purely so the Login/Register UI has something to call. When the
// real backend integration is ready, swap the bodies of `mockLogin` and
// `mockRegister` for real API calls and remove `simulateFailure`. Everything
// else in the auth pages (validation, loading state, error/success UI) can
// stay the same.
// ---------------------------------------------------------------------------

const SESSION_KEY = 'mock_auth_session';
const MOCK_LATENCY_MS = 900;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function mockLogin({ email, password }) {
  await delay(MOCK_LATENCY_MS);

  // Demo-only rule so the error UI is reachable without a backend.
  if (password.length < 6) {
    throw new Error('Incorrect email or password. Please try again.');
  }

  const user = { name: email.split('@')[0] || 'Demo User', email };
  saveSession(user);
  return user;
}

export async function mockRegister({ name, email }) {
  await delay(MOCK_LATENCY_MS);
  const user = { name, email };
  saveSession(user);
  return user;
}

export async function mockLogout() {
  await delay(200);
  clearSession();
}
