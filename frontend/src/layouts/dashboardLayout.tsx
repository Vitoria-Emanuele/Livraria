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
import { useAuth } from '../hooks/useAuth';
import { Box, Button, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';



const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Gestao de Estoque',
  },
  {
    segment: 'dashboard',
    title: 'Visao Geral',
    icon: <DashboardIcon />,
  },
  {
    segment: 'movimentacao',
    title: 'Movimentacao do Estoque',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'estoque',
    title: 'Controle de Estoque',
    icon: <InventoryIcon />,
  },
  {
    segment: 'relatorios',
    title: 'Relatorios',
    icon: <AnalyticsIcon />,
  },
];

// Conteudo principal temporario
function MainContent() {
  // Simulacao de roteamento baseado no pathname
  const pathname = window.location.pathname;
  
  const renderizarConteudo = () => {
    if (pathname.includes('movimentacao')) {
      return <MovimentacaoPage />;
    }
    
    // Pagina padrao (Dashboard)
    return <DashboardPage />;
  };

  return renderizarConteudo();

  
}

function ToolbarActions() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" sx={{ color: 'white' }}>
        Ola!
      </Typography>
      
      <Button
        color="inherit"
        startIcon={<Logout />}
        onClick={logout}
        sx={{ 
          border: '1px solid rgba(255,255,255,0.3)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        Sair
      </Button>
    </Box>
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