# Documentação de Features

Este documento descreve as funcionalidades implementadas no Mini CRM de Leads.

## 📖 Como Rodar o Projeto

Para instruções detalhadas de como executar o projeto localmente:

- **Backend (API)**: [api/README.md](api/README.md)
- **Frontend (Web)**: [web/README.md](web/README.md)

### Resumo Rápido

```bash
# 1. Backend - Na pasta api/
docker-compose up -d
docker-compose exec api npx sequelize-cli db:migrate
docker-compose exec api npx sequelize-cli db:seed:all

# 2. Frontend - Na pasta web/
npm install
npm run dev
```

---

## ✅ Requisitos Implementados

### API (Hono + TypeScript + PostgreSQL)

#### Contatos

- [x] **GET /contacts** - Listar contatos com paginação
  - Query param `search`: filtra por nome ou email (case insensitive)
  - Query params `page` e `limit`: paginação
- [x] **GET /contacts/:id** - Buscar contato por ID
- [x] **POST /contacts** - Criar novo contato
  - Validação de dados com Zod
  - Retorna erro 400 se dados inválidos
- [x] **PUT /contacts/:id** - Atualizar contato existente
  - Validação de dados com Zod
  - Retorna erro 400 se dados inválidos
- [x] **DELETE /contacts/:id** - Remover contato

#### Leads

- [x] **GET /leads** - Listar leads com paginação
  - Query param `search`: filtra por nome ou empresa (case insensitive)
  - Query param `status`: filtra por status
  - Query params `page` e `limit`: paginação
- [x] **GET /leads/:id** - Buscar lead por ID
- [x] **POST /leads** - Criar novo lead (vinculado a um contato via `contactId`)
  - Validação de dados com Zod
  - Retorna erro 400 se dados inválidos
- [x] **PUT /leads/:id** - Atualizar lead existente
  - Validação de dados com Zod
  - Retorna erro 400 se dados inválidos
- [x] **DELETE /leads/:id** - Remover lead

#### Funis (Feature Extra)

- [x] **GET /funnels** - Listar funis
- [x] **GET /funnels/:id** - Buscar funil por ID com seus estágios
- [x] **POST /funnels** - Criar novo funil
- [x] **PUT /funnels/:id** - Atualizar funil
- [x] **DELETE /funnels/:id** - Remover funil

#### Estágios (Feature Extra)

- [x] **GET /stages** - Listar estágios
- [x] **GET /stages/:id** - Buscar estágio por ID
- [x] **POST /stages** - Criar novo estágio
- [x] **PUT /stages/:id** - Atualizar estágio
- [x] **DELETE /stages/:id** - Remover estágio

### Frontend (Next.js + React + TypeScript)

#### Leads

- [x] Listagem de leads em tabela com paginação
- [x] Campo de busca por nome/empresa
- [x] Filtro por status (dropdown)
- [x] Formulário para criar novo lead (selecionando um contato existente)
- [x] Edição de lead existente
- [x] Remoção de lead com confirmação
- [x] Feedback visual de loading e erro (toast notifications)

#### Contatos

- [x] Listagem de contatos em tabela com paginação
- [x] Campo de busca por nome/email
- [x] Formulário para criar novo contato
- [x] Edição de contato existente
- [x] Remoção de contato com confirmação
- [x] Visualização dos leads vinculados a um contato

#### CRM / Funis (Feature Extra)

- [x] Listagem de funis
- [x] Criação de novo funil com estágios
- [x] Visualização de funil com quadro Kanban de estágios
- [x] Gerenciamento de estágios dentro do funil

#### WebSocket - Atualizações em Tempo Real (Feature Extra)

- [x] **WS /ws** - Conexão WebSocket para atualizações em tempo real
- [x] **GET /ws/status** - Verificar status das conexões WebSocket
- [x] Eventos emitidos:
  - `lead:moved` - Quando um lead é movido entre estágios
  - `lead:created`, `lead:updated`, `lead:deleted` - CRUD de leads
  - `stage:created`, `stage:updated`, `stage:deleted` - CRUD de estágios

---

## ⭐ Diferenciais Implementados

- [x] **Paginação** na listagem de leads e contatos
- [x] **Edição** de lead existente
- [x] **Edição** de contato existente
- [x] **Remoção de lead** com confirmação
- [x] **Remoção de contato** com confirmação
- [x] **Responsividade** (interface adaptada para mobile)
- [x] **Banco de dados PostgreSQL** (ao invés de persistência em memória)
- [x] **Docker** para facilitar o setup do ambiente
- [x] **Sistema de Funis/CRM** com estágios (feature extra não solicitada)
- [x] **WebSocket** para atualizações em tempo real do Kanban

---

## 🛠️ Stack Utilizada

### Backend

| Tecnologia | Uso |
|------------|-----|
| Hono | Framework HTTP |
| @hono/node-ws | WebSocket middleware |
| TypeScript | Linguagem |
| Zod | Validação de dados |
| Sequelize | ORM |
| PostgreSQL | Banco de dados |
| Docker | Containerização |

### Frontend

| Tecnologia | Uso |
|------------|-----|
| Next.js 16 | Framework React |
| React 19 | Biblioteca UI |
| TypeScript | Linguagem |
| Tailwind CSS 4 | Estilização |
| shadcn/ui | Componentes UI |
| React Query | Gerenciamento de estado do servidor |
| React Hook Form | Formulários |
| Zod | Validação |
| Lucide React | Ícones |
| Sonner | Toast notifications |

---

## 📁 Arquitetura

### Backend

```
api/
├── config/              # Configuração Sequelize
├── migrations/          # Migrations do banco
├── models/              # Models Sequelize
├── seeders/             # Seeds de dados
└── src/
    ├── env/             # Validação de env vars
    ├── http/
    │   ├── controllers/ # Rotas e handlers
    │   └── schemas/     # Schemas Zod
    ├── lib/             # Conexão DB
    ├── repositories/    # Camada de acesso a dados
    └── service/         # Regras de negócio
```

### Frontend

```
web/
└── src/
    ├── app/             # Rotas (App Router)
    ├── components/
    │   ├── content/     # Layout components
    │   ├── pages/       # Componentes de página
    │   └── ui/          # shadcn/ui components
    ├── dto/             # Data Transfer Objects
    ├── hooks/           # Custom hooks
    ├── lib/             # Utilitários
    └── providers/       # Context providers
```

---

## 📝 Observações

- O projeto utiliza PostgreSQL via Docker ao invés de persistência em memória para maior robustez
- As migrations e seeders estão configurados para popular o banco com dados de exemplo
- O frontend utiliza React Query para cache e sincronização de dados com a API
- Todas as validações são feitas tanto no frontend quanto no backend com Zod
- **WebSocket** implementado com `@hono/node-ws` para atualizações em tempo real
  - O frontend conecta automaticamente ao WebSocket e mostra indicador de status
  - Quando um usuário move um lead no Kanban, todos os outros usuários veem a atualização instantaneamente
  - Reconexão automática em caso de desconexão
