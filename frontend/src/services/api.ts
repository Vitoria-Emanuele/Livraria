// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(`Token no localStorage: ${token}`);
    console.log(`Enviando requisicao para: ${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token adicionado aos headers');
    } else {
      console.log('Nenhum token encontrado');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro na requisicao:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging (útil para debug)
api.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error.response?.status);
    console.error('Detalhes do erro:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;