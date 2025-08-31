from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sretirada
from ..crud import crud_retirada

router = APIRouter(
    prefix="/retiradas",
    tags=["Retiradas"]
)


@router.post("/", response_model=sretirada.RetiradaResponse)
def criar_retirada(retirada: sretirada.RetiradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_retirada.criar_retirada(db_session, retirada)


@router.get("/", response_model=list[sretirada.RetiradaResponse])
def listar_retiradas(db_session: Session = Depends(db.get_db)):
    return crud_retirada.listar_retiradas(db_session)


@router.get("/{retirada_id}", response_model=sretirada.RetiradaResponse)
def obter_retirada(retirada_id: int, db_session: Session = Depends(db.get_db)):
    retirada = crud_retirada.obter_retirada(db_session, retirada_id)
    if not retirada:
        raise HTTPException(status_code=404, detail="Retirada não encontrada")
    return retirada


@router.put("/{retirada_id}", response_model=sretirada.RetiradaResponse)
def atualizar_retirada(retirada_id: int, retirada: sretirada.RetiradaUpdate, db_session: Session = Depends(db.get_db)):
    retirada_db = crud_retirada.atualizar_retirada(
        db_session, retirada_id, retirada)
    if not retirada_db:
        raise HTTPException(status_code=404, detail="Retirada não encontrada")
    return retirada_db


@router.delete("/{retirada_id}")
def remover_retirada(retirada_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_retirada.remover_retirada(db_session, retirada_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Retirada não encontrada")
    return {"ok": True}
