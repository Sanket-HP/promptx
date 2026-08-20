import * as crypto from 'crypto';
import { OptimizationMode, RoutingPolicy, ChatMessage, ExplainabilityItem } from '@promptx/shared';
import { DEFAULT_MODEL_PRICING } from '@promptx/pricing';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export interface ProjectRecord {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  optimizationMode: OptimizationMode;
  routingPolicy: RoutingPolicy;
  cacheEnabled: boolean;
  cacheSimilarity: number;
  cacheTtlSeconds: number;
  createdAt: string;
}

export interface ApiKeyRecord {
  id: string;
  projectId: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
  lastUsedAt?: string;
  createdAt: string;
}

export interface RequestRecord {
  id: string;
  projectId: string;
  modelId: string;
  originalModel: string;
  targetModel: string;
  provider: string;
  originalInputTokens: number;
  optimizedInputTokens: number;
  tokensSaved: number;
  reductionPercentage: number;
  outputTokens: number;
  estimatedCostBefore: number;
  estimatedCostAfter: number;
  estimatedCostSaved: number;
  latencyMs: number;
  cacheHit: boolean;
  cacheSimilarity?: number;
  optimizationMode: OptimizationMode;
  createdAt: string;
  originalMessages: ChatMessage[];
  optimizedMessages: ChatMessage[];
  explainability: ExplainabilityItem[];
}

class InMemoryStore {
  public users: Map<string, UserRecord> = new Map();
  public organizations: Map<string, OrganizationRecord> = new Map();
  public projects: Map<string, ProjectRecord> = new Map();
  public apiKeys: Map<string, ApiKeyRecord> = new Map();
  public requests: RequestRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // 1. Seed Demo User
    const userId = 'user-demo-001';
    this.users.set(userId, {
      id: userId,
      email: 'demo@promptx.ai',
      name: 'PromptX Admin',
      passwordHash: 'demo_hashed_pass',
      createdAt: new Date().toISOString()
    });

    // 2. Seed Demo Organization
    const orgId = 'org-demo-001';
    this.organizations.set(orgId, {
      id: orgId,
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'ENTERPRISE'
    });

    // 3. Seed Default Project
    const projId = 'proj-prod-001';
    this.projects.set(projId, {
      id: projId,
      organizationId: orgId,
      name: 'Production LLM Gateway',
      slug: 'production-llm-gateway',
      optimizationMode: 'BALANCED',
      routingPolicy: 'DIRECT',
      cacheEnabled: true,
      cacheSimilarity: 0.90,
      cacheTtlSeconds: 86400,
      createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString()
    });

    // 4. Seed Default API Key (sk-px-demo12345678)
    const rawKey = 'sk-px-demo12345678';
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    this.apiKeys.set('key-demo-001', {
      id: 'key-demo-001',
      projectId: projId,
      name: 'Production API Key',
      keyHash,
      keyPrefix: 'sk-px-demo',
      createdAt: new Date().toISOString()
    });

    // 5. Seed Realistic Historical Requests
    const now = Date.now();
    const dayMs = 86400 * 1000;

    const samplePrompts = [
      {
        orig: 'As an AI language model, please act as a professional developer. I am going to ask you a question and I need you to answer carefully. Note: Make sure your answer is completely accurate.\n\nDocument A:\nCompany was founded in 2010 in San Francisco.\nCompany was founded in 2010 in San Francisco.\n\nWhat year was the company founded?',
        opt: 'What year was the company founded?\n\nContext: Company was founded in 2010 in San Francisco.',
        origTokens: 850,
        optTokens: 120,
        mode: 'BALANCED' as OptimizationMode
      },
      {
        orig: 'Please make sure to provide a thorough, accurate, and detailed explanation for the following query.\n\nSystem Instruction: You are a customer support bot.\nSystem Instruction: You are a customer support bot.\n\nUser: How do I reset my password?',
        opt: 'System Instruction: You are a customer support bot.\n\nUser: How do I reset my password?',
        origTokens: 420,
        optTokens: 65,
        mode: 'SAFE' as OptimizationMode
      },
      {
        orig: '--------------------------------------------------\nQuestion: Summarize key financial results.\n--------------------------------------------------\nAs an AI, give clear results.',
        opt: 'Question: Summarize key financial results.',
        origTokens: 310,
        optTokens: 45,
        mode: 'AGGRESSIVE' as OptimizationMode
      }
    ];

    for (let i = 0; i < 45; i++) {
      const daysAgo = Math.floor(i / 7);
      const timeOffset = daysAgo * dayMs + (i % 7) * 3600 * 1000;
      const createdAt = new Date(now - timeOffset).toISOString();

      const sample = samplePrompts[i % samplePrompts.length];
      const isCacheHit = i % 4 === 0;
      const tokensSaved = isCacheHit ? sample.origTokens : sample.origTokens - sample.optTokens;
      const optimizedInputTokens = isCacheHit ? 0 : sample.optTokens;
      const reductionPercentage = parseFloat(((tokensSaved / sample.origTokens) * 100).toFixed(2));

      const inputCostPer1k = 0.0025;
      const costBefore = (sample.origTokens / 1000) * inputCostPer1k;
      const costAfter = (optimizedInputTokens / 1000) * inputCostPer1k;
      const costSaved = costBefore - costAfter;

      this.requests.push({
        id: `req-seed-${1000 + i}`,
        projectId: projId,
        modelId: 'gpt-4o',
        originalModel: 'gpt-4o',
        targetModel: 'gpt-4o',
        provider: 'openai',
        originalInputTokens: sample.origTokens,
        optimizedInputTokens,
        tokensSaved,
        reductionPercentage,
        outputTokens: 85,
        estimatedCostBefore: parseFloat(costBefore.toFixed(6)),
        estimatedCostAfter: parseFloat(costAfter.toFixed(6)),
        estimatedCostSaved: parseFloat(costSaved.toFixed(6)),
        latencyMs: isCacheHit ? 14 : 240 + Math.floor(Math.random() * 150),
        cacheHit: isCacheHit,
        cacheSimilarity: isCacheHit ? 0.98 : undefined,
        optimizationMode: sample.mode,
        createdAt,
        originalMessages: [{ role: 'user', content: sample.orig }],
        optimizedMessages: [{ role: 'user', content: sample.opt }],
        explainability: isCacheHit
          ? [{ technique: 'SEMANTIC_CACHE', description: 'Matched identical prompt in Semantic Cache (100% tokens saved).', tokensSaved: sample.origTokens }]
          : [
              { technique: 'BOILERPLATE_STRIPPED', description: 'Removed unnecessary AI assistant boilerplate preamble.', tokensSaved: 140 },
              { technique: 'DUPLICATE_SYSTEM_PRUNED', description: 'Stripped repetitive system instructions.', tokensSaved: 220 }
            ]
      });
    }
  }
}

export const store = new InMemoryStore();
