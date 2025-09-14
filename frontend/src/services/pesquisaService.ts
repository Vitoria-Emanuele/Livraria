import api from './api';

export const pesquisaService = {
  async pesquisarLivros(tipo: string, termo: string) {
    const params = new URLSearchParams({ tipo });
    if (termo) params.append('termo', termo);
    
    const response = await api.get(`/pesquisa/livro?${params}`);
    return response.data;
  },

  async pesquisarFornecedores(tipo: string, termo: string) {
    const params = new URLSearchParams({ tipo });
    if (termo) params.append('termo', termo);
    
    const response = await api.get(`/pesquisa/fornecedor?${params}`);
    return response.data;
  },

  async pesquisarDistribuidores(tipo: string, termo: string) {
    const params = new URLSearchParams({ tipo });
    if (termo) params.append('termo', termo);
    
    const response = await api.get(`/pesquisa/distribuidores?${params}`);
    return response.data;
  },

  async pesquisarFuncionarios(tipo: string, termo: string) {
    const params = new URLSearchParams({ tipo });
    if (termo) params.append('termo', termo);
    
    const response = await api.get(`/pesquisa/funcionario?${params}`);
    return response.data;
  },
};