from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sitem_lote
from ..crud import crud_item_lote

router = APIRouter(
    prefix="/item_lote",
    tags=["Item de Lote"]
)


@router.get("/{id_lote}/{id_livro}", response_model=sitem_lote.item_loteResponse)
def buscar_item_lote(id_lote: int, id_livro: int, db_session: Session = Depends(db.get_db)):
    item = crud_item_lote.buscar_item_lote(db_session, id_lote, id_livro)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de lote nao encontrado")
    return item


@router.get("/", response_model=list[sitem_lote.item_loteResponse])
def listar_item_lote(db_session: Session = Depends(db.get_db)):
    return crud_item_lote.listar_item_lote(db_session)


@router.post("/", response_model=sitem_lote.item_loteResponse)
def criar_item_lote(item: sitem_lote.item_loteCreate, db_session: Session = Depends(db.get_db)):
    return crud_item_lote.criar_item_lote(db_session, item)


@router.put("/{id_lote}/{id_livro}", response_model=sitem_lote.item_loteResponse)
def atualizar_item_lote(id_lote: int, id_livro: int, item: sitem_lote.item_loteUpdate, db_session: Session = Depends(db.get_db)):
    item_db = crud_item_lote.atualizar_item_lote(
        db_session, id_lote, id_livro, item)
    if not item_db:
        raise HTTPException(
            status_code=404, detail="Item de lote nao encontrado")
    return item_db


@router.delete("/{id_lote}/{id_livro}")
def remover_item_lote(id_lote: int, id_livro: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_item_lote.remover_item_lote(db_session, id_lote, id_livro)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Item de lote nao encontrado")
    return {"ok": True}
