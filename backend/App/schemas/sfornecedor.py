from pydantic import BaseModel, EmailStr
from typing import Optional


class FornecedorBase(BaseModel):
    cnpj_fornecedor: str
    nome_fantasia_fornecedor: str
    razao_social_fornecedor: str
    email_fornecedor: EmailStr
    telefone_fornecedor: str
    logradouro_fornecedor: str
    numero_logradouro_fornecedor: int
    bairro_fornecedor: str
    cidade_fornecedor: str
    estado_fornecedor: str
    cep_fornecedor: str
    complemento_fornecedor: str


class FornecedorCreate(FornecedorBase):
    pass


class FornecedorUpdate(BaseModel):
    cnpj_fornecedor: Optional[str] = None
    nome_fantasia_fornecedor: Optional[str] = None
    razao_social_fornecedor: Optional[str] = None
    email_fornecedor: Optional[EmailStr] = None
    telefone_fornecedor: Optional[str] = None
    logradouro_fornecedor: Optional[str] = None
    numero_logradouro_fornecedor: Optional[int] = None
    bairro_fornecedor: Optional[str] = None
    cidade_fornecedor: Optional[str] = None
    estado_fornecedor: Optional[str] = None
    cep_fornecedor: Optional[str] = None
    complemento_fornecedor: Optional[str] = None


class FornecedorResponse(FornecedorBase):
    id_fornecedor: int

    class Config:
        from_attributes = True
