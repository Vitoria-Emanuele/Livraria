import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import EntradaEstoque from '../components/movimentacao/EntradaEstoque';
import SaidaEstoque from '../components/movimentacao/SaidaEstoque';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movimentacao-tabpanel-${index}`}
      aria-labelledby={`movimentacao-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `movimentacao-tab-${index}`,
    'aria-controls': `movimentacao-tabpanel-${index}`,
  };
}

export default function MovimentacaoPage() {
  const [abaAtiva, setAbaAtiva] = useState(0);

  const handleMudancaAba = (_event: React.SyntheticEvent, novoValor: number) => {
    setAbaAtiva(novoValor);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Movimentação de Estoque
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={abaAtiva} 
          onChange={handleMudancaAba}
          aria-label="abas de movimentação de estoque"
        >
          <Tab label="Entrada" {...a11yProps(0)} />
          <Tab label="Saída" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={abaAtiva} index={0}>
        <EntradaEstoque />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={1}>
        <SaidaEstoque />
      </CustomTabPanel>
    </Box>
  );
}