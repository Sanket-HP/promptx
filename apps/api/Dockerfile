# Multi-stage production Dockerfile for PromptX API Gateway
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/pricing/package.json ./packages/pricing/
COPY packages/token-engine/package.json ./packages/token-engine/
COPY packages/optimizer/package.json ./packages/optimizer/
COPY packages/compression/package.json ./packages/compression/
COPY packages/cache/package.json ./packages/cache/
COPY packages/providers/package.json ./packages/providers/
COPY packages/routing/package.json ./packages/routing/
COPY packages/sdk/package.json ./packages/sdk/

RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build packages and API
RUN npm run build --workspaces --if-present

# Production runtime stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app ./

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
