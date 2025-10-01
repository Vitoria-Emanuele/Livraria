from sqlalchemy.orm import Session
from .. import models
from ..schemas import scliente

# Listar todos


def listar_clientes(db: Session):
    return db.query(models.Cliente).all()

# Buscar por ID


def buscar_cliente(db: Session, cliente_id: int):
    return db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()

# Atualizar


def atualizar_cliente(db: Session, cliente_id: int, cliente_update: scliente.ClienteUpdate):
    db_cliente = buscar_cliente(db, cliente_id)
    if not db_cliente:
        return None
    for key, value in cliente_update.model_dump(exclude_unset=True).items():
        setattr(db_cliente, key, value)

    db.flush()
    db.refresh(db_cliente)
    return db_cliente

# Remover


def remover_cliente(db: Session, cliente_id: int):
    db_cliente = buscar_cliente(db, cliente_id)
    if db_cliente:
        db.delete(db_cliente)
        db.flush()
        return True
    return False

# Criar cliente


def criar_cliente(db: Session, cliente: scliente.ClienteCreate):
    db_cliente = models.Cliente(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente
