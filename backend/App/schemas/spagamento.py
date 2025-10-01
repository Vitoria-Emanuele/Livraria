from pydantic import BaseModel
from datetime import date, time
from typing import Literal, Optional


class PagamentoBase(BaseModel):
    id_compra: int
    forma_pagamento: Literal['CARTAO', 'BOLETO', 'PIX', 'BERRIES']
    status_pagamento: Literal['PENDENTE', 'CONFIRMADO', 'CANCELADO']
    data_pagamento: date
    hora_pagamento: time
    valor_pago: float


class PagamentoCreate(PagamentoBase):
    pass


class PagamentoUpdate(BaseModel):
    forma_pagamento: Optional[Literal['CARTAO',
                                      'BOLETO', 'PIX', 'BERRIES']] = None
    status_pagamento: Optional[Literal['PENDENTE',
                                       'CONFIRMADO', 'CANCELADO']] = None
    data_pagamento: Optional[date] = None
    hora_pagamento: Optional[time] = None
    valor_pago: Optional[float] = None


class PagamentoResponse(PagamentoBase):
    id_pagamento: int

    class Config:
        from_attributes = True


class PagamentoConfirmacao(BaseModel):
    id_compra: int
    forma_pagamento: Literal['CARTAO', 'BOLETO', 'PIX', 'BERRIES']
    valor_pago: Optional[float] = None
