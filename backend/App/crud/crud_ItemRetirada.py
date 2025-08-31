from sqlalchemy.orm import Session
from .. import models
from ..schemas import sitemretirada

# Listar todos


def listar_ItensRetirada(db: Session):
    return db.query(models.ItemRetirada).all()

# Buscar por ID


def buscar_ItemRetirada(db: Session, ItemRetirada_id: int):
    return db.query(models.ItemRetirada).filter(models.ItemRetirada.id_ItemRetirada == ItemRetirada_id).first()

# Atualizar


def atualizar_ItemRetirada(db: Session, ItemRetirada_id: int, ItemRetirada_update: sitemretirada.ItemRetiradaUpdate):
    db_ItemRetirada = buscar_ItemRetirada(db, ItemRetirada_id)
    if not db_ItemRetirada:
        return None
    for key, value in ItemRetirada_update.model_dump(exclude_unset=True).items():
        setattr(db_ItemRetirada, key, value)
    db.commit()
    db.refresh(db_ItemRetirada)
    return db_ItemRetirada

# Remover


def remover_ItemRetirada(db: Session, ItemRetirada_id: int):
    db_ItemRetirada = buscar_ItemRetirada(db, ItemRetirada_id)
    if db_ItemRetirada:
        db.delete(db_ItemRetirada)
        db.commit()
        return True
    return False

# Criar ItemRetirada


def criar_ItemRetirada(db: Session, ItemRetirada: sitemretirada.ItemRetiradaCreate):
    db_ItemRetirada = models.ItemRetirada(**ItemRetirada.model_dump())
    db.add(db_ItemRetirada)
    db.commit()
    db.refresh(db_ItemRetirada)
    return db_ItemRetirada
