from sqlalchemy.orm import Session
from .. import models
from ..schemas import sfuncionario

# Criar funcionário


def criar_funcionario(db: Session, funcionario: sfuncionario.FuncionarioCreate):
    db_funcionario = models.Funcionario(**funcionario.dict())
    db.add(db_funcionario)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

# Listar todos


def listar_funcionarios(db: Session):
    return db.query(models.Funcionario).all()

# Buscar por ID


def buscar_funcionario(db: Session, funcionario_id: int):
    return db.query(models.Funcionario).filter(models.Funcionario.id_funcionario == funcionario_id).first()

# Atualizar


def atualizar_funcionario(db: Session, funcionario_id: int, funcionario_update: sfuncionario.FuncionarioUpdate):
    db_funcionario = buscar_funcionario(db, funcionario_id)
    if not db_funcionario:
        return None
    for key, value in funcionario_update.dict(exclude_unset=True).items():
        setattr(db_funcionario, key, value)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

# Remover


def remover_funcionario(db: Session, funcionario_id: int):
    db_funcionario = buscar_funcionario(db, funcionario_id)
    if db_funcionario:
        db.delete(db_funcionario)
        db.commit()
        return True
    return False
