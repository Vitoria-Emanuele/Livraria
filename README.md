## Livraria

A primeira parte do projeto contempla uma aplicação pronta para o sistema para gerenciamento de estoque de livraria, desenvolvido com FastAPI no backend e React + TypeScript no frontend.

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
│       ├── 📂 crud           # Operações de banco de dados
│       ├── 📂 routers        # Endpoints da API
│       ├── 📂 schemas        # Validação de dados
│       ├── 📜 main.py        # Aplicação FastAPI
│       ├── 📜 models.py      # Modelos do banco
│       ├── 📜 db.py          # Conexão com PostgreSQL
│       └── 📜 requirements.txt
│
└── 📂 frontend
    ├── 📂 src
    │   ├── 📂 assets         # Imagens e recursos
    │   ├── 📂 components
    │   │   ├── 📂 movimentacao  # Formulários da aba de movimentações do estoque
    │   │   └── 📂 ui           # Componentes reutilizáveis
    │   ├── 📂 hooks          # Hooks customizados
    │   ├── 📂 layouts        # Layouts da aplicação
    │   ├── 📂 pages          # Páginas principais
    │   ├── 📂 services       # Comunicação com API
    │   └── 📂 styles         # Estilos CSS
    ├── 📜 package.json       # Dependências frontend
    └── 📜 vite.config.ts     # Configuração Vite
```
