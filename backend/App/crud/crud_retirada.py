from sqlalchemy.orm import Session
from .. import models
from ..schemas import sretirada


def listar_retiradas(db: Session):
    return db.query(models.Retirada).all()


def buscar_retirada(db: Session, retirada_id: int):
    return db.query(models.Retirada).filter(models.Retirada.id_retirada == retirada_id).first()


def atualizar_retirada(db: Session, retirada_id: int, retirada_update: sretirada.RetiradaUpdate):
    db_retirada = buscar_retirada(db, retirada_id)
    if not db_retirada:
        return None
    for key, value in retirada_update.model_dump(exclude_unset=True).items():
        setattr(db_retirada, key, value)

    db.flush()
    return db_retirada


def remover_retirada(db: Session, retirada_id: int):
    db_retirada = buscar_retirada(db, retirada_id)
    if db_retirada:
        db.delete(db_retirada)
        return True
    return False


def criar_retirada(db: Session, retirada: sretirada.RetiradaCreate):
    db_retirada = models.Retirada(**retirada.model_dump())
    db.add(db_retirada)

    db.flush()
    return db_retirada


def criar_saida_completa(db: Session, saida_completa: sretirada.SaidaCompletaCreate):
    from datetime import date, time

    db_retirada = models.Retirada(
        motivo_retirada=saida_completa.motivo_retirada,
        data_retirada=date.today(),
        hora_retirada=time.now().strftime("%H:%M:%S"),
        id_funcionario=saida_completa.id_funcionario
    )
    db.add(db_retirada)
    db.flush()

    for item in saida_completa.itens:
        livro = db.query(models.Livro).filter(
            models.Livro.id_livro == item.id_livro).first()
        if not livro:
            raise Exception(f"Livro com ID {item.id_livro} não encontrado")

        if livro.estoque_atual < item.quantidade:
            raise Exception(
                f"Estoque insuficiente para livro ID {item.id_livro}. Disponível: {livro.estoque_atual}, Solicitado: {item.quantidade}")

        db_item_retirada = models.item_retirada(
            id_retirada=db_retirada.id_retirada,
            id_livro=item.id_livro,
            quantidade_itens_retirada=item.quantidade,
            valor_unitario_retirada=item.valor_unitario
        )
        db.add(db_item_retirada)

        livro.estoque_atual -= item.quantidade

    return db_retirada
