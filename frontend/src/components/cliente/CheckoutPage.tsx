import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  Alert
} from '@mui/material';
import { ShoppingCartCheckout, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCarrinho, type ItemCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../hooks/useAuth';
import { estoqueService } from '../../services';

const CheckoutPage: React.FC = () => {
  const { itens, totalPreco, limparCarrinho } = useCarrinho();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState('CARTAO_CREDITO');

  const formasPagamento = [
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { value: 'PIX', label: 'PIX' },
    { value: 'BOLETO', label: 'Boleto' }
  ];

  const handleFinalizarCompra = async () => {
    if (!user) {
      setErro('Usuário não autenticado');
      return;
    }

    if (itens.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      // Preparar dados da compra
      const dadosCompra = {
        id_cliente: user.id_cliente || 1,
        id_funcionario: 1,
        itens: itens.map((item: ItemCarrinho) => ({
          id_livro: item.id_livro,
          quantidade: item.quantidade,
        })),
        forma_pagamento: formaPagamento
      };

      console.log('📤 Enviando compra:', dadosCompra);

      // Criar compra completa
      const resultado = await estoqueService.criarCompraCompleta(dadosCompra);
      
      console.log('  Compra criada com sucesso:', resultado);

      // Limpar carrinho
      limparCarrinho();

      // Redirecionar para confirmação
      navigate('/compra-concluida/', { 
        state: { 
          compra: resultado.compra,
          pagamento: resultado.pagamento
        } 
      });

    } catch (error: any) {
      console.error('  Erro ao finalizar compra:', error);
      setErro(error.message || 'Erro ao processar compra');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/carrinho/');
  };

  if (itens.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" gutterBottom color="text.secondary">
            Carrinho Vazio
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/loja/')}
            sx={{ mt: 2 }}
          >
            Continuar Comprando
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleVoltar}
        sx={{ mb: 3 }}
      >
        Voltar ao Carrinho
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C5530' }}>
        Finalizar Compra
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* RESUMO DO PEDIDO */}
        <Grid size={{xs:12, md:8}}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Itens do Pedido
              </Typography>
              {itens.map((item: ItemCarrinho) => (
                <Box key={item.id_livro} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Box>
                    <Typography variant="body1">{item.titulo_livro}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantidade} x R$ {item.valor_venda.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    R$ {(item.valor_venda * item.quantidade).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  R$ {totalPreco.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* FORMA DE PAGAMENTO */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Forma de Pagamento
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Forma de Pagamento</InputLabel>
                <Select
                  value={formaPagamento}
                  label="Forma de Pagamento"
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  {formasPagamento.map((forma) => (
                    <MenuItem key={forma.value} value={forma.value}>
                      {forma.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* RESUMO FINAL */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Resumo Final
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R$ {totalPreco.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Frete:</Typography>
                <Typography color="success.main">Grátis</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  R$ {totalPreco.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCartCheckout />}
              onClick={handleFinalizarCompra}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Processando...' : 'Finalizar Compra'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;