from sqlalchemy.orm import Session
from .. import models
from ..schemas import susuario
from passlib.context import CryptContext

# Configuração do passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Gera o hash da senha"""
    return pwd_context.hash(password)


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

    update_data = usuario_update.model_dump(exclude_unset=True)

    # Se veio senha nova, gera novo hash
    if "senha" in update_data and update_data["senha"]:
        db_usuario.senha_hash = hash_password(update_data["senha"])
        update_data.pop("senha")  # remove para nao dar conflito

    for key, value in update_data.items():
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


# Criar usuario
def criar_usuario(db: Session, usuario: susuario.UsuarioCreate):
    db_usuario = models.Usuario(
        email_login=usuario.email_login,
        senha_hash=hash_password(usuario.senha),  # senha convertida para hash
        role=usuario.role,
        ativo=usuario.ativo,
        id_funcionario=usuario.id_funcionario,
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
