from sqlalchemy.orm import Session
from .. import models
from ..schemas import sregistroentrada


# Listar todos


def listar_registro_entrada(db: Session):
    return db.query(models.registro_entrada).all()

# Buscar por ID


def buscar_registro_entrada(db: Session, registro_entrada_id: int):
    return db.query(models.registro_entrada).filter(models.registro_entrada.id_registro_entrada == registro_entrada_id).first()

# Atualizar


def atualizar_registro_entrada(db: Session, registro_entrada_id: int, registro_entrada_update: sregistroentrada.registro_entradaUpdate):
    db_registro_entrada = buscar_registro_entrada(db, registro_entrada_id)
    if not db_registro_entrada:
        return None
    for key, value in registro_entrada_update.model_dump(exclude_unset=True).items():
        setattr(db_registro_entrada, key, value)
    db.commit()
    db.refresh(db_registro_entrada)
    return db_registro_entrada

# Remover


def remover_registro_entrada(db: Session, registro_entrada_id: int):
    db_registro_entrada = buscar_registro_entrada(db, registro_entrada_id)
    if db_registro_entrada:
        db.delete(db_registro_entrada)
        db.commit()
        return True
    return False

# Criar registro de entrada


def criar_registro_entrada(db: Session, registro_entrada: sregistroentrada.registro_entradaCreate):
    db_registro_entrada = models.registro_entrada(**registro_entrada.model_dump())
    db.add(db_registro_entrada)
    db.commit()
    db.refresh(db_registro_entrada)
    return db_registro_entrada
