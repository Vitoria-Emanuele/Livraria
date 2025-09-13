from pydantic import BaseModel
from typing import Union


class RelatorioResponse(BaseModel):
    label: str
    value: Union[int, float]

    class Config:
        from_attributes = True
