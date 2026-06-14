import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const productsApi = axios.create({
  baseURL: '/api',
});

const cartApi = axios.create({
  baseURL: '/api',
});

const ordersApi = axios.create({
  baseURL: '/api',
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
export const IMAGE_BASE_URL = '';
