import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography,
  Grid, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { relatorioService } from '../../services/relatorioService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function GraficoEntradas() {
  const [dados, setDados] = useState<any[]>([]);
  const [campo, setCampo] = useState('fornecedor');
  const [agrupamento, setAgrupamento] = useState('month');
  const [tipoGrafico, setTipoGrafico] = useState('barra');
  
  const [dataInicial, setDataInicial] = useState<dayjs.Dayjs | null>(null);
  const [dataFinal, setDataFinal] = useState<dayjs.Dayjs | null>(null);

  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [campo, agrupamento]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const data = await relatorioService.gerarRelatorio({
        tipo: 'entradas',
        campo: campo,
        agrupamento: agrupamento,
        data_inicial: dataInicial ? dataInicial?.format('YYYY-MM-DD') : undefined,
        data_final: dataFinal ? dataFinal?.format('YYYY-MM-DD') : undefined
      });
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltrar = () => {
    carregarDados();
  };

  const handleLimparFiltros = () => {
    setDataInicial(null);
    setDataFinal(null);
    carregarDados();
  };

  const renderizarGrafico = () => {
    if (dados.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="h6" color="textSecondary">
            Nenhum dado encontrado para os filtros selecionados
          </Typography>
        </Box>
      );
    }

    const commonProps = {
      data: dados,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (tipoGrafico) {
      case 'barra':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" name="Quantidade de Entradas" />
          </BarChart>
        );
      
      case 'linha':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#FF8042" name="Entradas" />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" fill="#00C49F" stroke="#00C49F" name="Entradas" />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" name="Quantidade de Entradas" />
          </BarChart>
        );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Relatório de Entradas no Estoque
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Agrupar por</InputLabel>
            <Select value={campo} label="Agrupar por" onChange={(e) => setCampo(e.target.value)}>
              <MenuItem value="fornecedor">Fornecedor</MenuItem>
              <MenuItem value="funcionario">Funcionário</MenuItem>
              <MenuItem value="livro">Livro</MenuItem>
              <MenuItem value="genero">Gênero</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Período</InputLabel>
            <Select value={agrupamento} label="Período" onChange={(e) => setAgrupamento(e.target.value)}>
              <MenuItem value="day">Dia</MenuItem>
              <MenuItem value="month">Mês</MenuItem>
              <MenuItem value="year">Ano</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Gráfico</InputLabel>
            <Select value={tipoGrafico} label="Tipo de Gráfico" onChange={(e) => setTipoGrafico(e.target.value)}>
              <MenuItem value="barra">Barras</MenuItem>
              <MenuItem value="linha">Linha</MenuItem>
              <MenuItem value="area">Área</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" gutterBottom>
        Filtrar por Data
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label="Data Inicial"
              value={dataInicial}
              onChange={(newValue) => setDataInicial(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label="Data Final"
              value={dataFinal}
              onChange={(newValue) => setDataFinal(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="contained"
              onClick={handleFiltrar}
              disabled={carregando}
              fullWidth
              sx={{ height: '56px' }}
            >
              Filtrar
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLimparFiltros}
              disabled={carregando}
              fullWidth
              sx={{ height: '56px' }}
            >
              Limpar
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="80%" height="100%">
          {renderizarGrafico()}
        </ResponsiveContainer>
      </Box>

      {carregando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography>Carregando...</Typography>
        </Box>
      )}
    </Paper>
  );
}