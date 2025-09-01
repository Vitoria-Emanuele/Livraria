import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ModalForm from '../ui/ModalForm';
import CustomStepper from '../ui/CusstomStepper';
import FornecedorForm from './FornecedorForm';
import DistribuidorForm from './DistribuidorForm';
import LoteForm from './LoteForm';
import type { LivroData } from './LivroForm';
import LivroForm from './LivroForm';
import { useEffect, useState } from 'react';
import { useFornecedor } from '../../hooks/useFornecedor';
import { useDistribuidor } from '../../hooks/useDistribuidor';

interface FornecedorData {
  id_fornecedor?: string;
  cnpj_fornecedor: string;
  razao_social_fornecedor: string;
  nome_fantasia_fornecedor: string;
  email_fornecedor: string;
  telefone_fornecedor: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

interface DistribuidorData {
  id_distribuidor?: string;
  cnpj_distribuidor: string;
  razao_social_distribuidor: string;
  nome_fantasia_distribuidor: string;
  email_distribuidor: string;
  telefone_distribuidor: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

interface LoteData {
  valor_lote: string;
  quantidade_itens_lote: string;
}



export default function EntradaEstoque() {
  // Estados para controle do stepper
  const [activeStep, setActiveStep] = useState(0);
  
  // Estados para dados do formulário
  const [fornecedor, setFornecedor] = useState<FornecedorData | null>(null);
  const [distribuidor, setDistribuidor] = useState<DistribuidorData | null>(null);
  const [lote, setLote] = useState<LoteData | null>(null);
  const [livros, setLivros] = useState<LivroData[]>([]);
  
  // Estados para controle dos modais
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
  const [modalDistribuidorAberto, setModalDistribuidorAberto] = useState(false);

  const { distribuidores } = useDistribuidor();

  // Definição das etapas do stepper
  const steps = [
    { label: 'Fornecedor'},
    { label: 'Distribuidor' },
    { label: 'Lote' },
    { label: 'Livros',},
    { label: 'Confirmação' }
  ];

  // Funções de navegação
  const avancarEtapa = () => {

    if(activeStep == 0 && !fornecedor){
      alert("Selecione ou cadastre um Fornecedor antes de avançar!")
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const voltarEtapa = () => {
    setActiveStep((prev) => prev - 1);
  };

  const reiniciar = () => {
    setActiveStep(0);
    setFornecedor(null);
    setDistribuidor(null);
    setLote(null);
    setLivros([]);
  };

  // Handlers para os formulários
  const handleFornecedorSalvo = (dadosFornecedor: FornecedorData) => {
    setFornecedor(dadosFornecedor);
    setModalFornecedorAberto(false);
    avancarEtapa();
  };

  const handleDistribuidorSalvo = (dadosDistribuidor: DistribuidorData) => {
    setDistribuidor(dadosDistribuidor);
    setModalDistribuidorAberto(false);
    avancarEtapa();
  };

  const handleLoteSalvo = (dadosLote: LoteData) => {
    setLote(dadosLote);
    avancarEtapa();
  };

  const handleLivrosSalvos = (dadosLivros: LivroData[]) => {
    setLivros(dadosLivros);
    avancarEtapa();
  };

  const { fornecedores, carregando: carregandoFornecedor } = useFornecedor();
  
  useEffect(() => {
    console.log('Fornecedor atual:', fornecedor);
    console.log('Botão próximo deve estar habilitado?', !(activeStep === 0 && !fornecedor));
  }, [fornecedor, activeStep]);

  // Conteúdo de cada etapa
  const renderizarConteudoEtapa = () => {
    switch (activeStep) {
      case 0: // Fornecedor
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              {fornecedor ? 'Fornecedor selecionado:' : 'Selecione ou cadastre um fornecedor'}
            </Typography>
            {fornecedor && (
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                <Typography><strong>CNPJ:</strong> {fornecedor.cnpj_fornecedor}</Typography>
                <Typography><strong>Razão Social:</strong> {fornecedor.razao_social_fornecedor}</Typography>
                <Typography><strong>Nome Fantasia:</strong> {fornecedor.nome_fantasia_fornecedor}</Typography>
              </Box>
            )}
            {fornecedores.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <select 
                  value={fornecedor?.id_fornecedor || ''} 
                  onChange={(e) => { 
                    if (e.target.value) {
                      const selectedFornecedor = fornecedores.find(f => 
                        f.id_fornecedor?.toString() === e.target.value
                      );
                      
                      if (selectedFornecedor) {
                        console.log('Fornecedor selecionado:', selectedFornecedor);
                        // Converte para o formato correto
                        setFornecedor({
                          id_fornecedor: selectedFornecedor.id_fornecedor,
                          cnpj_fornecedor: selectedFornecedor.cnpj_fornecedor,
                          razao_social_fornecedor: selectedFornecedor.razao_social_fornecedor,
                          nome_fantasia_fornecedor: selectedFornecedor.nome_fantasia_fornecedor,
                          email_fornecedor: selectedFornecedor.email_fornecedor || '',
                          telefone_fornecedor: selectedFornecedor.telefone_fornecedor || '',
                          logradouro: selectedFornecedor.logradouro_fornecedor || '',
                          numero: selectedFornecedor.numero_logradouro_fornecedor || '',
                          bairro: selectedFornecedor.bairro_fornecedor || '',
                          cidade: selectedFornecedor.cidade_fornecedor || '',
                          estado: selectedFornecedor.estado_fornecedor || '',
                          cep: selectedFornecedor.cep_fornecedor || '',
                          complemento: selectedFornecedor.complemento_fornecedor || ''
                        } as any);
                      }
                    } else {
                      setFornecedor(null);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
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
              variant="contained"
              onClick={() => setModalFornecedorAberto(true)}
            >
              Novo Fornecedor
            </Button>
            
          </Box>
        );

      case 1: // Distribuidor
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              {distribuidor ? 'Distribuidor selecionado:' : 'Selecione ou cadastre um distribuidor'}
            </Typography>
            {distribuidor && (
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                <Typography><strong>CNPJ:</strong> {distribuidor.cnpj_distribuidor}</Typography>
                <Typography><strong>Razão Social:</strong> {distribuidor.razao_social_distribuidor}</Typography>
                <Typography><strong>Nome Fantasia:</strong> {distribuidor.nome_fantasia_distribuidor}</Typography>
              </Box>
            
            )}

            {distribuidores.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selecione um distribuidor existente:
                </Typography>
                <select 
                  value={distribuidor?.id_distribuidor || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const selectedDistribuidor = distribuidores.find(d => 
                        d.id_distribuidor?.toString() === e.target.value
                      );
                      if (selectedDistribuidor) {
                        setDistribuidor(selectedDistribuidor as any);
                      }
                    } else {
                      setDistribuidor(null);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant={distribuidor ? "outlined" : "contained"}
                onClick={() => setModalDistribuidorAberto(true)}
              >
                {distribuidor ? 'Alterar Distribuidor' : 'Cadastrar Distribuidor'}
              </Button>
              <Button onClick={avancarEtapa} color="inherit">
                Pular Etapa
              </Button>
            </Box>
          </Box>
        );

      case 2: // Lote
        return (
          <LoteForm 
            onNext={handleLoteSalvo}
            onBack={voltarEtapa}
          />
        );

      case 3: // Livros
        return (
          <LivroForm 
            onNext={handleLivrosSalvos}
            onBack={voltarEtapa}
            quantidade_itens_lote={lote ? parseInt(lote.quantidade_itens_lote) : 0}
          />
        );

      case 4: // Confirmação
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmação de Entrada
            </Typography>
            <Typography variant="body1">
              Revise os dados abaixo antes de confirmar a entrada do lote.
            </Typography>
            
            {/* Aqui viriam os dados de resumo */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">Resumo da entrada:</Typography>
              <Typography>Fornecedor: {fornecedor?.razao_social_fornecedor}</Typography>
              <Typography>Distribuidor: {distribuidor?.razao_social_distribuidor || 'Não informado'}</Typography>
              <Typography>Valor do lote: R$ {lote?.valor_lote}</Typography>
              <Typography>Quantidade de livros: {livros.length}</Typography>
            </Box>

            <Button 
              variant="contained" 
              onClick={reiniciar}
              sx={{ mt: 3 }}
            >
              Confirmar Entrada
            </Button>
          </Box>
        );

      default:
        return <Typography>Etapa não encontrada</Typography>;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Entrada de Estoque
      </Typography>

      <CustomStepper
        steps={steps}
        activeStep={activeStep}
        onNext={avancarEtapa}
        onBack={voltarEtapa}
        onReset={reiniciar}
        isLastStep={activeStep === steps.length - 1}
        disableNext={activeStep === 0 && !fornecedor}
      >
        {renderizarConteudoEtapa()}
      </CustomStepper>

      {/* Modais */}
      <ModalForm
        open={modalFornecedorAberto}
        onClose={() => setModalFornecedorAberto(false)}
        title="Cadastrar Fornecedor"
        maxWidth="md"
      >
        <FornecedorForm
          onSuccess={handleFornecedorSalvo}
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
          onSuccess={handleDistribuidorSalvo}
          onCancel={() => setModalDistribuidorAberto(false)}
        />
      </ModalForm>
    </Box>
  );
}