import CONFIG from '../config.js';
import { getToken } from '../utils/auth.js';

const BASE_URL ='https://story-api.dicoding.dev/v1';
const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

//Stories
export async function getStories({ page = 1, size = 8 } = {}) {
  const res = await fetch(`${ENDPOINTS.STORIES}?page=${page}&size=${size}`, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  });
  if (!res.ok) {
    let errMsg = 'Gagal mengambil stories';
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}

//Add Story
export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const res = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + getToken() },
    body: formData,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Gagal tambah story');
  return res.json();
}

export async function getStoryDetail(id) {
  const res = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
    headers: { Authorization: 'Bearer ' + getToken() }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Gagal ambil detail');
  return res.json();
}
