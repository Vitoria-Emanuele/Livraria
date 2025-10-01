// LivroCard.tsx - VERSÃO COMPLETA E CORRIGIDA
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../hooks/useAuth';

interface LivroCardProps {
  livro: {
    id_livro: number;
    titulo_livro: string;
    autor_livro: string;
    editora_livro: string;
    valor_venda: number;
    estoque_atual: number;
    genero_literario: string;
  };
}

const LivroCard: React.FC<LivroCardProps> = ({ livro }) => {
  const { adicionarItem } = useCarrinho();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAdicionarCarrinho = () => {
    if (!isAuthenticated) {
      alert('Faça login para adicionar livros ao carrinho!');
      navigate('/login/');
      return;
    }

    // Criar item do carrinho sem imagem (vou adicionar coluna depois no banco)
    const itemCarrinho = {
      id_livro: livro.id_livro,
      titulo_livro: livro.titulo_livro,
      autor_livro: livro.autor_livro,
      valor_venda: livro.valor_venda,
      estoque_atual: livro.estoque_atual,
      // imagem: `https://via.placeholder.com/200x280/4A7C59/FFFFFF?text=${encodeURIComponent(livro.titulo_livro)}` 
      // ↑ Comentado pois não tem coluna no banco ainda - vou adicionar depois
    };

    adicionarItem(itemCarrinho);
    
    // Feedback para o usuário
    console.log('Livro adicionado ao carrinho:', livro.titulo_livro);
  };

  return (
    <Card sx={{ maxWidth: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={`https://via.placeholder.com/200x280/4A7C59/FFFFFF?text=${encodeURIComponent(livro.titulo_livro)}`}
        alt={livro.titulo_livro}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontSize: '1rem', 
            fontWeight: 'bold',
            height: '48px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {livro.titulo_livro}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          por {livro.autor_livro}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Editora: {livro.editora_livro}
        </Typography>
        
        <Chip 
          label={livro.genero_literario} 
          size="small" 
          variant="outlined" 
          sx={{ mb: 1 }}
        />
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            R$ {livro.valor_venda.toFixed(2)}
          </Typography>
          
          <Typography 
            variant="body2" 
            color={livro.estoque_atual > 0 ? 'success.main' : 'error.main'}
            gutterBottom
          >
            {livro.estoque_atual > 0 ? `${livro.estoque_atual} em estoque` : 'Fora de estoque'}
          </Typography>
          
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddShoppingCart />}
            disabled={livro.estoque_atual === 0}
            onClick={handleAdicionarCarrinho}
            sx={{ mt: 1 }}
          >
            Adicionar ao Carrinho
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LivroCard;