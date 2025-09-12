import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InfoCard from '../components/InfoCard';
import WarningIcon from '@mui/icons-material/Warning';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { estoqueService, type Funcionario, type Livro } from '../services';

interface DashboardData {
  livrosBaixoEstoque: Livro[];
  totalMovimentacoesHoje: number;
  totalEntradasHoje: number;
  totalSaidasHoje: number;
  funcionarioLogado: Funcionario | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    livrosBaixoEstoque: [],
    totalMovimentacoesHoje: 0,
    totalEntradasHoje: 0,
    totalSaidasHoje: 0,
    funcionarioLogado: null
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    try {
      setCarregando(true);
      
      // buscar os dados do funcionario
      let funcionarioLogado = null;
      if (user?.id_funcionario) {
        try {
          funcionarioLogado = await estoqueService.buscarFuncionario(user.id_funcionario);
        } catch (error) {
          console.error('Erro ao buscar dados do funcionário:', error);
        }
      }

      // carregar os outros dados em paralelo
      const [livros, entradas, saidas] = await Promise.all([
        estoqueService.listarLivros(),
        estoqueService.listarRegistroEntrada(),
        estoqueService.listarRetiradas()
      ]);

      // data de hoje para filtragem
      const hoje = new Date();
      const hojeFormatado = hoje.toISOString().split('T')[0];

      // filtra livros com estoque baixo, menos de 3 unidades
      const livrosBaixoEstoque = livros.filter(livro => livro.estoque_atual < 3);

      // filtra movimentacoes de hoje
      const entradasHoje = entradas.filter(entrada => 
        entrada.data_entrada === hojeFormatado
      );

      const saidasHoje = saidas.filter(saida => 
        saida.data_retirada === hojeFormatado
      );

      setDashboardData({
        livrosBaixoEstoque: livrosBaixoEstoque,
        totalMovimentacoesHoje: entradasHoje.length + saidasHoje.length,
        totalEntradasHoje: entradasHoje.length,
        totalSaidasHoje: saidasHoje.length,
        funcionarioLogado: funcionarioLogado
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setCarregando(false);
    }
  };

  const formatarLivrosBaixoEstoque = () => {
    if (dashboardData.livrosBaixoEstoque.length === 0) {
      return "Nenhum livro com estoque baixo";
    }
    
    return dashboardData.livrosBaixoEstoque
      .slice(0, 3) // mostra apenas os 3 primeiros
      .map(livro => `${livro.titulo_livro} (${livro.estoque_atual} un)`)
      .join(', ') + 
      (dashboardData.livrosBaixoEstoque.length > 3 ? 
        ` e mais ${dashboardData.livrosBaixoEstoque.length - 3}...` : '');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visão Geral - Sistema de Estoque
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Necessidade de Reposição"
            value={dashboardData.livrosBaixoEstoque.length}
            subtitle={formatarLivrosBaixoEstoque()}
            icon={<WarningIcon />}
            color="error"
            alert={dashboardData.livrosBaixoEstoque.length > 0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Movimentações Hoje"
            value={dashboardData.totalMovimentacoesHoje}
            subtitle={`${dashboardData.totalEntradasHoje} entradas, ${dashboardData.totalSaidasHoje} saídas`}
            icon={<SwapVertIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Funcionário Logado"
            value={dashboardData.funcionarioLogado?.nome_funcionario || 'Não identificado'}
            subtitle={dashboardData.funcionarioLogado?.cargo || 'Funcionário'}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Bem-vindo ao Sistema de Gestão de Estoque
      </Typography>
      <Typography color="textSecondary">
        Utilize o menu lateral para acessar as funcionalidades do sistema.
      </Typography>

    </Box>
  );
}