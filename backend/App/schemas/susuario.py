from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional


class UsuarioBase(BaseModel):
    email_login: EmailStr
    role: str
    ativo: bool = True

    id_funcionario: Optional[int] = None
    id_cliente: Optional[int] = None

    @field_validator('role')
    def validate_role(cls, value):
        allowed_roles = ['CLIENTE', 'FUNCIONARIO']
        if value not in allowed_roles:
            raise ValueError(f"Role invalido. Deve ser um de: {allowed_roles}")
        return value


class UsuarioCreate(UsuarioBase):
    senha: str


class UsuarioUpdate(BaseModel):
    email_login: Optional[EmailStr] = None
    senha: Optional[str] = None
    role: Optional[str] = None
    ativo: Optional[bool] = None
    id_funcionario: Optional[int] = None
    id_cliente: Optional[int] = None


class UsuarioResponse(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True
