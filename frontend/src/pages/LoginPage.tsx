import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, 
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';

import logo from '../assets/logo.png'
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const loginStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e5dbc9 0%, #4A7C59 100%)',
    padding: 2,
  },
  paper: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 2,
    width: '100%',
    maxWidth: 450,
  },
  logoContainer: {
    textAlign: 'center' as const,
    marginBottom: 3,
  },
  form: {
    width: '100%',
    marginTop: 2,
  },
  submitButton: {
    marginTop: 3,
    marginBottom: 2,
    padding: 1.2,
    borderRadius: '8px',
    backgroundColor: '#2C5530',
    '&:hover': {
      backgroundColor: '#1E3E23',
    },
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 2,
  },
  link: {
    textDecoration: 'none',
    color: '#2C5530',
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/loja/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userId', response.usuario_id.toString());
      localStorage.setItem('userEmail', response.email);
      
      if (response.role === 'FUNCIONARIO' || response.role === 'ADMIN') {
        window.location.href = '/dashboard/'; // ← RECARREGA A PÁGINA
      } else if (response.role === 'CLIENTE') {
        window.location.href = '/loja/';
      } else {
        window.location.href = '/loja/';
      }


    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth={false} sx={loginStyles.container}>
      <Paper elevation={6} sx={loginStyles.paper}>
        <Box sx={loginStyles.logoContainer}>
          <img 
            src={logo}
            alt="Logo do Sistema" 
            style={{ height: '80px', marginBottom: '16px' }} 
          />
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Livraria do Tik Tok
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Faça login para acessar a loja
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={loginStyles.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={loginStyles.submitButton}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
          
          
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;