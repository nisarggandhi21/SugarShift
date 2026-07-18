# Hackathon Project

Stack: React (Vite) frontend, Node.js/Express backend, PostgreSQL (Neon).

## Structure

- `frontend/` — React app (Vite)
- `backend/` — Express API server

## Getting started

### Backend

```
cd backend
cp .env.example .env   # edit DATABASE_URL if needed
npm install
npm run dev
```

Runs on `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`, proxying `/api` requests to the backend.

### Database

Point `DATABASE_URL` in `backend/.env` at your PostgreSQL instance (this
project uses [Neon](https://neon.tech)). The `items` table is created
automatically on server start.
