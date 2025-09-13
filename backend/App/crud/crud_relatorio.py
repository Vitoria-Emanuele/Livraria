from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import Optional, List, Dict
from .. import models


def gerar_relatorio(
    db_session: Session,
    tipo: str,
    campo: str,
    agrupamento: str,
    data_inicial: Optional[str] = None,
    data_final: Optional[str] = None
) -> List[Dict]:

    mapeamento_campos = {
        "entradas": ["funcionario", "fornecedor", "livro", "genero"],
        "retiradas": ["funcionario", "motivo", "livro", "genero"],
        "estoque": ["livro", "genero", "editora"]
    }

    if tipo not in mapeamento_campos or campo not in mapeamento_campos[tipo]:
        return []

    if tipo == "entradas":
        return _query_entradas(db_session, campo, agrupamento, data_inicial, data_final)
    elif tipo == "retiradas":
        return _query_retiradas(db_session, campo, agrupamento, data_inicial, data_final)
    elif tipo == "estoque":
        return _query_estoque(db_session, campo, agrupamento)

    return []


def _query_entradas(db_session, campo, agrupamento, data_inicial, data_final):
    query = f"""
    SELECT 
        {"f.nome_funcionario" if campo == "funcionario" else
         "forn.nome_fantasia_fornecedor" if campo == "fornecedor" else
         "l.titulo_livro" if campo == "livro" else
         "l.genero_literario"} as label,
        COUNT(e.id_entrada) as value,
        {"DATE_TRUNC('" + agrupamento + "', e.data_entrada)" if agrupamento in ['day', 'month', 'year'] else "NULL"} as periodo
    FROM estoque.registro_entrada e
    INNER JOIN estoque.funcionario f ON e.id_funcionario = f.id_funcionario
    INNER JOIN estoque.fornecedor forn ON e.id_fornecedor = forn.id_fornecedor
    INNER JOIN estoque.lote lt ON e.id_entrada = lt.id_entrada
    INNER JOIN estoque.item_lote it ON lt.id_lote = it.id_lote
    INNER JOIN estoque.livro l ON it.id_livro = l.id_livro
    {"WHERE e.data_entrada BETWEEN :data_inicial AND :data_final" if data_inicial and data_final else ""}
    GROUP BY label{" , periodo" if agrupamento in ['day', 'month', 'year'] else ""}
    ORDER BY value DESC
    """

    params = {}
    if data_inicial and data_final:
        params = {'data_inicial': data_inicial, 'data_final': data_final}

    result = db_session.execute(text(query), params)
    return _formatar_resultados(result, agrupamento)


def _query_retiradas(db_session, campo, agrupamento, data_inicial, data_final):
    query = f"""
    SELECT 
        {"f.nome_funcionario" if campo == "funcionario" else
         "r.motivo_retirada" if campo == "motivo" else
         "l.titulo_livro" if campo == "livro" else
         "l.genero_literario"} as label,
        COUNT(r.id_retirada) as value,
        {"DATE_TRUNC('" + agrupamento + "', r.data_retirada)" if agrupamento in ['day', 'month', 'year'] else "NULL"} as periodo
    FROM estoque.retirada r
    INNER JOIN estoque.funcionario f ON r.id_funcionario = f.id_funcionario
    INNER JOIN estoque.item_retirada ir ON r.id_retirada = ir.id_retirada
    INNER JOIN estoque.livro l ON ir.id_livro = l.id_livro
    {"WHERE r.data_retirada BETWEEN :data_inicial AND :data_final" if data_inicial and data_final else ""}
    GROUP BY label{" , periodo" if agrupamento in ['day', 'month', 'year'] else ""}
    ORDER BY value DESC
    """

    params = {}
    if data_inicial and data_final:
        params = {'data_inicial': data_inicial, 'data_final': data_final}

    result = db_session.execute(text(query), params)
    return _formatar_resultados(result, agrupamento)


def _query_estoque(db_session, campo, agrupamento):
    query = f"""
    SELECT 
        {"titulo_livro" if campo == "livro" else
         "genero_literario" if campo == "genero" else
         "editora_livro"} as label,
        SUM(estoque_atual) as value
    FROM estoque.livro
    GROUP BY label
    ORDER BY value DESC
    """

    result = db_session.execute(text(query))
    return [{"label": row.label, "value": row.value} for row in result]


def _formatar_resultados(result, agrupamento):
    resultados = []
    for row in result:
        if agrupamento in ['day', 'month', 'year'] and row.periodo:
            label = f"{row.label} - {row.periodo.strftime('%Y-%m-%d' if agrupamento == 'day' else '%Y-%m' if agrupamento == 'month' else '%Y')}"
        else:
            label = row.label
        resultados.append({"label": label, "value": row.value})
    return resultados


def relatorio_financeiro(
    db_session: Session,
    tipo: str,
    agrupamento: str,
    data_inicial: Optional[str] = None,
    data_final: Optional[str] = None
) -> List[Dict]:

    if tipo == "gastos":
        query = """
        SELECT 
            DATE_TRUNC(:agrupamento, e.data_entrada) as periodo,
            SUM(il.valor_item_lote * il.quantidade_item_lote) as value
        FROM estoque.registro_entrada e
        JOIN estoque.lote l ON e.id_entrada = l.id_entrada
        JOIN estoque.item_lote il ON l.id_lote = il.id_lote
        WHERE 1=1
        """

    elif tipo == "lucros":
        query = """
        SELECT 
            DATE_TRUNC(:agrupamento, r.data_retirada) as periodo,
            SUM(ir.valor_unitario_retirada * ir.quantidade_itens_retirada) - 
            SUM(il.valor_item_lote * ir.quantidade_itens_retirada) as value
        FROM estoque.retirada r
        JOIN estoque.item_retirada ir ON r.id_retirada = ir.id_retirada
        JOIN estoque.livro liv ON ir.id_livro = liv.id_livro
        JOIN estoque.item_lote il ON liv.id_livro = il.id_livro
        WHERE 1=1
        """

    if data_inicial and data_final:
        if tipo == "gastos":
            query += " AND e.data_entrada BETWEEN :data_inicial AND :data_final"
        else:
            query += " AND r.data_retirada BETWEEN :data_inicial AND :data_final"

    query += " GROUP BY periodo ORDER BY periodo"

    result = db_session.execute(text(query), {
        'agrupamento': agrupamento,
        'data_inicial': data_inicial,
        'data_final': data_final
    })

    dados_formatados = []
    for row in result:
        periodo = row[0]
        valor = row[1]

        if agrupamento == 'month':
            label = periodo.strftime('%Y-%m')
        elif agrupamento == 'year':
            label = periodo.strftime('%Y')
        else:
            label = periodo.strftime('%Y-%m-%d')

        dados_formatados.append({
            "label": label,
            "value": float(valor)
        })

    return dados_formatados
