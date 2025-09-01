import { createTheme } from '@mui/material/styles';

// Cores da sua livraria - vamos escolher juntas!
const colors = {
  primary: {
    main: '#2C5530',
    light: '#4A7C59',    
    dark: '#1E3E23',      
  },
  secondary: {
    main: '#aa7444',
    light: '#e6aa77',    
    dark: '#46220f',
  },
  background: {
    default: '#e5dbc9',
    paper: '#e5dbc9',
  },
  text: {
    primary: '#2C5530',   // Texto escuro
    secondary: '#5D4037', // Texto secundário
  }
};

// Criando o tema principal
export const livrariaTheme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    mode: 'light',        // Começamos com tema claro
  },
  
  // Tipografia - fontes dos textos
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: colors.primary.dark,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.primary.main,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: colors.primary.main,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    }
  },

  // Componentes - personalização específica
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.light,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none', // remove CAPS LOCK dos botões
          fontWeight: 500,
        },
        contained: {
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});