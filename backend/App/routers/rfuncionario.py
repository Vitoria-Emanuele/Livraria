from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud import crud_funcionario
from ..schemas import sfuncionario
from .. import db


router = APIRouter(
    prefix="/funcionario",   # prefixo da rota
    tags=["Funcionario"]     # aparece na doc do Swagger
)

# Obter funcionario por ID


@router.get("/{funcionario_id}", response_model=sfuncionario.FuncionarioResponse)
def buscar_funcionario(funcionario_id: int, db_session: Session = Depends(db.get_db)):
    db_funcionario = crud_funcionario.buscar_funcionario(
        db_session, funcionario_id)
    if not db_funcionario:
        raise HTTPException(
            status_code=404, detail="Funcionario não encontrado")
    return db_funcionario

# Listar funcionario


@router.get("/", response_model=list[sfuncionario.FuncionarioResponse])
def listar_funcionario(db_session: Session = Depends(db.get_db)):
    return crud_funcionario.listar_funcionario(db_session)

# Criar funcionario


@router.post("/", response_model=sfuncionario.FuncionarioResponse)
def criar_funcionario(funcionario: sfuncionario.FuncionarioCreate, db_session: Session = Depends(db.get_db)):
    return crud_funcionario.criar_funcionario(db_session, funcionario)


# Atualizar funcionario
@router.put("/{funcionario_id}", response_model=sfuncionario.FuncionarioResponse)
def atualizar_funcionario(funcionario_id: int, funcionario: sfuncionario.FuncionarioUpdate, db_session: Session = Depends(db.get_db)):
    db_funcionario = crud_funcionario.atualizar_funcionario(
        db_session, funcionario_id, funcionario)
    if not db_funcionario:
        raise HTTPException(
            status_code=404, detail="Funcionario não encontrado")
    return db_funcionario

# Remover funcionario


@router.delete("/{funcionario_id}")
def remover_funcionario(funcionario_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_funcionario.remover_funcionario(db_session, funcionario_id)
    if not sucesso:
        raise HTTPException(
            status_code=404, detail="Funcionario não encontrado")
    return {"ok": True}
