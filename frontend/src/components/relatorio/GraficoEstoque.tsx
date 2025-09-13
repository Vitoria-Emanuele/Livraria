import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from '@mui/material';
import { relatorioService } from '../../services/relatorioService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function GraficoEstoque() {
  const [dados, setDados] = useState<any[]>([]);
  const [campo, setCampo] = useState('genero');
  const [tipoGrafico, setTipoGrafico] = useState('barra');

  useEffect(() => {
    carregarDados();
  }, [campo]);

  const carregarDados = async () => {
    try {
      const data = await relatorioService.gerarRelatorio({
        tipo: 'estoque',
        campo: campo,
        agrupamento: 'none'
      });
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Relatório de Estoque
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Agrupar por</InputLabel>
          <Select value={campo} label="Agrupar por" onChange={(e) => setCampo(e.target.value)}>
            <MenuItem value="genero">Gênero</MenuItem>
            <MenuItem value="editora">Editora</MenuItem>
            <MenuItem value="livro">Livro</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Tipo de Gráfico</InputLabel>
          <Select value={tipoGrafico} label="Tipo de Gráfico" onChange={(e) => setTipoGrafico(e.target.value)}>
            <MenuItem value="barra">Barras</MenuItem>
            <MenuItem value="pizza">Pizza</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="70%" height="100%">
          {tipoGrafico === 'barra' ? (
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Quantidade em Estoque" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="label"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}