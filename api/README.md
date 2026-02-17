# API - Backend

API REST desenvolvida com [Hono](https://hono.dev/), [Sequelize](https://sequelize.org/) e PostgreSQL.

## Requisitos

- Node.js 22+
- Docker e Docker Compose (recomendado)
- PostgreSQL 16+ (se rodar localmente sem Docker)

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `api/` com as seguintes variáveis:

```env
NODE_ENV=development
API_PORT=3333
POSTGRES_PORT=5432
POSTGRES_USER=root
POSTGRES_PASSWORD=12345678A@
```

## Rodando com Docker (Recomendado)

### 1. Subir os containers

```bash
docker-compose up -d
```

Isso irá iniciar:
- **API** na porta `3333`
- **PostgreSQL** na porta configurada em `POSTGRES_PORT`

### 2. Executar migrations

```bash
docker-compose exec api npx sequelize-cli db:migrate
```

### 3. Popular o banco com dados iniciais (opcional)

```bash
docker-compose exec api npx sequelize-cli db:seed:all
```

### 4. Acessar a API

```
http://localhost:3333
```

## Rodando Localmente (sem Docker)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Certifique-se de que o PostgreSQL está rodando e atualize o arquivo `config/config.json` com as credenciais corretas.

### 3. Executar migrations

```bash
npx sequelize-cli db:migrate
```

### 4. Popular o banco (opcional)

```bash
npx sequelize-cli db:seed:all
```

### 5. Iniciar em modo desenvolvimento

```bash
npm run dev
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Inicia o servidor a partir do build |

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check |
| GET/POST | `/leads` | Listar/Criar leads |
| GET/PUT/DELETE | `/leads/:id` | Operações em lead específico |
| GET/POST | `/contacts` | Listar/Criar contatos |
| GET/PUT/DELETE | `/contacts/:id` | Operações em contato específico |
| GET/POST | `/funnels` | Listar/Criar funis |
| GET/PUT/DELETE | `/funnels/:id` | Operações em funil específico |
| GET/POST | `/stages` | Listar/Criar estágios |
| GET/PUT/DELETE | `/stages/:id` | Operações em estágio específico |

## Estrutura do Projeto

```
api/
├── config/          # Configuração do Sequelize
├── migrations/      # Migrations do banco de dados
├── models/          # Models do Sequelize
├── seeders/         # Seeds para popular o banco
└── src/
    ├── env/         # Validação de variáveis de ambiente
    ├── http/
    │   ├── controllers/   # Controladores das rotas
    │   └── schemas/       # Schemas de validação (Zod)
    ├── lib/         # Utilitários (conexão DB)
    ├── repositories/      # Repositórios de dados
    └── service/     # Camada de serviços
```

## Comandos Úteis do Sequelize

```bash
# Criar nova migration
npx sequelize-cli migration:generate --name nome-da-migration

# Desfazer última migration
npx sequelize-cli db:migrate:undo

# Desfazer todas as migrations
npx sequelize-cli db:migrate:undo:all

# Criar novo seeder
npx sequelize-cli seed:generate --name nome-do-seeder

# Desfazer último seeder
npx sequelize-cli db:seed:undo
```
