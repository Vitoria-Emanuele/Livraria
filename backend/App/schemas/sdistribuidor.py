from pydantic import BaseModel, EmailStr
from typing import Optional


class DistribuidorBase(BaseModel):
    cnpj_distribuidor: str
    nome_fantasia_distribuidor: str
    razao_social_distribuidor: str
    email_distribuidor: EmailStr
    telefone_distribuidor: str
    logradouro_distribuidor: str
    numero_logradouro_distribuidor: int
    bairro_distribuidor: str
    cidade_distribuidor: str
    estado_distribuidor: str
    cep_distribuidor: str
    complemento_distribuidor: Optional[str] = None


class DistribuidorCreate(DistribuidorBase):
    pass


class DistribuidorUpdate(BaseModel):
    cnpj_distribuidor: Optional[str] = None
    nome_fantasia_distribuidor: Optional[str] = None
    razao_social_distribuidor: Optional[str] = None
    email_distribuidor: Optional[EmailStr] = None
    telefone_distribuidor: Optional[str] = None
    logradouro_distribuidor: Optional[str] = None
    numero_logradouro_distribuidor: Optional[int] = None
    bairro_distribuidor: Optional[str] = None
    cidade_distribuidor: Optional[str] = None
    estado_distribuidor: Optional[str] = None
    cep_distribuidor: Optional[str] = None
    complemento_distribuidor: Optional[str] = None


class DistribuidorResponse(DistribuidorBase):
    id_distribuidor: int

    class Config:
        from_attributes = True
