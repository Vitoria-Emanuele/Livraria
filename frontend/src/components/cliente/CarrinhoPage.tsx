import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCartCheckout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../hooks/useAuth';

const CarrinhoPage: React.FC = () => {
  const { 
    itens, 
    removerItem, 
    atualizarQuantidade, 
    limparCarrinho, 
    totalItens, 
    totalPreco 
  } = useCarrinho();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFinalizarCompra = () => {
    if (!isAuthenticated) {
      alert('Faça login para finalizar a compra!');
      navigate('/login/');
      return;
    }
    
    if (itens.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    navigate('/checkout/')
    
    };

  const handleContinuarComprando = () => {
    navigate('/loja/');
  };

  if (itens.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" gutterBottom color="text.secondary">
            🛒 Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Adicione alguns livros incríveis ao seu carrinho!
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleContinuarComprando}
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C5530' }}>
        Meu Carrinho
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {itens.map((item) => (
            <Card key={item.id_livro} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 3 }}>
                    <Box
                      component="img"
                      src={`https://via.placeholder.com/80x100/4A7C59/FFFFFF?text=${encodeURIComponent(item.titulo_livro.substring(0, 10))}`}
                      alt={item.titulo_livro}
                      sx={{ width: 80, height: 100, objectFit: 'cover' }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 5 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.titulo_livro}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      por {item.autor_livro}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      R$ {item.valor_venda.toFixed(2)}
                    </Typography>
                  </Grid>

                  {/*   GRID DA QUANTIDADE COM INDENTAÇÃO CORRIGIDA */}
                  <Grid size={{ xs: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => atualizarQuantidade(item.id_livro, item.quantidade - 1)}
                        disabled={item.quantidade <= 1}
                      >
                        <Remove />
                      </IconButton>
                      
                      <TextField
                        type="number"
                        value={item.quantidade}
                        size="small"
                        sx={{ 
                          width: 70,
                          '& .MuiInputBase-input': { 
                            textAlign: 'center',
                            padding: '8px 4px'
                          }
                        }}
                        InputProps={{
                          inputProps: { 
                            min: 1, 
                            max: item.estoque_atual,
                            style: { textAlign: 'center' }
                          }
                        }}
                        onChange={(e) => {
                          const novaQuantidade = Math.max(1, parseInt(e.target.value) || 1);
                          const quantidadeFinal = Math.min(novaQuantidade, item.estoque_atual);
                          atualizarQuantidade(item.id_livro, quantidadeFinal);
                        }}
                      />
                      
                      <IconButton 
                        size="small" 
                        onClick={() => atualizarQuantidade(item.id_livro, item.quantidade + 1)}
                        disabled={item.quantidade >= item.estoque_atual}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Máx: {item.estoque_atual}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 2 }} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom>
                      R$ {(item.valor_venda * item.quantidade).toFixed(2)}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => removerItem(item.id_livro)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={limparCarrinho}
            >
              Limpar Carrinho
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleContinuarComprando}
            >
              Continuar Comprando
            </Button>
          </Box>
        </Grid>

        {/* RESUMO DO PEDIDO */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Itens ({totalItens}):</Typography>
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
              sx={{ mb: 2 }}
            >
              Finalizar Compra
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarrinhoPage;