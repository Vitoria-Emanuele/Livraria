import React, { useState } from 'react';
import {Container, Paper, TextField,Button, Typography, Box, Alert, InputAdornment, IconButton, CircularProgress} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

import logo from '../assets/logo.png'


// Estilos customizados para a pagina de login
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

// Componente principal da pagina de login
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  // Se o usuario ja estiver autenticado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard/" replace />;
  }

  // Manipula mudancas nos campos do formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erros especificos do campo quando o usuario comeca a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Limpa erros gerais da autenticacao
    if (error) {
      clearError();
    }
  };

  // Valida o formulario
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email e obrigatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha e obrigatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipula o envio do formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard/');
    } catch (err) {
      // O erro ja e tratado pelo hook useAuth
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
            Sistema Estoque
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Faca login para acessar o sistema
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={clearError}>
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
          
          <Box sx={loginStyles.linksContainer}>
            <Typography 
              component="a" 
              href="/forgot-password" 
              sx={loginStyles.link}
            >
              Esqueceu sua senha?
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;