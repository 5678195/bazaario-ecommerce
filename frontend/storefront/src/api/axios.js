import axios from 'axios';

const BASE_URL = 'http://34.202.231.99';

const api = axios.create({
  baseURL: BASE_URL + '/api',
});

const productsApi = axios.create({
  baseURL: BASE_URL + '/api',
});

const cartApi = axios.create({
  baseURL: BASE_URL + '/api',
});

const ordersApi = axios.create({
  baseURL: BASE_URL + '/api',
});

const attachToken = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = Bearer ;
  }
  return config;
};

api.interceptors.request.use(attachToken);
productsApi.interceptors.request.use(attachToken);
cartApi.interceptors.request.use(attachToken);
ordersApi.interceptors.request.use(attachToken);

export { api, productsApi, cartApi, ordersApi };
export const IMAGE_BASE_URL = BASE_URL;
