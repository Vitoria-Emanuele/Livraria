import api from './api';

// interface do fornecedor
export interface Fornecedor {
  id_fornecedor: number;
  cnpj_fornecedor: string;
  nome_fantasia_fornecedor: string;
  razao_social_fornecedor: string;
  email_fornecedor: string;
  telefone_fornecedor: string;
  logradouro_fornecedor: string;
  numero_logradouro_fornecedor: number;
  bairro_fornecedor: string;
  cidade_fornecedor: string;
  estado_fornecedor: string;
  cep_fornecedor: string;
  complemento_fornecedor: string;
}

export interface FornecedorCreate {
  cnpj_fornecedor: string;
  nome_fantasia_fornecedor: string;
  razao_social_fornecedor: string;
  email_fornecedor: string;
  telefone_fornecedor: string;
  logradouro_fornecedor: string;
  numero_logradouro_fornecedor: number;
  bairro_fornecedor: string;
  cidade_fornecedor: string;
  estado_fornecedor: string;
  cep_fornecedor: string;
  complemento_fornecedor: string;
}

// Adicione as interfaces para Distribuidor
export interface Distribuidor {
  id_distribuidor: number;
  cnpj_distribuidor: string;
  nome_fantasia_distribuidor: string;
  razao_social_distribuidor: string;
  email_distribuidor: string;
  telefone_distribuidor: string;
  logradouro_distribuidor: string;
  numero_logradouro_distribuidor: number;
  bairro_distribuidor: string;
  cidade_distribuidor: string;
  estado_distribuidor: string;
  cep_distribuidor: string;
  complemento_distribuidor?: string;
}

export interface DistribuidorCreate {
  cnpj_distribuidor: string;
  nome_fantasia_distribuidor: string;
  razao_social_distribuidor: string;
  email_distribuidor: string;
  telefone_distribuidor: string;
  logradouro_distribuidor: string;
  numero_logradouro_distribuidor: number;
  bairro_distribuidor: string;
  cidade_distribuidor: string;
  estado_distribuidor: string;
  cep_distribuidor: string;
  complemento_distribuidor?: string;
}


export const estoqueService = {
  // Fornecedor
  listarFornecedor: (): Promise<Fornecedor[]> => 
    api.get('/fornecedor/').then(response => response.data),

  criarFornecedor: (fornecedor: FornecedorCreate): Promise<Fornecedor> => 
    api.post('/fornecedor/', fornecedor).then(response => response.data),

  // Distribuidor
  listarDistribuidor: (): Promise<any[]> => 
    api.get('/distribuidor/').then(response => response.data),

  criarDistribuidor: (distribuidor: any): Promise<any> => 
    api.post('/distribuidor/', distribuidor).then(response => response.data),

  // Livros
  listarLivros: (): Promise<any[]> => 
    api.get('/livro/').then(response => response.data),

  criarLivro: (livro: any): Promise<any[]> => 
    api.post('/livro/', livro).then(response => response.data),

  // Entradas
  registrarEntrada: (entrada: any): Promise<any> => 
    api.post('/registro_entrada/', entrada).then(response => response.data),

  // Saídas
  registrarSaida: (saida: any): Promise<any> => 
    api.post('/retiradas', saida).then(response => response.data),
};