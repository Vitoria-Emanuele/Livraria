import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface LivroFormProps {
  onNext: (livros: LivroData[]) => void;
  onBack: () => void;
  quantidadeitem: number;
}

export interface LivroData {
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  quantidade_item_lote: string;
  valor_item_lote: string;
}

export default function LivroForm({ onNext, onBack, quantidadeitem }: LivroFormProps) {
  const [livros, setLivros] = useState<LivroData[]>([
    {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      genero_literario: '',
      editora_livro: '',
      quantidade_item_lote: '',
      valor_item_lote: ''
    }
  ]);

  const [erros, setErros] = useState<Partial<LivroData>[]>([]);

  const adicionarLivro = () => {
    setLivros(prev => [...prev, {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      genero_literario: '',
      editora_livro: '',
      quantidade_item_lote: '',
      valor_item_lote: ''
    }]);
  };

  const removerLivro = (index: number) => {
    if (livros.length > 1) {
      setLivros(prev => prev.filter((_, i) => i !== index));
      setErros(prev => prev.filter((_, i) => i !== index));
    }
  };

  const atualizarLivro = (index: number, field: keyof LivroData, value: string) => {
    setLivros(prev => prev.map((livro, i) => 
      i === index ? { ...livro, [field]: value } : livro
    ));
  };

  const validarFormulario = (): boolean => {
    const novosErros: Partial<LivroData>[] = [];
    let valido = true;

    livros.forEach((livro, ) => {
      const erro: Partial<LivroData> = {};

      if (!livro.isbn_livro) erro.isbn_livro = 'ISBN é obrigatório';
      if (!livro.titulo_livro) erro.titulo_livro = 'Título é obrigatório';
      if (!livro.quantidade_item_lote || parseInt(livro.quantidade_item_lote) <= 0) {
        erro.quantidade_item_lote = 'Quantidade é obrigatória';
      }
      if (!livro.valor_item_lote || parseFloat(livro.valor_item_lote) <= 0) {
        erro.valor_item_lote = 'Valor é obrigatório';
      }

      novosErros.push(erro);
      if (Object.keys(erro).length > 0) valido = false;
    });

    setErros(novosErros);
    return valido;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validarFormulario()) {
      onNext(livros);
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

  const totalitemAdicionados = livros.reduce((total, livro) => 
    total + (parseInt(livro.quantidade_item_lote) || 0), 0
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Adicionar Livros ao Lote
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        item adicionados: {totalitemAdicionados} de {quantidadeitem}
      </Typography>

      {livros.map((livro, index) => (
        <Box key={index} sx={{ 
          mb: 4, 
          p: 3, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 2 
        }}>
          <Typography variant="subtitle1" gutterBottom>
            Livro {index + 1} {livros.length > 1 && (
              <IconButton 
                size="small" 
                onClick={() => removerLivro(index)}
                color="error"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="ISBN"
                value={livro.isbn_livro}
                onChange={(e) => atualizarLivro(index, 'isbn_livro', e.target.value)}
                error={!!erros[index]?.isbn_livro}
                helperText={erros[index]?.isbn_livro}
                placeholder="978-85-123-4567-8"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Título do Livro"
                value={livro.titulo_livro}
                onChange={(e) => atualizarLivro(index, 'titulo_livro', e.target.value)}
                error={!!erros[index]?.titulo_livro}
                helperText={erros[index]?.titulo_livro}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Autor"
                value={livro.autor_livro}
                onChange={(e) => atualizarLivro(index, 'autor_livro', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Gênero Literário"
                value={livro.genero_literario}
                onChange={(e) => atualizarLivro(index, 'genero_literario', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Editora"
                value={livro.editora_livro}
                onChange={(e) => atualizarLivro(index, 'editora_livro', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                required
                fullWidth
                label="Quantidade"
                value={livro.quantidade_item_lote}
                onChange={(e) => atualizarLivro(index, 'quantidade_item_lote', e.target.value.replace(/\D/g, ''))}
                error={!!erros[index]?.quantidade_item_lote}
                helperText={erros[index]?.quantidade_item_lote}
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                required
                fullWidth
                label="Valor Unitário"
                value={formatarValor(livro.valor_item_lote)}
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                  if (/^\d*\.?\d*$/.test(valor) || valor === '') {
                    atualizarLivro(index, 'valor_item_lote', valor);
                  }
                }}
                error={!!erros[index]?.valor_item_lote}
                helperText={erros[index]?.valor_item_lote}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={adicionarLivro}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Adicionar Outro Livro
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={onBack} color="inherit">
          Voltar
        </Button>
        <Button type="submit" variant="contained">
          Próximo → Confirmar
        </Button>
      </Box>
    </Box>
  );
}