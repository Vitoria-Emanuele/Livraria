import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import GraficoEstoque from '../components/relatorio/GraficoEstoque';
import GraficoEntradas from '../components/relatorio/GraficoEntrada';
import GraficoRetiradas from '../components/relatorio/GraficoRetirada';
import GraficoFinanceiro from '../components/relatorio/GraficoFinanceiro';

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
      hidden={value !== index} {...other}
      id={`movimentacao-tabpanel-${index}`}
      aria-labelledby={`movimentacao-tab-${index}`}
      {...other}
      >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children
          }</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `relatorio-tab-${index}`,
    'aria-controls': `relatorio-tabpanel-${index}`,
  };
}

export default function RelatorioPage() {
  const [abaAtiva, setAbaAtiva] = useState(0);

  const handleMudancaAba = (_event: React.SyntheticEvent, novoValor: number) => {
    setAbaAtiva(novoValor);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={abaAtiva} onChange={handleMudancaAba}>
          <Tab label="Estoque" {...a11yProps(0)} />
          <Tab label="Entradas" {...a11yProps(1)} />
          <Tab label="Retiradas" {...a11yProps(2)} />
          <Tab label="Financeiro" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={abaAtiva} index={0}>
        <GraficoEstoque />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={1}>
        <GraficoEntradas />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={2}>
        <GraficoRetiradas />
      </CustomTabPanel>

      <CustomTabPanel value={abaAtiva} index={3}>
        <GraficoFinanceiro />
      </CustomTabPanel>
    </Box>
  );
}