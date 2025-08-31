from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_distribuidor
from .. import db
from ..schemas import sdistribuidor


router = APIRouter(
    prefix="/distribuidores",   # prefixo da rota
    tags=["Distribuidores"]     # aparece na doc do Swagger
)

# Criar distribuidor


@router.post("/", response_model=sdistribuidor.DistribuidorResponse)
def criar_distribuidor(distribuidor: sdistribuidor.DistribuidorCreate, db_session: Session = Depends(db.get_db)):
    return crud_distribuidor.criar_distribuidor(db_session, distribuidor)

# Listar distribuidores


@router.get("/", response_model=list[sdistribuidor.DistribuidorResponse])
def listar_distribuidores(db_session: Session = Depends(db.get_db)):
    return crud_distribuidor.listar_distribuidores(db_session)

# Obter distribuidor por ID


@router.get("/{distribuidor_id}", response_model=sdistribuidor.DistribuidorResponse)
def obter_distribuidor(distribuidor_id: int, db_session: Session = Depends(db.get_db)):
    db_distribuidor = crud_distribuidor.obter_distribuidor(
        db_session, distribuidor_id)
    if not db_distribuidor:
        raise HTTPException(
            status_code=404, detail="Distribuidor não encontrado")
    return db_distribuidor

# Atualizar distribuidor


@router.put("/{distribuidor_id}", response_model=sdistribuidor.DistribuidorResponse)
def atualizar_distribuidor(distribuidor_id: int, distribuidor: sdistribuidor.DistribuidorUpdate, db_session: Session = Depends(db.get_db)):
    db_distribuidor = crud_distribuidor.atualizar_distribuidor(
        db_session, distribuidor_id, distribuidor)
    if not db_distribuidor:
        raise HTTPException(
            status_code=404, detail="Distribuidor não encontrado")
    return db_distribuidor

# Remover distribuidor


@router.delete("/{distribuidor_id}")
def remover_distribuidor(distribuidor_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_distribuidor.remover_distribuidor(
        db_session, distribuidor_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Distribuidor não encontrado")
    return {"ok": True}
