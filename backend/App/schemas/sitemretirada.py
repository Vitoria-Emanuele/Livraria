from pydantic import BaseModel
from typing import Optional


class ItemRetiradaBase(BaseModel):
    id_livro: int
    id_retirada: int
    quantidade_itens_retirada: int
    valor_unitario_retirada: float


class ItemRetiradaCreate(ItemRetiradaBase):
    pass


class ItemRetiradaUpdate(BaseModel):
    id_livro: Optional[int] = None
    id_retirada: Optional[int] = None
    quantidade_itens_retirada: Optional[int] = None
    valor_unitario_retirada: Optional[float] = None


class ItemRetiradaResponse(ItemRetiradaBase):
    class Config:
        from_attributes = True
