from sqlalchemy.orm import Session
from .. import models
from ..schemas import scompra
from datetime import date, datetime

# Listar todos


def listar_compras(db: Session):
    return db.query(models.Compra).all()

# Buscar por ID


def buscar_compra(db: Session, compra_id: int):
    return db.query(models.Compra).filter(models.Compra.id_compra == compra_id).first()

# Atualizar


def atualizar_compra(db: Session, compra_id: int, compra_update: scompra.CompraUpdate):
    db_compra = buscar_compra(db, compra_id)
    if not db_compra:
        return None
    for key, value in compra_update.model_dump(exclude_unset=True).items():
        setattr(db_compra, key, value)
    db.flush()
    return db_compra

# Remover


def remover_compra(db: Session, compra_id: int):
    db_compra = buscar_compra(db, compra_id)
    if db_compra:
        db.delete(db_compra)
        return True
    return False

# Criar compra simples (sem itens/pagamento)


def criar_compra(db: Session, compra: scompra.CompraCreate):
    db_compra = models.Compra(**compra.model_dump())
    db.add(db_compra)
    db.flush()
    return db_compra


def criar_compra_completa(db: Session, compra_completa: scompra.CompraCompletaCreate):
    total_bruto = 0

    # Calcula total com base no valor de venda do livro
    for item in compra_completa.itens:
        livro = db.query(models.Livro).filter(
            models.Livro.id_livro == item.id_livro).first()
        if not livro:
            raise Exception(f"Livro com ID {item.id_livro} não encontrado")

        total_bruto += item.quantidade * livro.valor_venda

    # Desconto se tiver cupom
    desconto_aplicado = 0
    if getattr(compra_completa, "id_cupom", None):
        cupom = db.query(models.Cupom).filter(
            models.Cupom.id_cupom == compra_completa.id_cupom).first()
        if not cupom:
            raise Exception(
                f"Cupom com ID {compra_completa.id_cupom} não encontrado")

        if cupom.data_validade < date.today():
            raise Exception("Cupom expirado")

        desconto_aplicado = (
            float(cupom.percentual_desconto) / 100) * float(total_bruto)

    total_liquido = total_bruto - desconto_aplicado

    # Cria a compra
    hoje = date.today()
    agora = datetime.now().time()
    db_compra = models.Compra(
        data_compra=hoje,
        hora_compra=agora,
        total_bruto=total_bruto,
        desconto_aplicado=desconto_aplicado,
        total_liquido=total_liquido,
        id_cliente=compra_completa.id_cliente,
        id_funcionario=compra_completa.id_funcionario,
        id_cupom=compra_completa.id_cupom if getattr(
            compra_completa, "id_cupom", None) else None,
        status_compra="AGUARDANDO_PAGAMENTO"
    )
    db.add(db_compra)
    db.flush()

    # Cria os itens
    for item in compra_completa.itens:
        livro = db.query(models.Livro).filter(
            models.Livro.id_livro == item.id_livro).first()

        if livro.estoque_atual < item.quantidade:
            raise Exception(
                f"Estoque insuficiente para livro ID {item.id_livro}")

        db_item = models.item_compra(
            id_compra=db_compra.id_compra,
            id_livro=item.id_livro,
            quantidade_item_compra=item.quantidade,
            valor_unitario_compra=livro.valor_venda
        )
        db.add(db_item)
        livro.estoque_atual -= item.quantidade

    db.commit()
    db.refresh(db_compra)

    return db_compra


def listar_compras_pendentes(db: Session):
    return db.query(models.Compra).filter(
        models.Compra.status_compra == "AGUARDANDO_PAGAMENTO"
    ).all()
