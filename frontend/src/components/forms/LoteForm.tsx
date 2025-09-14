import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { NumericFormat } from 'react-number-format';

interface LoteData {
  valor_lote: string;
  quantidade_itens_lote: string;
}

export default function LoteForm() {
  const [formData, setFormData] = useState<LoteData>({
    valor_lote: '',
    quantidade_itens_lote: ''
  });

  const [erros, setErros] = useState<Partial<LoteData>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<LoteData> = {};

    if (!formData.valor_lote || parseFloat(formData.valor_lote.replace(',', '.')) <= 0) {
      novosErros.valor_lote = 'Valor do lote e obrigatorio e deve ser maior que zero';
    }

    if (!formData.quantidade_itens_lote || parseInt(formData.quantidade_itens_lote) <= 0) {
      novosErros.quantidade_itens_lote = 'Quantidade de itens e obrigatoria';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleQuantidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setFormData(prev => ({ ...prev, quantidade_itens_lote: value }));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dados do Lote
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <NumericFormat
            customInput={TextField}
            fullWidth
            required
            label="Valor Total do Lote"
            value={formData.valor_lote}
            onValueChange={(values) => {
              setFormData(prev => ({ ...prev, valor_lote: values.value || '' }));
            }}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            prefix="R$ "
            placeholder="R$ 0,00"
            error={!!erros.valor_lote}
            helperText={erros.valor_lote}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            label="Quantidade de Itens"
            value={formData.quantidade_itens_lote}
            onChange={handleQuantidadeChange}
            error={!!erros.quantidade_itens_lote}
            helperText={erros.quantidade_itens_lote}
            type="number"
          />
        </Grid>
      </Grid>
    </Box>
  );
}