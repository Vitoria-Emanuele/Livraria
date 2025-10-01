from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.App.db import get_db
from ..crud import crud_pagamento
from ..schemas import spagamento

router = APIRouter(
    prefix="/pagamento",
    tags=["Pagamento"]
)


@router.get("/", response_model=list[spagamento.PagamentoResponse])
def listar(db: Session = Depends(get_db)):
    return crud_pagamento.listar_pagamentos(db)


@router.get("/{pagamento_id}", response_model=spagamento.PagamentoResponse)
def buscar(pagamento_id: int, db: Session = Depends(get_db)):
    pagamento = crud_pagamento.buscar_pagamento(db, pagamento_id)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    return pagamento


@router.post("/", response_model=spagamento.PagamentoResponse)
def criar(pagamento: spagamento.PagamentoCreate, db: Session = Depends(get_db)):
    try:
        return crud_pagamento.criar_pagamento(db, pagamento)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{pagamento_id}", response_model=spagamento.PagamentoResponse)
def atualizar(pagamento_id: int, pagamento_update: spagamento.PagamentoUpdate, db: Session = Depends(get_db)):
    pagamento = crud_pagamento.atualizar_pagamento(
        db, pagamento_id, pagamento_update)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    return pagamento


@router.delete("/{pagamento_id}")
def remover(pagamento_id: int, db: Session = Depends(get_db)):
    sucesso = crud_pagamento.remover_pagamento(db, pagamento_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    return {"message": "Removido com sucesso"}


@router.post("/confirmar", response_model=dict)
def confirmar(pagamento: spagamento.PagamentoConfirmacao, db: Session = Depends(get_db)):
    try:
        compra = crud_pagamento.confirmar_pagamento(db, pagamento)
        return {"message": "Pagamento confirmado", "status_compra": compra.status_compra}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/cancelar/{id_compra}")
def cancelar(id_compra: int, db: Session = Depends(get_db)):
    try:
        compra = crud_pagamento.cancelar_pagamento(db, id_compra)
        return {"message": "Compra cancelada", "status_compra": compra.status_compra}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/compra/{compra_id}", response_model=spagamento.PagamentoResponse)
def atualizar_por_compra(compra_id: int, pagamento_update: spagamento.PagamentoUpdate, db: Session = Depends(get_db)):
    try:
        pagamento = crud_pagamento.atualizar_pagamento_por_compra(
            db, compra_id, pagamento_update)
        if not pagamento:
            raise HTTPException(
                status_code=404, detail="Pagamento não encontrado para esta compra")
        return pagamento
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
