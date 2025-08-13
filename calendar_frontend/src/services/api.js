/**
 * Simple REST API client for the Calendar app.
 * Reads API base from REACT_APP_API_BASE_URL. All methods return JSON.
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';
const TOKEN_KEY = 'calendar_token';

// PUBLIC_INTERFACE
export function getToken() {
  /** Retrieves the stored auth token from localStorage. */
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persists the auth token in localStorage. */
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Removes the auth token from localStorage. */
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let errText = 'Request failed';
    try { const e = await res.json(); errText = e?.message || errText; } catch {}
    const error = new Error(errText);
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * auth
 * Authentication related API methods: login, register, getMe.
 */
export const auth = {
  /** Logs in using email and password. */
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  /** Registers a user then returns token and user. */
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  /** Fetches the current user profile. */
  getMe: () => request('/users/me', { method: 'GET' }),
};

/**
 * PUBLIC_INTERFACE
 * calendars
 * Calendar management API: list, create, get, update, remove.
 */
export const calendars = {
  /** Returns list of personal/shared calendars. */
  list: () => request('/calendars', { method: 'GET' }),
  /** Creates a calendar. */
  create: (payload) => request('/calendars', { method: 'POST', body: payload }),
  /** Returns a calendar by id. */
  get: (id) => request(`/calendars/${id}`, { method: 'GET' }),
  /** Updates a calendar. */
  update: (id, payload) => request(`/calendars/${id}`, { method: 'PUT', body: payload }),
  /** Deletes a calendar. */
  remove: (id) => request(`/calendars/${id}`, { method: 'DELETE' }),
};

/**
 * PUBLIC_INTERFACE
 * events
 * Event management API: list, create, update, remove, invite.
 */
export const events = {
  /** Lists events for a calendar in a date range. */
  list: ({ calendarId, start, end }) => request(`/calendars/${calendarId}/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, { method: 'GET' }),
  /** Creates an event in a calendar. */
  create: (payload) => request(`/calendars/${payload.calendarId}/events`, { method: 'POST', body: payload }),
  /** Updates an event. */
  update: (id, payload) => request(`/events/${id}`, { method: 'PUT', body: payload }),
  /** Deletes an event. */
  remove: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  /** Sends invitations for an event to a list of emails. */
  invite: (eventId, emails) => request(`/events/${eventId}/invite`, { method: 'POST', body: { emails } }),
};
