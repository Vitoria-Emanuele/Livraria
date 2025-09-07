import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useFornecedor } from '../../hooks/useFornecedor';
import { useDistribuidor } from '../../hooks/useDistribuidor';
import ModalForm from '../ui/ModalForm';
import FornecedorForm from './FornecedorForm';
import DistribuidorForm from './DistribuidorForm';
import type { LivroData } from './LivroForm';
import LivroForm from './LivroForm';

interface FornecedorData {
  id_fornecedor?: number;
  cnpj_fornecedor: string;
  razao_social_fornecedor: string;
  nome_fantasia_fornecedor: string;
}

interface DistribuidorData {
  id_distribuidor?: number;
  cnpj_distribuidor: string;
  razao_social_distribuidor: string;
  nome_fantasia_distribuidor: string;
}

export default function EntradaEstoque() {
  // Estados para dados do formulario
  const [fornecedor, setFornecedor] = useState<FornecedorData | null>(null);
  const [distribuidor, setDistribuidor] = useState<DistribuidorData | null>(null);
  const [livros, setLivros] = useState<LivroData[]>([]);
  
  // Estados para controle dos modais
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
  const [modalDistribuidorAberto, setModalDistribuidorAberto] = useState(false);

  const { fornecedores } = useFornecedor();
  const { distribuidores } = useDistribuidor();

  // Calcular dados do lote automaticamente com base nos livros
  const calcularDadosLote = () => {
    const quantidade_itens_lote = livros.length;

    const valor_lote = livros.reduce((total, livro) => {
      const quantidade = parseInt(livro.quantidade_item_lote) || 0;
      const valorUnitario = parseFloat(livro.valor_item_lote) || 0;
      return total + (quantidade * valorUnitario);
    }, 0);

    return {
      quantidade_itens_lote: quantidade_itens_lote,
      valor_lote: valor_lote
    };
  };

  const handleFornecedorSalvo = (dadosFornecedor: FornecedorData) => {
    setFornecedor(dadosFornecedor);
    setModalFornecedorAberto(false);
  };

  const handleDistribuidorSalvo = (dadosDistribuidor: DistribuidorData) => {
    setDistribuidor(dadosDistribuidor);
    setModalDistribuidorAberto(false);
  };

  const handleLivrosChange = (novosLivros: LivroData[]) => {
    setLivros(novosLivros);
  };

  const handleSubmit = async () => {
    // Validacoes basicas
    if (!fornecedor) {
      alert("Selecione ou cadastre um fornecedor antes de continuar!");
      return;
    }

    if (livros.length === 0) {
      alert("Adicione pelo menos um livro ao lote!");
      return;
    }

    try {
      // Calcular dados do lote automaticamente
      const dadosLote = calcularDadosLote();
      
      // Montar objeto completo para envio
      const dadosEntrada = {
        fornecedor: fornecedor,
        distribuidor: distribuidor,
        lote: dadosLote,
        livros: livros
      };

      console.log('Dados para envio:', dadosEntrada);
      
      // Aqui você faria a chamada para o servico que envia os dados
      // await estoqueService.criarEntradaEstoque(dadosEntrada);
      
      alert("Entrada de estoque registrada com sucesso!");
      // Limpar formulario apos sucesso
      setFornecedor(null);
      setDistribuidor(null);
      setLivros([]);
      
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      alert('Erro ao registrar entrada. Verifique o console.');
    }
  };

  const dadosLote = calcularDadosLote();

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Entrada de Estoque
      </Typography>

      {/* Secao de Fornecedor e Distribuidor */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Origem dos Livros
        </Typography>
        
        <Grid container spacing={3}>
          {/* Fornecedor (Obrigatorio) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Fornecedor *
            </Typography>
            
            {fornecedores.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <select 
                  value={fornecedor?.id_fornecedor || ''} 
                  onChange={(e) => { 
                    if (e.target.value) {
                      const selectedFornecedor = fornecedores.find(f => 
                        f.id_fornecedor === Number(e.target.value)
                      );
                      if (selectedFornecedor) {
                        setFornecedor(selectedFornecedor as FornecedorData);
                      }
                    } else {
                      setFornecedor(null);
                    }
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor}>
                      {fornecedor.razao_social_fornecedor}
                    </option>
                  ))}
                </select>
              </Box>
            )}
            
            <Button 
              variant="outlined"
              onClick={() => setModalFornecedorAberto(true)}
              fullWidth
            >
              Cadastrar Novo Fornecedor
            </Button>
            
            {fornecedor && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Selecionado:</strong> {fornecedor.razao_social_fornecedor}
                </Typography>
                <Typography variant="body2">
                  <strong>CNPJ:</strong> {fornecedor.cnpj_fornecedor}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Distribuidor (Opcional) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Distribuidor (Opcional)
            </Typography>
            
            {distribuidores.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <select 
                  value={distribuidor?.id_distribuidor || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const selectedDistribuidor = distribuidores.find(d => 
                        d.id_distribuidor === Number(e.target.value)
                      );
                      if (selectedDistribuidor) {
                        setDistribuidor(selectedDistribuidor as DistribuidorData);
                      }
                    } else {
                      setDistribuidor(null);
                    }
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
                >
                  <option value="">Selecione um distribuidor</option>
                  {distribuidores.map(distribuidor => (
                    <option key={distribuidor.id_distribuidor} value={distribuidor.id_distribuidor}>
                      {distribuidor.razao_social_distribuidor}
                    </option>
                  ))}
                </select>
              </Box>
            )}
            
            <Button 
              variant="outlined"
              onClick={() => setModalDistribuidorAberto(true)}
              fullWidth
            >
              Cadastrar Novo Distribuidor
            </Button>
            
            {distribuidor && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Selecionado:</strong> {distribuidor.razao_social_distribuidor}
                </Typography>
                <Typography variant="body2">
                  <strong>CNPJ:</strong> {distribuidor.cnpj_distribuidor}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Formulario de Livros */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Livros do Lote
        </Typography>
        <LivroForm onLivrosChange={handleLivrosChange} />
      </Box>

      {/* Resumo do Lote (calculado automaticamente) */}
      {livros.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumo do Lote
          </Typography>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Quantidade total de itens:</strong> {dadosLote.quantidade_itens_lote}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Valor total do lote:</strong> R$ {dadosLote.valor_lote.toFixed(2)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="textSecondary">
                  * Valores calculados automaticamente com base nos livros adicionados
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {/* Botao de Submissao */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSubmit}
          disabled={!fornecedor || livros.length === 0}
        >
          Registrar Entrada de Estoque
        </Button>
      </Box>

      {/* Modais para cadastro */}
      <ModalForm
        open={modalFornecedorAberto}
        onClose={() => setModalFornecedorAberto(false)}
        title="Cadastrar Fornecedor"
        maxWidth="md"
      >
        <FornecedorForm
          onSubmit={handleFornecedorSalvo}
          onCancel={() => setModalFornecedorAberto(false)}
        />
      </ModalForm>

      <ModalForm
        open={modalDistribuidorAberto}
        onClose={() => setModalDistribuidorAberto(false)}
        title="Cadastrar Distribuidor"
        maxWidth="md"
      >
        <DistribuidorForm
          onSubmit={handleDistribuidorSalvo}
          onCancel={() => setModalDistribuidorAberto(false)}
        />
      </ModalForm>
    </Box>
  );
}