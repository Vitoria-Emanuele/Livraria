from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import slote
from ..crud import crud_lote

router = APIRouter(
    prefix="/lotes",
    tags=["Lotes"]
)


@router.post("/", response_model=slote.LoteResponse)
def criar_lote(lote: slote.LoteCreate, db_session: Session = Depends(db.get_db)):
    return crud_lote.criar_lote(db_session, lote)


@router.get("/", response_model=list[slote.LoteResponse])
def listar_lotes(db_session: Session = Depends(db.get_db)):
    return crud_lote.listar_lotes(db_session)


@router.get("/{lote_id}", response_model=slote.LoteResponse)
def obter_lote(lote_id: int, db_session: Session = Depends(db.get_db)):
    lote = crud_lote.obter_lote(db_session, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return lote


@router.put("/{lote_id}", response_model=slote.LoteResponse)
def atualizar_lote(lote_id: int, lote: slote.LoteUpdate, db_session: Session = Depends(db.get_db)):
    lote_db = crud_lote.atualizar_lote(db_session, lote_id, lote)
    if not lote_db:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return lote_db


@router.delete("/{lote_id}")
def remover_lote(lote_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_lote.remover_lote(db_session, lote_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return {"ok": True}
