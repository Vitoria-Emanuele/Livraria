import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ClienteFormCompleto from '../forms/ClienteForm';

const CadastroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCadastroSucesso = () => {
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    navigate('/login/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="#2C5530">
          Criar Nova Conta
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Preencha os dados abaixo para criar sua conta de cliente
        </Typography>

        <ClienteFormCompleto onSubmit={handleCadastroSucesso} />
      </Paper>
    </Container>
  );
};

export default CadastroPage;