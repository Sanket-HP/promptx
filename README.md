# TokenForge — Intelligent LLM Token Optimization Platform

> **Tagline:** *"More intelligence. Fewer tokens."*  
> **Platform Name:** PromptX  
> **Core Gateway:** TokenForge API (`POST /v1/chat/completions`)

---

## 🌟 Overview

TokenForge (powered by PromptX) is a universal middleware and API gateway that sits transparently between application clients and LLM providers (OpenAI, Anthropic, Gemini, AWS Bedrock, Ollama). It intelligently compresses prompt context, strips AI verbosity and duplicated system preambles, reranks RAG chunks, and caches repeated requests before they hit downstream LLMs — achieving **up to 99% token reduction** on suitable workloads without sacrificing answer quality.

---

## ✨ Features

- ⚡ **Zero-Code Drop-In OpenAI Compatibility:** Intercepts `POST /v1/chat/completions`, `GET /v1/models`, and `POST /v1/embeddings`.
- 🔍 **Visual Request Inspector:** Side-by-side BEFORE vs AFTER diff debugger highlighting exact removed verbosity and explainability tags.
- ⚡ **Semantic Cache Layer:** SHA-256 exact matching & word-trigram vector similarity search (<15ms latency, 100% LLM tokens avoided on hit).
- 🎛️ **Optimization Modes:** Configurable `SAFE`, `BALANCED` (default), and `AGGRESSIVE` compression modes.
- 🧮 **Interactive Token Savings Calculator:** Real-time calculator projecting monthly token and dollar savings.
- 📊 **Enterprise SaaS Dashboard:** Multi-tenancy, project scoping, API key hashing, Recharts analytics, dynamic model pricing registry, and system admin metrics.

---

## 🏗 Architecture & Tech Stack

- **Core Runtime:** Node.js 18 / TypeScript 5 / Express / Next.js 13
- **Styling:** Vanilla CSS & TailwindCSS (custom design system tokens)
- **Database & Vectors:** PostgreSQL + `pgvector` via Prisma ORM
- **Cache:** Redis / In-memory LRU vector store
- **Deployment Target:** Render Blueprint & Docker Multi-stage containers

```
promptx/
├── apps/
│   ├── api/             # TokenForge Gateway & Express / NestJS backend API (Port 4000)
│   └── web/             # Next.js 14 SaaS Dashboard & Landing Page (Port 3000)
├── packages/
│   ├── shared/          # Shared TypeScript DTOs & Interfaces
│   ├── token-engine/    # Tiktoken Tokenizer & Token Analyzer Engine
│   ├── optimizer/       # Intelligent Prompt Optimizer (SAFE, BALANCED, AGGRESSIVE)
│   ├── compression/     # Context Compression & RAG Chunk Deduplicator
│   ├── cache/           # Semantic Caching Layer (Redis & N-gram Vector Matching)
│   ├── providers/       # Modular Adapters (OpenAI, Anthropic, Gemini, Ollama, Bedrock)
│   ├── routing/         # Smart Model & Provider Complexity Router
│   ├── pricing/         # Dynamic Model Pricing Schedule Registry
│   ├── database/        # Prisma ORM Schema & Client (PostgreSQL + pgvector)
│   └── sdk/             # @promptx/sdk NPM Client Package
├── infrastructure/      # Docker Compose setup & SQL init scripts
└── docs/                # Render deployment guides & specifications
```

---

## 🚀 Local Development

### 1. Install Monorepo Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Build Monorepo Packages
```bash
npm run build
```

### 3. Run Development Servers
```bash
# Start API Gateway (Port 4000)
npm run dev:api

# Start Web SaaS Dashboard (Port 3000)
npm run dev:web
```

---

## 🔑 Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Application runtime environment |
| `PORT` | `4000` | Port for API Gateway |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin for web clients |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Gateway endpoint target for Next.js frontend |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL database connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `JWT_SECRET` | `promptx_secret...` | Secret key for JWT signing |

---

## 🔌 API Usage (OpenAI Compatible)

```javascript
const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: 'sk-px-demo12345678',
  baseURL: 'http://localhost:4000/v1' // TokenForge Gateway Base URL
});

async function run() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Explain quantum computing simply.' }]
  });

  console.log('LLM Output:', response.choices[0].message.content);
  console.log('Token Savings:', response._promptx);
}
```

---

## 🐳 Docker & Render Deployment

### Local Docker Stack
```bash
cd infrastructure/docker
docker-compose up --build -d
```

### Render Deployment
Refer to [`docs/deployment/render.md`](docs/deployment/render.md) for full instructions on deploying using `render.yaml`.

---

## 🛡️ License

MIT © PromptX / TokenForge Inc.
