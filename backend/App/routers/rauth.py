from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import db
from .. import auth
from ..config import settings

router = APIRouter(
    tags=["Autenticação"]  # Vai aparecer no Swagger como "Autenticação"
)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db_session: Session = Depends(db.get_db)):
    usuario = auth.autenticar_usuario(
        db_session, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Tempo de expiração do token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    # Cria token com o ID do usuário no "sub"
    access_token = auth.criar_access_token(
        data={"sub": str(usuario.id_usuario)}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": usuario.id_usuario,
        "email": usuario.email_login,
        "role": usuario.role,
    }
