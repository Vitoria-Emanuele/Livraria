// App.tsx - VERSÃO COMPLETA
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { livrariaTheme } from './styles/theme';
import './styles/global.css';

import ProtectedRoute from './components/protectedRoute';
import DashboardLivraria from './layouts/dashboardLayout';
import LoginPage from './pages/LoginPage';
import LojaPage from './pages/LojaPage';
import MinhaContaPage from './components/cliente/ContaPage';
import CadastroPage from './components/cliente/CadastroClintePage';
import CarrinhoPage from './components/cliente/CarrinhoPage';
import CompraConcluidaPage from './components/cliente/CompraConcluidaPage';
import CheckoutPage from './components/cliente/CheckoutPage';
import MeusPedidosPage from './components/cliente/MeusPedidosPage';
import EditarClientePage from './components/cliente/EditarClientePage';

function App() {
  return (
    <ThemeProvider theme={livrariaTheme}>
      <CssBaseline />
      <AuthProvider>
        <CarrinhoProvider>
          <Router>
            <Routes>
              {/* ROTAS PÚBLICAS */}
              <Route path="/login/" element={<LoginPage />} />
              <Route path="/cadastro/" element={<CadastroPage />} />
              
              {/* LOJA - Acessível para todos (pública) */}
              <Route path="/loja/" element={<LojaPage />} />

              {/* CARRINHO - Área logada */}
              <Route 
                path="/carrinho/" 
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <CarrinhoPage />
                  </ProtectedRoute>
                } 
              />

              <Route
                path="/minha-conta/"
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <MinhaContaPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minha-conta/pedidos/"
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <MeusPedidosPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minha-conta/editar-perfil/"
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <EditarClientePage />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/checkout/" 
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/compra-concluida/" 
                element={
                  <ProtectedRoute roles={['CLIENTE', 'ADMIN', 'FUNCIONARIO']}>
                    <CompraConcluidaPage />
                  </ProtectedRoute>
                } 
              />

              {/* ÁREA ADMIN/FUNCIONARIO */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute roles={['ADMIN', 'FUNCIONARIO']}>
                    <DashboardLivraria />
                  </ProtectedRoute>
                }
              />
              
              
              <Route path="/" element={<Navigate to="/loja/" replace />} />
            </Routes>
          </Router>
        </CarrinhoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;