import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';


interface InfoCardProps {
  title: string;          
  value: string | number;  
  icon: React.ReactElement; 
  color?: 'primary' | 'error' | 'success' | 'warning' | 'info'; 
  subtitle?: string;       
  alert?: boolean;      
}

export default function InfoCard({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  subtitle, 
  alert = false 
}: InfoCardProps) {
  
  const theme = useTheme();
  
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
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}
        >
          
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

          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              ...colorStyles[color], 
            }}
          >
            {icon}
          </Box>
        </Box>

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
            Atenção: necessaria ação imediata
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}