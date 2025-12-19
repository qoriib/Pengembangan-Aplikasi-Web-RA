const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:6543';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function me() {
  return request('/api/auth/me');
}

export async function updateProfile(payload) {
  return request('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/api/properties?${query}` : '/api/properties';
  return request(path, { method: 'GET' });
}

export async function fetchPropertyDetail(id) {
  return request(`/api/properties/detail/${id}`, { method: 'GET' });
}

export async function createProperty(payload) {
  return request('/api/properties/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProperty(id, payload) {
  return request(`/api/properties/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteProperty(id) {
  return request(`/api/properties/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function addFavorite(property_id) {
  return request('/api/favorites/add', {
    method: 'POST',
    body: JSON.stringify({ property_id }),
  });
}

export async function listFavorites() {
  return request('/api/favorites', { method: 'GET' });
}

export async function deleteFavorite(property_id) {
  return request(`/api/favorites/remove/${property_id}`, { method: 'DELETE' });
}

export async function sendInquiry(payload) {
  return request('/api/inquiries/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listInquiries(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/api/inquiries?${query}` : '/api/inquiries';
  return request(path, { method: 'GET' });
}

export async function deleteInquiry(id) {
  return request(`/api/inquiries/delete/${id}`, { method: 'DELETE' });
}

export const apiBaseURL = baseURL;
