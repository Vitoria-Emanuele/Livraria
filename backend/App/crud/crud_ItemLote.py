from sqlalchemy.orm import Session
from .. import models
from ..schemas import sitemlote

# Criar ItemLote


def criar_ItemLote(db: Session, ItemLote: sitemlote.ItemLoteCreate):
    db_ItemLote = models.ItemLote(**ItemLote.dict())
    db.add(db_ItemLote)
    db.commit()
    db.refresh(db_ItemLote)
    return db_ItemLote

# Listar todos


def listar_ItemLote(db: Session):
    return db.query(models.ItemLote).all()

# Buscar por ID


def buscar_ItemLote(db: Session, ItemLote_id: int):
    return db.query(models.ItemLote).filter(models.ItemLote.id_ItemLote == ItemLote_id).first()

# Atualizar


def atualizar_ItemLote(db: Session, ItemLote_id: int, ItemLote_update: sitemlote.ItemLoteUpdate):
    db_ItemLote = buscar_ItemLote(db, ItemLote_id)
    if not db_ItemLote:
        return None
    for key, value in ItemLote_update.dict(exclude_unset=True).items():
        setattr(db_ItemLote, key, value)
    db.commit()
    db.refresh(db_ItemLote)
    return db_ItemLote

# Remover


def remover_ItemLote(db: Session, ItemLote_id: int):
    db_ItemLote = buscar_ItemLote(db, ItemLote_id)
    if db_ItemLote:
        db.delete(db_ItemLote)
        db.commit()
        return True
    return False
