import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { ShoppingBag, Visibility, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { estoqueService, type Compra } from '../../services';

const MeusPedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    if (!user?.id_cliente) {
      setErro('Usuário não identificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Buscar todas as compras do cliente
      const todasCompras = await estoqueService.listarCompras();
      
      // Filtrar apenas as compras do usuário atual
      const meusPedidos = todasCompras.filter(compra => 
        compra.id_cliente === user.id_cliente
      );
      
      // Ordenar por data (mais recente primeiro)
      meusPedidos.sort((a, b) => 
        new Date(b.data_compra + 'T' + b.hora_compra).getTime() - 
        new Date(a.data_compra + 'T' + a.hora_compra).getTime()
      );
      
      setPedidos(meusPedidos);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      setErro('Erro ao carregar pedidos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/minha-conta/');
  };

  const handleVerDetalhes = (compraId: number) => {
    navigate(`/minha-conta/pedidos/${compraId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'success';
      case 'AGUARDANDO_PAGAMENTO':
        return 'warning';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'AGUARDANDO_PAGAMENTO':
        return 'Aguardando Pagamento';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatarData = (data: string, hora: string) => {
    return new Date(data + 'T' + hora).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
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
        Voltar
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C5530' }}>
        <ShoppingBag sx={{ mr: 2, verticalAlign: 'middle' }} />
        Meus Pedidos
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      {pedidos.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" gutterBottom color="text.secondary">
            Nenhum pedido encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Você ainda não realizou nenhuma compra.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/loja/')}
            sx={{ mt: 2 }}
          >
            Ir para Loja
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {pedidos.map((pedido) => (
            <Grid key={pedido.id_compra} size ={ {xs:12}}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Pedido #{pedido.id_compra}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Realizado em {formatarData(pedido.data_compra, pedido.hora_compra)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusText(pedido.status_compra)}
                      color={getStatusColor(pedido.status_compra) as any}
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total:</strong> R$ {pedido.total_liquido.toFixed(2)}
                      </Typography>
                      {pedido.desconto_aplicado > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Economizou: R$ {pedido.desconto_aplicado.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleVerDetalhes(pedido.id_compra)}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MeusPedidosPage;