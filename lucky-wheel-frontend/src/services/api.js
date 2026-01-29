import axios from 'axios';

// Use runtime env if available, otherwise fallback to build time env or localhost
const API_URL = (window.ENV && window.ENV.VITE_API_URL) || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const login = async (password) => {
  const response = await api.post('/auth/login', { password });
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    api.defaults.headers.common['Authorization'] = response.data.token;
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = token;
  }
  return !!token;
};

// Users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const toggleBlacklist = async (userId) => {
  const response = await api.patch(`/users/${userId}/blacklist`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Spin
export const spinWheel = async (excludedIds = []) => {
  const response = await api.post('/spin', { excludedIds });
  return response.data;
};

export default api;
