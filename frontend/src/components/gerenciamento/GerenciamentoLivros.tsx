import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert,
  Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Search } from '@mui/icons-material';
import { estoqueService, type Livro } from '../../services/estoqueService';
import { pesquisaService } from '../../services/pesquisaService';

export default function GerenciamentoLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string>('');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [tipoPesquisa, setTipoPesquisa] = useState('todos');

  useEffect(() => {
    carregarLivros();
  }, []);

  useEffect(() => {
    if (termoPesquisa.trim() === '') {
      setLivrosFiltrados(livros);
    } else {
      const filtrados = livros.filter(livro => {
        const termo = termoPesquisa.toLowerCase();
        switch (tipoPesquisa) {
          case 'titulo':
            return livro.titulo_livro.toLowerCase().includes(termo);
          case 'autor':
            return livro.autor_livro.toLowerCase().includes(termo);
          case 'isbn':
            return livro.isbn_livro.includes(termo);
          case 'genero':
            return livro.genero_literario.toLowerCase().includes(termo);
          default:
            return true;
        }
      });
      setLivrosFiltrados(filtrados);
    }
  }, [livros, termoPesquisa, tipoPesquisa]);

  const carregarLivros = async () => {
    setCarregando(true);
    try {
      const data = await estoqueService.listarLivros();
      setLivros(data);
      setLivrosFiltrados(data);
      setErro('');
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      setErro('Erro ao carregar livros');
    } finally {
      setCarregando(false);
    }
  };

  const handlePesquisar = async () => {
    if (termoPesquisa.trim() === '' || tipoPesquisa === 'todos') {
      carregarLivros();
      return;
    }

    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarLivros(tipoPesquisa, termoPesquisa);
      setLivrosFiltrados(data);
      setErro('');
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setErro('Erro ao pesquisar livros');
      setLivrosFiltrados([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleLimparPesquisa = () => {
    setTermoPesquisa('');
    setTipoPesquisa('todos');
    carregarLivros();
  };

  const handleSalvarEdicao = async () => {
    if (!livroEditando) return;

    try {
      await estoqueService.atualizarLivro(livroEditando.id_livro, {
        titulo_livro: livroEditando.titulo_livro,
        autor_livro: livroEditando.autor_livro,
        genero_literario: livroEditando.genero_literario,
        editora_livro: livroEditando.editora_livro
      });

      setDialogAberto(false);
      setLivroEditando(null);
      carregarLivros(); 
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      setErro('Erro ao salvar alterações');
    }
  };

  const abrirDialogEdicao = (livro: Livro) => {
    setLivroEditando({ ...livro });
    setDialogAberto(true);
    setErro('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handlePesquisar();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gerenciamento de Livros
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Aqui você pode editar informações dos livros e pesquisar por livros existentes.
        A criação de livros é feita automaticamente durante as entradas de estoque.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Tipo de Pesquisa</InputLabel>
          <Select
            value={tipoPesquisa}
            label="Tipo de Pesquisa"
            onChange={(e) => setTipoPesquisa(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="isbn">ISBN</MenuItem>
            <MenuItem value="titulo">Título</MenuItem>
            <MenuItem value="autor">Autor</MenuItem>
            <MenuItem value="genero">Gênero</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Termo de pesquisa"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={tipoPesquisa === 'todos'}
          sx={{ minWidth: 200 }}
          placeholder={tipoPesquisa === 'isbn' ? 'Digite o ISBN' : 'Digite para pesquisar'}
        />

        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handlePesquisar}
          disabled={carregando || (tipoPesquisa !== 'todos' && !termoPesquisa)}
        >
          Pesquisar
        </Button>

        <Button
          variant="outlined"
          onClick={handleLimparPesquisa}
          disabled={carregando}
        >
          Limpar
        </Button>
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ISBN</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Gênero</TableCell>
              <TableCell>Editora</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {livrosFiltrados.map((livro) => (
              <TableRow key={livro.id_livro}>
                <TableCell>{livro.isbn_livro}</TableCell>
                <TableCell>{livro.titulo_livro}</TableCell>
                <TableCell>{livro.autor_livro}</TableCell>
                <TableCell>{livro.genero_literario}</TableCell>
                <TableCell>{livro.editora_livro}</TableCell>
                <TableCell>{livro.estoque_atual}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => abrirDialogEdicao(livro)}
                    disabled={carregando}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {carregando && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          Carregando...
        </Typography>
      )}
      
      {livrosFiltrados.length === 0 && !carregando && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          {termoPesquisa ? 'Nenhum livro encontrado para a pesquisa.' : 'Nenhum livro cadastrado.'}
        </Typography>
      )}

      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar Livro
        </DialogTitle>
        <DialogContent>
          {livroEditando && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="ISBN"
                value={livroEditando.isbn_livro}
                disabled
                helperText="ISBN não pode ser alterado"
              />
              <TextField
                label="Título"
                value={livroEditando.titulo_livro}
                onChange={(e) => setLivroEditando({
                  ...livroEditando,
                  titulo_livro: e.target.value
                })}
              />
              <TextField
                label="Autor"
                value={livroEditando.autor_livro}
                onChange={(e) => setLivroEditando({
                  ...livroEditando,
                  autor_livro: e.target.value
                })}
              />
              <TextField
                label="Gênero"
                value={livroEditando.genero_literario}
                onChange={(e) => setLivroEditando({
                  ...livroEditando,
                  genero_literario: e.target.value
                })}
              />
              <TextField
                label="Editora"
                value={livroEditando.editora_livro}
                onChange={(e) => setLivroEditando({
                  ...livroEditando,
                  editora_livro: e.target.value
                })}
              />
              <TextField
                label="Estoque Atual"
                value={livroEditando.estoque_atual}
                disabled
                helperText="O estoque é controlado automaticamente pelas entradas e saídas"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <Button onClick={handleSalvarEdicao} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}