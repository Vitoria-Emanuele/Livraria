from sqlalchemy.orm import Session
from .. import models
from ..schemas import spagamento
from datetime import datetime

# Listar todos


def listar_pagamentos(db: Session):
    return db.query(models.Pagamento).all()

# Buscar por ID


def buscar_pagamento(db: Session, pagamento_id: int):
    return db.query(models.Pagamento).filter(models.Pagamento.id_pagamento == pagamento_id).first()

# Atualizar (parcial)


def atualizar_pagamento(db: Session, pagamento_id: int, pagamento_update: spagamento.PagamentoUpdate):
    db_pagamento = buscar_pagamento(db, pagamento_id)
    if not db_pagamento:
        return None
    for key, value in pagamento_update.model_dump(exclude_unset=True).items():
        setattr(db_pagamento, key, value)
    db.flush()
    return db_pagamento

# Remover


def remover_pagamento(db: Session, pagamento_id: int):
    db_pagamento = buscar_pagamento(db, pagamento_id)
    if db_pagamento:
        db.delete(db_pagamento)
        return True
    return False

# Criar pagamento (manual)


def criar_pagamento(db: Session, pagamento: spagamento.PagamentoCreate):
    compra = db.query(models.Compra).filter(
        models.Compra.id_compra == pagamento.id_compra).first()
    if not compra:
        raise Exception(f"Compra com ID {pagamento.id_compra} não encontrada")

    existing = db.query(models.Pagamento).filter(
        models.Pagamento.id_compra == pagamento.id_compra).first()
    if existing:
        raise Exception(
            f"Já existe pagamento para a compra {pagamento.id_compra}")

    db_pagamento = models.Pagamento(**pagamento.model_dump())
    db.add(db_pagamento)
    db.flush()
    return db_pagamento


def confirmar_pagamento(db: Session, pagamento_dados: spagamento.PagamentoConfirmacao):
    compra = db.query(models.Compra).filter(
        models.Compra.id_compra == pagamento_dados.id_compra).first()

    if not compra:
        raise Exception("Compra não encontrada")

    if compra.status_compra != "AGUARDANDO_PAGAMENTO":
        raise Exception(
            f"Não é possível confirmar pagamento. Status atual: {compra.status_compra}")

    novo_pagamento = models.Pagamento(
        id_compra=pagamento_dados.id_compra,
        forma_pagamento=pagamento_dados.forma_pagamento,
        status_pagamento="CONFIRMADO",
        valor_pago=compra.total_liquido,
        data_pagamento=datetime.now().date(),
        hora_pagamento=datetime.now().time()
    )
    db.add(novo_pagamento)

    compra.status_compra = "PAGO"
    db.flush()
    return compra


def cancelar_pagamento(db: Session, id_compra: int):
    compra = db.query(models.Compra).filter(
        models.Compra.id_compra == id_compra).first()

    if not compra:
        raise Exception("Compra não encontrada")

    if compra.status_compra == "CANCELADO":
        raise Exception("Compra já está cancelada")

    compra.status_compra = "CANCELADO"

    pagamento = db.query(models.Pagamento).filter(
        models.Pagamento.id_compra == id_compra).first()
    if pagamento:
        pagamento.status_pagamento = "CANCELADO"

    db.flush()
    return compra

# Buscar pagamento por ID da compra


def buscar_pagamento_por_compra(db: Session, compra_id: int):
    return db.query(models.Pagamento).filter(
        models.Pagamento.id_compra == compra_id
    ).first()

# Atualizar pagamento por ID da compra


def atualizar_pagamento_por_compra(db: Session, compra_id: int, pagamento_update: spagamento.PagamentoUpdate):
    db_pagamento = buscar_pagamento_por_compra(db, compra_id)
    if not db_pagamento:
        return None

    # Atualiza os campos
    for key, value in pagamento_update.model_dump(exclude_unset=True).items():
        setattr(db_pagamento, key, value)

    db.flush()
    return db_pagamento
