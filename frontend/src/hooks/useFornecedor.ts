import { useState, useEffect } from 'react';
import { estoqueService, type Fornecedor, type FornecedorCreate } from '../services';

export function useFornecedor() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listarFornecedor = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await estoqueService.listarFornecedor();
      setFornecedores(dados);
    } catch (error) {
      setErro('Erro ao carregar fornecedores');
      console.error('Erro ao listar fornecedores:', error);
    } finally {
      setCarregando(false);
    }
  };

  const criarFornecedor = async (fornecedorData: FornecedorCreate): Promise<Fornecedor> => {
    try {
      setErro(null);
      const novoFornecedor = await estoqueService.criarFornecedor(fornecedorData);
      setFornecedores(prev => [...prev, novoFornecedor]);
      return novoFornecedor;
    } catch (error) {
      setErro('Erro ao criar fornecedor');
      console.error('Erro ao criar fornecedor:', error);
      throw error;
    }
  };

  useEffect(() => {
    listarFornecedor();
  }, []);

  return {
    fornecedores,
    carregando,
    erro,
    listarFornecedor,
    criarFornecedor
  };
}