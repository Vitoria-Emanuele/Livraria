from pydantic import BaseModel
from typing import Optional


class ItemLoteBase(BaseModel):
    id_lote: int
    id_livro: int
    quantidade_item_lote: int
    valor_item_lote: float


class ItemLoteCreate(ItemLoteBase):
    pass


class ItemLoteUpdate(BaseModel):
    id_lote: Optional[int] = None
    id_livro: Optional[int] = None
    quantidade_item_lote: Optional[int] = None
    valor_item_lote: Optional[float] = None


class ItemLoteResponse(ItemLoteBase):
    class Config:
        from_attributes = True
