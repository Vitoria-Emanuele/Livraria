from sqlalchemy.orm import Session
from .. import models
from ..schemas import sregistroentrada


# Listar todos


def listar_registro_entrada(db: Session):
    return db.query(models.registro_entrada).all()

# Buscar por ID


def buscar_registro_entrada(db: Session, registro_entrada_id: int):
    return db.query(models.registro_entrada).filter(models.registro_entrada.id_registro_entrada == registro_entrada_id).first()

# Atualizar


def atualizar_registro_entrada(db: Session, registro_entrada_id: int, registro_entrada_update: sregistroentrada.registro_entradaUpdate):
    db_registro_entrada = buscar_registro_entrada(db, registro_entrada_id)
    if not db_registro_entrada:
        return None
    for key, value in registro_entrada_update.model_dump(exclude_unset=True).items():
        setattr(db_registro_entrada, key, value)
    db.flush()
    return db_registro_entrada

# Remover


def remover_registro_entrada(db: Session, registro_entrada_id: int):
    db_registro_entrada = buscar_registro_entrada(db, registro_entrada_id)
    if db_registro_entrada:
        db.delete(db_registro_entrada)
        return True
    return False

# Criar registro de entrada


def criar_registro_entrada(db: Session, registro_entrada: sregistroentrada.registro_entradaCreate):
    db_registro_entrada = models.registro_entrada(
        **registro_entrada.model_dump())
    db.add(db_registro_entrada)
    db.flush()
    return db_registro_entrada

# criar_entrada_completa (transacional)


def criar_entrada_completa(db: Session, entrada_completa: sregistroentrada.EntradaCompletaCreate):

    db_registro = models.registro_entrada(
        data_entrada=entrada_completa.data_entrada,
        hora_entrada=entrada_completa.hora_entrada,
        id_fornecedor=entrada_completa.id_fornecedor,
        id_distribuidor=entrada_completa.id_distribuidor,
        id_funcionario=entrada_completa.id_funcionario
    )
    db.add(db_registro)
    db.flush()

    valor_total = sum(item.quantidade *
                      item.valor_unitario for item in entrada_completa.livros)
    quantidade_total = sum(item.quantidade for item in entrada_completa.livros)

    db_lote = models.Lote(
        valor_lote=valor_total,
        quantidade_itens_lote=quantidade_total,
        id_entrada=db_registro.id_entrada
    )
    db.add(db_lote)
    db.flush()

    for livro_data in entrada_completa.livros:
        livro_existente = db.query(models.Livro).filter(
            models.Livro.isbn_livro == livro_data.isbn_livro
        ).first()

        if livro_existente:
            livro_existente.estoque_atual += livro_data.quantidade
        else:
            livro_existente = models.Livro(
                isbn_livro=livro_data.isbn_livro,
                titulo_livro=livro_data.titulo_livro,
                autor_livro=livro_data.autor_livro,
                genero_literario=livro_data.genero_literario,
                editora_livro=livro_data.editora_livro,
                estoque_atual=livro_data.quantidade
            )
            db.add(livro_existente)
            db.flush()

        db_item_lote = models.item_lote(
            id_lote=db_lote.id_lote,
            id_livro=livro_existente.id_livro,
            quantidade_item_lote=livro_data.quantidade,
            valor_item_lote=livro_data.valor_unitario
        )
        db.add(db_item_lote)

    return db_registro
