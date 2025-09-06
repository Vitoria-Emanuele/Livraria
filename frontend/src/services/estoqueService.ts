import api from './api';

// interfaces para Distribuidor
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

// Interface do Funcionario
export interface Funcionario {
  id_funcionario: number;
  nome_funcionario: string;
  ctps_funcionario: string;
  cpf_funcionario: string;
  setor: string;
  cargo: string;
  salario: number;
  telefone_funcionario: string;
  email_funcionario: string;
  logradouro_funcionario: string;
  numero_logradouro_funcionario: number;
  bairro_funcionario: string;
  cidade_funcionario: string;
  estado_funcionario: string;
  cep_funcionario: string;
  complemento_funcionario: string;
}

export interface FuncionarioCreate {
  nome_funcionario: string;
  ctps_funcionario: string;
  cpf_funcionario: string;
  setor: string;
  cargo: string;
  salario: number;
  telefone_funcionario: string;
  email_funcionario: string;
  logradouro_funcionario: string;
  numero_logradouro_funcionario: number;
  bairro_funcionario: string;
  cidade_funcionario: string;
  estado_funcionario: string;
  cep_funcionario: string;
  complemento_funcionario: string;
}

// Interface do Registro de Entrada
export interface RegistroEntrada {
  id_entrada: number;
  data_entrada: string;
  hora_entrada: string;
  id_fornecedor: number;    
  id_distribuidor?: number;  
  id_funcionario: number; 
}

export interface RegistroEntradaCreate {
  id_distribuidor?: number;
  id_fornecedor: number;
  id_funcionario: number;
}

// Interfaces para Lote
export interface Lote {
  id_lote: number;
  valor_lote: number; 
  quantidade_itens_lote: number;
  id_entrada: number;
}

export interface LoteCreate {
  valor_lote: number; 
  quantidade_itens_lote: number;
  id_entrada: number;
}

// Interface do Livro
export interface Livro {
  id_livro: number;
  isbn_livro: number;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
}

export interface LivroCreate {
  isbn_livro: number;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
}

// Interface do Item Lote
export interface ItemLote {
  id_lote: number;  
  id_livro: number;      
  quantidade_itens_lote: number;         
  valor_item_lote: number;     
}

export interface ItemLoteCreate {
  id_lote: number;
  id_livro: number;
  quantidade_itens_lote: number;
  valor_item_lote: number;
}

// Interface da Retirada
export interface Retirada {
  id_retirada: number;
  id_funcionario: number;
  motivo_retirada: string;
  data_retirada: string;
  hora_retirada: string;
}

export interface RetiradaCreate {
  id_funcionario: number;
  motivo_retirada: string;
  data_retirada: string;
  hora_retirada: string;
}

// Interface do Item retirada
export interface ItemRetirada {
  id_retirada: number;  
  id_livro: number;      
  quantidade_itens_retirada: number;         
  valor_unitario_retirada: number;     
}

export interface ItemRetiradaCreate {
  id_retirada: number;
  id_livro: number;
  quantidade_itens_retirada: number;
  valor_unitario_retirada: number;
}

export const estoqueService = {

  // Distribuidor
  buscarDistribuidor: (distribuidor_id: number): Promise<Distribuidor> => 
    api.get(`/distribuidor/${distribuidor_id}`).then(response => response.data),

  listarDistribuidor: (): Promise<Distribuidor[]> => 
    api.get('/distribuidor/').then(response => response.data),

  criarDistribuidor: (distribuidor: DistribuidorCreate): Promise<Distribuidor> => 
    api.post('/distribuidor/', distribuidor).then(response => response.data),

  atualizarDistribuidor: (distribuidor_id: number, distribuidor: Partial<DistribuidorCreate>): Promise<Distribuidor> => 
    api.put(`/distribuidor/${distribuidor_id}`, distribuidor).then(response => response.data),

  removerDistribuidor: (distribuidor_id: number): Promise<{ok: boolean}> => 
    api.delete(`/distribuidor/${distribuidor_id}`).then(response => response.data),

  // Fornecedor
  buscarFornecedor: (fornecedor_id: number): Promise<Fornecedor> => 
    api.get(`/fornecedor/${fornecedor_id}`).then(response => response.data),

  listarFornecedor: (): Promise<Fornecedor[]> => 
    api.get('/fornecedor/').then(response => response.data),

  criarFornecedor: (fornecedor: FornecedorCreate): Promise<Fornecedor> => 
    api.post('/fornecedor/', fornecedor).then(response => response.data),

  atualizarFornecedor: (fornecedor_id: number, fornecedor: Partial<FornecedorCreate>): Promise<Fornecedor> => 
    api.put(`/fornecedor/${fornecedor_id}`, fornecedor).then(response => response.data),

  removerFornecedor: (fornecedor_id: number): Promise<{ok: boolean}> => 
    api.delete(`/fornecedor/${fornecedor_id}`).then(response => response.data),

  // Funcionario
  buscarFuncionario: (funcionario_id: number): Promise<Funcionario> => 
    api.get(`/funcionario/${funcionario_id}`).then(response => response.data),

  listarFuncionario: (): Promise<Funcionario[]> => 
    api.get('/funcionario/').then(response => response.data),

  criarFuncionario: (funcionario: FuncionarioCreate): Promise<Funcionario> => 
    api.post('/funcionario/', funcionario).then(response => response.data),

  atualizarFuncionario: (funcionario_id: number, funcionario: Partial<FuncionarioCreate>): Promise<Funcionario> => 
    api.put(`/funcionario/${funcionario_id}`, funcionario).then(response => response.data),

  removerFuncionario: (funcionario_id: number): Promise<{ok: boolean}> => 
    api.delete(`/funcionario/${funcionario_id}`).then(response => response.data),

  // Registro de Entrada
  buscarRegistroEntrada: (entrada_id: number): Promise<RegistroEntrada> => 
    api.get(`/registro_entrada/${entrada_id}`).then(response => response.data),

  listarRegistroEntrada: (): Promise<RegistroEntrada[]> => 
    api.get('/registro_entrada/').then(response => response.data),

  criarRegistroEntrada: (entrada: RegistroEntradaCreate): Promise<RegistroEntrada> => 
    api.post('/registro_entrada/', entrada).then(response => response.data),

  atualizarRegistroEntrada: (entrada_id: number, entrada: Partial<RegistroEntradaCreate>): Promise<RegistroEntrada> => 
    api.put(`/registro_entrada/${entrada_id}`, entrada).then(response => response.data),

  removerRegistroEntrada: (entrada_id: number): Promise<{ok: boolean}> => 
    api.delete(`/registro_entrada/${entrada_id}`).then(response => response.data),

  // Lote
  listarLote: (): Promise<Lote[]> => 
    api.get('/lote/').then(response => response.data),

  buscarLote: (lote_id: number): Promise<Lote> => 
    api.get(`/lote/${lote_id}`).then(response => response.data),

  criarLote: (lote: LoteCreate): Promise<Lote> => 
    api.post('/lote/', lote).then(response => response.data),

  atualizarLote: (lote_id: number, lote: Partial<LoteCreate>): Promise<Lote> => 
    api.put(`/lote/${lote_id}`, lote).then(response => response.data),

  removerLote: (lote_id: number): Promise<{ok: boolean}> => 
    api.delete(`/lote/${lote_id}`).then(response => response.data),

  // Livros
  buscarLivro: (livro_id: number): Promise<Livro> => 
    api.get(`/livro/${livro_id}`).then(response => response.data),

  listarLivros: (): Promise<Livro[]> => 
    api.get('/livro/').then(response => response.data),

  criarLivro: (livro: LivroCreate): Promise<Livro> => 
    api.post('/livro/', livro).then(response => response.data),

  atualizarLivro: (livro_id: number, livro: Partial<LivroCreate>): Promise<Livro> => 
    api.put(`/livro/${livro_id}`, livro).then(response => response.data),

  removerLivro: (livro_id: number): Promise<{ok: boolean}> => 
    api.delete(`/livro/${livro_id}`).then(response => response.data),

  // Item do Lote
  buscarItemLote: (lote_id: number, livro_id: number): Promise<ItemLote> => 
    api.get(`/item_lote/${lote_id}/${livro_id}`).then(response => response.data),

  listarItensLote: (lote_id: number): Promise<ItemLote[]> => 
    api.get(`/item_lote/${lote_id}`).then(response => response.data),

  criarItemLote: (itemLote: ItemLoteCreate): Promise<ItemLote> => 
    api.post('/item_lote/', itemLote).then(response => response.data),

  atualizarItemLote: (lote_id: number, livro_id: number, itemLote: Partial<ItemLoteCreate>): Promise<ItemLote> => 
    api.put(`/item_lote/${lote_id}/${livro_id}`, itemLote).then(response => response.data),

  removerItemLote: (lote_id: number, livro_id: number): Promise<{ok: boolean}> => 
    api.delete(`/item_lote/${lote_id}/${livro_id}`).then(response => response.data),

  // Retirada
  buscarRetirada: (retirada_id: number): Promise<Retirada> => 
    api.get(`/retirada/${retirada_id}`).then(response => response.data),

  listarRetiradas: (): Promise<Retirada[]> => 
    api.get('/retirada/').then(response => response.data),

  criarRetirada: (retirada: RetiradaCreate): Promise<Retirada> => 
    api.post('/retirada/', retirada).then(response => response.data),

  atualizarRetirada: (retirada_id: number, retirada: Partial<RetiradaCreate>): Promise<Retirada> => 
    api.put(`/retirada/${retirada_id}`, retirada).then(response => response.data),

  removerRetirada: (retirada_id: number): Promise<{ok: boolean}> => 
    api.delete(`/retirada/${retirada_id}`).then(response => response.data),

  // Item de Retirada
  buscarItemRetirada: (retirada_id: number, livro_id: number): Promise<ItemRetirada> => 
    api.get(`/item_retirada/${retirada_id}/${livro_id}`).then(response => response.data),

  listarItensRetirada: (retirada_id: number): Promise<ItemRetirada[]> => 
    api.get(`/item_retirada/${retirada_id}`).then(response => response.data),

  criarItemRetirada: (itemRetirada: ItemRetiradaCreate): Promise<ItemRetirada> => 
    api.post('/item_retirada/', itemRetirada).then(response => response.data),

  atualizarItemRetirada: (retirada_id: number, livro_id: number, itemRetirada: Partial<ItemRetiradaCreate>): Promise<ItemRetirada> => 
    api.put(`/item_retirada/${retirada_id}/${livro_id}`, itemRetirada).then(response => response.data),

  removerItemRetirada: (retirada_id: number, livro_id: number): Promise<{ok: boolean}> => 
    api.delete(`/item_retirada/${retirada_id}/${livro_id}`).then(response => response.data),
};