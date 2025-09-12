from sqlalchemy import Column, Integer, String, Numeric, Date, Time, ForeignKey, Boolean
from .db import Base


class Distribuidor(Base):
    __tablename__ = "distribuidor"
    __table_args__ = {"schema": "estoque"}

    id_distribuidor = Column(Integer, primary_key=True, index=True)
    cnpj_distribuidor = Column(String(14), unique=True, nullable=False)
    nome_fantasia_distribuidor = Column(String(100), nullable=False)
    razao_social_distribuidor = Column(String(100), nullable=False)
    email_distribuidor = Column(String(100), nullable=False)
    telefone_distribuidor = Column(String(20), nullable=False)
    logradouro_distribuidor = Column(String(100), nullable=False)
    numero_logradouro_distribuidor = Column(Integer, nullable=False)
    bairro_distribuidor = Column(String(100), nullable=False)
    cidade_distribuidor = Column(String(50), nullable=False)
    estado_distribuidor = Column(String(2), nullable=False)
    cep_distribuidor = Column(String(10), nullable=False)
    complemento_distribuidor = Column(String(50), nullable=True)


class Fornecedor(Base):
    __tablename__ = "fornecedor"
    __table_args__ = {"schema": "estoque"}

    id_fornecedor = Column(Integer, primary_key=True, index=True)
    cnpj_fornecedor = Column(String(14), unique=True, nullable=False)
    nome_fantasia_fornecedor = Column(String(100), nullable=False)
    razao_social_fornecedor = Column(String(100), nullable=False)
    email_fornecedor = Column(String(100), nullable=False)
    telefone_fornecedor = Column(String(20), nullable=False)
    logradouro_fornecedor = Column(String(100), nullable=False)
    numero_logradouro_fornecedor = Column(Integer, nullable=False)
    bairro_fornecedor = Column(String(100), nullable=False)
    cidade_fornecedor = Column(String(50), nullable=False)
    estado_fornecedor = Column(String(2), nullable=False)
    cep_fornecedor = Column(String(10), nullable=False)
    complemento_fornecedor = Column(String(50), nullable=True)


class Funcionario(Base):
    __tablename__ = "funcionario"
    __table_args__ = {"schema": "estoque"}

    id_funcionario = Column(Integer, primary_key=True, index=True)
    nome_funcionario = Column(String(100), nullable=False)
    ctps_funcionario = Column(String(12), unique=True, nullable=False)
    cpf_funcionario = Column(String(14), unique=True, nullable=False)
    setor = Column(String(50), nullable=False)
    cargo = Column(String(50), nullable=False)
    salario = Column(Numeric(9, 2), nullable=False)
    telefone_funcionario = Column(String(20), nullable=False)
    email_funcionario = Column(String(100), nullable=False)
    logradouro_funcionario = Column(String(100), nullable=False)
    numero_logradouro_funcionario = Column(Integer, nullable=False)
    bairro_funcionario = Column(String(100), nullable=False)
    cidade_funcionario = Column(String(50), nullable=False)
    estado_funcionario = Column(String(2), nullable=False)
    cep_funcionario = Column(String(10), nullable=False)
    complemento_funcionario = Column(String(50), nullable=True)


class Usuario(Base):
    __tablename__ = "usuario"
    __table_args__ = {"schema": "estoque"}
    id_usuario = Column(Integer, primary_key=True, index=True)
    email_login = Column(String(100), nullable=False, unique=True, index=True)
    senha_hash = Column(String(200), nullable=False)
    role = Column(String(20), nullable=False)
    ativo = Column(Boolean, nullable=False, default=True)
    id_funcionario = Column(Integer, ForeignKey(
        "estoque.funcionario.id_funcionario"), nullable=False, unique=True)


class registro_entrada(Base):
    __tablename__ = "registro_entrada"
    __table_args__ = {"schema": "estoque"}

    id_entrada = Column(Integer, primary_key=True, index=True)
    data_entrada = Column(Date, nullable=False)
    hora_entrada = Column(Time, nullable=False)
    id_distribuidor = Column(Integer, ForeignKey(
        "estoque.distribuidor.id_distribuidor"), nullable=True)
    id_fornecedor = Column(Integer, ForeignKey(
        "estoque.fornecedor.id_fornecedor"), nullable=False)
    id_funcionario = Column(Integer, ForeignKey(
        "estoque.funcionario.id_funcionario"), nullable=False)


class Lote(Base):
    __tablename__ = "lote"
    __table_args__ = {"schema": "estoque"}

    id_lote = Column(Integer, primary_key=True, index=True)
    valor_lote = Column(Numeric(12, 2), nullable=False)
    quantidade_itens_lote = Column(Integer, nullable=False)
    id_entrada = Column(Integer, ForeignKey(
        "estoque.registro_entrada.id_entrada"), nullable=False)


class Livro(Base):
    __tablename__ = "livro"
    __table_args__ = {"schema": "estoque"}

    id_livro = Column(Integer, primary_key=True, index=True)
    isbn_livro = Column(String(17), unique=True, nullable=False)
    titulo_livro = Column(String(200), nullable=False)
    autor_livro = Column(String(100), nullable=False)
    genero_literario = Column(String(50), nullable=False)
    editora_livro = Column(String(100), nullable=False)
    estoque_atual = Column(Integer, nullable=False, default=0)


class item_lote(Base):
    __tablename__ = "item_lote"
    __table_args__ = {"schema": "estoque"}

    id_lote = Column(Integer, ForeignKey("estoque.lote.id_lote"),
                     primary_key=True, nullable=False)
    id_livro = Column(Integer, ForeignKey(
        "estoque.livro.id_livro"), primary_key=True, nullable=False)
    quantidade_item_lote = Column(Integer, nullable=False)
    valor_item_lote = Column(Numeric(9, 2), nullable=False)


class Retirada(Base):
    __tablename__ = "retirada"
    __table_args__ = {"schema": "estoque"}

    id_retirada = Column(Integer, primary_key=True, index=True)
    motivo_retirada = Column(String(50), nullable=False)
    data_retirada = Column(Date, nullable=False)
    hora_retirada = Column(Time, nullable=False)
    id_funcionario = Column(Integer, ForeignKey(
        "estoque.funcionario.id_funcionario"), nullable=False)


class item_retirada(Base):
    __tablename__ = "item_retirada"
    __table_args__ = {"schema": "estoque"}

    id_livro = Column(Integer, ForeignKey(
        "estoque.livro.id_livro"), primary_key=True, nullable=False)
    id_retirada = Column(Integer, ForeignKey(
        "estoque.retirada.id_retirada"), primary_key=True, nullable=False)
    quantidade_itens_retirada = Column(Integer, nullable=False)
    valor_unitario_retirada = Column(Numeric(9, 2), nullable=False)
