import React from 'react';
import { Container, Typography, Box, Button, Paper, Divider } from '@mui/material';
import { CheckCircle, ShoppingCart } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CompraConcluidaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados passados do CheckoutPage
  const { compra, pagamento } = location.state || {};

  const handleVoltarLoja = () => {
    navigate('/loja/'); //   CORREÇÃO: Barra adicionada
  };

  const handleVerPedidos = () => {
    navigate('/minha-conta/pedidos/'); //   CORREÇÃO: Barra adicionada
  };

  if (!compra) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" color="error" gutterBottom>
            Erro ao carregar compra
          </Typography>
          <Button variant="contained" onClick={handleVoltarLoja}>
            Voltar para Loja
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" py={4}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom color="success.main">
          Compra Realizada com Sucesso!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Sua compra foi registrada e aguarda confirmação de pagamento
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resumo do Pedido
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1"><strong>Número do Pedido:</strong></Typography>
            <Typography variant="body1">#{compra.id_compra}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1"><strong>Data:</strong></Typography>
            <Typography variant="body1">
              {new Date(compra.data_compra).toLocaleDateString('pt-BR')} às {compra.hora_compra}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1"><strong>Status:</strong></Typography>
            <Typography 
              variant="body1" 
              color={compra.status_compra === 'AGUARDANDO_PAGAMENTO' ? 'warning.main' : 'success.main'}
            >
              {compra.status_compra === 'AGUARDANDO_PAGAMENTO' ? 'Aguardando Pagamento' : 'Pago'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Valores</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>R$ {compra.total_bruto?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Desconto:</Typography>
            <Typography color="success.main">- R$ {compra.desconto_aplicado?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              R$ {compra.total_liquido?.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {pagamento && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom>Pagamento</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Forma:</Typography>
                <Typography>{pagamento.forma_pagamento}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Status:</Typography>
                <Typography 
                  color={pagamento.status_pagamento === 'PENDENTE' ? 'warning.main' : 'success.main'}
                >
                  {pagamento.status_pagamento === 'PENDENTE' ? 'Pendente' : 'Confirmado'}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ShoppingCart />}
          onClick={handleVoltarLoja}
          size="large"
        >
          Continuar Comprando
        </Button>
        <Button
          variant="contained"
          onClick={handleVerPedidos}
          size="large"
        >
          Meus Pedidos
        </Button>
      </Box>
    </Container>
  );
};

export default CompraConcluidaPage;