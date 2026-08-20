# Multi-stage production Dockerfile for PromptX Web SaaS Dashboard
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm --workspace=apps/web run build

# Production runtime stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "--workspace=apps/web", "run", "start"]
