from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sregistroentrada
from ..crud import crud_RegistroEntrada

router = APIRouter(
    prefix="/registro_entrada",
    tags=["Registro de Entrada"]
)


@router.get("/{registro_id}", response_model=sregistroentrada.RegistroEntradaResponse)
def obter_registro(registro_id: int, db_session: Session = Depends(db.get_db)):
    registro = crud_RegistroEntrada.obter_registro_entrada(
        db_session, registro_id)
    if not registro:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return registro


@router.get("/", response_model=list[sregistroentrada.RegistroEntradaResponse])
def listar_registros(db_session: Session = Depends(db.get_db)):
    return crud_RegistroEntrada.listar_registros_entrada(db_session)


@router.post("/", response_model=sregistroentrada.RegistroEntradaResponse)
def criar_registro(registro: sregistroentrada.RegistroEntradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_RegistroEntrada.criar_registro_entrada(db_session, registro)


@router.put("/{registro_id}", response_model=sregistroentrada.RegistroEntradaResponse)
def atualizar_registro(registro_id: int, registro: sregistroentrada.RegistroEntradaUpdate, db_session: Session = Depends(db.get_db)):
    registro_db = crud_RegistroEntrada.atualizar_registro_entrada(
        db_session, registro_id, registro)
    if not registro_db:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return registro_db


@router.delete("/{registro_id}")
def remover_registro(registro_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_RegistroEntrada.remover_registro_entrada(
        db_session, registro_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Registro de entrada não encontrado")
    return {"ok": True}
