from pydantic import BaseModel
from typing import Optional


class item_loteBase(BaseModel):
    id_lote: int
    id_livro: int
    quantidade_itens_lote: int
    valor_item_lote: float


class item_loteCreate(item_loteBase):
    pass


class item_loteUpdate(BaseModel):
    id_lote: Optional[int] = None
    id_livro: Optional[int] = None
    quantidade_item_lote: Optional[int] = None
    valor_item_lote: Optional[float] = None


class item_loteResponse(item_loteBase):
    class Config:
        from_attributes = True
