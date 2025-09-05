from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_usuario
from ..schemas import susuario
from .. import db


router = APIRouter(
    prefix="/usuario",   # prefixo da rota
    tags=["Usuario"]     # aparece na doc do Swagger
)

# Obter usuario por ID


@router.get("/{usuario_id}", response_model=susuario.UsuarioResponse)
def buscar_usuario(usuario_id: int, db_session: Session = Depends(db.get_db)):
    db_usuario = crud_usuario.buscar_usuario(
        db_session, usuario_id)
    if not db_usuario:
        raise HTTPException(
            status_code=404, detail="Usuario nao encontrado")
    return db_usuario


# Listar usuario
@router.get("/", response_model=list[susuario.UsuarioResponse])
def listar_usuario(db_session: Session = Depends(db.get_db)):
    return crud_usuario.listar_usuario(db_session)

# Atualizar usuario


@router.put("/{usuario_id}", response_model=susuario.UsuarioResponse)
def atualizar_usuario(usuario_id: int, usuario: susuario.UsuarioUpdate, db_session: Session = Depends(db.get_db)):
    db_usuario = crud_usuario.atualizar_usuario(
        db_session, usuario_id, usuario)
    if not db_usuario:
        raise HTTPException(
            status_code=404, detail="Usuario nao encontrado")
    return db_usuario

# Remover usuario


@router.delete("/{usuario_id}")
def remover_usuario(usuario_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_usuario.remover_usuario(db_session, usuario_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Usuario nao encontrado")
    return {"ok": True}


# Criar usuario
@router.post("/", response_model=susuario.UsuarioResponse)
def criar_usuario(usuario: susuario.UsuarioCreate, db_session: Session = Depends(db.get_db)):
    return crud_usuario.criar_usuario(db_session, usuario)
