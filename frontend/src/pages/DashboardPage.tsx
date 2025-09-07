
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InfoCard from '../components/InfoCard';
import WarningIcon from '@mui/icons-material/Warning';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PersonIcon from '@mui/icons-material/Person';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visao Geral - Sistema de Estoque
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Necessitam Reposicao"
            value={12}
            icon={<WarningIcon />}
            color="error"
            alert={true}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Movimentacoes Hoje"
            value={8}
            icon={<SwapVertIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            title="Funcionario"
            value="Maria Silva"
            icon={<PersonIcon />}
            subtitle="Gerente de Estoque"
            color="primary"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Bem-vindo ao Sistema de Gestao
      </Typography>
      <Typography color="textSecondary">
        Utilize o menu lateral para acessar as funcionalidades do sistema.
      </Typography>
    </Box>
  );
}