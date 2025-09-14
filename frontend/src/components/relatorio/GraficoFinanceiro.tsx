import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography
} from '@mui/material';
import { relatorioService } from '../../services/relatorioService';

export default function GraficoFinanceiro() {
  const [dados, setDados] = useState<any[]>([]);
  const [agrupamento, setAgrupamento] = useState('month');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [agrupamento]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [gastosData, lucrosData] = await Promise.all([
        relatorioService.gerarRelatorio({
          tipo: 'gastos',
          campo: 'ignorado',
          agrupamento: agrupamento
        }),
        relatorioService.gerarRelatorio({
          tipo: 'lucros', 
          campo: 'ignorado',
          agrupamento: agrupamento
        })
      ]);

      const dadosCombinados = combinarDados(gastosData, lucrosData);
      setDados(dadosCombinados);
      
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setCarregando(false);
    }
  };

  const combinarDados = (gastos: any[], lucros: any[]) => {
    const mapa = new Map();

    gastos.forEach(item => {
      mapa.set(item.label, { periodo: item.label, gastos: item.value, lucros: 0 });
    });

    lucros.forEach(item => {
      if (mapa.has(item.label)) {
        mapa.get(item.label).lucros = item.value;
      } else {
        mapa.set(item.label, { periodo: item.label, gastos: 0, lucros: item.value });
      }
    });

    return Array.from(mapa.values()).sort((a, b) => a.periodo.localeCompare(b.periodo));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Análise Financeira - Lucro vs Gastos
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Período</InputLabel>
          <Select 
            value={agrupamento} 
            label="Período" 
            onChange={(e) => setAgrupamento(e.target.value)}
          >
            <MenuItem value="day">Dia</MenuItem>
            <MenuItem value="month">Mês</MenuItem>
            <MenuItem value="year">Ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#ff6b6b" 
              name="Gastos" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="lucros" 
              stroke="#004D40" 
              name="Lucros" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {carregando && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          Carregando dados...
        </Typography>
      )}

      {dados.length > 0 && !carregando && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2">
            Resumo:
          </Typography>
          <Typography variant="body2">
            Total Gastos: R$ {dados.reduce((sum, item) => sum + item.gastos, 0).toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Total Lucros: R$ {dados.reduce((sum, item) => sum + item.lucros, 0).toFixed(2)}
          </Typography>
          <Typography variant="body2" color={dados.reduce((sum, item) => sum + (item.lucros - item.gastos), 0) >= 0 ? 'success.main' : 'error.main'}>
            Saldo: R$ {dados.reduce((sum, item) => sum + (item.lucros - item.gastos), 0).toFixed(2)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}