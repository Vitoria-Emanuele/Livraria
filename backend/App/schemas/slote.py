from pydantic import BaseModel
from typing import Optional


class LoteBase(BaseModel):
    valor_lote: float
    quantidade_itens_lote: int
    id_entrada: int


class LoteCreate(LoteBase):
    pass


class LoteUpdate(BaseModel):
    valor_lote: Optional[float] = None
    quantidade_itens_lote: Optional[int] = None
    id_entrada: Optional[int] = None


class LoteResponse(LoteBase):
    id_lote: int

    class Config:
        from_attributes = True
