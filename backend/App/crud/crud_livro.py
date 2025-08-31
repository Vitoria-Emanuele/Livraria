from sqlalchemy.orm import Session
from .. import models
from ..schemas import slivro

# Criar livro


def criar_livro(db: Session, livro: slivro.LivroCreate):
    db_livro = models.Livro(**livro.dict())
    db.add(db_livro)
    db.commit()
    db.refresh(db_livro)
    return db_livro

# Listar todos


def listar_livros(db: Session):
    return db.query(models.Livro).all()

# Buscar por ID


def buscar_livro(db: Session, livro_id: int):
    return db.query(models.Livro).filter(models.Livro.id_livro == livro_id).first()

# Atualizar


def atualizar_livro(db: Session, livro_id: int, livro_update: slivro.LivroUpdate):
    db_livro = buscar_livro(db, livro_id)
    if not db_livro:
        return None
    for key, value in livro_update.dict(exclude_unset=True).items():
        setattr(db_livro, key, value)
    db.commit()
    db.refresh(db_livro)
    return db_livro

# Remover


def remover_livro(db: Session, livro_id: int):
    db_livro = buscar_livro(db, livro_id)
    if db_livro:
        db.delete(db_livro)
        db.commit()
        return True
    return False
