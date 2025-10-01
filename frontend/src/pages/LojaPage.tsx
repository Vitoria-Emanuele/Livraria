import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  Grid, Container, TextField, Select, FormControl, InputLabel, Chip, Badge
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../hooks/useAuth';
import { useCarrinho } from '../contexts/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import { estoqueService, type Livro } from '../services';
import LivroCard from '../components/ui/LivroCard';

const LojaPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItens } = useCarrinho(); // ← ADICIONADO: hook do carrinho
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [generoFilter, setGeneroFilter] = useState('');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Carregar livros
  useEffect(() => {
    const carregarLivros = async () => {
      try {
        const livrosData = await estoqueService.listarLivros();
        setLivros(livrosData);
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarLivros();
  }, []);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/loja/');
  };

  const goToMinhaConta = () => {
    handleClose();
    navigate('/minha-conta/');
  };

  const goToPedidos = () => {
    handleClose();
    navigate('/minha-conta/pedidos/');
  };

  const goToCarrinho = () => {
    navigate('/carrinho/');
  };

  const goToLogin = () => navigate('/login/');
  const goToCadastro = () => navigate('/cadastro/'); 

  // Filtros
  const livrosFiltrados = livros.filter(livro => {
    const matchesSearch = livro.titulo_livro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livro.autor_livro.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenero = !generoFilter || livro.genero_literario === generoFilter;
    return matchesSearch && matchesGenero;
  });

  const generos = Array.from(new Set(livros.map(livro => livro.genero_literario)));

  return (
    <>
      {/* BARRA SUPERIOR */}
      <AppBar position="static" sx={{ backgroundColor: '#2C5530' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => navigate('/loja/')}
          >
            Livraria do Tik Tok
          </Typography>

          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={goToLogin}>Login</Button>
              <Button 
                color="inherit" 
                variant="outlined" 
                onClick={goToCadastro}
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Criar Conta
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Olá, {user?.email_login || user?.email || 'Cliente'}! {/* ← CORRIGIDO: email_login */}
              </Typography>
              
              {/* 🛒 ADICIONADO: Ícone do carrinho com badge */}
              <IconButton 
                color="inherit" 
                onClick={goToCarrinho}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={totalItens} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              
              <IconButton color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton>
              
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={goToMinhaConta}>Minha Conta</MenuItem>
                <MenuItem onClick={goToPedidos}>Meus Pedidos</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* CONTEÚDO PRINCIPAL */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C5530' }}>
          Catálogo de Livros
        </Typography>

        {/* BARRA DE PESQUISA E FILTROS */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Pesquisar livros..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Gênero</InputLabel>
            <Select
              value={generoFilter}
              label="Gênero"
              onChange={(e) => setGeneroFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {generos.map(genero => (
                <MenuItem key={genero} value={genero}>{genero}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || generoFilter) && (
            <Chip 
              label="Limpar filtros" 
              variant="outlined" 
              onDelete={() => {
                setSearchTerm('');
                setGeneroFilter('');
              }}
              clickable
            />
          )}
        </Box>

        {/* LISTA DE LIVROS */}
        {loading ? (
          <Typography>Carregando livros...</Typography>
        ) : (
          <Grid container spacing={3}>
            {livrosFiltrados.map(livro => (
              <Grid key={livro.id_livro} size={{ xs: 12, sm: 6 }}>
                <LivroCard livro={livro} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && livrosFiltrados.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              Nenhum livro encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente ajustar os filtros de pesquisa
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default LojaPage;