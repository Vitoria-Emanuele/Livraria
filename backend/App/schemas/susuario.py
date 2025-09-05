from pydantic import BaseModel, EmailStr
from typing import Optional


class UsuarioBase(BaseModel):
    email_login: EmailStr
    senha_hash: str
    role: str
    ativo: bool
    id_funcionario: int


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(BaseModel):
    email_login: Optional[EmailStr] = None
    senha_hash: Optional[str] = None
    role: Optional[str] = None
    ativo: Optional[bool] = None
    id_funcionario: Optional[int] = None


class UsuarioResponse(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True
