import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface ItemSaida {
  id_livro: string;
  isbn_livro: string;
  titulo_livro: string;
  quantidade_itens_retirada: string;
  valor_unitario_retirada: string;
}

export default function SaidaEstoque() {
  const [motivoRetirada, setMotivoRetirada] = useState('');
  const [item, setitem] = useState<ItemSaida[]>([{
    id_livro: '',
    isbn_livro: '',
    titulo_livro: '',
    quantidade_itens_retirada: '',
    valor_unitario_retirada: ''
  }]);

  // Mock data - depois virá do backend
  const motivos = [
    { value: 'venda', label: 'Venda' },
    { value: 'perda', label: 'Perda/Danificado' },
    { value: 'devolucao', label: 'Devolução ao Fornecedor' },
    { value: 'ajuste', label: 'Ajuste de Estoque' },
    { value: 'outro', label: 'Outro' }
  ];

  const livrosEstoque = [
    { id: '1', isbn: '978-85-123-4567-8', titulo: 'Dom Casmurro', estoque: 15, valor: 29.90 },
    { id: '2', isbn: '978-85-234-5678-9', titulo: 'O Cortiço', estoque: 8, valor: 35.00 },
    { id: '3', isbn: '978-85-345-6789-0', titulo: 'Iracema', estoque: 12, valor: 25.50 }
  ];

  const adicionarItem = () => {
    setitem(prev => [...prev, {
      id_livro: '',
      isbn_livro: '',
      titulo_livro: '',
      quantidade_itens_retirada: '',
      valor_unitario_retirada: ''
    }]);
  };

  const removerItem = (index: number) => {
    if (item.length > 1) {
      setitem(prev => prev.filter((_, i) => i !== index));
    }
  };

  const atualizarItem = (index: number, field: keyof ItemSaida, value: string) => {
    setitem(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));

    // Auto-preencher dados quando selecionar um livro
    if (field === 'id_livro' && value) {
      const livroSelecionado = livrosEstoque.find(livro => livro.id === value);
      if (livroSelecionado) {
        setitem(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            id_livro: value,
            isbn_livro: livroSelecionado.isbn,
            titulo_livro: livroSelecionado.titulo,
            valor_unitario_retirada: livroSelecionado.valor.toString()
          } : item
        ));
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const dadosSaida = {
      motivo_retirada: motivoRetirada,
      data_retirada: new Date().toLocaleDateString('pt-BR'),
      hora_retirada: new Date().toLocaleTimeString('pt-BR'),
      item: item
    };

    console.log('Dados da saída:', dadosSaida);
    alert('Saída de estoque registrada com sucesso!');
  };

  const totalitem = item.reduce((total, item) => 
    total + (parseInt(item.quantidade_itens_retirada) || 0), 0
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Saída de Estoque
      </Typography>

      <Grid container spacing={3}>
        {/* Motivo da Retirada */}
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            required
            fullWidth
            label="Motivo da Retirada"
            value={motivoRetirada}
            onChange={(e) => setMotivoRetirada(e.target.value)}
          >
            {motivos.map((motivo) => (
              <MenuItem key={motivo.value} value={motivo.value}>
                {motivo.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* item da Retirada */}
        {item.map((item, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Item {index + 1} {item.length > 1 && (
                  <IconButton 
                    size="small" 
                    onClick={() => removerItem(index)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Selecionar Livro"
                    value={item.id_livro}
                    onChange={(e) => atualizarItem(index, 'id_livro', e.target.value)}
                  >
                    <MenuItem value="">Selecione um livro</MenuItem>
                    {livrosEstoque.map((livro) => (
                      <MenuItem key={livro.id} value={livro.id}>
                        {livro.titulo} (Estoque: {livro.estoque})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    required
                    fullWidth
                    label="Quantidade"
                    value={item.quantidade_itens_retirada}
                    onChange={(e) => atualizarItem(index, 'quantidade_itens_retirada', e.target.value.replace(/\D/g, ''))}
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    required
                    fullWidth
                    label="Valor Unitário"
                    value={item.valor_unitario_retirada}
                    onChange={(e) => atualizarItem(index, 'valor_unitario_retirada', e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <Typography>R$</Typography>,
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {item.id_livro && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  ISBN: {item.isbn_livro}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button
        startIcon={<AddIcon />}
        onClick={adicionarItem}
        variant="outlined"
        sx={{ mt: 2, mb: 3 }}
      >
        Adicionar Outro Item
      </Button>

      <Typography variant="body1" gutterBottom>
        Total de item: {totalitem}
      </Typography>

      <Button type="submit" variant="contained" size="large" fullWidth>
        Confirmar Saída de Estoque
      </Button>
    </Box>
  );
}