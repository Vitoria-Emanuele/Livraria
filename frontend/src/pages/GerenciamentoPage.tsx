import React, { useState } from 'react';
import {
  Box, Paper, FormControl, InputLabel, Select, MenuItem, Typography, Tabs, Tab
} from '@mui/material';
import GerenciamentoFornecedores from '../components/gerenciamento/GerenciamentoFornecedor';
import GerenciamentoDistribuidores from '../components/gerenciamento/GerenciamentoDistribuidor';
import GerenciamentoFuncionarios from '../components/gerenciamento/GerenciamentoFuncionario';
import GerenciamentoLivros from '../components/gerenciamento/GerenciamentoLivros';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `gerenciamento-tab-${index}`,
    'aria-controls': `gerenciamento-tabpanel-${index}`,
  };
}

export default function GerenciamentoPage() {
  const [abaAtiva, setAbaAtiva] = useState(0);

  const handleMudancaAba = (_event: React.SyntheticEvent, novoValor: number) => {
    setAbaAtiva(novoValor);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Setor de Gerenciamento
      </Typography>


      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={abaAtiva} onChange={handleMudancaAba}>
          <Tab label="Fornecedores" {...a11yProps(0)} />
          <Tab label="Distribuidores" {...a11yProps(1)} />
          <Tab label="Funcionários" {...a11yProps(2)} />
          <Tab label="Livros" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={abaAtiva} index={0}>
        <GerenciamentoFornecedores />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={1}>
        <GerenciamentoDistribuidores />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={2}>
        <GerenciamentoFuncionarios />
      </CustomTabPanel>
      <CustomTabPanel value={abaAtiva} index={3}>
        <GerenciamentoLivros />
      </CustomTabPanel>
    </Box>
  );
}