import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { NumericFormat } from 'react-number-format';
import { useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { buscarLivroPorIsbn } from '../../services';

export interface LivroData {
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  quantidade_item_lote: string;
  valor_item_lote: string;
  valor_venda: string
}

interface LivroFormProps {
  onLivrosChange?: (livros: LivroData[]) => void;
  onReset?: () => void; 
  resetTrigger?: number;
}

const limparIsbn = (valor: string): string => {
  return valor.replace(/[-\s]/g, ''); 
};
const limparFormatacao = (valor: string): string => {
  return valor.replace(/\D/g, ''); 
};

const formatarValor = (valor: string): string => {
  return valor.replace(/[^\d.]/g, '');
};


const GENEROS_LITERARIOS = [
  'Acadêmico', 'Ação', 'Aventura', 'Autoajuda', 'Biografia', 'Clássicos',
  'Comédia', 'Contos', 'Crônica', 'Didático', 'Drama', 'Ensaio', 'Fantasia',
  'Ficção Científica', 'Ficção Histórica', 'História', 'Infantil', 'Juvenil',
  'Literatura Alemã', 'Literatura Americana', 'Literatura Brasileira',
  'Literatura Francesa', 'Literatura Italiana', 'Literatura Japonesa',
  'Literatura Portuguesa', 'Literatura Russa', 'Literatura Árabe', 'Literatura Africana',
  'Literatura Latino-americana', 'Mistério', 'Modernismo', 'Poesia', 'Policial', 'Psicologia',
   'Religioso', 'Romance', 'Suspense', 'Terror', 'Tragicomédia', 'Outro'
];

export default function LivroForm({ onLivrosChange, onReset, resetTrigger }: LivroFormProps) {
  const [livros, setLivros] = useState<LivroData[]>([
    {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      genero_literario: '',
      editora_livro: '',
      quantidade_item_lote: '',
      valor_item_lote: '',
      valor_venda: ''
    }
  ]);

  const [erros, setErros] = useState<Partial<LivroData>[]>([]);
  const [statusBusca, setStatusBusca] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setLivros([{
        isbn_livro: '',
        titulo_livro: '',
        autor_livro: '',
        genero_literario: '',
        editora_livro: '',
        quantidade_item_lote: '',
        valor_item_lote: '',
        valor_venda:''
      }]);
      setErros([]);
      setStatusBusca({});
      if (onLivrosChange) onLivrosChange([]);
    }
  }, [resetTrigger, onLivrosChange]);

  const buscarLivro = async (isbn: string, index: number) => {
    console.log('Buscando ISBN:', isbn);
    setStatusBusca(prev => ({ ...prev, [index]: 'buscando' }));

    try {
      const isbnLimpo = limparIsbn(isbn);
      const livro = await buscarLivroPorIsbn(isbnLimpo);
      
      if (livro) {
        console.log('Livro encontrado:', livro);
        setStatusBusca(prev => ({ ...prev, [index]: 'encontrado' }));
        
        const novosLivros = livros.map((item, i) => 
          i === index ? {
            ...item,
            isbn_livro: isbnLimpo,
            titulo_livro: livro.titulo_livro,
            autor_livro: livro.autor_livro,
            genero_literario: livro.genero_literario,
            editora_livro: livro.editora_livro
          } : item
        );
        
        setLivros(novosLivros);
        if (onLivrosChange) onLivrosChange(novosLivros);
      } else {
        console.log('ISBN não encontrado:', isbn);
        setStatusBusca(prev => ({ ...prev, [index]: 'nao_encontrado' }));
        
        const confirmar = window.confirm(
          `ISBN ${isbn} não encontrado. Deseja cadastrar como novo livro?`
        );
        
        if (!confirmar) {
          const novosLivros = livros.map((item, i) => 
            i === index ? { ...item, isbn_livro: '' } : item
          );
          setLivros(novosLivros);
          if (onLivrosChange) onLivrosChange(novosLivros);
        } else {
          const novosLivros = livros.map((item, i) => 
            i === index ? { ...item, isbn_livro: isbnLimpo } : item
          );
          setLivros(novosLivros);
          if (onLivrosChange) onLivrosChange(novosLivros);
        }
      }
    } catch (error) {
      console.error('Erro na busca por ISBN:', error);
      setStatusBusca(prev => ({ ...prev, [index]: 'erro' }));
    }
  };

  const adicionarLivro = () => {
    const novosLivros = [...livros, {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      genero_literario: '',
      editora_livro: '',
      quantidade_item_lote: '',
      valor_item_lote: '',
      valor_venda:''
    }];
    
    setLivros(novosLivros);
    if (onLivrosChange) onLivrosChange(novosLivros);
  };

  const removerLivro = (index: number) => {
    if (livros.length > 1) {
      const novosLivros = livros.filter((_, i) => i !== index);
      setLivros(novosLivros);
      setErros(prev => prev.filter((_, i) => i !== index));
      const novoStatus = { ...statusBusca };
      delete novoStatus[index];
      setStatusBusca(novoStatus);
      if (onLivrosChange) onLivrosChange(novosLivros);
    }
  };

  const atualizarLivro = async (index: number, field: keyof LivroData, value: string) => {
    let valorFormatado = value;
    
    if (field === 'isbn_livro') {
      valorFormatado = limparIsbn(value);
    }else if (field === 'quantidade_item_lote') {
      valorFormatado = limparFormatacao(value);
    } else if (field === 'valor_item_lote') {
      valorFormatado = formatarValor(value);
    }else if (field === 'valor_venda') {
      valorFormatado = formatarValor(value);
    }


    const novosLivros = livros.map((livro, i) => 
      i === index ? { ...livro, [field]: valorFormatado } : livro
    );

    setLivros(novosLivros);
    if (onLivrosChange) onLivrosChange(novosLivros);

    if (field === 'isbn_livro') {
      if (valorFormatado.length >= 10) {
        buscarLivro(valorFormatado, index);
      } else {
        setStatusBusca(prev => ({ ...prev, [index]: '' }));
      }
    }
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
      if (!livro.valor_venda || parseFloat(livro.valor_venda) <= 0) {
        erro.valor_venda = 'Valor é obrigatório';
      }

      const valorNumerico = parseFloat(livro.valor_item_lote);
      if (!livro.valor_item_lote || isNaN(valorNumerico) || valorNumerico < 0) { 
        erro.valor_item_lote = 'Valor unitário é obrigatório';
      }

      novosErros.push(erro);
      if (Object.keys(erro).length > 0) valido = false;
    });

    setErros(novosErros);
    return valido;
  };

  const getHelperText = (index: number): string => {
    const status = statusBusca[index];
    return (
      erros[index]?.isbn_livro ||
      (status === 'buscando' ? 'Buscando...' :
       status === 'encontrado' ? 'Livro encontrado' :
       status === 'nao_encontrado' ? 'ISBN não cadastrado' :
       status === 'erro' ? 'Erro na busca' : 
       'Digite o ISBN completo (10 ou 13 dígitos)')
    );
  };

  // interface

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
                error={!!erros[index]?.isbn_livro || statusBusca[index] === 'erro'}
                helperText={getHelperText(index)}
                placeholder="9788512345678"
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
                onChange={(e) => atualizarLivro(index, 'quantidade_item_lote', e.target.value)}
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

            <Grid size={{ xs: 12, sm: 3 }}>
              <NumericFormat
                customInput={TextField}
                required
                fullWidth
                label="Valor Unitário para venda"
                value={livro.valor_venda}
                onValueChange={(values) => {
                  atualizarLivro(index, 'valor_venda', values.value);
                }}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                thousandSeparator="."
                prefix="R$ "
                placeholder="R$ 0,00"
                error={!!erros[index]?.valor_venda}
                helperText={erros[index]?.valor_venda}
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