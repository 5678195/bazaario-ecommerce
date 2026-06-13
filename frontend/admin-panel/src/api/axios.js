import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4001/api', // users-service
});

const productsApi = axios.create({
  baseURL: 'http://localhost:4002/api', // products-service
});

const productsBase = axios.create({
  baseURL: 'http://localhost:4002', // for static file URLs (images)
});

const attachToken = (config) => {
  const token = localStorage.getItem('adminAccessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
productsApi.interceptors.request.use(attachToken);

export { api, productsApi };
export const IMAGE_BASE_URL = 'http://localhost:4002';