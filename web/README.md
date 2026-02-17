# Web - Frontend

Frontend desenvolvido com [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/).

## Requisitos

- Node.js 20+
- npm, yarn, pnpm ou bun
- API backend rodando (porta 3333)

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz da pasta `web/` (opcional):

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Instalação

```bash
npm install
```

## Rodando em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila o projeto para produção |
| `npm start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o ESLint para verificar o código |

## Estrutura do Projeto

```
web/
├── public/              # Arquivos estáticos
└── src/
    ├── app/             # Rotas do Next.js (App Router)
    │   ├── contacts/    # Páginas de contatos
    │   ├── crm/         # Páginas do CRM (funis)
    │   └── leads/       # Páginas de leads
    ├── components/
    │   ├── content/     # Componentes de layout (sidebar)
    │   ├── pages/       # Componentes específicos de páginas
    │   └── ui/          # Componentes UI reutilizáveis (shadcn)
    ├── dto/             # Data Transfer Objects
    ├── hooks/           # Custom hooks
    ├── lib/             # Utilitários
    └── providers/       # Context providers (React Query)
```

## Páginas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard principal |
| `/leads` | Listagem de leads |
| `/leads/new` | Criar novo lead |
| `/leads/[id]` | Editar lead |
| `/contacts` | Listagem de contatos |
| `/contacts/new` | Criar novo contato |
| `/contacts/[id]` | Editar contato |
| `/crm` | Listagem de funis |
| `/crm/new` | Criar novo funil |
| `/crm/[funnelId]` | Visualizar/Editar funil |

## Tecnologias Principais

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado do servidor
- **React Hook Form + Zod** - Formulários e validação
- **Lucide React** - Ícones

## Build para Produção

```bash
npm run build
npm start
```

## Deploy

A forma mais fácil de fazer deploy é usar a [Vercel](https://vercel.com/new):

```bash
npx vercel
```

Consulte a [documentação de deployment do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
