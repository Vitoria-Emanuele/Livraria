from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sitemretirada
from ..crud import crud_ItemRetirada

router = APIRouter(
    prefix="/itens_retirada",
    tags=["Itens de Retirada"]
)


@router.get("/{id_livro}/{id_retirada}", response_model=sitemretirada.ItemRetiradaResponse)
def obter_item_retirada(id_livro: int, id_retirada: int, db_session: Session = Depends(db.get_db)):
    item = crud_ItemRetirada.obter_item_retirada(
        db_session, id_livro, id_retirada)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return item


@router.get("/", response_model=list[sitemretirada.ItemRetiradaResponse])
def listar_itens_retirada(db_session: Session = Depends(db.get_db)):
    return crud_ItemRetirada.listar_itens_retirada(db_session)


@router.post("/", response_model=sitemretirada.ItemRetiradaResponse)
def criar_item_retirada(item:  sitemretirada.ItemRetiradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_ItemRetirada.criar_item_retirada(db_session, item)


@router.put("/{id_livro}/{id_retirada}", response_model=sitemretirada.ItemRetiradaResponse)
def atualizar_item_retirada(id_livro: int, id_retirada: int, item:  sitemretirada.ItemRetiradaUpdate, db_session: Session = Depends(db.get_db)):
    item_db = crud_ItemRetirada.atualizar_item_retirada(
        db_session, id_livro, id_retirada, item)
    if not item_db:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return item_db


@router.delete("/{id_livro}/{id_retirada}")
def remover_item_retirada(id_livro: int, id_retirada: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_ItemRetirada.remover_item_retirada(
        db_session, id_livro, id_retirada)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Item de retirada não encontrado")
    return {"ok": True}
