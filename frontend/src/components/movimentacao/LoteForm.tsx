import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

interface LoteFormProps {
  onNext: (dadosLote: LoteData) => void;
  onBack: () => void;
}

interface LoteData {
  valor_lote: string;
  quantidade_item_lote: string;
}

export default function LoteForm({ onNext, onBack }: LoteFormProps) {
  const [formData, setFormData] = useState<LoteData>({
    valor_lote: '',
    quantidade_item_lote: ''
  });

  const [erros, setErros] = useState<Partial<LoteData>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<LoteData> = {};

    if (!formData.valor_lote || parseFloat(formData.valor_lote) <= 0) {
      novosErros.valor_lote = 'Valor do lote é obrigatório';
    }

    if (!formData.quantidade_item_lote || parseInt(formData.quantidade_item_lote) <= 0) {
      novosErros.quantidade_item_lote = 'Quantidade de item é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validarFormulario()) {
      onNext(formData);
    }
  };

  const handleChange = (field: keyof LoteData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    // Validação básica para números
    if (field === 'valor_lote') {
      // Permite apenas números e ponto decimal
      if (/^\d*\.?\d*$/.test(value) || value === '') {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'quantidade_item_lote') {
      // Permite apenas números inteiros
      if (/^\d*$/.test(value) || value === '') {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const formatarValor = (valor: string): string => {
    if (!valor) return '';
    
    const numero = parseFloat(valor);
    if (isNaN(numero)) return valor;
    
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dados do Lote
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            label="Valor Total do Lote"
            value={formatarValor(formData.valor_lote)}
            onChange={handleChange('valor_lote')}
            error={!!erros.valor_lote}
            helperText={erros.valor_lote}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }
            }}
            placeholder="0,00"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            label="Quantidade de item"
            value={formData.quantidade_item_lote}
            onChange={handleChange('quantidade_item_lote')}
            error={!!erros.quantidade_item_lote}
            helperText={erros.quantidade_item_lote}
            type="number"
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Após preencher estes dados, você poderá adicionar os livros individualmente na próxima etapa.
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} color="inherit">
          Voltar
        </Button>
        <Button type="submit" variant="contained">
          Próximo → Adicionar Livros
        </Button>
      </Box>
    </Box>
  );
}