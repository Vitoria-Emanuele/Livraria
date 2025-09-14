import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { pesquisaService } from '../../services/pesquisaService';

interface Funcionario {
  id_funcionario: number;
  nome_funcionario: string;
  ctps_funcionario: string;
  cpf_funcionario: string;
  setor: string;
  cargo: string;
  salario: number;
  telefone_funcionario: string;
  email_funcionario: string;
}

export default function PesquisaFuncionarios() {
  const [tipoPesquisa, setTipoPesquisa] = useState('todos');
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handlePesquisar = async () => {
    setCarregando(true);
    try {
      const data = await pesquisaService.pesquisarFuncionarios(tipoPesquisa, termo);
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
      const data = await pesquisaService.pesquisarFuncionarios('todos', '');
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
        Pesquisa de Funcionários
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
            <MenuItem value="nome">Nome</MenuItem>
            <MenuItem value="cpf">CPF</MenuItem>
            <MenuItem value="ctps">CTPS</MenuItem>
            <MenuItem value="email">Email</MenuItem>
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
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>CTPS</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Setor</TableCell>
              <TableCell>Salário</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultados.map((funcionario) => (
              <TableRow key={funcionario.id_funcionario}>
                <TableCell>{funcionario.nome_funcionario}</TableCell>
                <TableCell>{funcionario.cpf_funcionario}</TableCell>
                <TableCell>{funcionario.ctps_funcionario}</TableCell>
                <TableCell>{funcionario.cargo}</TableCell>
                <TableCell>{funcionario.setor}</TableCell>
                <TableCell>R$ {funcionario.salario.toFixed(2)}</TableCell>
                <TableCell>{funcionario.email_funcionario}</TableCell>
                <TableCell>{funcionario.telefone_funcionario}</TableCell>
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