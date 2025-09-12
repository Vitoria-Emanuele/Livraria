from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import db
from ..schemas import slivro
from ..crud import crud_livro

router = APIRouter(
    prefix="/livro",
    tags=["Livro"]
)


@router.get("/{livro_id}", response_model=slivro.LivroResponse)
def buscar_livro(livro_id: int, db_session: Session = Depends(db.get_db)):
    livro = crud_livro.buscar_livro(db_session, livro_id)
    if not livro:
        raise HTTPException(status_code=404, detail="Livro nao encontrado")
    return livro


@router.get("/isbn/{isbn_livro}", response_model=slivro.LivroResponse)
def buscar_isbn_livro(isbn_livro: str, db_session: Session = Depends(db.get_db)):
    livro = crud_livro.buscar_isbn_livro(db_session, isbn_livro)
    if not livro:
        raise HTTPException(status_code=404, detail="Livro nao encontrado")
    return livro


@router.get("/", response_model=list[slivro.LivroResponse])
def listar_livros(db_session: Session = Depends(db.get_db)):
    return crud_livro.listar_livros(db_session)


@router.post("/", response_model=slivro.LivroResponse)
def criar_livro(livro: slivro.LivroCreate, db_session: Session = Depends(db.get_db)):
    return crud_livro.criar_livro(db_session, livro)


@router.put("/{livro_id}", response_model=slivro.LivroResponse)
def atualizar_livro(livro_id: int, livro: slivro.LivroUpdate, db_session: Session = Depends(db.get_db)):
    livro_db = crud_livro.atualizar_livro(db_session, livro_id, livro)
    if not livro_db:
        raise HTTPException(status_code=404, detail="Livro nao encontrado")
    return livro_db


@router.delete("/{livro_id}")
def remover_livro(livro_id: int, db_session: Session = Depends(db.get_db)):
    sucesso = crud_livro.remover_livro(db_session, livro_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Livro nao encontrado")
    return {"ok": True}
