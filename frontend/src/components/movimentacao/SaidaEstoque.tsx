import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';

import { useState } from 'react';
import { estoqueService, type SaidaEstoqueRequest } from '../../services';
import { useAuth } from '../../hooks/useAuth';

interface ItemSaida {
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  quantidade: string;
  valor_unitario: string;
  estoque_atual?: number;
}

export default function SaidaEstoque() {
  const { user } = useAuth();
  const [motivoRetirada, setMotivoRetirada] = useState('');
  const [itens, setItens] = useState<ItemSaida[]>([]);
  const [carregando, setCarregando] = useState(false);

  const motivos = [
    { value: 'venda', label: 'Venda' },
    { value: 'perda', label: 'Perda/Danificado' },
    { value: 'devolucao', label: 'Devolução ao Fornecedor' },
    { value: 'ajuste', label: 'Ajuste de Estoque' },
    { value: 'outro', label: 'Outro' }
  ];

  const adicionarItem = () => {
    setItens(prev => [...prev, {
      isbn_livro: '',
      titulo_livro: '',
      autor_livro: '',
      quantidade: '',
      valor_unitario: ''
    }]);
  };

  const removerItem = (index: number) => {
    setItens(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: keyof ItemSaida, valor: string) => {
    setItens(prev => prev.map((item, i) => 
      i === index ? { ...item, [campo]: valor } : item
    ));
  };

  const buscarLivroPorIsbn = async (isbn: string, index: number) => {
    if (isbn.length < 10) return;
    
    try {
      const livro = await estoqueService.buscarLivroPorIsbn(isbn);
      if (livro) {
        setItens(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            titulo_livro: livro.titulo_livro,
            autor_livro: livro.autor_livro,
            estoque_atual: livro.estoque_atual,
          } : item
        ));
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
    }
  };

  const limparFormulario = () => {
    setMotivoRetirada('');
    setItens([]);
  };

  const handleSubmit = async () => {
    if (!motivoRetirada) {
      alert("Selecione o motivo da retirada!");
      return;
    }

    if (itens.length === 0) {
      alert("Adicione pelo menos um livro à retirada!");
      return;
    }

    // validar estoque e quantidades
    for (const [index, item] of itens.entries()) {
      const quantidade = parseInt(item.quantidade) || 0;
      
      if (quantidade <= 0) {
        alert(`Quantidade inválida para o livro ${item.titulo_livro || 'ISBN: ' + item.isbn_livro}`);
        return;
      }

      if (item.estoque_atual !== undefined && quantidade > item.estoque_atual) {
        alert(`Estoque insuficiente para ${item.titulo_livro}. Disponível: ${item.estoque_atual}`);
        return;
      }

      if (!item.valor_unitario || parseFloat(item.valor_unitario) <= 0) {
        alert(`Valor unitário inválido para ${item.titulo_livro}`);
        return;
      }
    }

    setCarregando(true);

    try {
      const idFuncionario = user?.id_funcionario || user?.funcionario_id || user?.funcionario?.id || user?.id;

      if (!idFuncionario) {
        alert('Não foi possível identificar o funcionário!');
        return;
      }

      // para cada item, buscar o ID do livro pelo ISBN
      const itensComIds = await Promise.all(
        itens.map(async (item) => {
          const livro = await estoqueService.buscarLivroPorIsbn(item.isbn_livro);
          return {
            id_livro: livro?.id_livro || 0,
            quantidade: parseInt(item.quantidade) || 0,
            valor_unitario: parseFloat(item.valor_unitario) || 0
          };
        })
      );

      // verificar se todos os livros foram encontrados
      if (itensComIds.some(item => item.id_livro === 0)) {
        alert('Alguns livros não foram encontrados no sistema. Verifique os ISBNs.');
        return;
      }

      const dadosSaida: SaidaEstoqueRequest = {
        motivo_retirada: motivoRetirada,
        id_funcionario: idFuncionario,
        itens: itensComIds
      };

      await estoqueService.criarSaidaEstoqueCompleta(dadosSaida);

      alert("Saída de estoque registrada com sucesso!");
      limparFormulario();

    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      alert('Erro ao registrar saída. Verifique o console.');
    } finally {
      setCarregando(false);
    }
  };

  // calcular totais
  const quantidadeTotal = itens.reduce((total, item) => 
    total + (parseInt(item.quantidade) || 0), 0
  );

  const valorTotal = itens.reduce((total, item) => {
    const quantidade = parseInt(item.quantidade) || 0;
    const valorUnitario = parseFloat(item.valor_unitario) || 0;
    return total + (quantidade * valorUnitario);
  }, 0);

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Saída de Estoque
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Motivo da Retirada
        </Typography>
        <TextField
          select
          required
          fullWidth
          label="Motivo da Retirada"
          value={motivoRetirada}
          onChange={(e) => setMotivoRetirada(e.target.value)}
        >
          <MenuItem value="">Selecione o motivo</MenuItem>
          {motivos.map((motivo) => (
            <MenuItem key={motivo.value} value={motivo.value}>
              {motivo.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Livros para Retirada
        </Typography>

        {itens.map((item, index) => (
          <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  required
                  fullWidth
                  label="ISBN do Livro"
                  value={item.isbn_livro}
                  onChange={(e) => {
                    atualizarItem(index, 'isbn_livro', e.target.value);
                    if (e.target.value.length >= 10) {
                      buscarLivroPorIsbn(e.target.value, index);
                    }
                  }}
                  placeholder="Digite o ISBN (10 ou 13 dígitos)"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Quantidade"
                  value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', e.target.value.replace(/\D/g, ''))}
                  type="number"
                  helperText={item.estoque_atual !== undefined ? `Estoque: ${item.estoque_atual}` : ''}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  required
                  fullWidth
                  label="Valor de Saída"
                  value={item.valor_unitario}
                  onChange={(e) => atualizarItem(index, 'valor_unitario', e.target.value)}
                  placeholder="0,00"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removerItem(index)}
                  fullWidth
                >
                  Remover
                </Button>
              </Grid>

              {item.titulo_livro && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Livro:</strong> {item.titulo_livro} | 
                    <strong> Autor:</strong> {item.autor_livro}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={adicionarItem}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Adicionar Livro
        </Button>
      </Box>


      {itens.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumo da Retirada
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography><strong>Total de Livros:</strong> {itens.length}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography><strong>Quantidade Total:</strong> {quantidadeTotal}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography><strong>Valor Total:</strong> R$ {valorTotal.toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={limparFormulario}
          disabled={itens.length === 0 && !motivoRetirada}
        >
          Limpar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!motivoRetirada || itens.length === 0 || carregando}
        >
          {carregando ? 'Processando...' : 'Confirmar Saída'}
        </Button>
      </Box>
    </Box>
  );
}