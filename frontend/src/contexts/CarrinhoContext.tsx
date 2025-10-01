import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

export interface ItemCarrinho {
  id_livro: number;
  titulo_livro: string;
  autor_livro: string;
  valor_venda: number;
  quantidade: number;
  estoque_atual: number;
  imagem?: string;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (livro: Omit<ItemCarrinho, 'quantidade'>, quantidade?: number) => void;
  removerItem: (idLivro: number) => void;
  atualizarQuantidade: (idLivro: number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      setItens(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (livro: Omit<ItemCarrinho, 'quantidade'>, quantidade: number = 1) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.id_livro === livro.id_livro);
      
      if (itemExistente) {
        // Se já existe, atualiza a quantidade
        return prevItens.map(item =>
          item.id_livro === livro.id_livro
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Se não existe, adiciona novo item
        return [...prevItens, { ...livro, quantidade }];
      }
    });
  };

  const removerItem = (idLivro: number) => {
    setItens(prevItens => prevItens.filter(item => item.id_livro !== idLivro));
  };

  const atualizarQuantidade = (idLivro: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(idLivro);
      return;
    }

    setItens(prevItens =>
      prevItens.map(item =>
        item.id_livro === idLivro ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const totalPreco = itens.reduce((total, item) => total + (item.valor_venda * item.quantidade), 0);

  const value = {
    itens,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    totalItens,
    totalPreco,
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};