from datetime import date
from pydantic import BaseModel, EmailStr
from typing import Optional


class ClienteBase(BaseModel):
    nome_cliente: str
    cpf_cliente: str
    data_nascimento_cliente: date
    telefone_cliente: str
    email_cliente: EmailStr
    logradouro_cliente: str
    numero_logradouro_cliente: int
    bairro_cliente: str
    cidade_cliente: str
    estado_cliente: str
    cep_cliente: str
    complemento_cliente: Optional[str] = None


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nome_cliente: Optional[str] = None
    cpf_cliente: Optional[str] = None
    data_nascimento_cliente: Optional[date] = None
    telefone_cliente: Optional[str] = None
    email_cliente: Optional[EmailStr] = None
    logradouro_cliente: Optional[str] = None
    numero_logradouro_cliente: int
    bairro_cliente: Optional[str] = None
    cidade_cliente: Optional[str] = None
    estado_cliente: Optional[str] = None
    cep_cliente: Optional[str] = None
    complemento_cliente: Optional[str] = None


class ClienteResponse(ClienteBase):
    id_cliente: int

    class Config:
        from_attributes = True
