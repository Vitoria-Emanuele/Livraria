import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Grid, Typography, CircularProgress, Alert
} from '@mui/material';
import { useCep } from '../../hooks/useCep';
import { estoqueService, type ClienteCreate, type UsuarioCreate} from '../../services';

interface ClienteFormCompletoProps {
  onSubmit?: (clienteCriado: any) => void;
  onCancel?: () => void;
}

export default function ClienteFormCompleto({ onSubmit, onCancel }: ClienteFormCompletoProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string>('');
  const { buscarEnderecoPorCep, carregando: carregandoCep } = useCep();
  
  const [dadosCliente, setDadosCliente] = useState<ClienteCreate>({
    nome_cliente: '',
    cpf_cliente: '',
    data_nascimento_cliente: '',
    telefone_cliente: '',
    email_cliente: '',
    logradouro_cliente: '',
    numero_logradouro_cliente: 0,
    bairro_cliente: '',
    cidade_cliente: '',
    estado_cliente: '',
    cep_cliente: '',
    complemento_cliente: ''
  });

  const [dadosUsuario, setDadosUsuario] = useState<UsuarioCreate>({
    email_login: '',
    senha: '',
    role: 'CLIENTE',
    ativo: true,
    id_cliente: 0
  });

  useEffect(() => {
    const preencherEndereco = async () => {
      if (dadosCliente.cep_cliente.length === 9) {
        const endereco = await buscarEnderecoPorCep(dadosCliente.cep_cliente);
        if (endereco) {
          setDadosCliente(prev => ({
            ...prev,
            logradouro_cliente: endereco.logradouro,
            bairro_cliente: endereco.bairro,
            cidade_cliente: endereco.localidade,
            estado_cliente: endereco.uf
          }));
        }
      }
    };

    preencherEndereco();
  }, [dadosCliente.cep_cliente]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEnviando(true);
    setErro('');
  
    try {
      // Função para formatar a data para YYYY-MM-DD
      const formatarData = (dataString: string): string => {
        if (!dataString) return '';
        
        // Se já estiver no formato YYYY-MM-DD, retorna como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
          return dataString;
        }
        
        // Tenta converter de DD/MM/YYYY para YYYY-MM-DD
        if (dataString.includes('/')) {
          const [dia, mes, ano] = dataString.split('/');
          if (dia && mes && ano) {
            return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
          }
        }
        
        // Se não conseguir converter, retorna vazio (vai dar erro de validação)
        return dataString;
      };

      console.log('📅 Data antes da formatação:', dadosCliente.data_nascimento_cliente);
      const dataFormatada = formatarData(dadosCliente.data_nascimento_cliente);
      console.log('📅 Data após formatação:', dataFormatada);

      // 1. Criar cliente
      const clienteCriado = await estoqueService.criarCliente({
        ...dadosCliente,
        data_nascimento_cliente: dataFormatada, // ← DATA FORMATADA
        cpf_cliente: limparFormatacao(dadosCliente.cpf_cliente),
        telefone_cliente: limparFormatacao(dadosCliente.telefone_cliente),
        cep_cliente: limparFormatacao(dadosCliente.cep_cliente)
      });
      
      console.log('  Cliente criado com ID:', clienteCriado.id_cliente);
      
      // 2. Preparar dados do usuário
      const dadosUsuarioParaEnviar = {
        email_login: dadosUsuario.email_login,
        senha: dadosUsuario.senha,
        role: 'CLIENTE',
        ativo: true,
        id_cliente: clienteCriado.id_cliente
      };
      
      console.log('📤 Dados do usuário a enviar:', dadosUsuarioParaEnviar);
      
      // 3. Criar usuário
      const usuarioCriado = await estoqueService.criarUsuario(dadosUsuarioParaEnviar);
      console.log('  Usuário criado:', usuarioCriado);
  
      if (onSubmit) {
        onSubmit({ ...clienteCriado, usuario: usuarioCriado });
      }
  
    } catch (error: any) {
      console.error('  Erro detalhado:', error);
      console.error('  Response data:', error.response?.data);
      
      if (error.response?.data?.detail) {
        const errorDetails = error.response.data.detail;
        if (Array.isArray(errorDetails)) {
          console.error('🔍 Detalhes dos erros de validação:');
          errorDetails.forEach((err: any, index: number) => {
            console.error(`Erro ${index + 1}:`, err);
          });
          
          const errorMessages = errorDetails.map((err: any) => {
            return `Campo: ${err.loc?.join('.') || 'desconhecido'}, Erro: ${err.msg}`;
          });
          setErro(errorMessages.join(' | '));
        } else {
          setErro(typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails));
        }
      } else {
        setErro('Erro ao criar usuário após cliente ser criado');
      }
    } finally {
      setEnviando(false);
    }
  };

  const limparFormatacao = (valor: string): string => {
    return valor.replace(/\D/g, ''); 
  };

  const handleChangeCliente = (field: keyof ClienteCreate) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setDadosCliente(prev => ({
      ...prev,
      [field]: field.includes('numero') ? Number(value) : value
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
    
    setDadosCliente(prev => ({
      ...prev,
      cep_cliente: value
    }));
  };

  // Função para mascarar CPF
  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{1,3})/, '$1.$2');
      }
    }
    
    setDadosCliente(prev => ({
      ...prev,
      cpf_cliente: value
    }));
  };

  // Função para mascarar telefone
  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length === 11) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length === 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    setDadosCliente(prev => ({
      ...prev,
      telefone_cliente: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
            Dados do Cliente
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof erro === 'string' ? erro : 'Erro de validação - verifique o console'}
          </Alert>
        )}

        <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="Nome Completo"
                value={dadosCliente.nome_cliente}
                onChange={handleChangeCliente('nome_cliente')}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="CPF"
                value={dadosCliente.cpf_cliente}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                type="date"
                label="Data de Nascimento"
                value={dadosCliente.data_nascimento_cliente}
                onChange={handleChangeCliente('data_nascimento_cliente')}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Use o formato AAAA-MM-DD"
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="Telefone"
                value={dadosCliente.telefone_cliente}
                onChange={handleTelefoneChange}
                placeholder="(11) 99999-9999"
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                type="email"
                label="Email"
                value={dadosCliente.email_cliente}
                onChange={handleChangeCliente('email_cliente')}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="CEP"
                value={dadosCliente.cep_cliente}
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
                value={dadosCliente.logradouro_cliente}
                onChange={handleChangeCliente('logradouro_cliente')}
                disabled={carregandoCep}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
                required
                fullWidth
                label="Número"
                type="number"
                value={dadosCliente.numero_logradouro_cliente}
                onChange={handleChangeCliente('numero_logradouro_cliente')}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="Bairro"
                value={dadosCliente.bairro_cliente}
                onChange={handleChangeCliente('bairro_cliente')}
                disabled={carregandoCep}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="Cidade"
                value={dadosCliente.cidade_cliente}
                onChange={handleChangeCliente('cidade_cliente')}
                disabled={carregandoCep}
            />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                required
                fullWidth
                label="Estado"
                value={dadosCliente.estado_cliente}
                onChange={handleChangeCliente('estado_cliente')}
                placeholder="SP"
                disabled={carregandoCep}
            />
            </Grid>

            <Grid size={{ xs: 12 }}>
            <TextField
                fullWidth
                label="Complemento"
                value={dadosCliente.complemento_cliente}
                onChange={handleChangeCliente('complemento_cliente')}
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
                {enviando ? <CircularProgress size={20} /> : 'Criar Cliente'}
                </Button>
        </Box>
    </Box>
  );
}