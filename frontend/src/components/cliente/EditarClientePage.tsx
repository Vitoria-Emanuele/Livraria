import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Save, ArrowBack, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { estoqueService, type Cliente } from '../../services';

const EditarClientePage: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    carregarCliente();
  }, []);

  const carregarCliente = async () => {
    if (!user?.id_cliente) {
      setErro('Usuário não identificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const dadosCliente = await estoqueService.buscarCliente(user.id_cliente);
      setCliente(dadosCliente);
    } catch (error: any) {
      console.error('Erro ao carregar dados do cliente:', error);
      setErro('Erro ao carregar dados: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!cliente) return;

    try {
      setSalvando(true);
      setErro('');
      setSucesso('');

      // Preparar dados para atualização (apenas campos editáveis)
      const dadosAtualizacao = {
        telefone_cliente: cliente.telefone_cliente,
        email_cliente: cliente.email_cliente,
        logradouro_cliente: cliente.logradouro_cliente,
        numero_logradouro_cliente: cliente.numero_logradouro_cliente,
        bairro_cliente: cliente.bairro_cliente,
        cidade_cliente: cliente.cidade_cliente,
        estado_cliente: cliente.estado_cliente,
        cep_cliente: cliente.cep_cliente,
        complemento_cliente: cliente.complemento_cliente
      };

      await estoqueService.atualizarCliente(cliente.id_cliente, dadosAtualizacao);
      setSucesso('Dados atualizados com sucesso!');
      
      // Atualizar dados do usuário no contexto de auth se necessário
      setTimeout(() => {
        navigate('/minha-conta/');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      setErro('Erro ao salvar dados: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setSalvando(false);
    }
  };

  const handleVoltar = () => {
    navigate('/minha-conta/');
  };

  const handleChange = (campo: string, valor: string | number) => {
    if (cliente) {
      setCliente({
        ...cliente,
        [campo]: valor
      });
    }
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

  if (!cliente) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Não foi possível carregar os dados do cliente.
        </Alert>
        <Button onClick={handleVoltar} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleVoltar}
        sx={{ mb: 3 }}
      >
        Voltar para Minha Conta
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C5530', mb: 1 }}>
        <Person sx={{ mr: 2, verticalAlign: 'middle' }} />
        Editar Meus Dados
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Atualize suas informações de contato e endereço
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {sucesso}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Informações de Contato */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#2C5530' }}>
            Informações de Contato
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Telefone"
                value={cliente.telefone_cliente}
                onChange={(e) => handleChange('telefone_cliente', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={cliente.email_cliente}
                onChange={(e) => handleChange('email_cliente', e.target.value)}
                placeholder="seu@email.com"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Endereço */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#2C5530' }}>
            Endereço
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Logradouro"
                value={cliente.logradouro_cliente}
                onChange={(e) => handleChange('logradouro_cliente', e.target.value)}
                placeholder="Rua, Avenida, etc."
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Número"
                type="number"
                value={cliente.numero_logradouro_cliente}
                onChange={(e) => handleChange('numero_logradouro_cliente', parseInt(e.target.value) || 0)}
                placeholder="123"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Bairro"
                value={cliente.bairro_cliente}
                onChange={(e) => handleChange('bairro_cliente', e.target.value)}
                placeholder="Centro, Jardim, etc."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="CEP"
                value={cliente.cep_cliente}
                onChange={(e) => handleChange('cep_cliente', e.target.value)}
                placeholder="00000-000"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Cidade"
                value={cliente.cidade_cliente}
                onChange={(e) => handleChange('cidade_cliente', e.target.value)}
                placeholder="Sua Cidade"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                value={cliente.estado_cliente}
                onChange={(e) => handleChange('estado_cliente', e.target.value)}
                placeholder="SP"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>

            <Grid size={{ xs: 12}}>
              <TextField
                fullWidth
                label="Complemento (Opcional)"
                value={cliente.complemento_cliente || ''}
                onChange={(e) => handleChange('complemento_cliente', e.target.value)}
                placeholder="Apartamento, Bloco, etc."
              />
            </Grid>
          </Grid>

          {/* Informações não editáveis (somente leitura) */}
          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#2C5530' }}>
            Informações Pessoais (Não Editáveis)
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={cliente.nome_cliente}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="CPF"
                value={cliente.cpf_cliente}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* Botões de Ação */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={handleVoltar}
              disabled={salvando}
            >
              Cancelar
            </Button>
            
            <Button 
              variant="contained" 
              startIcon={salvando ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditarClientePage;