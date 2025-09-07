// frontend/src/App.tsx
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { livrariaTheme } from './styles/theme';
import './styles/global.css';
import DashboardLivraria from './layouts/dashboardLayout';
import LoginPage from './pages/LoginPage';

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login/" replace />;
};

// Componente para pagina do Dashboard
const DashboardPage = () => {
  return <DashboardLivraria />;
};

function App() {
  return (
    <ThemeProvider theme={livrariaTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login/" element={<LoginPage />} />
            <Route 
              path="/dashboard/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;