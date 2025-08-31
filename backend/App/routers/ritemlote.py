from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sitemlote
from ..crud import crud_ItemLote

router = APIRouter(
    prefix="/itens_lote",
    tags=["Itens de Lote"]
)


@router.post("/", response_model=sitemlote.ItemLoteResponse)
def criar_item_lote(item: sitemlote.ItemLoteCreate, db_session: Session = Depends(db.get_db)):
    return crud_ItemLote.criar_item_lote(db_session, item)


@router.get("/", response_model=list[sitemlote.ItemLoteResponse])
def listar_itens_lote(db_session: Session = Depends(db.get_db)):
    return crud_ItemLote.listar_itens_lote(db_session)


@router.get("/{id_lote}/{id_livro}", response_model=sitemlote.ItemLoteResponse)
def obter_item_lote(id_lote: int, id_livro: int, db_session: Session = Depends(db.get_db)):
    item = crud_ItemLote.obter_item_lote(db_session, id_lote, id_livro)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de lote não encontrado")
    return item


@router.put("/{id_lote}/{id_livro}", response_model=sitemlote.ItemLoteResponse)
def atualizar_item_lote(id_lote: int, id_livro: int, item: sitemlote.ItemLoteUpdate, db_session: Session = Depends(db.get_db)):
    item_db = crud_ItemLote.atualizar_item_lote(
        db_session, id_lote, id_livro, item)
    if not item_db:
        raise HTTPException(
            status_code=404, detail="Item de lote não encontrado")
    return item_db


@router.delete("/{id_lote}/{id_livro}")
def remover_item_lote(id_lote: int, id_livro: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_ItemLote.remover_item_lote(db_session, id_lote, id_livro)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Item de lote não encontrado")
    return {"ok": True}
