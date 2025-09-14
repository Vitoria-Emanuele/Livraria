import React, { useState } from 'react';
import {
  Box, Paper, FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import PesquisaLivros from '../components/pesquisa/PesquisaLivros';
import PesquisaFornecedores from '../components/pesquisa/PesquisarFornecedor';
import PesquisaDistribuidores from '../components/pesquisa/PesquisarDistribuidores';
import PesquisaFuncionarios from '../components/pesquisa/PesquisarFuncionario';

type TipoPesquisa = 'livros' | 'fornecedores' | 'distribuidores' | 'funcionarios';

export default function PesquisaPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPesquisa>('livros');

  const renderComponentePesquisa = () => {
    switch (tipoSelecionado) {
      case 'livros':
        return <PesquisaLivros />;
      case 'fornecedores':
        return <PesquisaFornecedores />;
      case 'distribuidores':
        return <PesquisaDistribuidores />;
      case 'funcionarios':
        return <PesquisaFuncionarios />;
      default:
        return <PesquisaLivros />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Pesquisa
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          O que você deseja pesquisar?
        </Typography>
        
        <FormControl sx={{ minWidth: 200, mt: 2 }}>
          <InputLabel>Tipo de Pesquisa</InputLabel>
          <Select
            value={tipoSelecionado}
            label="Tipo de Pesquisa"
            onChange={(e) => setTipoSelecionado(e.target.value as TipoPesquisa)}
          >
            <MenuItem value="livros">Livros</MenuItem>
            <MenuItem value="fornecedores">Fornecedores</MenuItem>
            <MenuItem value="distribuidores">Distribuidores</MenuItem>
            <MenuItem value="funcionarios">Funcionários</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {renderComponentePesquisa()}
    </Box>
  );
}