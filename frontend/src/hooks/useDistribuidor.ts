import { useState, useEffect } from 'react';
import { estoqueService, type Distribuidor, type DistribuidorCreate } from '../services';

export function useDistribuidor() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listarDistribuidor = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await estoqueService.listarDistribuidor();
      setDistribuidores(dados);
    } catch (error) {
      setErro('Erro ao carregar distribuidores');
      console.error('Erro ao listar distribuidores:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    listarDistribuidor();
  }, []);

  const criarDistribuidor = async (distribuidorData: DistribuidorCreate): Promise<Distribuidor> => {
    try {
      setErro(null);
      const novoDistribuidor = await estoqueService.criarDistribuidor(distribuidorData);
      setDistribuidores(prev => [...prev, novoDistribuidor]);
      return novoDistribuidor;
    } catch (error) {
      setErro('Erro ao criar distribuidor');
      console.error('Erro ao criar distribuidor:', error);
      throw error;
    }
  };

  return {
    distribuidores,
    carregando,
    erro,
    listarDistribuidor,
    criarDistribuidor
  };
}