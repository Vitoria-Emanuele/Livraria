import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Switch,
  FormControlLabel, Alert, Button, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { Block, CheckCircle, Add } from '@mui/icons-material';
import { estoqueService, type Usuario } from '../../services/estoqueService';
import FuncionarioFormCompleto from '../forms/FuncionarioForm';

interface FuncionarioComUsuario {
  id_funcionario: number;
  nome_funcionario: string;
  cpf_funcionario: string;
  ctps_funcionario: string;
  cargo: string;
  setor: string;
  usuario?: Usuario;
}

export default function GerenciamentoFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<FuncionarioComUsuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [criandoFuncionario, setCriandoFuncionario] = useState(false);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setCarregando(true);
    try {
      const [funcionariosData, usuariosData] = await Promise.all([
        estoqueService.listarFuncionario(),
        estoqueService.listarUsuarios()
      ]);

      const funcionariosComUsuario = funcionariosData.map(funcionario => ({
        ...funcionario,
        usuario: usuariosData.find(u => u.id_funcionario === funcionario.id_funcionario)
      }));

      setFuncionarios(funcionariosComUsuario);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleToggleStatus = async (funcionario: FuncionarioComUsuario) => {
    if (!funcionario.usuario) return;

    try {
      const novoStatus = !funcionario.usuario.ativo;
      await estoqueService.atualizarUsuario(funcionario.usuario.id_usuario, {
        ativo: novoStatus
      });
      carregarFuncionarios(); 
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleFuncionarioCriado = () => {
    setCriandoFuncionario(false);
    carregarFuncionarios();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gerenciamento de Funcionários
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCriandoFuncionario(true)}
        >
          Novo Funcionário
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Setor</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios.map((funcionario) => (
              <TableRow key={funcionario.id_funcionario}>
                <TableCell>{funcionario.nome_funcionario}</TableCell>
                <TableCell>{funcionario.cpf_funcionario}</TableCell>
                <TableCell>{funcionario.cargo}</TableCell>
                <TableCell>{funcionario.setor}</TableCell>
                <TableCell>
                  {funcionario.usuario ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={funcionario.usuario.ativo}
                          onChange={() => handleToggleStatus(funcionario)}
                          color="success"
                        />
                      }
                      label={funcionario.usuario.ativo ? 'Ativo' : 'Inativo'}
                    />
                  ) : (
                    <Typography variant="body2" color="error">
                      Sem usuário
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {carregando && <Typography>Carregando...</Typography>}

      <Dialog 
        open={criandoFuncionario} 
        onClose={() => setCriandoFuncionario(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Novo Funcionário</DialogTitle>
        <DialogContent>
          <FuncionarioFormCompleto
            onSubmit={handleFuncionarioCriado}
            onCancel={() => setCriandoFuncionario(false)}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}