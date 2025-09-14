import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { estoqueService, type Distribuidor, type DistribuidorCreate } from '../../services/estoqueService';
import DistribuidorForm from '../forms/DistribuidorForm';

export default function GerenciamentoDistribuidores() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [distribuidorEditando, setDistribuidorEditando] = useState<Distribuidor | null>(null);
  const [formulario, setFormulario] = useState<DistribuidorCreate>({
    cnpj_distribuidor: '',
    nome_fantasia_distribuidor: '',
    razao_social_distribuidor: '',
    email_distribuidor: '',
    telefone_distribuidor: '',
    logradouro_distribuidor: '',
    numero_logradouro_distribuidor: 0,
    bairro_distribuidor: '',
    cidade_distribuidor: '',
    estado_distribuidor: '',
    cep_distribuidor: '',
    complemento_distribuidor: ''
  });

  useEffect(() => {
    carregarDistribuidores();
  }, []);

  const carregarDistribuidores = async () => {
    try {
      const data = await estoqueService.listarDistribuidor();
      setDistribuidores(data);
    } catch (error) {
      console.error('Erro ao carregar distribuidores:', error);
    }
  };

  const handleCriarDistribuidor = async (dadosDistribuidor: any) => {
    try {
      await estoqueService.criarDistribuidor(dadosDistribuidor);
      setDialogAberto(false);
      carregarDistribuidores();
    } catch (error) {
      console.error('Erro ao criar distribuidor:', error);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      if (distribuidorEditando) {
        await estoqueService.atualizarDistribuidor(distribuidorEditando.id_distribuidor, formulario);
        setDialogAberto(false);
        carregarDistribuidores();
        limparFormulario();
      }
    } catch (error) {
      console.error('Erro ao salvar distribuidor:', error);
    }
  };

  const limparFormulario = () => {
    setFormulario({
      cnpj_distribuidor: '',
      nome_fantasia_distribuidor: '',
      razao_social_distribuidor: '',
      email_distribuidor: '',
      telefone_distribuidor: '',
      logradouro_distribuidor: '',
      numero_logradouro_distribuidor: 0,
      bairro_distribuidor: '',
      cidade_distribuidor: '',
      estado_distribuidor: '',
      cep_distribuidor: '',
      complemento_distribuidor: ''
    });
    setDistribuidorEditando(null);
    setModoCriacao(false);
  };

  const abrirDialogCriacao = () => {
    setModoCriacao(true);
    setDistribuidorEditando(null);
    setDialogAberto(true);
  };

  const abrirDialogEdicao = (distribuidor: Distribuidor) => {
    setModoCriacao(false);
    setDistribuidorEditando(distribuidor);
    setFormulario({ ...distribuidor });
    setDialogAberto(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Gerenciamento de Distribuidores</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={abrirDialogCriacao}
        >
          Novo Distribuidor
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CNPJ</TableCell>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distribuidores.map((distribuidor) => (
              <TableRow key={distribuidor.id_distribuidor}>
                <TableCell>{distribuidor.cnpj_distribuidor}</TableCell>
                <TableCell>{distribuidor.nome_fantasia_distribuidor}</TableCell>
                <TableCell>{distribuidor.razao_social_distribuidor}</TableCell>
                <TableCell>{distribuidor.email_distribuidor}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => abrirDialogEdicao(distribuidor)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (window.confirm('Tem certeza que deseja excluir este distribuidor?')) {
                        try {
                          await estoqueService.removerDistribuidor(distribuidor.id_distribuidor);
                          carregarDistribuidores();
                        } catch (error) {
                          console.error('Erro ao excluir distribuidor:', error);
                        }
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {modoCriacao ? 'Novo Distribuidor' : 'Editar Distribuidor'}
        </DialogTitle>
        <DialogContent>
          {modoCriacao ? (
            <DistribuidorForm
              onSubmit={handleCriarDistribuidor}
              onCancel={() => setDialogAberto(false)}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="CNPJ"
                value={formulario.cnpj_distribuidor}
                onChange={(e) => setFormulario({ ...formulario, cnpj_distribuidor: e.target.value })}
              />
              <TextField
                label="Nome Fantasia"
                value={formulario.nome_fantasia_distribuidor}
                onChange={(e) => setFormulario({ ...formulario, nome_fantasia_distribuidor: e.target.value })}
              />
              <TextField
                label="Razão Social"
                value={formulario.razao_social_distribuidor}
                onChange={(e) => setFormulario({ ...formulario, razao_social_distribuidor: e.target.value })}
              />
              <TextField
                label="Email"
                value={formulario.email_distribuidor}
                onChange={(e) => setFormulario({ ...formulario, email_distribuidor: e.target.value })}
              />
              <TextField
                label="Telefone"
                value={formulario.telefone_distribuidor}
                onChange={(e) => setFormulario({ ...formulario, telefone_distribuidor: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        {!modoCriacao && (
          <DialogActions>
            <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
            <Button onClick={handleSalvarEdicao} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Paper>
  );
}