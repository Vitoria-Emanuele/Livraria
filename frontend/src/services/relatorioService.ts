import api from './api';

export interface RelatorioFiltros {
  tipo: string;
  campo: string;
  agrupamento: string;
  data_inicial?: string;
  data_final?: string;
}

export interface RelatorioResponse {
  label: string;
  value: number;
}

export const relatorioService = {
  async gerarRelatorio(filtros: RelatorioFiltros): Promise<RelatorioResponse[]> {
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/relatorio/?${params}`);
    return response.data;
  },

  //  metodos especificos para estoque
  async relatorioEstoquePorGenero(): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'estoque',
      campo: 'genero',
      agrupamento: 'none'
    });
  },

  async relatorioEstoquePorEditora(): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'estoque',
      campo: 'editora',
      agrupamento: 'none'
    });
  },

  async relatorioEstoquePorLivro(): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'estoque',
      campo: 'livro',
      agrupamento: 'none'
    });
  },

  // metodos especificos para entradas
  async relatorioEntradasPorFornecedor(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'entradas',
      campo: 'fornecedor',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioEntradasPorFuncionario(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'entradas',
      campo: 'funcionario',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioEntradasPorLivro(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'entradas',
      campo: 'livro',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioEntradasPorGenero(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'entradas',
      campo: 'genero',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  // metodos especificos para retiradas
  async relatorioRetiradasPorMotivo(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'motivo',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioRetiradasPorFuncionario(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'funcionario',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioRetiradasPorLivro(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'livro',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  async relatorioRetiradasPorGenero(agrupamento: string = 'month', dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    return this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'genero',
      agrupamento: agrupamento,
      data_inicial: dataInicial,
      data_final: dataFinal
    });
  },

  // metodos de resumo/ranking 
  async rankingLivrosMaisVendidos(limit: number = 10, dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    const dados = await this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'livro',
      agrupamento: 'none',
      data_inicial: dataInicial,
      data_final: dataFinal
    });
    
    // ordena por quantidade e limita o resultado
    return dados.sort((a, b) => b.value - a.value).slice(0, limit);
  },

  async rankingGenerosMaisVendidos(limit: number = 10, dataInicial?: string, dataFinal?: string): Promise<RelatorioResponse[]> {
    const dados = await this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'genero',
      agrupamento: 'none',
      data_inicial: dataInicial,
      data_final: dataFinal
    });
    
    return dados.sort((a, b) => b.value - a.value).slice(0, limit);
  },

  async resumoMovimentacaoMensal(ano: number = new Date().getFullYear()): Promise<RelatorioResponse[]> {
    const dataInicial = `${ano}-01-01`;
    const dataFinal = `${ano}-12-31`;
    
    const entradas = await this.gerarRelatorio({
      tipo: 'entradas',
      campo: 'fornecedor',
      agrupamento: 'month',
      data_inicial: dataInicial,
      data_final: dataFinal
    });

    const retiradas = await this.gerarRelatorio({
      tipo: 'retiradas',
      campo: 'motivo',
      agrupamento: 'month',
      data_inicial: dataInicial,
      data_final: dataFinal
    });

    // permite processar e combinar os dados como necessario
    // retornando um formato especifico para grafico comparativo
    return [
      { label: 'Entradas', value: entradas.reduce((sum, item) => sum + item.value, 0) },
      { label: 'Retiradas', value: retiradas.reduce((sum, item) => sum + item.value, 0) }
    ];
  }
};