import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.202.231.99/api',
});

const productsApi = axios.create({
  baseURL: 'http://34.202.231.99/api',
});

const attachToken = (config) => {
  const token = localStorage.getItem('adminAccessToken');
  if (token) {
    config.headers.Authorization = Bearer ;
  }
  return config;
};

api.interceptors.request.use(attachToken);
productsApi.interceptors.request.use(attachToken);

export { api, productsApi };
export const IMAGE_BASE_URL = 'http://34.202.231.99';
