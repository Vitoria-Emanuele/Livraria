from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from .. import db, models
from ..crud import crud_livro, crud_fornecedor, crud_distribuidor, crud_funcionario

router = APIRouter(
    prefix="/pesquisa",
    tags=["Pesquisa"]
)


@router.get("/livro")
def pesquisar_livros(
    tipo: str = Query(
        "todos", description="todos, isbn, titulo, autor, genero, editora"),
    termo: Optional[str] = Query(None),
    db_session: Session = Depends(db.get_db)
):
    try:
        if tipo == "todos" or not termo:
            return crud_livro.listar_livros(db_session)

        elif tipo == "isbn":
            livro = crud_livro.buscar_isbn_livro(db_session, termo)
            return [livro] if livro else []
        elif tipo == "titulo":
            return db_session.query(models.Livro).filter(
                models.Livro.titulo_livro.ilike(f"%{termo}%")
            ).all()

        elif tipo == "autor":
            return db_session.query(models.Livro).filter(
                models.Livro.autor_livro.ilike(f"%{termo}%")
            ).all()

        elif tipo == "genero":
            return db_session.query(models.Livro).filter(
                models.Livro.genero_literario.ilike(f"%{termo}%")
            ).all()

        elif tipo == "editora":
            return db_session.query(models.Livro).filter(
                models.Livro.editora_livro.ilike(f"%{termo}%")
            ).all()

        else:
            raise HTTPException(
                status_code=400, detail="Tipo de pesquisa inválido")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro na pesquisa: {str(e)}")


@router.get("/fornecedor")
def pesquisar_fornecedores(
    tipo: str = Query(
        "todos", description="todos, cnpj, nome_fantasia, razao_social"),
    termo: Optional[str] = Query(None),
    db_session: Session = Depends(db.get_db)
):
    try:
        if tipo == "todos" or not termo:
            return crud_fornecedor.listar_fornecedor(db_session)

        elif tipo == "cnpj":
            return db_session.query(models.Fornecedor).filter(
                models.Fornecedor.cnpj_fornecedor.ilike(f"%{termo}%")
            ).all()

        elif tipo == "nome_fantasia":
            return db_session.query(models.Fornecedor).filter(
                models.Fornecedor.nome_fantasia_fornecedor.ilike(f"%{termo}%")
            ).all()

        elif tipo == "razao_social":
            return db_session.query(models.Fornecedor).filter(
                models.Fornecedor.razao_social_fornecedor.ilike(f"%{termo}%")
            ).all()

        else:
            raise HTTPException(
                status_code=400, detail="Tipo de pesquisa inválido")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro na pesquisa: {str(e)}")


@router.get("/distribuidores")
def pesquisar_distribuidores(
    tipo: str = Query(
        "todos", description="todos, cnpj, nome_fantasia, razao_social"),
    termo: Optional[str] = Query(None),
    db_session: Session = Depends(db.get_db)
):
    try:
        if tipo == "todos" or not termo:
            return crud_distribuidor.listar_distribuidores(db_session)

        elif tipo == "cnpj":
            return db_session.query(models.Distribuidor).filter(
                models.Distribuidor.cnpj_distribuidor.ilike(f"%{termo}%")
            ).all()

        elif tipo == "nome_fantasia":
            return db_session.query(models.Distribuidor).filter(
                models.Distribuidor.nome_fantasia_distribuidor.ilike(
                    f"%{termo}%")
            ).all()

        elif tipo == "razao_social":
            return db_session.query(models.Distribuidor).filter(
                models.Distribuidor.razao_social_distribuidor.ilike(
                    f"%{termo}%")
            ).all()

        else:
            raise HTTPException(
                status_code=400, detail="Tipo de pesquisa inválido")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro na pesquisa: {str(e)}")


@router.get("/funcionario")
def pesquisar_funcionarios(
    tipo: str = Query("todos", description="todos, nome, cpf, ctps, email"),
    termo: Optional[str] = Query(None),
    db_session: Session = Depends(db.get_db)
):
    try:
        if tipo == "todos" or not termo:
            return crud_funcionario.listar_funcionarios(db_session)

        elif tipo == "nome":
            return db_session.query(models.Funcionario).filter(
                models.Funcionario.nome_funcionario.ilike(f"%{termo}%")
            ).all()

        elif tipo == "cpf":
            return db_session.query(models.Funcionario).filter(
                models.Funcionario.cpf_funcionario.ilike(f"%{termo}%")
            ).all()

        elif tipo == "ctps":
            return db_session.query(models.Funcionario).filter(
                models.Funcionario.ctps_funcionario.ilike(f"%{termo}%")
            ).all()

        elif tipo == "email":
            return db_session.query(models.Funcionario).filter(
                models.Funcionario.email_funcionario.ilike(f"%{termo}%")
            ).all()

        else:
            raise HTTPException(
                status_code=400, detail="Tipo de pesquisa inválido")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro na pesquisa: {str(e)}")
