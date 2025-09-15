from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import sretirada
from ..crud import crud_retirada

router = APIRouter(
    prefix="/retirada",
    tags=["Retirada"]
)


@router.get("/{retirada_id}", response_model=sretirada.RetiradaResponse)
def buscar_retirada(retirada_id: int, db_session: Session = Depends(db.get_db)):
    retirada = crud_retirada.buscar_retirada(db_session, retirada_id)
    if not retirada:
        raise HTTPException(status_code=404, detail="Retirada nao encontrada")
    return retirada


@router.get("/", response_model=list[sretirada.RetiradaResponse])
def listar_retiradas(db_session: Session = Depends(db.get_db)):
    return crud_retirada.listar_retiradas(db_session)


@router.post("/", response_model=sretirada.RetiradaResponse)
def criar_retirada(retirada: sretirada.RetiradaCreate, db_session: Session = Depends(db.get_db)):
    return crud_retirada.criar_retirada(db_session, retirada)


@router.put("/{retirada_id}", response_model=sretirada.RetiradaResponse)
def atualizar_retirada(retirada_id: int, retirada: sretirada.RetiradaUpdate, db_session: Session = Depends(db.get_db)):
    retirada_db = crud_retirada.atualizar_retirada(
        db_session, retirada_id, retirada)
    if not retirada_db:
        raise HTTPException(status_code=404, detail="Retirada nao encontrada")
    return retirada_db


@router.delete("/{retirada_id}")
def remover_retirada(retirada_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_retirada.remover_retirada(db_session, retirada_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Retirada nao encontrada")
    return {"ok": True}


@router.post("/saida_completa", response_model=sretirada.RetiradaResponse)
def criar_saida_completa(
    saida_completa: sretirada.SaidaCompletaCreate,
    db_session: Session = Depends(db.get_db)
):
    try:
        return crud_retirada.criar_saida_completa(db_session, saida_completa)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro na saída completa: {str(e)}")
