from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.App.routers import rpesquisa, rrelatorio

from .routers import rdistribuidor, rfornecedor, rfuncionario, rusuario, ritem_lote, ritem_retirada, rlivro, rlote, rregistroentrada, rretirada, rauth


app = FastAPI(title="API da Livraria", version="1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Seu React (Vite)
        "http://127.0.0.1:5173",      # IP local tambem
        "http://localhost:3000",      # Caso use Create React App tambem
        "http://127.0.0.1:3000"       # IP local do CRA
    ],
    allow_credentials=True,           # Permite cookies/auth
    allow_methods=["*"],              # Permite TODOS os metodos HTTP
    allow_headers=["*"],              # Permite TODOS os headers
    expose_headers=["*"],             # Expoe todos os headers na resposta
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
app.include_router(rauth.router)
app.include_router(rregistroentrada.router)
app.include_router(rlote.router)
app.include_router(rlivro.router)
app.include_router(ritem_lote.router)
app.include_router(rretirada.router)
app.include_router(ritem_retirada.router)
app.include_router(rrelatorio.router)
app.include_router(rpesquisa.router)
