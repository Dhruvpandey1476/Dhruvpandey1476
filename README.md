# ChargeGo

On-demand mobile EV charging platform (User, Provider, Admin) — monorepo with Node/Express API, React frontend, PostgreSQL + MongoDB, Socket.IO, and Mapbox.

## Quickstart

1. Copy environment

```bash
cp .env.example .env
```

2. Start databases

```bash
npm run db:up
```

3. Install dependencies

```bash
npm install
```

4. Run server and web (after initial scaffolding)

```bash
npm run dev
```

## Services
- API: Express + TypeScript, Prisma (Postgres) + Mongoose (Mongo), Socket.IO
- Frontend: React + Vite + Tailwind + Mapbox
- Databases: Postgres (structured), Mongo (realtime/telemetry)

## Workspaces
- server: API service
- apps/web: React app
