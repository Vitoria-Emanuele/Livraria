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

// interface do Funcionario
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

// interface do Registro de Entrada
export interface RegistroEntrada {
  id_entrada: number;
  data_entrada: string;
  hora_entrada: string;
  id_fornecedor: number;    
  id_distribuidor?: number;  
  id_funcionario: number; 
}

export interface RegistroEntradaCreate {
  data_entrada: string;
  hora_entrada: string;
  id_distribuidor?: number;
  id_fornecedor: number;
  id_funcionario: number;
}

// interfaces para Lote
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

// interface do Livro
export interface Livro {
  id_livro: number;
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
  valor_venda: number;
}

export interface LivroCreate {
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
  valor_venda:number
}

// interface do Item Lote
export interface ItemLote {
  id_lote: number;  
  id_livro: number;      
  quantidade_item_lote: number;         
  valor_item_lote: number;     
}

export interface ItemLoteCreate {
  id_lote: number;
  id_livro: number;
  quantidade_item_lote: number;
  valor_item_lote: number;
}

// interface da Retirada
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

// interface do Item retirada
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

// interface do Usuario
export interface Usuario {
  id_usuario: number;
  email_login: string;
  senha_hash: string;
  role: string;
  ativo: boolean;

  id_funcionario?: number | null;
  id_cliente?: number | null;
}

export interface UsuarioCreate {
  email_login: string;
  senha: string; 
  role: string;
  ativo?: boolean;
  
  id_funcionario?: number;
  id_cliente?: number;
}

export interface UsuarioUpdate {
  email_login?: string;
  senha?: string; 
  role?: string;
  ativo?: boolean;
  
  id_funcionario?: number | null;
  id_cliente?: number | null;

}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: number;
  email: string;
  role: string;
}

// fucao auxiliar para buscar livro por isbn 
export const buscarLivroPorIsbn = async (isbn: string): Promise<Livro | null> => {
  const isbnLimpo = isbn.replace(/[-\s]/g, '');
  if (isbnLimpo.length < 10) {
    return null;
  }
  
  try {
    const response = await api.get(`/livro/isbn/${isbnLimpo}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Erro ao buscar livro por ISBN:', error);
    throw error;
  }
}

// interface para a entrada completa

export interface EntradaEstoqueRequest {
  id_fornecedor: number;
  id_distribuidor?: number;
  id_funcionario: number;
  livros: Array<{
    isbn_livro: string;
    titulo_livro: string;
    autor_livro: string;
    genero_literario: string;
    editora_livro: string;
    quantidade: number;
    valor_unitario: number;
  }>;
}

// interface para a saida
export interface SaidaEstoqueRequest {
  motivo_retirada: string;
  id_funcionario: number;
  itens: Array<{
    id_livro: number;
    quantidade: number;
    valor_unitario: number;
  }>;
}

// interface do Cliente
export interface Cliente {
  id_cliente: number;
  nome_cliente: string;
  cpf_cliente: string;
  data_nascimento_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
  logradouro_cliente: string;
  numero_logradouro_cliente: number;
  bairro_cliente: string;
  cidade_cliente: string;
  estado_cliente: string;
  cep_cliente: string;
  complemento_cliente: string;
}

export interface ClienteCreate {
  nome_cliente: string;
  cpf_cliente: string;
  data_nascimento_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
  logradouro_cliente: string;
  numero_logradouro_cliente: number;
  bairro_cliente: string;
  cidade_cliente: string;
  estado_cliente: string;
  cep_cliente: string;
  complemento_cliente: string;
}

// Interface para Compra
export interface Compra {
  id_compra: number;
  data_compra: string;
  hora_compra: string;
  total_bruto: number;
  desconto_aplicado: number;
  total_liquido: number;
  id_cliente: number;
  id_funcionario: number;
  id_cupom?: number;
  status_compra: string;
}

export interface CompraCreate {
  data_compra: string;
  hora_compra: string;
  total_bruto: number;
  desconto_aplicado: number;
  total_liquido: number;
  id_cliente: number;
  id_funcionario: number;
  id_cupom?: number;
  status_compra: string;
}

// Interface para ItemCompra
export interface ItemCompra {
  id_item_compra: number;
  id_compra: number;
  id_livro: number;
  quantidade_item_compra: number;
  valor_unitario_compra: number;
}

export interface ItemCompraCreate {
  id_compra: number;
  id_livro: number;
  quantidade_item_compra: number;
  valor_unitario_compra: number;
}

// Interface para Pagamento
export interface Pagamento {
  id_pagamento: number;
  id_compra: number;
  forma_pagamento: string;
  status_pagamento: string;
  data_pagamento: string;
  hora_pagamento: string;
  valor_pago: number;
}

export interface PagamentoCreate {
  id_compra: number;
  forma_pagamento: string;
  status_pagamento: string;
  data_pagamento: string;
  hora_pagamento: string;
  valor_pago: number;
}

// Interface para CompraCompletaRequest -   CORREÇÃO: Remover valor_unitario
export interface CompraCompletaRequest {
  id_cliente: number;
  id_funcionario?: number;
  itens: Array<{
    id_livro: number;
    quantidade: number;
    //   REMOVIDO: valor_unitario: number;
  }>;
  forma_pagamento: string;
  id_cupom?: number;
}

export const estoqueService = {

  // distribuidor
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

  // fornecedor
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

  // funcionario
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

  // registro de entrada
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

  // lote
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

  // livros
  buscarLivro: (livro_id: number): Promise<Livro> => 
    api.get(`/livro/${livro_id}`).then(response => response.data),

  buscarLivroPorIsbn: (isbn_livro: string): Promise<Livro> => 
    api.get(`/livro/isbn/${isbn_livro}`).then(response => response.data),

  listarLivros: (): Promise<Livro[]> => 
    api.get('/livro/').then(response => response.data),

  criarLivro: (livro: LivroCreate): Promise<Livro> => 
    api.post('/livro/', livro).then(response => response.data),

  atualizarLivro: (livro_id: number, livro: Partial<LivroCreate>): Promise<Livro> => 
    api.put(`/livro/${livro_id}`, livro).then(response => response.data),

  removerLivro: (livro_id: number): Promise<{ok: boolean}> => 
    api.delete(`/livro/${livro_id}`).then(response => response.data),

  // item do lote
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

  // retirada
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

  // item de retirada
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

  // autenticacao
  login: (credenciais: LoginRequest): Promise<LoginResponse> =>
    api.post('/login/', credenciais).then(response => response.data),
  
  getUsuarioLogado: (): Promise<Usuario> =>
    api.get('/me/').then(response => response.data),

  buscarUsuario: (usuario_id: number): Promise<Usuario> =>
    api.get(`/usuario/${usuario_id}`).then(response => response.data),
  
  listarUsuarios: (): Promise<Usuario[]> =>
    api.get('/usuario/').then(response => response.data),
  
  criarUsuario: (usuario: UsuarioCreate): Promise<Usuario> =>
    api.post('/usuario/', usuario).then(response => response.data),
  
  atualizarUsuario: (usuario_id: number, usuario: UsuarioUpdate): Promise<Usuario> =>
    api.put(`/usuario/${usuario_id}`, usuario).then(response => response.data),
  
  removerUsuario: (usuario_id: number): Promise<{ ok: boolean }> =>
    api.delete(`/usuario/${usuario_id}`).then(response => response.data),

  // cliente
  buscarCliente: (cliente_id: number): Promise<Cliente> => 
    api.get(`/cliente/${cliente_id}`).then(response => response.data),
  
  listarCliente: (): Promise<Cliente[]> => 
    api.get('/cliente/').then(response => response.data),
  
  criarCliente: (cliente: ClienteCreate): Promise<Cliente> => 
    api.post('/cliente/', cliente).then(response => response.data),
  
  atualizarCliente: (cliente_id: number, cliente: Partial<ClienteCreate>): Promise<Cliente> => 
    api.put(`/cliente/${cliente_id}`, cliente).then(response => response.data),
  
  removerCliente: (cliente_id: number): Promise<{ok: boolean}> => 
    api.delete(`/cliente/${cliente_id}`).then(response => response.data),

  criarEntradaEstoqueCompleta : async (
    dados: EntradaEstoqueRequest
  ): Promise<void> => {
    try {
      console.log('Iniciando processo de entrada de estoque:', dados);
      
      const agora = new Date();
      const dataEntrada = agora.toISOString().split('T')[0]; 
      const horaEntrada = agora.toTimeString().split(' ')[0]; 
  
      const response = await api.post('/registro_entrada/entrada_completa', {
        data_entrada: dataEntrada,
        hora_entrada: horaEntrada,
        id_fornecedor: dados.id_fornecedor,
        id_distribuidor: dados.id_distribuidor, 
        id_funcionario: dados.id_funcionario,
        livros: dados.livros 
      });

      console.log('Processo de entrada de estoque concluído com sucesso!');
  
    } catch (error) {
      console.error('Erro no processo completo de entrada de estoque:', error);
      throw new Error('Falha ao processar entrada de estoque: ' + (error as Error).message);
    }
  },

  // saida completa
  criarSaidaEstoqueCompleta: async (
    dados: SaidaEstoqueRequest
  ): Promise<void> => {
    try {
      const response = await api.post('/retirada/saida_completa', {
        motivo_retirada: dados.motivo_retirada,
        id_funcionario: dados.id_funcionario,
        itens: dados.itens
      });
    
      console.log('Processo de saída de estoque concluído com sucesso!');
    } catch (error) {
      console.error('Erro no processo completo de saída de estoque:', error);
      throw new Error('Falha ao processar saída de estoque: ' + (error as Error).message);
    }
  },

  // COMPRAS
  criarCompra: (compra: CompraCreate): Promise<Compra> =>
    api.post('/compra/', compra).then(response => response.data),

  buscarCompra: (compra_id: number): Promise<Compra> =>
    api.get(`/compra/${compra_id}`).then(response => response.data),

  listarCompras: (): Promise<Compra[]> =>
    api.get('/compra/').then(response => response.data),

  // ITENS COMPRA
  criarItemCompra: (itemCompra: ItemCompraCreate): Promise<ItemCompra> =>
    api.post('/item_compra/', itemCompra).then(response => response.data),

  listarItensCompra: (compra_id: number): Promise<ItemCompra[]> =>
    api.get(`/item_compra/${compra_id}`).then(response => response.data),

  // PAGAMENTOS
  criarPagamento: (pagamento: PagamentoCreate): Promise<Pagamento> =>
    api.post('/pagamento/', pagamento).then(response => response.data),

  //   CORREÇÃO COMPLETA: criarCompraCompleta
  criarCompraCompleta: async (dados: CompraCompletaRequest): Promise<{compra: Compra, pagamento: Pagamento}> => {
    try {
      console.log('📤 Iniciando processo de compra completa:', dados);
      
      //   Dados para a compra (sem valor_unitario)
      const compraData = {
        id_cliente: dados.id_cliente,
        id_funcionario: dados.id_funcionario || 1,
        id_cupom: dados.id_cupom,
        itens: dados.itens.map(item => ({
          id_livro: item.id_livro,
          quantidade: item.quantidade
        }))
      };

      console.log('📦 Dados enviados para /compra/completa:', compraData);

      const compra = await api.post('/compra/completa', compraData)
        .then(response => response.data);

      console.log('  Compra criada (Aguardando pagamento):', compra);

      const agora = new Date();
      const dataAtual = agora.toISOString().split('T')[0];
      const horaAtual = agora.toTimeString().split(' ')[0];

      //   Dados para o pagamento
      const pagamentoData = {
        id_compra: compra.id_compra,
        forma_pagamento: dados.forma_pagamento,
        status_pagamento: 'PENDENTE',
        data_pagamento: dataAtual,
        hora_pagamento: horaAtual,
        valor_pago: compra.total_liquido
      };

      console.log('💰 Dados enviados para /pagamento/:', pagamentoData);

      const pagamento = await api.post('/pagamento/', pagamentoData)
        .then(response => response.data);

      console.log('  Pagamento criado (Pendente):', pagamento);

      return { compra, pagamento };
    } catch (error: any) {
      //   MELHOR TRATAMENTO DE ERRO
      console.error('  Erro no processo de compra completa:', error);
      
      if (error.response) {
        console.error('  Detalhes do erro:', error.response.data);
        console.error('  Status:', error.response.status);
      }
      
      throw new Error('Falha ao processar compra: ' + 
        (error.response?.data?.detail || error.response?.data?.message || error.message));
    }
  },

  // CONFIRMAR PAGAMENTO
  confirmarPagamento: async (idCompra: number, formaPagamento: string): Promise<{compra: Compra, pagamento: Pagamento}> => {
    try {
      console.log(` Confirmando pagamento da compra ${idCompra}`);
      
      const agora = new Date();
      const dataAtual = agora.toISOString().split('T')[0];
      const horaAtual = agora.toTimeString().split(' ')[0];

      // 1. Buscar compra para pegar o total
      const compra = await api.get(`/compra/${idCompra}`).then(response => response.data);

      // 2. Atualizar compra para status PAGO
      const compraAtualizada = await api.put(`/compra/${idCompra}`, {
        status_compra: "PAGO"
      }).then(response => response.data);

      // 3. Atualizar pagamento para CONFIRMADO
      const pagamento = await api.put(`/pagamento/compra/${idCompra}`, {
        forma_pagamento: formaPagamento,
        status_pagamento: 'CONFIRMADO',
        data_pagamento: dataAtual,
        hora_pagamento: horaAtual,
        valor_pago: compra.total_liquido
      }).then(response => response.data);

      console.log('  Pagamento confirmado:', pagamento);

      return { compra: compraAtualizada, pagamento };
    } catch (error: any) {
      console.error('  Erro ao confirmar pagamento:', error);
      throw new Error('Falha ao confirmar pagamento: ' + 
        (error.response?.data?.detail || error.message));
    }
  },

  // LISTAR COMPRAS PENDENTES
  listarComprasPendentes: (): Promise<Compra[]> =>
    api.get('/compra/pendentes/').then(response => response.data)

};