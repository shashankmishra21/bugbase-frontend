// src/api/bugService.ts
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add Authorization token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// API calls
export const fetchBugs = () => API.get('bugs/');
export const fetchBugById = (id: number) => API.get(`bugs/${id}/`);
export const createBug = (bugData: any) => API.post('bugs/', bugData);

// ✅ Fix: Add Content-Type header for login
export const loginUser = (credentials: any) =>
  API.post('login/', credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const registerUser = (userData: any) =>
  API.post('register/', userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const deleteBug = (id: number) => API.delete(`bugs/${id}/`);
