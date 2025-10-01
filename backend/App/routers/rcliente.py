from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_cliente
from ..schemas import scliente
from .. import db

router = APIRouter(
    prefix="/cliente",   # prefixo da rota
    tags=["Cliente"]     # aparece na doc do Swagger
)

# Obter cliente por ID


@router.get("/{cliente_id}", response_model=scliente.ClienteResponse)
def buscar_cliente(cliente_id: int, db_session: Session = Depends(db.get_db)):
    db_cliente = crud_cliente.buscar_cliente(
        db_session, cliente_id)
    if not db_cliente:
        raise HTTPException(
            status_code=404, detail="Cliente nao encontrado")
    return db_cliente


# Listar clientes
@router.get("/", response_model=list[scliente.ClienteResponse])
def listar_clientes(db_session: Session = Depends(db.get_db)):
    return crud_cliente.listar_clientes(db_session)


# Atualizar cliente
@router.put("/{cliente_id}", response_model=scliente.ClienteResponse)
def atualizar_cliente(cliente_id: int, cliente: scliente.ClienteUpdate, db_session: Session = Depends(db.get_db)):
    db_cliente = crud_cliente.atualizar_cliente(
        db_session, cliente_id, cliente)
    if not db_cliente:
        raise HTTPException(
            status_code=404, detail="Cliente nao encontrado")
    return db_cliente


# Remover cliente
@router.delete("/{cliente_id}")
def remover_cliente(cliente_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_cliente.remover_cliente(db_session, cliente_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Cliente nao encontrado")
    return {"ok": True}


# Criar cliente
@router.post("/", response_model=scliente.ClienteResponse)
def criar_cliente(cliente: scliente.ClienteCreate, db_session: Session = Depends(db.get_db)):
    return crud_cliente.criar_cliente(db_session, cliente)
