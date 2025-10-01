from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.App.db import get_db
from ..crud import crud_item_compra
from ..schemas import sitem_compra

router = APIRouter(
    prefix="/item_compra",
    tags=["Item Compra"]
)


@router.get("/", response_model=list[sitem_compra.ItemCompraResponse])
def listar(db: Session = Depends(get_db)):
    return crud_item_compra.listar_item_compra(db)


@router.get("/{item_compra_id}", response_model=sitem_compra.ItemCompraResponse)
def buscar(item_compra_id: int, db: Session = Depends(get_db)):
    item = crud_item_compra.buscar_item_compra(db, item_compra_id)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de compra não encontrado")
    return item


@router.post("/", response_model=sitem_compra.ItemCompraResponse)
def criar(item: sitem_compra.ItemCompraCreate, db: Session = Depends(get_db)):
    return crud_item_compra.criar_item_compra(db, item)


@router.put("/{item_compra_id}", response_model=sitem_compra.ItemCompraResponse)
def atualizar(item_compra_id: int, item_update: sitem_compra.ItemCompraUpdate, db: Session = Depends(get_db)):
    item = crud_item_compra.atualizar_item_compra(
        db, item_compra_id, item_update)
    if not item:
        raise HTTPException(
            status_code=404, detail="Item de compra não encontrado")
    return item


@router.delete("/{item_compra_id}")
def remover(item_compra_id: int, db: Session = Depends(get_db)):
    sucesso = crud_item_compra.remover_item_compra(db, item_compra_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Item de compra não encontrado")
    return {"message": "Removido com sucesso"}
