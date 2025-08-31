from sqlalchemy.orm import Session
from .. import models
from ..schemas import sfornecedor

# Listar todos


def listar_fornecedor(db: Session):
    return db.query(models.Fornecedor).all()

# Buscar por ID


def buscar_fornecedor(db: Session, fornecedor_id: int):
    return db.query(models.Fornecedor).filter(models.Fornecedor.id_fornecedor == fornecedor_id).first()

# Atualizar


def atualizar_fornecedor(db: Session, fornecedor_id: int, fornecedor_update: sfornecedor.FornecedorUpdate):
    db_fornecedor = buscar_fornecedor(db, fornecedor_id)
    if not db_fornecedor:
        return None
    for key, value in fornecedor_update.model_dump(exclude_unset=True).items():
        setattr(db_fornecedor, key, value)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

# Remover


def remover_fornecedor(db: Session, fornecedor_id: int):
    db_fornecedor = buscar_fornecedor(db, fornecedor_id)
    if db_fornecedor:
        db.delete(db_fornecedor)
        db.commit()
        return True
    return False

# Criar fornecedor


def criar_fornecedor(db: Session, fornecedor: sfornecedor.FornecedorCreate):
    db_fornecedor = models.Fornecedor(**fornecedor.model_dump())
    db.add(db_fornecedor)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor
