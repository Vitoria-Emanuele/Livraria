from pydantic import BaseModel
from typing import Optional


class item_retiradaBase(BaseModel):
    id_livro: int
    id_retirada: int
    quantidade_itens_retirada: int
    valor_unitario_retirada: float


class item_retiradaCreate(item_retiradaBase):
    pass


class item_retiradaUpdate(BaseModel):
    id_livro: Optional[int] = None
    id_retirada: Optional[int] = None
    quantidade_itens_retirada: Optional[int] = None
    valor_unitario_retirada: Optional[float] = None


class item_retiradaResponse(item_retiradaBase):
    class Config:
        from_attributes = True
