from fastapi import FastAPI

from .routers import rdistribuidor, rfornecedor, rfuncionario, ritemlote, ritemretirada, rlivro, rlote, rregistroentrada, rretirada


app = FastAPI(title="API da Livraria", version="1.0")


@app.get("/")
def home():
    return {"message": "minha api esta no ar "}


# registra cada router
app.include_router(rdistribuidor.router)
app.include_router(rfornecedor.router)
app.include_router(rfuncionario.router)
app.include_router(rregistroentrada.router)
app.include_router(rlote.router)
app.include_router(rlivro.router)
app.include_router(ritemlote.router)
app.include_router(rretirada.router)
app.include_router(ritemretirada.router)
