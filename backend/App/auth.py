from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from . import models, db
from .config import settings

# Contexto para hash de senha (usa bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Definição do esquema OAuth2
# Esse "tokenUrl" deve apontar para a rota de login que criaremos (/login)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def verificar_senha(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def gerar_senha_hash(password: str) -> str:
    return pwd_context.hash(password)


def criar_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + \
        (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})  # adiciona a expiração no payload
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def autenticar_usuario(db_session: Session, email: str, senha: str):
    usuario = db_session.query(models.Usuario).filter(
        models.Usuario.email_login == email).first()
    if not usuario:
        return None
    if not verificar_senha(senha, usuario.senha_hash):
        return None
    return usuario


def get_usuario_atual(token: str = Depends(oauth2_scheme), db_session: Session = Depends(db.get_db)):
    credenciais_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decodifica o token
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        usuario_id: str = payload.get("sub")
        if usuario_id is None:
            raise credenciais_exception
    except JWTError:
        raise credenciais_exception

    # Busca usuário no banco
    usuario = db_session.query(models.Usuario).filter(
        models.Usuario.id_usuario == int(usuario_id)).first()
    if usuario is None:
        raise credenciais_exception
    return usuario
