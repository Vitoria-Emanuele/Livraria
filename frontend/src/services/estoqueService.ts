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
  data_entrada: string;
  hora_entrada: string;
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
  isbn_livro: string;
  titulo_livro: string;
  autor_livro: string;
  genero_literario: string;
  editora_livro: string;
  estoque_atual: number;
}

export interface LivroCreate {
  isbn_livro: string;
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
  quantidade_item_lote: number;         
  valor_item_lote: number;     
}

export interface ItemLoteCreate {
  id_lote: number;
  id_livro: number;
  quantidade_item_lote: number;
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

// Interface do Usuario
export interface Usuario {
  id_usuario: number;
  email_login: string;
  senha_hash: string;
  role: string;
  ativo: boolean;
  id_funcionario: number;
}

export interface UsuarioCreate {
  email_login: string;
  senha: string; 
  role: string;
  ativo: boolean;
  id_funcionario: number;
}

export interface UsuarioUpdate {
  email_login?: string;
  senha?: string; 
  role?: string;
  ativo?: boolean;
  id_funcionario?: number;
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

// Função auxiliar para buscar livro por ISBN com tratamento de erro
export const buscarLivroPorIsbn = async (isbn: string): Promise<Livro | null> => {
  const isbnLimpo = isbn.replace(/[-\s]/g, '');
  
  // Validação do ISBN
  if (isbnLimpo.length < 10) {
    return null;
  }
  
  try {
    // Usa o endpoint específico para ISBN
    const response = await api.get(`/livro/isbn/${isbnLimpo}`);
    return response.data;
  } catch (error: any) {
    // Livro não encontrado
    if (error.response?.status === 404) {
      return null;
    }
    
    // Outros erros
    console.error('Erro ao buscar livro por ISBN:', error);
    throw error;
  }
}

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

export interface SaidaEstoqueRequest {
  motivo_retirada: string;
  id_funcionario: number;
  itens: Array<{
    id_livro: number;
    quantidade: number;
    valor_unitario: number;
  }>;
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

  // Autenticacao
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



  criarEntradaEstoqueCompleta : async (
    dados: EntradaEstoqueRequest
  ): Promise<void> => {
    try {
      console.log('Iniciando processo de entrada de estoque:', dados);
      
      const agora = new Date();
      const dataEntrada = agora.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const horaEntrada = agora.toTimeString().split(' ')[0]; // "HH:MM:SS"

  
      // Criar REGISTRO_ENTRADA (com data/hora automática no backend)
      const registroEntrada = await estoqueService.criarRegistroEntrada({
        data_entrada: dataEntrada,
        hora_entrada: horaEntrada,
        id_fornecedor: dados.id_fornecedor,
        id_distribuidor: dados.id_distribuidor,
        id_funcionario: dados.id_funcionario
      });
  
      console.log('Registro entrada criado:', registroEntrada);
  
      // 2. Calcular totais para LOTE
      const valorTotal = dados.livros.reduce((total, livro) => 
        total + (livro.quantidade * livro.valor_unitario), 0);
      
      const quantidadeTotal = dados.livros.reduce((total, livro) => 
        total + livro.quantidade, 0);
  
      console.log('Totais do lote - Valor:', valorTotal, 'Quantidade:', quantidadeTotal);
  
      // 3. Criar LOTE vinculado ao registro_entrada
      const lote = await estoqueService.criarLote({
        valor_lote: valorTotal,
        quantidade_itens_lote: quantidadeTotal,
        id_entrada: registroEntrada.id_entrada
      });
  
      console.log('Lote criado:', lote);
  
      // 4. Processar cada livro
      for (const [index, livro] of dados.livros.entries()) {
        console.log(`Processando livro ${index + 1}/${dados.livros.length}:`, livro.isbn_livro);
  
        // Verificar se livro já existe
        const isbnLimpo = livro.isbn_livro.replace(/[-\s]/g, '');
        let livroExistente = await buscarLivroPorIsbn(isbnLimpo);
        
        if (!livroExistente) {
          // Livro NOVO: criar com estoque inicial
          console.log('Livro não encontrado, criando novo...');
          livroExistente = await estoqueService.criarLivro({
            isbn_livro: isbnLimpo,
            titulo_livro: livro.titulo_livro,
            autor_livro: livro.autor_livro,
            genero_literario: livro.genero_literario,
            editora_livro: livro.editora_livro,
            estoque_atual: livro.quantidade
          });
          console.log('Novo livro criado:', livroExistente);
        } else {
          // Livro EXISTENTE: atualizar estoque
          console.log('Livro existente encontrado, atualizando estoque...');
          await estoqueService.atualizarLivro(livroExistente.id_livro, {
            estoque_atual: livroExistente.estoque_atual + livro.quantidade
          });
          console.log('Estoque atualizado para:', livroExistente.estoque_atual + livro.quantidade);
        }
  
        // 5. Criar ITEM_LOTE
        console.log('Criando item do lote...');
        const itemLote = await estoqueService.criarItemLote({
          id_lote: lote.id_lote,
          id_livro: livroExistente.id_livro,
          quantidade_item_lote: livro.quantidade,
          valor_item_lote: livro.valor_unitario
        });
        console.log('Item lote criado:', itemLote);
      }
  
      console.log('Processo de entrada de estoque concluído com sucesso!');
  
    } catch (error) {
      console.error('Erro no processo completo de entrada de estoque:', error);
      throw new Error('Falha ao processar entrada de estoque: ' + (error as Error).message);
    }

  },

  // Saida completa
  criarSaidaEstoqueCompleta: async (
    dados: SaidaEstoqueRequest
  ): Promise<void> => {
    try {
      console.log('Iniciando processo de saída de estoque:', dados);

      // 1. Criar RETIRADA (com data/hora automática)
      const retirada = await estoqueService.criarRetirada({
        motivo_retirada: dados.motivo_retirada,
        data_retirada: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
        hora_retirada: new Date().toTimeString().split(' ')[0], // formato HH:MM:SS
        id_funcionario: dados.id_funcionario
      });

      console.log('Retirada criada:', retirada);

      // 2. Processar cada item da retirada
      for (const item of dados.itens) {
        console.log('Processando item:', item);

        // Verificar se o livro existe e tem estoque suficiente
        const livro = await estoqueService.buscarLivro(item.id_livro);
        if (!livro) {
          throw new Error(`Livro com ID ${item.id_livro} não encontrado`);
        }

        if (livro.estoque_atual < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${livro.titulo_livro}. Disponível: ${livro.estoque_atual}, Solicitado: ${item.quantidade}`);
        }

        // 3. Criar ITEM_RETIRADA
        const itemRetirada = await estoqueService.criarItemRetirada({
          id_retirada: retirada.id_retirada,
          id_livro: item.id_livro,
          quantidade_itens_retirada: item.quantidade,
          valor_unitario_retirada: item.valor_unitario
        });

        console.log('Item retirada criado:', itemRetirada);

        // 4. Atualizar estoque do livro (subtrair a quantidade)
        const novoEstoque = livro.estoque_atual - item.quantidade;
        await estoqueService.atualizarLivro(item.id_livro, {
          estoque_atual: novoEstoque
        });

        console.log(`Estoque atualizado: ${livro.titulo_livro} - ${livro.estoque_atual} → ${novoEstoque}`);
      }

      console.log('Processo de saída de estoque concluído com sucesso!');

    } catch (error) {
      console.error('Erro no processo completo de saída de estoque:', error);
      throw new Error('Falha ao processar saída de estoque: ' + (error as Error).message);
    }
  }


};