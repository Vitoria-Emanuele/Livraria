from sqlalchemy.orm import Session
from .. import models
from ..schemas import scupom


# Listar todos
def listar_cupons(db: Session):
    return db.query(models.Cupom).all()


# Buscar por ID
def buscar_cupom(db: Session, cupom_id: int):
    return db.query(models.Cupom).filter(models.Cupom.id_cupom == cupom_id).first()


# Atualizar
def atualizar_cupom(db: Session, cupom_id: int, cupom_update: scupom.CupomUpdate):
    db_cupom = buscar_cupom(db, cupom_id)
    if not db_cupom:
        return None

    for key, value in cupom_update.model_dump(exclude_unset=True).items():
        setattr(db_cupom, key, value)

    db.flush()
    return db_cupom


# Remover
def remover_cupom(db: Session, cupom_id: int):
    db_cupom = buscar_cupom(db, cupom_id)
    if db_cupom:
        db.delete(db_cupom)
        return True
    return False


# Criar cupom
def criar_cupom(db: Session, cupom: scupom.CupomCreate):
    db_cupom = models.Cupom(**cupom.model_dump())
    db.add(db_cupom)

    db.flush()
    return db_cupom
