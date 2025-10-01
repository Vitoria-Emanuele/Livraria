from sqlalchemy.orm import Session
from .. import models
from ..schemas import sitem_compra


def listar_item_compra(db: Session):
    return db.query(models.item_compra).all()


def buscar_item_compra(db: Session, item_compra_id: int):
    return db.query(models.item_compra).filter(models.item_compra.id_item_compra == item_compra_id).first()


def atualizar_item_compra(db: Session, item_compra_id: int, item_compra_update: sitem_compra.ItemCompraUpdate):
    db_item_compra = buscar_item_compra(db, item_compra_id)
    if not db_item_compra:
        return None
    for key, value in item_compra_update.model_dump(exclude_unset=True).items():
        setattr(db_item_compra, key, value)

    db.flush()
    return db_item_compra


def remover_item_compra(db: Session, item_compra_id: int):
    db_item_compra = buscar_item_compra(db, item_compra_id)
    if db_item_compra:
        db.delete(db_item_compra)
        return True
    return False


def criar_item_compra(db: Session, item_compra: sitem_compra.ItemCompraCreate):
    db_item_compra = models.item_compra(**item_compra.model_dump())
    db.add(db_item_compra)
    db.flush()
    return db_item_compra
