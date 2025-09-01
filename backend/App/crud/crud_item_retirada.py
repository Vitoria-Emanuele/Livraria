from sqlalchemy.orm import Session
from .. import models
from ..schemas import sitem_retirada

# Listar todos


def listar_item_retirada(db: Session):
    return db.query(models.item_retirada).all()

# Buscar por ID


def buscar_item_retirada(db: Session, item_retirada_id: int):
    return db.query(models.item_retirada).filter(models.item_retirada.id_item_retirada == item_retirada_id).first()

# Atualizar


def atualizar_item_retirada(db: Session, item_retirada_id: int, item_retirada_update: sitem_retirada.item_retiradaUpdate):
    db_item_retirada = buscar_item_retirada(db, item_retirada_id)
    if not db_item_retirada:
        return None
    for key, value in item_retirada_update.model_dump(exclude_unset=True).items():
        setattr(db_item_retirada, key, value)
    db.commit()
    db.refresh(db_item_retirada)
    return db_item_retirada

# Remover


def remover_item_retirada(db: Session, item_retirada_id: int):
    db_item_retirada = buscar_item_retirada(db, item_retirada_id)
    if db_item_retirada:
        db.delete(db_item_retirada)
        db.commit()
        return True
    return False

# Criar item_retirada


def criar_item_retirada(db: Session, item_retirada: sitem_retirada.item_retiradaCreate):
    db_item_retirada = models.item_retirada(**item_retirada.model_dump())
    db.add(db_item_retirada)
    db.commit()
    db.refresh(db_item_retirada)
    return db_item_retirada
