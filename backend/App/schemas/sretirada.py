from pydantic import BaseModel
from typing import Optional
from datetime import date, time


class RetiradaBase(BaseModel):
    motivo_retirada: str
    data_retirada: date
    hora_retirada: time
    id_funcionario: int


class RetiradaCreate(RetiradaBase):
    pass


class RetiradaUpdate(BaseModel):
    motivo_retirada: Optional[str] = None
    data_retirada: Optional[date] = None
    hora_retirada: Optional[time] = None
    id_funcionario: Optional[int] = None


class RetiradaResponse(RetiradaBase):
    id_retirada: int

    class Config:
        from_attributes = True
