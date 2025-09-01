import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';


import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import { livrariaTheme } from '../styles/theme';
import logo from '../assets/logo.png'

import MovimentacaoPage from '../pages/MovimentacaoPage';
import DashboardPage from '../pages/DashboardPage';



// Navegação do sistema - modifique aqui com seus item de menu
const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Gestão de Estoque',
  },
  {
    segment: 'dashboard',
    title: 'Visão Geral',
    icon: <DashboardIcon />,
  },
  {
    segment: 'movimentacao',
    title: 'Movimentação do Estoque',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'estoque',
    title: 'Controle de Estoque',
    icon: <InventoryIcon />,
  },
  {
    segment: 'relatorios',
    title: 'Relatórios',
    icon: <AnalyticsIcon />,
  },
];

// Conteudo principal temporário
function MainContent() {
  // Simulação de roteamento baseado no pathname
  const pathname = window.location.pathname;
  
  const renderizarConteudo = () => {
    if (pathname.includes('movimentacao')) {
      return <MovimentacaoPage />;
    }
    
    // Página padrão (Dashboard)
    return <DashboardPage />;
  };

  return renderizarConteudo();

  
}

//barra em cima
function ToolbarActions() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
    </div>
  );
}

// Componente principal do layout - SEM ROTAS
export default function DashboardLivraria() {
  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={livrariaTheme}
      // Logo da livraria
      branding={{
        logo: <img src={logo} style={{ height: '50px' }} />,
        title: '',
        homeUrl: '/dashboard',
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarActions,
        }}
      >
        <MainContent />
      </DashboardLayout>
    </AppProvider>
  );
}