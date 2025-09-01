import { useState } from 'react';

interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export function useCep() {
  const [carregando, setCarregando] = useState(false);

  const buscarEnderecoPorCep = async (cep: string): Promise<Endereco | null> => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return null;

    setCarregando(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (data.erro) return null;
      
      return {
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || ''
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    } finally {
      setCarregando(false);
    }
  };

  return { buscarEnderecoPorCep, carregando };
}