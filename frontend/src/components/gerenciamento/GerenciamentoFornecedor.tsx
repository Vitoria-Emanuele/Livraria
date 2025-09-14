import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { estoqueService, type Fornecedor, type FornecedorCreate } from '../../services/estoqueService';
import FornecedorForm from '../forms/FornecedorForm';

export default function GerenciamentoFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [formulario, setFormulario] = useState<FornecedorCreate>({
    cnpj_fornecedor: '',
    nome_fantasia_fornecedor: '',
    razao_social_fornecedor: '',
    email_fornecedor: '',
    telefone_fornecedor: '',
    logradouro_fornecedor: '',
    numero_logradouro_fornecedor: 0,
    bairro_fornecedor: '',
    cidade_fornecedor: '',
    estado_fornecedor: '',
    cep_fornecedor: '',
    complemento_fornecedor: ''
  });

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const data = await estoqueService.listarFornecedor();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const handleCriarFornecedor = async (dadosFornecedor: any) => {
    try {
      await estoqueService.criarFornecedor(dadosFornecedor);
      setDialogAberto(false);
      carregarFornecedores();
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      if (fornecedorEditando) {
        await estoqueService.atualizarFornecedor(fornecedorEditando.id_fornecedor, formulario);
        setDialogAberto(false);
        carregarFornecedores();
        limparFormulario();
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    }
  };

  const limparFormulario = () => {
    setFormulario({
      cnpj_fornecedor: '',
      nome_fantasia_fornecedor: '',
      razao_social_fornecedor: '',
      email_fornecedor: '',
      telefone_fornecedor: '',
      logradouro_fornecedor: '',
      numero_logradouro_fornecedor: 0,
      bairro_fornecedor: '',
      cidade_fornecedor: '',
      estado_fornecedor: '',
      cep_fornecedor: '',
      complemento_fornecedor: ''
    });
    setFornecedorEditando(null);
    setModoCriacao(false);
  };

  const abrirDialogCriacao = () => {
    setModoCriacao(true);
    setFornecedorEditando(null);
    setDialogAberto(true);
  };

  const abrirDialogEdicao = (fornecedor: Fornecedor) => {
    setModoCriacao(false);
    setFornecedorEditando(fornecedor);
    setFormulario({ ...fornecedor });
    setDialogAberto(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Gerenciamento de Fornecedores</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={abrirDialogCriacao}
        >
          Novo Fornecedor
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
            {fornecedores.map((fornecedor) => (
              <TableRow key={fornecedor.id_fornecedor}>
                <TableCell>{fornecedor.cnpj_fornecedor}</TableCell>
                <TableCell>{fornecedor.nome_fantasia_fornecedor}</TableCell>
                <TableCell>{fornecedor.razao_social_fornecedor}</TableCell>
                <TableCell>{fornecedor.email_fornecedor}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => abrirDialogEdicao(fornecedor)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
                        try {
                          await estoqueService.removerFornecedor(fornecedor.id_fornecedor);
                          carregarFornecedores();
                        } catch (error) {
                          console.error('Erro ao excluir fornecedor:', error);
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
          {modoCriacao ? 'Novo Fornecedor' : 'Editar Fornecedor'}
        </DialogTitle>
        <DialogContent>
          {modoCriacao ? (
            <FornecedorForm
              onSubmit={handleCriarFornecedor}
              onCancel={() => setDialogAberto(false)}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="CNPJ"
                value={formulario.cnpj_fornecedor}
                disabled={true}
                onChange={(e) => setFormulario({ ...formulario, cnpj_fornecedor: e.target.value })}
              />
              <TextField
                label="Nome Fantasia"
                value={formulario.nome_fantasia_fornecedor}
                onChange={(e) => setFormulario({ ...formulario, nome_fantasia_fornecedor: e.target.value })}
              />
              <TextField
                label="Razão Social"
                value={formulario.razao_social_fornecedor}
                onChange={(e) => setFormulario({ ...formulario, razao_social_fornecedor: e.target.value })}
              />
              <TextField
                label="Email"
                value={formulario.email_fornecedor}
                onChange={(e) => setFormulario({ ...formulario, email_fornecedor: e.target.value })}
              />
              <TextField
                label="Telefone"
                value={formulario.telefone_fornecedor}
                onChange={(e) => setFormulario({ ...formulario, telefone_fornecedor: e.target.value })}
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