from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt


from .. import db
from .. import auth
from .. import models
from ..config import settings
from ..schemas import susuario

router = APIRouter(
    tags=["Autenticacao"]  # Vai aparecer no Swagger como "Autenticacao"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")


def get_current_user(token: str = Depends(oauth2_scheme), db_session: Session = Depends(db.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nao foi possivel validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica o token
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    usuario = db_session.query(models.Usuario).filter(
        models.Usuario.id_usuario == int(user_id)).first()
    if not usuario:
        raise credentials_exception
    return usuario


@router.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db_session: Session = Depends(db.get_db)):
    usuario = auth.autenticar_usuario(
        db_session, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Tempo de expiracaoo do token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    # Cria token com o ID do usuario no "sub"
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


@router.get("/me/", response_model=susuario.UsuarioResponse)
def read_current_user(current_user: models.Usuario = Depends(get_current_user)):
    return current_user
