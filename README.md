## Livraria

A primeira parte do projeto contempla uma aplicacao pronta para o sistema para gerenciamento de estoque de livraria, desenvolvido com FastAPI no backend e React + TypeScript no frontend.

### Tecnologias: 

- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy

- Frontend: React, TypeScript, Vite e MUI 

### Estrutura:
```
estoque-livraria/
├── backend/          # API FastAPI com PostgreSQL
├── frontend/         # Interface React com TypeScript
└── README.md
```

### Árvore de Pastas:

```
📦 Livraria
├── 📂 backend
│   └── 📂 App
│       ├── 📂 crud           # Operacoes de banco de dados
│       ├── 📂 routers        # Endpoints da API
│       ├── 📂 schemas        # Validacao de dados
|       ├── 📜 auth.py        # Regras de autenticação (login/JWT)
|       ├── 📜 config.py      # Cofiguração/variáveis de ambiente
│       ├── 📜 db.py          # Conexao com PostgreSQL
│       ├── 📜 main.py        # Aplicacao FastAPI
│       ├── 📜 models.py      # Modelos do banco
│       ├── 📜 security.py    # Regras de segurança (hashing, permissões)
│       └── 📜 requirements.txt
│
└── 📂 frontend
    ├── 📂 src
    │   ├── 📂 assets               # Imagens e recursos
    │   ├── 📂 components
    │   │   ├── 📂 movimentacao     # Componentes da aba de movimentações
    |   |   ├── 📂 relatorio        # Componentes para relatórios
    │   │   └── 📂 ui               # Componentes reutilizaveis
    │   ├── 📂 contexts             # Context API
    │   ├── 📂 hooks                # Hooks customizados
    │   ├── 📂 layouts              # Estruturas de layouts da aplicacao
    │   ├── 📂 pages                # Paginas principais
    │   ├── 📂 services             # Comunicacao com API
    │   └── 📂 styles               # Estilos CSS
    │   ├── 📜 App.tsx              # Componente raiz
    │   ├── 📜 main.tsx             # Ponto de entrada da aplicação
    │   └── 📜 vite-env.d.ts     # Tipagens globais para Vite

```
