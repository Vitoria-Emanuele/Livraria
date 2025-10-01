from pydantic import BaseModel
from datetime import date
from typing import Optional


class CupomBase(BaseModel):
    codigo_cupom: str
    tipo_cupom: Optional[str] = None
    percentual_desconto: float
    regra_cupom: str
    data_validade: date


class CupomCreate(CupomBase):
    pass


class CupomUpdate(BaseModel):
    codigo_cupom: Optional[str] = None
    tipo_cupom: Optional[str] = None
    percentual_desconto: Optional[float] = None
    data_validade: Optional[date] = None


class CupomResponse(CupomBase):
    id_cupom: int

    class Config:
        from_attributes = True
