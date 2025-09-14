import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { pesquisaService } from '../../services/pesquisaService';

interface Distribuidor {
  id_distribuidor: number;
  cnpj_distribuidor: string;
  nome_fantasia_distribuidor: string;
  razao_social_distribuidor: string;
  email_distribuidor: string;
  telefone_distribuidor: string;
}

export default function PesquisaDistribuidores() {
  const [tipoPesquisa, setTipoPesquisa] = useState('todos');
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<Distribuidor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handlePesquisar = async () => {
    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarDistribuidores(tipoPesquisa, termo);
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
      const data = await pesquisaService.pesquisarDistribuidores('todos', '');
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
        Pesquisa de Distribuidores
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
            {resultados.map((distribuidor) => (
              <TableRow key={distribuidor.id_distribuidor}>
                <TableCell>{distribuidor.cnpj_distribuidor}</TableCell>
                <TableCell>{distribuidor.nome_fantasia_distribuidor}</TableCell>
                <TableCell>{distribuidor.razao_social_distribuidor}</TableCell>
                <TableCell>{distribuidor.email_distribuidor}</TableCell>
                <TableCell>{distribuidor.telefone_distribuidor}</TableCell>
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