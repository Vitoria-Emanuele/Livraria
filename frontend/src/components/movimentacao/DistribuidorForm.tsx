import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useCep } from '../../hooks/useCep';
import { estoqueService } from '../../services';

interface FornecedorFormProps {
  onSuccess?: (dadosFornecedor: any) => void;
  onCancel?: () => void;
}

export default function FornecedorForm({ onSuccess, onCancel }: FornecedorFormProps) {
  const [formData, setFormData] = useState({
    cnpj_fornecedor: '',
    razao_social_fornecedor: '',
    nome_fantasia_fornecedor: '',
    email_fornecedor: '',
    telefone_fornecedor: '',
    logradouro_fornecedor: '',
    numero_logradouro_fornecedor: '',
    bairro_fornecedor: '',
    cidade_fornecedor: '',
    estado_fornecedor: '',
    cep_fornecedor: '',
    complemento_fornecedor: ''
  });

  const [enviando, setEnviando] = useState(false);
  const { buscarEnderecoPorCep, carregando } = useCep();
  
  const limparFormatacao = (valor: string): string => {
    return valor.replace(/\D/g, ''); 
  };

  useEffect(() => {
    const preencherEndereco = async () => {
      if (formData.cep_fornecedor.length === 9) {
        const endereco = await buscarEnderecoPorCep(formData.cep_fornecedor);
        if (endereco) {
          setFormData(prev => ({
            ...prev,
            logradouro_fornecedor: endereco.logradouro,
            bairro_fornecedor: endereco.bairro,
            cidade_fornecedor: endereco.localidade,
            estado_fornecedor: endereco.uf
          }));
        }
      }
    };

    preencherEndereco();
  }, [formData.cep_fornecedor]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEnviando(true);

    try {
      const dadosParaEnviar = {
        cnpj_fornecedor: limparFormatacao(formData.cnpj_fornecedor),
        nome_fantasia_fornecedor: formData.nome_fantasia_fornecedor,
        razao_social_fornecedor: formData.razao_social_fornecedor,
        email_fornecedor: formData.email_fornecedor,
        telefone_fornecedor: limparFormatacao(formData.telefone_fornecedor),
        logradouro_fornecedor: formData.logradouro_fornecedor,
        numero_logradouro_fornecedor: parseInt(formData.numero_logradouro_fornecedor) || 0,
        bairro_fornecedor: formData.bairro_fornecedor,
        cidade_fornecedor: formData.cidade_fornecedor,
        estado_fornecedor: formData.estado_fornecedor,
        cep_fornecedor: limparFormatacao(formData.cep_fornecedor),
        complemento_fornecedor: formData.complemento_fornecedor
      };

      console.log('Enviando dados:', dadosParaEnviar);

      const fornecedorCriado = await estoqueService.criarFornecedor(dadosParaEnviar);

      if (onSuccess) {
        onSuccess(fornecedorCriado);
      }
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      alert('Erro ao criar fornecedor. Verifique o console.');
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
      cep_fornecedor: value
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
            value={formData.cnpj_fornecedor}
            onChange={handleChange('cnpj_fornecedor')}
            placeholder="00.000.000/0000-00"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Razão Social *"
            value={formData.razao_social_fornecedor}
            onChange={handleChange('razao_social_fornecedor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Nome Fantasia *"
            value={formData.nome_fantasia_fornecedor}
            onChange={handleChange('nome_fantasia_fornecedor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email *"
            value={formData.email_fornecedor}
            onChange={handleChange('email_fornecedor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Telefone *"
            value={formData.telefone_fornecedor}
            onChange={handleChange('telefone_fornecedor')}
            placeholder="(11) 99999-9999"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="CEP *"
            value={formData.cep_fornecedor}
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
            value={formData.logradouro_fornecedor}
            onChange={handleChange('logradouro_fornecedor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Número *"
            value={formData.numero_logradouro_fornecedor}
            onChange={handleChange('numero_logradouro_fornecedor')}
            type="number"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Bairro *"
            value={formData.bairro_fornecedor}
            onChange={handleChange('bairro_fornecedor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Cidade *"
            value={formData.cidade_fornecedor}
            onChange={handleChange('cidade_fornecedor')}
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Estado *"
            value={formData.estado_fornecedor}
            onChange={handleChange('estado_fornecedor')}
            placeholder="SP"
            disabled={carregando}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Complemento"
            value={formData.complemento_fornecedor}
            onChange={handleChange('complemento_fornecedor')}
            placeholder="Apartamento, bloco, etc."
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <Button onClick={onCancel} color="inherit" disabled={enviando}>
          Cancelar
        </Button>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={enviando}
        >
          {enviando ? <CircularProgress size={20} /> : 'Salvar Fornecedor'}
        </Button>
        
      </Box>
    </Box>
  );
}