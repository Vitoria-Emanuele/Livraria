from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sitem_retirada
from ..crud import crud_item_retirada

router = APIRouter(
    prefix="/item_retirada",
    tags=["Item de Retirada"]
)


@router.get("/{id_livro}/{id_retirada}", response_model=sitem_retirada.item_retiradaResponse)
def buscar_item_retirada(id_livro: int, id_retirada: int, db_session: Session = Depends(db.get_db)):
    item = crud_item_retirada.buscar_item_retirada(
        db_session, id_livro, id_retirada)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return item


@router.get("/", response_model=list[sitem_retirada.item_retiradaResponse])
def listar_item_retirada(db_session: Session = Depends(db.get_db)):
    return crud_item_retirada.listar_item_retirada(db_session)


@router.post("/", response_model=sitem_retirada.item_retiradaResponse)
def criar_item_retirada(item:  sitem_retirada.item_retiradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_item_retirada.criar_item_retirada(db_session, item)


@router.put("/{id_livro}/{id_retirada}", response_model=sitem_retirada.item_retiradaResponse)
def atualizar_item_retirada(id_livro: int, id_retirada: int, item:  sitem_retirada.item_retiradaUpdate, db_session: Session = Depends(db.get_db)):
    item_db = crud_item_retirada.atualizar_item_retirada(
        db_session, id_livro, id_retirada, item)
    if not item_db:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return item_db


@router.delete("/{id_livro}/{id_retirada}")
def remover_item_retirada(id_livro: int, id_retirada: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_item_retirada.remover_item_retirada(
        db_session, id_livro, id_retirada)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return {"ok": True}
