from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from .. import db
from ..crud import crud_relatorio
from ..schemas import srelatorio

router = APIRouter(
    prefix="/relatorio",
    tags=["Relatório"]
)


@router.get("/", response_model=list[srelatorio.RelatorioResponse])
def gerar_relatorio(
    tipo: str = Query(...,
                      description="Tipo: entradas, retiradas, estoque, gastos, lucros"),
    campo: str = Query(..., description="Campo de agrupamento..."),
    agrupamento: str = Query(..., description="Agrupamento: dia, mes, ano"),
    data_inicial: Optional[str] = Query(None),
    data_final: Optional[str] = Query(None),
    db_session: Session = Depends(db.get_db)
):
    if tipo in ['gastos', 'lucros']:
        resultado = crud_relatorio.relatorio_financeiro(
            db_session, tipo, agrupamento, data_inicial, data_final
        )
    else:
        resultado = crud_relatorio.gerar_relatorio(
            db_session, tipo, campo, agrupamento, data_inicial, data_final
        )

    if not resultado:
        raise HTTPException(status_code=404, detail="Nenhum dado encontrado")

    return resultado
