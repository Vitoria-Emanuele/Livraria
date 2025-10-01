import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MinhaContaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Minha Conta
      </Typography>

      <Grid container spacing={3}>
        {/* Card de Perfil */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meus Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gerencie suas informações pessoais
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => navigate('/minha-conta/editar-perfil/')}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Pedidos */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meus Pedidos
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Acompanhe seus pedidos e histórico
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => navigate('/minha-conta/pedidos/')}
              >
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Voltar à Loja */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Continuar Comprando
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 1 }}
                onClick={() => navigate('/loja/')}
              >
                Voltar para a Loja
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MinhaContaPage;