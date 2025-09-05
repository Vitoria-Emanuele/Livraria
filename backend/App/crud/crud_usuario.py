from sqlalchemy.orm import Session
from .. import models
from ..schemas import susuario


# Listar todos


def listar_usuario(db: Session):
    return db.query(models.Usuario).all()

# Buscar por ID


def buscar_usuario(db: Session, usuario_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()

# Atualizar


def atualizar_usuario(db: Session, usuario_id: int, usuario_update: susuario.UsuarioUpdate):
    db_usuario = buscar_usuario(db, usuario_id)
    if not db_usuario:
        return None
    for key, value in usuario_update.model_dump(exclude_unset=True).items():
        setattr(db_usuario, key, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Remover


def remover_usuario(db: Session, usuario_id: int):
    db_usuario = buscar_usuario(db, usuario_id)
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
        return True
    return False

# Criar funcionário


def criar_usuario(db: Session, usuario: susuario.UsuarioCreate):
    db_usuario = models.Usuario(**usuario.model_dump())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
