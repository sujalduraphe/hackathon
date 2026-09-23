// Thin fetch wrapper for the backend API. Attaches the JWT and turns error
// responses into thrown Errors with the server's message.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
const TOKEN_KEY = 'aicp-token';

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: t => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = fn => { onUnauthorized = fn; };

// body may be a plain object (sent as JSON) or FormData (file upload).
// raw: true returns the Response itself, for binary downloads.
export async function api(path, { method = 'GET', body, raw = false } = {}) {
  const token = tokenStore.get();
  const isForm = body instanceof FormData;
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the API is running.');
  }
  if (raw && res.ok) return res;
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) onUnauthorized();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
