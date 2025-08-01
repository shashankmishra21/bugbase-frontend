import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});       

export const fetchBugs = () => API.get('bugs/');
export const fetchBugById = (id: number) => API.get(`bugs/${id}/`);
export const createBug = (bugData: any) => API.post('bugs/', bugData);
export const loginUser = (credentials: any) =>
  API.post('login/', credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const registerUser = (userData: any) => API.post('register/', userData);
export const deleteBug = (id: number) => API.delete(`bugs/${id}/`);
