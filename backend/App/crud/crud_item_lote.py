from sqlalchemy.orm import Session
from .. import models
from ..schemas import sitem_lote


# Listar todos


def listar_item_lote(db: Session):
    return db.query(models.item_lote).all()

# Buscar por ID


def buscar_item_lote(db: Session, item_lote_id: int):
    return db.query(models.item_lote).filter(models.item_lote.id_item_lote == item_lote_id).first()

# Atualizar


def atualizar_item_lote(db: Session, item_lote_id: int, item_lote_update: sitem_lote.item_loteUpdate):
    db_item_lote = buscar_item_lote(db, item_lote_id)
    if not db_item_lote:
        return None
    for key, value in item_lote_update.model_dump(exclude_unset=True).items():
        setattr(db_item_lote, key, value)

    db.flush()
    return db_item_lote

# Remover


def remover_item_lote(db: Session, item_lote_id: int):
    db_item_lote = buscar_item_lote(db, item_lote_id)
    if db_item_lote:
        db.delete(db_item_lote)

        return True
    return False

# Criar item_lote


def criar_item_lote(db: Session, item_lote: sitem_lote.item_loteCreate):
    db_item_lote = models.item_lote(**item_lote.model_dump())
    db.add(db_item_lote)

    db.flush()
    return db_item_lote
