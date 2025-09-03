from sqlalchemy.orm import Session
from .. import models
from ..schemas import slote


# Listar todos


def listar_lote(db: Session):
    return db.query(models.Lote).all()

# Buscar por ID


def buscar_lote(db: Session, lote_id: int):
    return db.query(models.Lote).filter(models.Lote.id_lote == lote_id).first()

# Atualizar


def atualizar_lote(db: Session, lote_id: int, lote_update: slote.LoteUpdate):
    db_lote = buscar_lote(db, lote_id)
    if not db_lote:
        return None
    for key, value in lote_update.model_dump(exclude_unset=True).items():
        setattr(db_lote, key, value)
    db.commit()
    db.refresh(db_lote)
    return db_lote

# Remover


def remover_lote(db: Session, lote_id: int):
    db_lote = buscar_lote(db, lote_id)
    if db_lote:
        db.delete(db_lote)
        db.commit()
        return True
    return False

# Criar lote


def criar_lote(db: Session, lote: slote.LoteCreate):
    db_lote = models.Lote(**lote.model_dump())
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return db_lote
