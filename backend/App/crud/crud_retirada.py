from sqlalchemy.orm import Session
from .. import models
from ..schemas import sretirada

# Criar Retirada


def criar_retirada(db: Session, retirada: sretirada.RetiradaCreate):
    db_retirada = models.Retirada(**retirada.dict())
    db.add(db_retirada)
    db.commit()
    db.refresh(db_retirada)
    return db_retirada

# Listar todos


def listar_retiradas(db: Session):
    return db.query(models.Retirada).all()

# Buscar por ID


def buscar_retirada(db: Session, retirada_id: int):
    return db.query(models.Retirada).filter(models.Retiradaetirada.id_retirada == retirada_id).first()

# Atualizar


def atualizar_retirada(db: Session, retirada_id: int, retirada_update: sretirada.RetiradaUpdate):
    db_retirada = buscar_retirada(db, retirada_id)
    if not db_retirada:
        return None
    for key, value in retirada_update.dict(exclude_unset=True).items():
        setattr(db_retirada, key, value)
    db.commit()
    db.refresh(db_retirada)
    return db_retirada

# Remover


def remover_retirada(db: Session, retirada_id: int):
    db_retirada = buscar_retirada(db, retirada_id)
    if db_retirada:
        db.delete(db_retirada)
        db.commit()
        return True
    return False
