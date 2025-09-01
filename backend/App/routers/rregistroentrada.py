from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sregistroentrada
from ..crud import crud_registro_entrada

router = APIRouter(
    prefix="/registro_entrada",
    tags=["Registro de Entrada"]
)


@router.get("/{registro_id}", response_model=sregistroentrada.registro_entradaResponse)
def buscar_registro(registro_id: int, db_session: Session = Depends(db.get_db)):
    registro = crud_registro_entrada.buscar_registro_entrada(
        db_session, registro_id)
    if not registro:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return registro


@router.get("/", response_model=list[sregistroentrada.registro_entradaResponse])
def listar_registro(db_session: Session = Depends(db.get_db)):
    return crud_registro_entrada.listar_registro_entrada(db_session)


@router.post("/", response_model=sregistroentrada.registro_entradaResponse)
def criar_registro(registro: sregistroentrada.registro_entradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_registro_entrada.criar_registro_entrada(db_session, registro)


@router.put("/{registro_id}", response_model=sregistroentrada.registro_entradaResponse)
def atualizar_registro(registro_id: int, registro: sregistroentrada.registro_entradaUpdate, db_session: Session = Depends(db.get_db)):
    registro_db = crud_registro_entrada.atualizar_registro_entrada(
        db_session, registro_id, registro)
    if not registro_db:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return registro_db


@router.delete("/{registro_id}")
def remover_registro(registro_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_registro_entrada.remover_registro_entrada(
        db_session, registro_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return {"ok": True}
