from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_cupom
from ..schemas import scupom
from .. import db

router = APIRouter(
    prefix="/cupom",   # prefixo da rota
    tags=["Cupom"]     # aparece na doc do Swagger
)

# Obter cupom por ID


@router.get("/{cupom_id}", response_model=scupom.CupomResponse)
def buscar_cupom(Cfliente_id: int, db_session: Session = Depends(db.get_db)):
    db_cupom = crud_cupom.buscar_cupom(
        db_session, Cfliente_id)
    if not db_cupom:
        raise HTTPException(
            status_code=404, detail="Cupom nao encontrado")
    return db_cupom


# Listar cupons
@router.get("/", response_model=list[scupom.CupomResponse])
def listar_cupons(db_session: Session = Depends(db.get_db)):
    return crud_cupom.listar_cupons(db_session)


# Atualizar cupom
@router.put("/{cupom_id}", response_model=scupom.CupomResponse)
def atualizar_cupom(cupom_id: int, cupom: scupom.CupomUpdate, db_session: Session = Depends(db.get_db)):
    db_cupom = crud_cupom.atualizar_cupom(
        db_session, cupom_id, cupom)
    if not db_cupom:
        raise HTTPException(
            status_code=404, detail="Cupom nao encontrado")
    return db_cupom


# Remover cupom
@router.delete("/{cupom_id}")
def remover_cupom(cupom_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_cupom.remover_cupom(db_session, cupom_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Cupom nao encontrado")
    return {"ok": True}

# Criar cupom


@router.post("/", response_model=scupom.CupomResponse)
def criar_cupom(cupom: scupom.CupomCreate, db_session: Session = Depends(db.get_db)):
    return crud_cupom.criar_cupom(db_session, cupom)
