import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import WarningIcon from '@mui/icons-material/Warning';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PersonIcon from '@mui/icons-material/Person';


// Interface que define as propriedades do componente
interface InfoCardProps {
  title: string;           // Título do card
  value: string | number;  // Valor principal (pode ser texto ou número)
  icon: React.ReactElement; // Ícone do card
  color?: 'primary' | 'error' | 'success' | 'warning' | 'info'; // Cor do card
  subtitle?: string;       // Texto adicional (opcional)
  alert?: boolean;         // Se é um card de alerta
}

// Componente InfoCard
export default function InfoCard({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  subtitle, 
  alert = false 
}: InfoCardProps) {
  
  // Hook para acessar o tema do MUI
  const theme = useTheme();
  
  // Mapeamento de cores para estilos
  const colorStyles = {
    primary: {
      bgcolor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    error: {
      bgcolor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
    },
    success: {
      bgcolor: theme.palette.success.light,
      color: theme.palette.success.contrastText,
    },
    warning: {
      bgcolor: theme.palette.warning.light,
      color: theme.palette.warning.contrastText,
    },
    info: {
      bgcolor: theme.palette.info.light,
      color: theme.palette.info.contrastText,
    },
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        border: alert ? `2px solid ${theme.palette.error.main}` : 'none',
        boxShadow: alert ? 3 : 1,
      }}
    >
      <CardContent>
        {/* Container principal do card */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}
        >
          {/* Área do texto */}
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              gutterBottom
              sx={{ fontWeight: 'medium' }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h4" 
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              {value}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Área do ícone */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              ...colorStyles[color], // Aplica as cores baseadas na prop
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Mensagem de alerta se necessário */}
        {alert && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'error.main', 
              fontStyle: 'italic',
              display: 'block',
              mt: 1
            }}
          >
            Atenção: necessária ação imediata
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de exemplo para mostrar como usar
export function ExampleUsage() {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {/* Card de estoque baixo */}
      <InfoCard
        title="Necessitam Reposição"
        value={12}
        icon={<WarningIcon />}
        color="error"
        alert={true}
      />
      
      {/* Card de movimentações */}
      <InfoCard
        title="Movimentações Hoje"
        value={8}
        icon={<SwapVertIcon />}
        color="info"
      />
      
      {/* Card de funcionário */}
      <InfoCard
        title="Funcionário"
        value="Maria Silva"
        icon={<PersonIcon />}
        subtitle="Gerente de Estoque"
        color="primary"
      />
    </Box>
  );
}