import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useCep } from '../../hooks/useCep';
import { estoqueService } from '../../services';

interface DistribuidorFormProps {
  onSubmit?: (dadosDistribuidor: any) => void;
  onCancel?: () => void;
}

export default function DistribuidorForm({ onSubmit, onCancel }: DistribuidorFormProps) {
  const [formData, setFormData] = useState({
    cnpj_distribuidor: '',
    razao_social_distribuidor: '',
    nome_fantasia_distribuidor: '',
    email_distribuidor: '',
    telefone_distribuidor: '',
    logradouro_distribuidor: '',
    numero_logradouro_distribuidor: '',
    bairro_distribuidor: '',
    cidade_distribuidor: '',
    estado_distribuidor: '',
    cep_distribuidor: '',
    complemento_distribuidor: ''
  });

  const [enviando, setEnviando] = useState(false);
  const { buscarEnderecoPorCep, carregando } = useCep();
  
  const limparFormatacao = (valor: string): string => {
    return valor.replace(/\D/g, ''); 
  };

  useEffect(() => {
    const preencherEndereco = async () => {
      if (formData.cep_distribuidor.length === 9) {
        const endereco = await buscarEnderecoPorCep(formData.cep_distribuidor);
        if (endereco) {
          setFormData(prev => ({
            ...prev,
            logradouro_distribuidor: endereco.logradouro,
            bairro_distribuidor: endereco.bairro,
            cidade_distribuidor: endereco.localidade,
            estado_distribuidor: endereco.uf
          }));
        }
      }
    };

    preencherEndereco();
  }, [formData.cep_distribuidor]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEnviando(true);

    try {
      const dadosParaEnviar = {
        cnpj_distribuidor: limparFormatacao(formData.cnpj_distribuidor),
        nome_fantasia_distribuidor: formData.nome_fantasia_distribuidor,
        razao_social_distribuidor: formData.razao_social_distribuidor,
        email_distribuidor: formData.email_distribuidor,
        telefone_distribuidor: limparFormatacao(formData.telefone_distribuidor),
        logradouro_distribuidor: formData.logradouro_distribuidor,
        numero_logradouro_distribuidor: parseInt(formData.numero_logradouro_distribuidor) || 0,
        bairro_distribuidor: formData.bairro_distribuidor,
        cidade_distribuidor: formData.cidade_distribuidor,
        estado_distribuidor: formData.estado_distribuidor,
        cep_distribuidor: limparFormatacao(formData.cep_distribuidor),
        complemento_distribuidor: formData.complemento_distribuidor
      };

      console.log('Enviando dados:', dadosParaEnviar);

      const distribuidorCriado = await estoqueService.criarDistribuidor(dadosParaEnviar);

      if (onSubmit) {
        onSubmit(distribuidorCriado);
      }
    } catch (error) {
      console.error('Erro ao criar distribuidor:', error);
      alert('Erro ao criar distribuidor. Verifique o console.');
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    setFormData(prev => ({
      ...prev,
      cep_distribuidor: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Campos obrigatórios *
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            label="CNPJ"
            value={formData.cnpj_distribuidor}
            onChange={handleChange('cnpj_distribuidor')}
            placeholder="00.000.000/0000-00"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Razão Social *"
            value={formData.razao_social_distribuidor}
            onChange={handleChange('razao_social_distribuidor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Nome Fantasia *"
            value={formData.nome_fantasia_distribuidor}
            onChange={handleChange('nome_fantasia_distribuidor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email *"
            value={formData.email_distribuidor}
            onChange={handleChange('email_distribuidor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Telefone *"
            value={formData.telefone_distribuidor}
            onChange={handleChange('telefone_distribuidor')}
            placeholder="(11) 99999-9999"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="CEP *"
            value={formData.cep_distribuidor}
            onChange={handleCepChange}
            placeholder="00000-000"
            disabled={carregando}
            slotProps={{
              input: {
                endAdornment: carregando ? <CircularProgress size={20} /> : null
              }
            }}
            helperText={carregando ? "Buscando endereço..." : "Digite o CEP para preencher automaticamente"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            required
            fullWidth
            label="Logradouro *"
            value={formData.logradouro_distribuidor}
            onChange={handleChange('logradouro_distribuidor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Número *"
            value={formData.numero_logradouro_distribuidor}
            onChange={handleChange('numero_logradouro_distribuidor')}
            type="number"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Bairro *"
            value={formData.bairro_distribuidor}
            onChange={handleChange('bairro_distribuidor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Cidade *"
            value={formData.cidade_distribuidor}
            onChange={handleChange('cidade_distribuidor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Estado *"
            value={formData.estado_distribuidor}
            onChange={handleChange('estado_distribuidor')}
            placeholder="SP"
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Complemento"
            value={formData.complemento_distribuidor}
            onChange={handleChange('complemento_distribuidor')}
            placeholder="Apartamento, bloco, etc."
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit" disabled={enviando}>
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          disabled={enviando}
        >
          {enviando ? <CircularProgress size={20} /> : 'Salvar Distribuidor'}
        </Button>
      </Box>
    </Box>
  );
}