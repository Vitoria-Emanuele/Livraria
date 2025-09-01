import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { livrariaTheme } from './styles/theme';
 
import './styles/global.css';
import DashboardLivraria from './layouts/dashboardLayout';

function App() {
  return (
    <ThemeProvider theme={livrariaTheme}>
      <CssBaseline />
       <DashboardLivraria />
    </ThemeProvider>
  );
}

export default App;