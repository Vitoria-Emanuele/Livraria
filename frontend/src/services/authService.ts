import api from './api';
import type { LoginResponse, Usuario } from './estoqueService';

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', email);    
    formData.append('password', password); 
    
    return api.post('/login/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  },   

  getProfile: (): Promise<Usuario> => {
    return api.get('/me/').then(response => response.data);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
};

export default authService;