from pydantic import BaseModel
from typing import Optional
from datetime import date, time


class registro_entradaBase(BaseModel):
    data_entrada: date
    hora_entrada: time
    id_fornecedor: int
    id_funcionario: int
    id_distribuidor: Optional[int] = None  # distribuidor é opcional


class registro_entradaCreate(registro_entradaBase):
    pass


class registro_entradaUpdate(BaseModel):
    data_entrada: Optional[date] = None
    hora_entrada: Optional[time] = None
    id_fornecedor: Optional[int] = None
    id_funcionario: Optional[int] = None
    id_distribuidor: Optional[int] = None


class registro_entradaResponse(registro_entradaBase):
    id_entrada: int

    class Config:
        from_attributes = True
