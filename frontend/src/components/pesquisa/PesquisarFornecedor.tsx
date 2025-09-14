import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { pesquisaService } from '../../services/pesquisaService';

interface Fornecedor {
  id_fornecedor: number;
  cnpj_fornecedor: string;
  nome_fantasia_fornecedor: string;
  razao_social_fornecedor: string;
  email_fornecedor: string;
  telefone_fornecedor: string;
}

export default function PesquisaFornecedores() {
  const [tipoPesquisa, setTipoPesquisa] = useState('todos');
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handlePesquisar = async () => {
    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarFornecedores(tipoPesquisa, termo);
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
      const data = await pesquisaService.pesquisarFornecedores('todos', '');
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
        Pesquisa de Fornecedores
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
            <MenuItem value="cnpj">CNPJ</MenuItem>
            <MenuItem value="nome_fantasia">Nome Fantasia</MenuItem>
            <MenuItem value="razao_social">Razão Social</MenuItem>
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
              <TableCell>CNPJ</TableCell>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultados.map((fornecedor) => (
              <TableRow key={fornecedor.id_fornecedor}>
                <TableCell>{fornecedor.cnpj_fornecedor}</TableCell>
                <TableCell>{fornecedor.nome_fantasia_fornecedor}</TableCell>
                <TableCell>{fornecedor.razao_social_fornecedor}</TableCell>
                <TableCell>{fornecedor.email_fornecedor}</TableCell>
                <TableCell>{fornecedor.telefone_fornecedor}</TableCell>
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