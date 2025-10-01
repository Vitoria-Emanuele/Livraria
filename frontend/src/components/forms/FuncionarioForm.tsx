import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Grid, Typography, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { estoqueService, type FuncionarioCreate, type UsuarioCreate } from '../../services/estoqueService';
import { useCep } from '../../hooks/useCep';

interface FuncionarioFormCompletoProps {
  onSubmit?: (funcionarioCriado: any) => void;
  onCancel?: () => void;
}

export default function FuncionarioFormCompleto({ onSubmit, onCancel }: FuncionarioFormCompletoProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string>('');
  const { buscarEnderecoPorCep, carregando: carregandoCep } = useCep();
  
  const [dadosFuncionario, setDadosFuncionario] = useState<FuncionarioCreate>({
    nome_funcionario: '',
    ctps_funcionario: '',
    cpf_funcionario: '',
    setor: '',
    cargo: '',
    salario: 0,
    telefone_funcionario: '',
    email_funcionario: '',
    logradouro_funcionario: '',
    numero_logradouro_funcionario: 0,
    bairro_funcionario: '',
    cidade_funcionario: '',
    estado_funcionario: '',
    cep_funcionario: '',
    complemento_funcionario: ''
  });

  const [dadosUsuario, setDadosUsuario] = useState<UsuarioCreate>({
    email_login: '',
    senha: '',
    role: 'user',
    ativo: true,
    id_funcionario: 0
  });

  useEffect(() => {
    const preencherEndereco = async () => {
      if (dadosFuncionario.cep_funcionario.length === 9) {
        const endereco = await buscarEnderecoPorCep(dadosFuncionario.cep_funcionario);
        if (endereco) {
          setDadosFuncionario(prev => ({
            ...prev,
            logradouro_funcionario: endereco.logradouro,
            bairro_funcionario: endereco.bairro,
            cidade_funcionario: endereco.localidade,
            estado_funcionario: endereco.uf
          }));
        }
      }
    };

    preencherEndereco();
  }, [dadosFuncionario.cep_funcionario]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEnviando(true);
    setErro('');

    try {
      const funcionarioCriado = await estoqueService.criarFuncionario({
        ...dadosFuncionario,
        cpf_funcionario: limparFormatacao(dadosFuncionario.cpf_funcionario),
        telefone_funcionario: limparFormatacao(dadosFuncionario.telefone_funcionario),
        cep_funcionario: limparFormatacao(dadosFuncionario.cep_funcionario)
      });
      
      const usuarioCriado = await estoqueService.criarUsuario({
        ...dadosUsuario,
        id_funcionario: funcionarioCriado.id_funcionario,
        ativo: true
      });

      if (onSubmit) {
        onSubmit({ ...funcionarioCriado, usuario: usuarioCriado });
      }

    } catch (error: any) {
      console.error('Erro ao criar funcionário:', error);
      setErro(error.response?.data?.detail || 'Erro ao criar funcionário');
    } finally {
      setEnviando(false);
    }
  };

  const limparFormatacao = (valor: string): string => {
    return valor.replace(/\D/g, ''); 
  };

  const handleChangeFuncionario = (field: keyof FuncionarioCreate) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setDadosFuncionario(prev => ({
      ...prev,
      [field]: field.includes('salario') || field.includes('numero') ? Number(value) : value
    }));
  };

  const handleChangeUsuario = (field: keyof UsuarioCreate) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDadosUsuario(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    setDadosFuncionario(prev => ({
      ...prev,
      cep_funcionario: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dados do Funcionário
      </Typography>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Nome Completo"
            value={dadosFuncionario.nome_funcionario}
            onChange={handleChangeFuncionario('nome_funcionario')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="CPF"
            value={dadosFuncionario.cpf_funcionario}
            onChange={handleChangeFuncionario('cpf_funcionario')}
            placeholder="000.000.000-00"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="CTPS"
            value={dadosFuncionario.ctps_funcionario}
            onChange={handleChangeFuncionario('ctps_funcionario')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Cargo"
            value={dadosFuncionario.cargo}
            onChange={handleChangeFuncionario('cargo')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Setor"
            value={dadosFuncionario.setor}
            onChange={handleChangeFuncionario('setor')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Salário"
            value={dadosFuncionario.salario}
            onChange={handleChangeFuncionario('salario')}
            inputProps={{ step: 0.01, min: 0 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Telefone"
            value={dadosFuncionario.telefone_funcionario}
            onChange={handleChangeFuncionario('telefone_funcionario')}
            placeholder="(11) 99999-9999"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email"
            value={dadosFuncionario.email_funcionario}
            onChange={handleChangeFuncionario('email_funcionario')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="CEP"
            value={dadosFuncionario.cep_funcionario}
            onChange={handleCepChange}
            placeholder="00000-000"
            disabled={carregandoCep}
            helperText={carregandoCep ? "Buscando endereço..." : "Digite o CEP para preencher automaticamente"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            required
            fullWidth
            label="Logradouro"
            value={dadosFuncionario.logradouro_funcionario}
            onChange={handleChangeFuncionario('logradouro_funcionario')}
            disabled={carregandoCep}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Número"
            type="number"
            value={dadosFuncionario.numero_logradouro_funcionario}
            onChange={handleChangeFuncionario('numero_logradouro_funcionario')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Bairro"
            value={dadosFuncionario.bairro_funcionario}
            onChange={handleChangeFuncionario('bairro_funcionario')}
            disabled={carregandoCep}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Cidade"
            value={dadosFuncionario.cidade_funcionario}
            onChange={handleChangeFuncionario('cidade_funcionario')}
            disabled={carregandoCep}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Estado"
            value={dadosFuncionario.estado_funcionario}
            onChange={handleChangeFuncionario('estado_funcionario')}
            placeholder="SP"
            disabled={carregandoCep}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Complemento"
            value={dadosFuncionario.complemento_funcionario}
            onChange={handleChangeFuncionario('complemento_funcionario')}
            placeholder="Apartamento, bloco, etc."
          />
        </Grid>

        <Typography variant="h6" sx={{ mt: 3, mb: 2, width: '100%' }}>
          Dados de Acesso (Usuário)
        </Typography>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email de Login"
            value={dadosUsuario.email_login}
            onChange={handleChangeUsuario('email_login')}
            helperText="Será usado para fazer login no sistema"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="password"
            label="Senha"
            value={dadosUsuario.senha}
            onChange={handleChangeUsuario('senha')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Permissão</InputLabel>
            <Select
              value={dadosUsuario.role}
              label="Permissão"
              onChange={(e) => setDadosUsuario(prev => ({ ...prev, role: e.target.value }))}
            >
              <MenuItem value="FUNCIONARIO">Usuário</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit" disabled={enviando}>
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          disabled={enviando}
        >
          {enviando ? <CircularProgress size={20} /> : 'Criar Funcionário'}
        </Button>
      </Box>
    </Box>
  );
}