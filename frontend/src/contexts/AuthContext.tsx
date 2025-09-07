import React, { createContext, useState, useEffect, type ReactNode} from 'react';
import { authService } from '../services/authService';

// Interface do contexto
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  isLoading: boolean;
}

// Cria e exporta o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar se ha token valido ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const userData = await authService.getProfile();
      setIsAuthenticated(true);
      setUser(userData);
    } catch (err) {
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      const { access_token } = response;
      
      localStorage.setItem('access_token', access_token);
      
      const userData = await authService.getProfile();
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
    } catch (err: any) {
      // Extrai a mensagem de erro corretamente
      let errorMessage = 'Erro ao fazer login';
      
      if (err.response?.data?.detail) {
        // Se for um erro de validacao do FastAPI
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.msg) {
        // Se for outro formato de erro
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }; 

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    error,
    clearError,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 