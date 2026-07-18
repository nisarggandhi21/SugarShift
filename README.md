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

## Deploying for free

Database is already on Neon's free tier. Deploy the backend and frontend as
separate services:

### Backend → Render (free web service)

1. New Web Service → connect this repo → root directory `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Set environment variables (from `backend/.env.example`):
   - `DATABASE_URL` — your Neon connection string
   - `JWT_SECRET`, `SESSION_SECRET` — long random strings
   - `CLIENT_URL` — your deployed frontend URL (e.g. `https://your-app.vercel.app`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` — if using Google login; update the callback URL in Google Cloud Console and here to `https://your-backend.onrender.com/api/auth/google/callback`
   - `NODE_ENV=production` — required so auth cookies are issued with `secure`/`SameSite=None` for cross-site requests
4. Free tier spins down after inactivity; the first request after idle takes ~30-50s to wake up.

### Frontend → Vercel or Netlify (free)

1. New project → connect this repo → root directory `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set environment variable `VITE_API_URL` to your Render backend URL (e.g.
   `https://your-backend.onrender.com`), with no trailing slash.
4. Redeploy after the backend's `CLIENT_URL` and this `VITE_API_URL` are both
   set, so CORS and cookies line up on both sides.
