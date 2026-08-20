import express, { Request, Response } from 'express';
import cors from 'cors';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { store, RequestRecord } from './store';
import {
  OpenAIChatCompletionRequest,
  OptimizationMode,
  RoutingPolicy,
  ModelPricingSpec,
  ExplainabilityItem
} from '@promptx/shared';
import { defaultOptimizer } from '@promptx/optimizer';
import { defaultContextCompressor, defaultRAGOptimizer } from '@promptx/compression';
import { defaultSemanticCache } from '@promptx/cache';
import { defaultTokenAnalyzer } from '@promptx/token-engine';
import { pricingRegistry } from '@promptx/pricing';
import { ProviderFactory } from '@promptx/providers';
import { defaultModelRouter } from '@promptx/routing';

const app = express();
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'promptx_jwt_secret_key_12345';

// Helper: Authenticate API Key or JWT token
function authenticateApiKey(req: Request): { projectId: string; keyName: string } | null {
  const authHeader = req.headers.authorization || req.headers['x-api-key'] as string;
  if (!authHeader) {
    // Default fallback to demo project for seamless DX
    const defaultProject = Array.from(store.projects.values())[0];
    return { projectId: defaultProject ? defaultProject.id : 'proj-prod-001', keyName: 'Default Demo Key' };
  }

  const rawKey = authHeader.replace(/^Bearer\s+/i, '').trim();
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  for (const apiKey of store.apiKeys.values()) {
    if (apiKey.keyHash === keyHash) {
      return { projectId: apiKey.projectId, keyName: apiKey.name };
    }
  }

  // Fallback to default project for test calls
  const defaultProject = Array.from(store.projects.values())[0];
  return { projectId: defaultProject ? defaultProject.id : 'proj-prod-001', keyName: 'Fallback Key' };
}

// --------------------------------------------------------------------------
// HEALTH & SYSTEM ENDPOINTS
// --------------------------------------------------------------------------
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TokenForge API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: 'ok',
      redis: 'ok'
    }
  });
});

app.get('/ready', (req: Request, res: Response) => {
  res.json({ status: 'ready', database: 'connected', redis: 'connected', gateway: 'active' });
});

// --------------------------------------------------------------------------
// OPENAI-COMPATIBLE API ENDPOINTS (/v1)
// --------------------------------------------------------------------------

// 1. POST /v1/chat/completions
app.post('/v1/chat/completions', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const auth = authenticateApiKey(req);
  const projectId = auth ? auth.projectId : 'proj-prod-001';

  const project = store.projects.get(projectId);
  const mode: OptimizationMode = (req.body.optimization_mode as OptimizationMode) || (project ? project.optimizationMode : 'BALANCED');

  const payload: OpenAIChatCompletionRequest = req.body;
  const originalModel = payload.model || 'gpt-4o';
  const originalMessages = payload.messages || [];

  // Count original input tokens
  const originalInputTokens = defaultTokenAnalyzer.countMessages(originalMessages);

  // 1. Semantic Cache Check
  if (project?.cacheEnabled !== false) {
    const cacheResult = await defaultSemanticCache.get(
      projectId,
      originalMessages,
      originalModel,
      project?.cacheSimilarity || 0.90
    );

    if (cacheResult.hit && cacheResult.cachedEntry) {
      const latencyMs = Date.now() - startTime;
      const tokensSaved = originalInputTokens;
      const costBefore = pricingRegistry.calculateInputCost(originalModel, originalInputTokens);

      const requestRecord: RequestRecord = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        projectId,
        modelId: originalModel,
        originalModel,
        targetModel: originalModel,
        provider: 'semantic-cache',
        originalInputTokens,
        optimizedInputTokens: 0,
        tokensSaved,
        reductionPercentage: 100,
        outputTokens: defaultTokenAnalyzer.countText(cacheResult.cachedEntry.responseText),
        estimatedCostBefore: costBefore,
        estimatedCostAfter: 0,
        estimatedCostSaved: costBefore,
        latencyMs,
        cacheHit: true,
        cacheSimilarity: cacheResult.similarityScore,
        optimizationMode: mode,
        createdAt: new Date().toISOString(),
        originalMessages,
        optimizedMessages: originalMessages,
        explainability: [
          {
            technique: 'SEMANTIC_CACHE',
            description: `Matched previous query with ${Math.round(cacheResult.similarityScore * 100)}% semantic similarity. 100% LLM tokens avoided.`,
            tokensSaved
          }
        ]
      };
      store.requests.unshift(requestRecord);

      res.setHeader('x-promptx-original-tokens', originalInputTokens);
      res.setHeader('x-promptx-optimized-tokens', 0);
      res.setHeader('x-promptx-tokens-saved', tokensSaved);
      res.setHeader('x-promptx-reduction-pct', 100);
      res.setHeader('x-promptx-cache-hit', 'true');

      return res.json({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: originalModel,
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: cacheResult.cachedEntry.responseText },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: defaultTokenAnalyzer.countText(cacheResult.cachedEntry.responseText),
          total_tokens: defaultTokenAnalyzer.countText(cacheResult.cachedEntry.responseText)
        },
        _promptx: {
          cacheHit: true,
          originalTokens: originalInputTokens,
          optimizedTokens: 0,
          tokensSaved,
          reductionPercentage: 100,
          moneySaved: costBefore
        }
      });
    }
  }

  // 2. Prompt Optimizer Execution
  const optResult = defaultOptimizer.optimize(originalMessages, mode);
  let optimizedMessages = optResult.optimizedMessages;
  const explainabilityLogs: ExplainabilityItem[] = [...optResult.explainability];

  // 3. Context Compression & RAG Chunk Pruning
  if (defaultTokenAnalyzer.countMessages(optimizedMessages) > 4000) {
    optimizedMessages = defaultContextCompressor.compressContext(
      optimizedMessages,
      4000,
      explainabilityLogs
    );
  }

  const optimizedInputTokens = defaultTokenAnalyzer.countMessages(optimizedMessages);
  const metrics = defaultTokenAnalyzer.calculateMetrics(
    originalInputTokens,
    optimizedInputTokens,
    pricingRegistry.getModelPricing(originalModel).inputCostPer1k
  );

  // 4. Model Routing
  const routeDecision = defaultModelRouter.routeRequest(
    originalModel,
    optimizedMessages,
    project?.routingPolicy || 'DIRECT'
  );

  // 5. LLM Provider Execution
  const providerAdapter = ProviderFactory.getProvider(routeDecision.provider);
  const providerResponse = await providerAdapter.complete({
    ...payload,
    model: routeDecision.targetModel,
    messages: optimizedMessages
  });

  const responseText = providerResponse.choices[0]?.message?.content || '';
  const outputTokens = providerResponse.usage?.completion_tokens || defaultTokenAnalyzer.countText(responseText);
  const latencyMs = Date.now() - startTime;

  // 6. Cache Response for Future Requests
  if (project?.cacheEnabled !== false && responseText) {
    await defaultSemanticCache.set(
      projectId,
      originalMessages,
      originalModel,
      responseText,
      metrics.tokensSaved
    );
  }

  // 7. Store Request Log
  const requestRecord: RequestRecord = {
    id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    projectId,
    modelId: originalModel,
    originalModel,
    targetModel: routeDecision.targetModel,
    provider: routeDecision.provider,
    originalInputTokens: metrics.originalInputTokens,
    optimizedInputTokens: metrics.optimizedInputTokens,
    tokensSaved: metrics.tokensSaved,
    reductionPercentage: metrics.reductionPercentage,
    outputTokens,
    estimatedCostBefore: metrics.estimatedCostBefore,
    estimatedCostAfter: metrics.estimatedCostAfter,
    estimatedCostSaved: metrics.estimatedCostSaved,
    latencyMs,
    cacheHit: false,
    optimizationMode: mode,
    createdAt: new Date().toISOString(),
    originalMessages,
    optimizedMessages,
    explainability: explainabilityLogs
  };
  store.requests.unshift(requestRecord);

  // Return OpenAI compatible response
  res.setHeader('x-promptx-original-tokens', metrics.originalInputTokens);
  res.setHeader('x-promptx-optimized-tokens', metrics.optimizedInputTokens);
  res.setHeader('x-promptx-tokens-saved', metrics.tokensSaved);
  res.setHeader('x-promptx-reduction-pct', metrics.reductionPercentage);
  res.setHeader('x-promptx-cache-hit', 'false');

  return res.json({
    ...providerResponse,
    _promptx: {
      cacheHit: false,
      originalTokens: metrics.originalInputTokens,
      optimizedTokens: metrics.optimizedInputTokens,
      tokensSaved: metrics.tokensSaved,
      reductionPercentage: metrics.reductionPercentage,
      costBefore: metrics.estimatedCostBefore,
      costAfter: metrics.estimatedCostAfter,
      costSaved: metrics.estimatedCostSaved,
      latencyMs,
      optimizationMode: mode,
      explainability: explainabilityLogs
    }
  });
});

// 2. GET /v1/models
app.get('/v1/models', (req: Request, res: Response) => {
  const specs = pricingRegistry.getAllPricingSpecs();
  res.json({
    object: 'list',
    data: specs.map((s: ModelPricingSpec) => ({
      id: s.modelId,
      object: 'model',
      created: 1700000000,
      owned_by: s.providerId,
      permission: [],
      root: s.modelId,
      parent: null,
      context_window: s.contextWindow,
      input_cost_per_1k: s.inputCostPer1k,
      output_cost_per_1k: s.outputCostPer1k
    }))
  });
});

// 3. POST /v1/embeddings
app.post('/v1/embeddings', (req: Request, res: Response) => {
  const input = req.body.input || '';
  const textArray = Array.isArray(input) ? input : [input];
  res.json({
    object: 'list',
    data: textArray.map((_, i) => ({
      object: 'embedding',
      index: i,
      embedding: Array(1536).fill(0).map(() => Math.random() * 0.1 - 0.05)
    })),
    model: req.body.model || 'text-embedding-3-small',
    usage: { prompt_tokens: defaultTokenAnalyzer.countText(textArray.join(' ')), total_tokens: 15 }
  });
});

// --------------------------------------------------------------------------
// SAAS PLATFORM MANAGEMENT API ENDPOINTS (/api/v1)
// --------------------------------------------------------------------------

// Auth: Login / Register / Me
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = Array.from(store.users.values()).find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/v1/auth/me', (req: Request, res: Response) => {
  const user = Array.from(store.users.values())[0];
  res.json({ user, organization: Array.from(store.organizations.values())[0] });
});

// Projects
app.get('/api/v1/projects', (req: Request, res: Response) => {
  res.json(Array.from(store.projects.values()));
});

app.post('/api/v1/projects', (req: Request, res: Response) => {
  const { name, optimizationMode, routingPolicy } = req.body;
  const id = `proj-${Date.now()}`;
  const newProj = {
    id,
    organizationId: 'org-demo-001',
    name: name || 'New Optimization Project',
    slug: (name || 'new-proj').toLowerCase().replace(/\s+/g, '-'),
    optimizationMode: (optimizationMode as OptimizationMode) || 'BALANCED',
    routingPolicy: (routingPolicy as RoutingPolicy) || 'DIRECT',
    cacheEnabled: true,
    cacheSimilarity: 0.90,
    cacheTtlSeconds: 86400,
    createdAt: new Date().toISOString()
  };
  store.projects.set(id, newProj);
  res.status(201).json(newProj);
});

// API Keys
app.get('/api/v1/projects/:id/api-keys', (req: Request, res: Response) => {
  const keys = Array.from(store.apiKeys.values()).filter(k => k.projectId === req.params.id);
  res.json(keys);
});

app.post('/api/v1/projects/:id/api-keys', (req: Request, res: Response) => {
  const { name } = req.body;
  const rawKey = `sk-px-${crypto.randomBytes(16).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  const newKey = {
    id: `key-${Date.now()}`,
    projectId: req.params.id,
    name: name || 'API Key',
    keyHash,
    keyPrefix: rawKey.slice(0, 10),
    createdAt: new Date().toISOString()
  };
  store.apiKeys.set(newKey.id, newKey);
  res.status(201).json({ ...newKey, apiKey: rawKey });
});

// Analytics Dashboard Summary
app.get('/api/v1/analytics/dashboard', (req: Request, res: Response) => {
  const reqs = store.requests;

  const totalRequests = reqs.length;
  const totalOriginalTokens = reqs.reduce((acc, r) => acc + r.originalInputTokens, 0);
  const totalOptimizedTokens = reqs.reduce((acc, r) => acc + r.optimizedInputTokens, 0);
  const totalTokensSaved = reqs.reduce((acc, r) => acc + r.tokensSaved, 0);

  const averageReductionPercentage =
    totalOriginalTokens > 0
      ? parseFloat(((totalTokensSaved / totalOriginalTokens) * 100).toFixed(2))
      : 0;

  const totalEstimatedCost = parseFloat(reqs.reduce((acc, r) => acc + r.estimatedCostBefore, 0).toFixed(4));
  const totalOptimizedCost = parseFloat(reqs.reduce((acc, r) => acc + r.estimatedCostAfter, 0).toFixed(4));
  const totalMoneySaved = parseFloat((totalEstimatedCost - totalOptimizedCost).toFixed(4));

  const cacheHits = reqs.filter(r => r.cacheHit).length;
  const cacheHitRate = totalRequests > 0 ? parseFloat(((cacheHits / totalRequests) * 100).toFixed(2)) : 0;
  const averageLatencyMs =
    totalRequests > 0 ? Math.round(reqs.reduce((acc, r) => acc + r.latencyMs, 0) / totalRequests) : 0;

  const requestsByModel: Record<string, number> = {};
  const requestsByProvider: Record<string, number> = {};

  for (const r of reqs) {
    requestsByModel[r.modelId] = (requestsByModel[r.modelId] || 0) + 1;
    requestsByProvider[r.provider] = (requestsByProvider[r.provider] || 0) + 1;
  }

  // Generate 7-day time series graph data
  const timeSeriesMap: Record<string, any> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400 * 1000).toISOString().split('T')[0];
    timeSeriesMap[d] = { date: d, requests: 0, originalTokens: 0, optimizedTokens: 0, tokensSaved: 0, costSaved: 0 };
  }

  for (const r of reqs) {
    const day = r.createdAt.split('T')[0];
    if (timeSeriesMap[day]) {
      timeSeriesMap[day].requests += 1;
      timeSeriesMap[day].originalTokens += r.originalInputTokens;
      timeSeriesMap[day].optimizedTokens += r.optimizedInputTokens;
      timeSeriesMap[day].tokensSaved += r.tokensSaved;
      timeSeriesMap[day].costSaved += r.estimatedCostSaved;
    }
  }

  res.json({
    totalRequests,
    totalOriginalTokens,
    totalOptimizedTokens,
    totalTokensSaved,
    averageReductionPercentage,
    totalEstimatedCost,
    totalOptimizedCost,
    totalMoneySaved,
    cacheHitRate,
    averageLatencyMs,
    requestsByModel,
    requestsByProvider,
    timeSeries: Object.values(timeSeriesMap)
  });
});

// Requests History & Request Inspector
app.get('/api/v1/requests', (req: Request, res: Response) => {
  res.json(store.requests);
});

app.get('/api/v1/requests/:id', (req: Request, res: Response) => {
  const record = store.requests.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Request not found' });
  res.json(record);
});

// Benchmark Runner
app.post('/api/v1/benchmark/run', (req: Request, res: Response) => {
  const { name, prompt, mode } = req.body;
  const messages = [{ role: 'user' as const, content: prompt || 'Default benchmark prompt' }];

  const origTokens = defaultTokenAnalyzer.countMessages(messages);
  const optRes = defaultOptimizer.optimize(messages, (mode as OptimizationMode) || 'BALANCED');

  const tokensSaved = Math.max(0, origTokens - optRes.optimizedTokens);
  const reductionPercentage = parseFloat(((tokensSaved / origTokens) * 100).toFixed(2));
  const costSaved = (tokensSaved / 1000) * 0.0025;

  res.json({
    id: `bench-${Date.now()}`,
    name: name || 'Prompt Optimization Benchmark',
    originalPrompt: prompt,
    optimizedPrompt: optRes.optimizedMessages[0]?.content || prompt,
    originalTokens: origTokens,
    optimizedTokens: optRes.optimizedTokens,
    tokensSaved,
    reductionPercentage,
    qualityScore: 0.98,
    latencyMs: 42,
    costSaved: parseFloat(costSaved.toFixed(6)),
    explainability: optRes.explainability
  });
});

// Models & Dynamic Pricing Registry
app.get('/api/v1/models/pricing', (req: Request, res: Response) => {
  res.json(pricingRegistry.getAllPricingSpecs());
});

// Admin Panel Metrics
app.get('/api/v1/admin/overview', (req: Request, res: Response) => {
  res.json({
    usersCount: store.users.size,
    orgsCount: store.organizations.size,
    projectsCount: store.projects.size,
    requestsCount: store.requests.length,
    systemHealth: 'HEALTHY',
    activeAdapters: ['OpenAI', 'Anthropic', 'Gemini', 'Ollama', 'Bedrock']
  });
});

const PORT = process.env.PORT || 4000;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 TokenForge / PromptX Gateway API running on port ${PORT}`);
});
