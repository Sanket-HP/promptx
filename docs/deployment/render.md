# PromptX / TokenForge — Render Deployment Guide

This guide provides step-by-step instructions to deploy **PromptX (TokenForge Gateway)** to [Render](https://render.com) using the included `render.yaml` Blueprint.

---

## 📋 Prerequisites

1. A **GitHub Account** with the `PromptX` repository pushed.
2. A **Render Account**.
3. API Keys for LLM providers (OpenAI, Anthropic, Gemini, AWS Bedrock).

---

## 🚀 Deployment Steps

### 1. Push Repository to GitHub
Ensure all local changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: finalize TokenForge production release"
git push origin main
```

### 2. Connect Render to GitHub
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub account and select your `PromptX` repository.

### 3. Apply `render.yaml` Blueprint
Render will automatically detect `render.yaml` and provision:
- **`promptx-postgres`** (Managed PostgreSQL database with `pgvector`).
- **`promptx-redis`** (Managed Redis cache for semantic prompt caching).
- **`promptx-api`** (Web service running TokenForge Gateway on Port 4000).
- **`promptx-web`** (Web service running Next.js SaaS Dashboard on Port 3000).

### 4. Configure Provider API Keys
In the Render Dashboard under **Services** -> **promptx-api** -> **Environment**, add your active provider keys:
- `OPENAI_API_KEY`: `sk-proj-...`
- `ANTHROPIC_API_KEY`: `sk-ant-...`
- `GEMINI_API_KEY`: `AIzaSy...`

### 5. Run Database Migrations
In `promptx-api` Shell tab (or via Render deployment hook):
```bash
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma
```

### 6. Verify Deployment Health
- **API Health Check:** `https://promptx-api.onrender.com/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "TokenForge API Gateway",
    "version": "1.0.0",
    "timestamp": "2026-08-20T...",
    "dependencies": {
      "database": "ok",
      "redis": "ok"
    }
  }
  ```
- **Web SaaS Dashboard:** Open `https://promptx-web.onrender.com` in your browser.

---

## 🛡️ Production Security Recommendations

1. **CORS Restriction:** Ensure `CORS_ORIGIN` matches your custom domain (e.g., `https://promptx.io`).
2. **JWT Secret:** Never expose `JWT_SECRET` in client builds.
3. **API Keys:** Hashed using SHA-256 before storage in PostgreSQL.
