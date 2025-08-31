from sqlalchemy.orm import Session
from .. import models
from ..schemas import sregistroentrada

# Criar registro de entrada


def criar_RegistroEntrada(db: Session, RegistroEntrada: sregistroentrada.RegistroEntradaCreate):
    db_RegistroEntrada = models.RegistroEntrada(**RegistroEntrada.dict())
    db.add(db_RegistroEntrada)
    db.commit()
    db.refresh(db_RegistroEntrada)
    return db_RegistroEntrada

# Listar todos


def listar_RegistrosEntradas(db: Session):
    return db.query(models.RegistroEntrada).all()

# Buscar por ID


def buscar_RegistroEntrada(db: Session, RegistroEntrada_id: int):
    return db.query(models.RegistroEntrada).filter(models.RegistroEntrada.id_RegistroEntrada == RegistroEntrada_id).first()

# Atualizar


def atualizar_RegistroEntrada(db: Session, RegistroEntrada_id: int, RegistroEntrada_update: sregistroentrada.RegistroEntradaUpdate):
    db_RegistroEntrada = buscar_RegistroEntrada(db, RegistroEntrada_id)
    if not db_RegistroEntrada:
        return None
    for key, value in RegistroEntrada_update.dict(exclude_unset=True).items():
        setattr(db_RegistroEntrada, key, value)
    db.commit()
    db.refresh(db_RegistroEntrada)
    return db_RegistroEntrada

# Remover


def remover_RegistroEntrada(db: Session, RegistroEntrada_id: int):
    db_RegistroEntrada = buscar_RegistroEntrada(db, RegistroEntrada_id)
    if db_RegistroEntrada:
        db.delete(db_RegistroEntrada)
        db.commit()
        return True
    return False
