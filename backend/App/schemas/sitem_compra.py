from pydantic import BaseModel
from typing import Optional


class ItemCompraBase(BaseModel):
    id_compra: int
    id_livro: int
    quantidade_item_compra: int
    valor_unitario_compra: float


class ItemCompraCreate(ItemCompraBase):
    pass


class ItemCompraUpdate(BaseModel):
    quantidade_item_compra: Optional[int] = None
    valor_unitario_compra: Optional[float] = None


class ItemCompraResponse(ItemCompraBase):
    id_item_compra: int

    class Config:
        from_attributes = True
