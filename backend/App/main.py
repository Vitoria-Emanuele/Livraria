from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import rdistribuidor, rfornecedor, rfuncionario, rusuario, ritem_lote, ritem_retirada, rlivro, rlote, rregistroentrada, rretirada


app = FastAPI(title="API da Livraria", version="1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Seu React (Vite)
        "http://127.0.0.1:5173",      # IP local também
        "http://localhost:3000",      # Caso use Create React App também
        "http://127.0.0.1:3000"       # IP local do CRA
    ],
    allow_credentials=True,           # Permite cookies/auth
    allow_methods=["*"],              # Permite TODOS os métodos HTTP
    allow_headers=["*"],              # Permite TODOS os headers
    expose_headers=["*"],             # Expõe todos os headers na resposta
    max_age=600,                      # Cache de 10min para preflight
)


@app.get("/")
def home():
    return {"message": "minha api esta no ar "}


# registra cada router
app.include_router(rdistribuidor.router)
app.include_router(rfornecedor.router)
app.include_router(rfuncionario.router)
app.include_router(rusuario.router)
app.include_router(rregistroentrada.router)
app.include_router(rlote.router)
app.include_router(rlivro.router)
app.include_router(ritem_lote.router)
app.include_router(rretirada.router)
app.include_router(ritem_retirada.router)
