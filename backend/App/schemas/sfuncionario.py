from pydantic import BaseModel, EmailStr
from typing import Optional


class FuncionarioBase(BaseModel):
    nome_funcionario: str
    ctps_funcionario: str
    cpf_funcionario: str
    setor: str
    cargo: str
    salario: float
    telefone_funcionario: str
    email_funcionario: EmailStr
    logradouro_funcionario: str
    numero_logradouro_funcionario: int
    bairro_funcionario: str
    cidade_funcionario: str
    estado_funcionario: str
    cep_funcionario: str
    complemento_funcionario: str


class FuncionarioCreate(FuncionarioBase):
    pass


class FuncionarioUpdate(BaseModel):
    nome_funcionario: Optional[str] = None
    ctps_funcionario: Optional[str] = None
    cpf_funcionario: Optional[str] = None
    setor: Optional[str] = None
    cargo: Optional[str] = None
    salario: Optional[float] = None
    telefone_funcionario: Optional[str] = None
    email_funcionario: Optional[EmailStr] = None
    logradouro_funcionario: Optional[str] = None
    numero_logradouro_funcionario: Optional[int] = None
    bairro_funcionario: Optional[str] = None
    cidade_funcionario: Optional[str] = None
    estado_funcionario: Optional[str] = None
    cep_funcionario: Optional[str] = None
    complemento_funcionario: Optional[str] = None


class FuncionarioResponse(FuncionarioBase):
    id_funcionario: int

    class Config:
        from_attributes = True
