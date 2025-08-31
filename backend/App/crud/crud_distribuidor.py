from sqlalchemy.orm import Session
from ..schemas import sdistribuidor
from .. import models


# Criar distribuidor


def criar_distribuidor(db: Session, distribuidor: sdistribuidor.DistribuidorCreate):
    db_distribuidor = models.Distribuidor(**distribuidor.dict())
    db.add(db_distribuidor)
    db.commit()
    db.refresh(db_distribuidor)
    return db_distribuidor

# Listar todos


def listar_distribuidores(db: Session):
    return db.query(models.Distribuidor).all()

# Buscar por ID


def buscar_distribuidor(db: Session, distribuidor_id: int):
    return db.query(models.Distribuidor).filter(models.Distribuidor.id_distribuidor == distribuidor_id).first()

# Atualizar


def atualizar_distribuidor(db: Session, distribuidor_id: int, distribuidor_update: sdistribuidor.DistribuidorUpdate):
    db_distribuidor = buscar_distribuidor(db, distribuidor_id)
    if not db_distribuidor:
        return None
    for key, value in distribuidor_update.dict(exclude_unset=True).items():
        setattr(db_distribuidor, key, value)
    db.commit()
    db.refresh(db_distribuidor)
    return db_distribuidor

# Remover


def remover_distribuidor(db: Session, distribuidor_id: int):
    db_distribuidor = buscar_distribuidor(db, distribuidor_id)
    if db_distribuidor:
        db.delete(db_distribuidor)
        db.commit()
        return True
    return False
