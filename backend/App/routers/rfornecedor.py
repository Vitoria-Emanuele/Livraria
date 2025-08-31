from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_fornecedor
from ..schemas import sfornecedor
from .. import db


router = APIRouter(
    prefix="/fornecedor",   # prefixo da rota
    tags=["Fornecedor"]     # aparece na doc do Swagger
)

# Criar fornecedor


@router.post("/", response_model=sfornecedor.FornecedorResponse)
def criar_fornecedor(fornecedor: sfornecedor.FornecedorCreate, db_session: Session = Depends(db.get_db)):
    return crud_fornecedor.criar_fornecedor(db_session, fornecedor)

# Listar fornecedor


@router.get("/", response_model=list[sfornecedor.FornecedorResponse])
def listar_fornecedor(db_session: Session = Depends(db.get_db)):
    return crud_fornecedor.listar_fornecedor(db_session)

# Obter fornecedor por ID


@router.get("/{fornecedor_id}", response_model=sfornecedor.FornecedorResponse)
def obter_fornecedor(fornecedor_id: int, db_session: Session = Depends(db.get_db)):
    db_fornecedor = crud_fornecedor.buscar_fornecedor(
        db_session, fornecedor_id)
    if not db_fornecedor:
        raise HTTPException(
            status_code=404, detail="Fornecedor não encontrado")
    return db_fornecedor

# Atualizar fornecedor


@router.put("/{fornecedor_id}", response_model=sfornecedor.FornecedorResponse)
def atualizar_fornecedor(fornecedor_id: int, fornecedor: sfornecedor.FornecedorUpdate, db_session: Session = Depends(db.get_db)):
    db_fornecedor = crud_fornecedor.atualizar_fornecedor(
        db_session, fornecedor_id, fornecedor)
    if not db_fornecedor:
        raise HTTPException(
            status_code=404, detail="Fornecedor não encontrado")
    return db_fornecedor

# Remover fornecedor


@router.delete("/{fornecedor_id}")
def remover_fornecedor(fornecedor_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_fornecedor.remover_fornecedor(db_session, fornecedor_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Fornecedor não encontrado")
    return {"ok": True}
