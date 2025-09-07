## Livraria

A primeira parte do projeto contempla uma aplicacao pronta para o sistema para gerenciamento de estoque de livraria, desenvolvido com FastAPI no backend e React + TypeScript no frontend.

### Tecnologias: 

Backend: Python, FastAPI, PostgreSQL, SQLAlchemy
Frontend: React, TypeScript, Vite e MUI 

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
│       ├── 📜 main.py        # Aplicacao FastAPI
│       ├── 📜 models.py      # Modelos do banco
│       ├── 📜 db.py          # Conexao com PostgreSQL
│       └── 📜 requirements.txt
│
└── 📂 frontend
    ├── 📂 src
    │   ├── 📂 assets         # Imagens e recursos
    │   ├── 📂 components
    │   │   ├── 📂 movimentacao  # Formularios da aba de movimentacoes do estoque
    │   │   └── 📂 ui           # Componentes reutilizaveis
    │   ├── 📂 hooks          # Hooks customizados
    │   ├── 📂 layouts        # Layouts da aplicacao
    │   ├── 📂 pages          # Paginas principais
    │   ├── 📂 services       # Comunicacao com API
    │   └── 📂 styles         # Estilos CSS
    ├── 📜 package.json       # Dependências frontend
    └── 📜 vite.config.ts     # Configuracao Vite
```
