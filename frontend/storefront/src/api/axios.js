import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4001/api',
});

const productsApi = axios.create({
  baseURL: 'http://localhost:4002/api',
});

const cartApi = axios.create({
  baseURL: 'http://localhost:4003/api',
});

const ordersApi = axios.create({
  baseURL: 'http://localhost:4004/api',
});

const attachToken = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
productsApi.interceptors.request.use(attachToken);
cartApi.interceptors.request.use(attachToken);
ordersApi.interceptors.request.use(attachToken);

export { api, productsApi, cartApi, ordersApi };
export const IMAGE_BASE_URL = 'http://localhost:4002';
