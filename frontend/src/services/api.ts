import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log(`Enviando requisição para: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error);
    return Promise.reject(error);
  }
);

export default api;