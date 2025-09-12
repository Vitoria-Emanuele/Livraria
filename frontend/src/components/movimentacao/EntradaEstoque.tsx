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
import { estoqueService, type EntradaEstoqueRequest } from '../../services';
import { useAuth } from '../../hooks/useAuth';



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
  // estados para dados do formulario
  const {user} = useAuth();
  const [fornecedor, setFornecedor] = useState<FornecedorData | null>(null);
  const [distribuidor, setDistribuidor] = useState<DistribuidorData | null>(null);
  const [livros, setLivros] = useState<LivroData[]>([]);
  
  const [livroFormKey, setLivroFormKey] = useState(0);
  // estados para controle dos modais
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
  const [modalDistribuidorAberto, setModalDistribuidorAberto] = useState(false);

  const { fornecedores } = useFornecedor();
  const { distribuidores } = useDistribuidor();

  // calcular dados do lote automaticamente com base nos livros
  const calcularDadosLote = () => {
    const quantidade_itens_lote = livros.reduce((total, livro) => {
      return total + (parseInt(livro.quantidade_item_lote));
    }, 0);

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


  const limparFormulario = () => {
    setFornecedor(null);
    setDistribuidor(null);
    setLivros([]);
    
    setLivroFormKey(prev => prev + 1);

    setTimeout(() => {
      const fornecedorSelect = document.querySelector('select[name="fornecedor"]') as HTMLSelectElement;
      const distribuidorSelect = document.querySelector('select[name="distribuidor"]') as HTMLSelectElement;
      
      if (fornecedorSelect) fornecedorSelect.value = '';
      if (distribuidorSelect) distribuidorSelect.value = '';
    }, 100)
  };

  const handleSubmit = async () => {
    if (!fornecedor || !fornecedor.id_fornecedor) {
      alert("Selecione ou cadastre um fornecedor antes de continuar!");
      return;
    }
  
    if (livros.length === 0) {
      alert("Adicione pelo menos um livro ao lote!");
      return;
    }

    console.log('Usuário logado:', user);
  
    if (!user) {
      alert('Usuário não autenticado!');
      return;
    }

  const idFuncionario = user.id_funcionario || user.funcionario_id || user.funcionario?.id || user.id;

  if (!idFuncionario) {
    alert('Não foi possível identificar o funcionário!');
    console.error('Estrutura do usuário:', user);
    return;
  }
  
    try {
      const dadosEntrada: EntradaEstoqueRequest = {
        id_fornecedor: fornecedor.id_fornecedor,
        id_distribuidor: distribuidor?.id_distribuidor || undefined,
        id_funcionario: idFuncionario,
        livros: livros.map(livro => {

          const isbnLimpo = livro.isbn_livro.replace(/[-\s]/g, '');

          return{
            isbn_livro: isbnLimpo,
            titulo_livro: livro.titulo_livro,
            autor_livro: livro.autor_livro,
            genero_literario: livro.genero_literario,
            editora_livro: livro.editora_livro,
            quantidade: parseInt(livro.quantidade_item_lote) || 0,
            valor_unitario: parseFloat(livro.valor_item_lote) || 0
          }
        })
      };
  
      await estoqueService.criarEntradaEstoqueCompleta(dadosEntrada);
  
      alert("Entrada de estoque registrada com sucesso!");
      
      
      // Limpar formulário
      limparFormulario()
      
  
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      alert('Erro ao registrar entrada. Verifique o console.');
    }
  };

  const dadosLote = calcularDadosLote();

  // Interface
  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Entrada de Estoque
      </Typography>

      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Origem dos Livros
        </Typography>
        
        <Grid container spacing={3}>
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
              Cadastrar novo fornecedor
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
              Cadastrar novo distribuidor
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Livros do Lote
        </Typography>
        <LivroForm
        key={livroFormKey}
        onLivrosChange={handleLivrosChange} />
      </Box>

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