import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { pesquisaService } from '../../services/pesquisaService';

interface Livro {
  id_livro: number;
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
}

export default function PesquisaLivros() {
  const [tipoPesquisa, setTipoPesquisa] = useState('todos');
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handlePesquisar = async () => {
    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarLivros(tipoPesquisa, termo);
      setResultados(data);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleListarTodos = async () => {
    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarLivros('todos', '');
      setResultados(data);
    } catch (error) {
      console.error('Erro ao listar todos:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pesquisa de Livros
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
            <MenuItem value="editora">Editora</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Termo de busca"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          disabled={tipoPesquisa === 'todos'}
          sx={{ minWidth: 200 }}
        />

        <Button
          variant="contained"
          onClick={handlePesquisar}
          disabled={carregando || (tipoPesquisa !== 'todos' && !termo)}
        >
          Pesquisar
        </Button>

        <Button
          variant="outlined"
          onClick={handleListarTodos}
          disabled={carregando}
        >
          Listar Todos
        </Button>
      </Box>

      {carregando && <Typography>Carregando...</Typography>}

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
            </TableRow>
          </TableHead>
          <TableBody>
            {resultados.map((livro) => (
              <TableRow key={livro.id_livro}>
                <TableCell>{livro.isbn_livro}</TableCell>
                <TableCell>{livro.titulo_livro}</TableCell>
                <TableCell>{livro.autor_livro}</TableCell>
                <TableCell>{livro.genero_literario}</TableCell>
                <TableCell>{livro.editora_livro}</TableCell>
                <TableCell>{livro.estoque_atual}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {resultados.length === 0 && !carregando && (
        <Typography sx={{ mt: 2 }}>Nenhum resultado encontrado.</Typography>
      )}
    </Paper>
  );
}