from pydantic import BaseModel, EmailStr
from typing import Optional

# Dados básicos de usuário (sem senha)


class UsuarioBase(BaseModel):
    email_login: EmailStr
    role: str
    ativo: bool
    id_funcionario: int


# Para criação de usuário, inclui senha em texto
class UsuarioCreate(UsuarioBase):
    senha: str


# Para atualização parcial de usuário, senha opcional em texto
class UsuarioUpdate(BaseModel):
    email_login: Optional[EmailStr] = None
    senha: Optional[str] = None  # senha em texto
    role: Optional[str] = None
    ativo: Optional[bool] = None
    id_funcionario: Optional[int] = None


# Resposta da API, nunca inclui senha ou hash
class UsuarioResponse(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True
