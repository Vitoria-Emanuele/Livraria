from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.App.db import get_db
from ..crud import crud_compra
from ..schemas import scompra

router = APIRouter(
    prefix="/compra",
    tags=["Compra"]
)

# Listar todas


@router.get("/", response_model=list[scompra.CompraResponse])
def listar(db: Session = Depends(get_db)):
    return crud_compra.listar_compras(db)

# Buscar por ID


@router.get("/{compra_id}", response_model=scompra.CompraResponse)
def buscar(compra_id: int, db: Session = Depends(get_db)):
    compra = crud_compra.buscar_compra(db, compra_id)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    return compra

# Criar compra simples


@router.post("/", response_model=scompra.CompraResponse)
def criar(compra: scompra.CompraCreate, db: Session = Depends(get_db)):
    try:
        return crud_compra.criar_compra(db, compra)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Criar compra completa (com itens)


@router.post("/completa", response_model=scompra.CompraResponse)
def criar_completa(compra: scompra.CompraCompletaCreate, db: Session = Depends(get_db)):
    try:
        return crud_compra.criar_compra_completa(db, compra)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Atualizar compra


@router.put("/{compra_id}", response_model=scompra.CompraResponse)
def atualizar(compra_id: int, compra_update: scompra.CompraUpdate, db: Session = Depends(get_db)):
    compra = crud_compra.atualizar_compra(db, compra_id, compra_update)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    return compra

# Remover compra


@router.delete("/{compra_id}")
def remover(compra_id: int, db: Session = Depends(get_db)):
    sucesso = crud_compra.remover_compra(db, compra_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    return {"message": "Removido com sucesso"}


@router.get("/pendentes/", response_model=list[scompra.CompraResponse])
def listar_pendentes(db: Session = Depends(get_db)):
    try:
        return crud_compra.listar_compras_pendentes(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
