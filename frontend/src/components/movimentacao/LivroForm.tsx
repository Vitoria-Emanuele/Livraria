import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { NumericFormat } from 'react-number-format';
import { useState } from 'react';
import { MenuItem } from '@mui/material';

export interface LivroData {
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  quantidade_item_lote: string;
  valor_item_lote: string;
}

interface LivroFormProps {
  onLivrosChange?: (livros: LivroData[]) => void;
}

const GENEROS_LITERARIOS = [
  'Romance','Ficção Científica','Fantasia','Terror','Mistério','Suspense','Aventura','Biografia','História','Poesia','Drama','Comédia','Infantil','Juvenil','Autoajuda','Didático','Religioso','Acadêmico','Outro'
];

export default function LivroForm({ onLivrosChange }: LivroFormProps) {
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
    const novosLivros = [...livros, {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      genero_literario: '',
      editora_livro: '',
      quantidade_item_lote: '',
      valor_item_lote: ''
    }];
    
    setLivros(novosLivros);
    if (onLivrosChange) onLivrosChange(novosLivros);
  };

  const removerLivro = (index: number) => {
    if (livros.length > 1) {
      const novosLivros = livros.filter((_, i) => i !== index);
      setLivros(novosLivros);
      setErros(prev => prev.filter((_, i) => i !== index));
      if (onLivrosChange) onLivrosChange(novosLivros);
    }
  };

  const atualizarLivro = (index: number, field: keyof LivroData, value: string) => {
    const novosLivros = livros.map((livro, i) => 
      i === index ? { ...livro, [field]: value } : livro
    );
    
    setLivros(novosLivros);
    if (onLivrosChange) onLivrosChange(novosLivros);
  };


  const validarFormulario = (): boolean => {
    const novosErros: Partial<LivroData>[] = [];
    let valido = true;

    livros.forEach((livro) => {
      const erro: Partial<LivroData> = {};

      if (!livro.isbn_livro) erro.isbn_livro = 'ISBN é obrigatório';
      if (!livro.titulo_livro) erro.titulo_livro = 'Título é obrigatório';
      if (!livro.genero_literario) {
        erro.genero_literario = 'Selecione um gênero literário';
      }
      if (!livro.quantidade_item_lote || parseInt(livro.quantidade_item_lote) <= 0) {
        erro.quantidade_item_lote = 'Quantidade é obrigatória';
      }
      if (!livro.valor_item_lote || parseFloat(livro.valor_item_lote) <= 0) {
        erro.valor_item_lote = 'Valor é obrigatório';
      }

      const valorNumerico = parseFloat(livro.valor_item_lote);
      if (!livro.valor_item_lote || isNaN(valorNumerico) || valorNumerico < 0){ 
        erro.valor_item_lote = 'Valor unitário é obrigatório';
      }

      novosErros.push(erro);
      if (Object.keys(erro).length > 0) valido = false;
    });

    setErros(novosErros);
    return valido;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Adicionar Livros ao Lote
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
                select
                required
                fullWidth
                label="Gênero Literário"
                value={livro.genero_literario || ''}
                onChange={(e) => atualizarLivro(index, 'genero_literario', e.target.value)}
                error={!!erros[index]?.genero_literario}
                helperText={erros[index]?.genero_literario}
              >
                <MenuItem value="">
                  <em>Selecione um gênero</em>
                </MenuItem>
                {GENEROS_LITERARIOS.map((genero) => (
                  <MenuItem key={genero} value={genero}>
                    {genero}
                  </MenuItem>
                ))}
              </TextField>
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
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <NumericFormat
                customInput={TextField}
                required
                fullWidth
                label="Valor Unitário"
                value={livro.valor_item_lote}
                onValueChange={(values) => {
                  atualizarLivro(index, 'valor_item_lote', values.value);
                }}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                thousandSeparator="."
                prefix="R$ "
                placeholder="R$ 0,00"
                error={!!erros[index]?.valor_item_lote}
                helperText={erros[index]?.valor_item_lote}
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
    </Box>
  );
}