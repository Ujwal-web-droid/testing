# WebGuard AI 🛡️

Automated Website Compliance, Header Hardening, and Public Trust Seal Platform.

---

## 🚀 Deploying to Railway

WebGuard AI is configured for seamless deployment on [Railway](https://railway.app).

### Option 1: Full-Stack Deployment (Monorepo)
1. In Railway, click **New Project** → **Deploy from GitHub repo**.
2. Select this repository (`testing` or your cloned repo).
3. Add a PostgreSQL database in Railway (**New Service** → **Database** → **PostgreSQL**).
4. Create two services from the repository:
   - **Frontend Service**: Set Root Directory to `/frontend` (or let Railway use `frontend/Dockerfile`).
   - **Backend Service**: Set Root Directory to `/backend` (or let Railway use `backend/Dockerfile`).

### Environment Variables for Railway:

#### Frontend Service:
| Variable | Description | Example / Default |
|:---|:---|:---|
| `PORT` | Auto-assigned by Railway | `3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anon key | `eyJh...` |
| `NEXT_PUBLIC_API_URL` | URL of your Backend Service | `https://backend-production.up.railway.app/api/v1` |

#### Backend Service:
| Variable | Description | Example / Default |
|:---|:---|:---|
| `PORT` | Auto-assigned by Railway | `8000` |
| `DATABASE_URL` | Railway Postgres Connection String | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | Strong random secret key | `super-secret-jwt-key` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `https://your-frontend.up.railway.app,http://localhost:3000` |

---

## 💻 Local Development

### 1. Frontend (Next.js 16)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. Backend (FastAPI Python)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Running on http://localhost:8000
```

### 3. Docker Compose (Full Stack)
```bash
docker-compose up --build
```
