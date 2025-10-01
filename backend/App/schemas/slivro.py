from pydantic import BaseModel
from typing import Optional


class LivroBase(BaseModel):
    isbn_livro: str
    titulo_livro: str
    autor_livro: str
    genero_literario: str
    editora_livro: str
    estoque_atual: int = 0
    valor_venda: float


class LivroCreate(LivroBase):
    pass


class LivroUpdate(BaseModel):
    isbn_livro: Optional[str] = None
    titulo_livro: Optional[str] = None
    autor_livro: Optional[str] = None
    genero_literario: Optional[str] = None
    editora_livro: Optional[str] = None
    estoque_atual: Optional[int] = None
    valor_venda: Optional[float] = None


class LivroResponse(LivroBase):
    id_livro: int

    class Config:
        from_attributes = True
