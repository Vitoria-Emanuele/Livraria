from pydantic import BaseModel
from datetime import date, time
from typing import Optional, List, Literal
from .sitem_compra import ItemCompraResponse


class ItemCompraCreate(BaseModel):
    id_livro: int
    quantidade: int


class CompraBase(BaseModel):
    id_cliente: int
    id_funcionario: Optional[int] = None
    id_cupom: Optional[int] = None


class CompraCreate(CompraBase):
    data_compra: date
    hora_compra: time
    total_bruto: float
    desconto_aplicado: float
    total_liquido: float
    status_compra: Literal["AGUARDANDO_PAGAMENTO",
                           "PAGO", "CANCELADO"] = "AGUARDANDO_PAGAMENTO"


class CompraCompletaCreate(CompraBase):
    itens: List[ItemCompraCreate]


class CompraUpdate(BaseModel):
    data_compra: Optional[date] = None
    hora_compra: Optional[time] = None
    total_bruto: Optional[float] = None
    desconto_aplicado: Optional[float] = None
    total_liquido: Optional[float] = None
    id_cliente: Optional[int] = None
    id_funcionario: Optional[int] = None
    id_cupom: Optional[int] = None
    status_compra: Optional[Literal["AGUARDANDO_PAGAMENTO",
                                    "PAGO", "CANCELADO"]] = None


class CompraResponse(BaseModel):
    id_compra: int
    data_compra: date
    hora_compra: time
    total_bruto: float
    desconto_aplicado: float
    total_liquido: float
    id_cliente: int
    id_funcionario: Optional[int]
    id_cupom: Optional[int]
    status_compra: Literal["AGUARDANDO_PAGAMENTO", "PAGO", "CANCELADO"]

    itens: Optional[List[ItemCompraResponse]] = None

    class Config:
        from_attributes = True
