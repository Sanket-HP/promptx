export type Role = 'ADMIN' | 'MEMBER' | 'VIEWER';
export type OptimizationMode = 'SAFE' | 'BALANCED' | 'AGGRESSIVE';
export type RoutingPolicy = 'DIRECT' | 'COST_OPTIMIZED' | 'PERFORMANCE_OPTIMIZED' | 'BALANCED';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface OpenAIChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  user?: string;
  tools?: any[];
  tool_choice?: any;
  optimization_mode?: OptimizationMode;
  routing_policy?: RoutingPolicy;
}

export interface ExplainabilityItem {
  technique: string;
  description: string;
  tokensSaved: number;
  details?: Record<string, any>;
}

export interface OptimizationMetrics {
  originalInputTokens: number;
  optimizedInputTokens: number;
  tokensSaved: number;
  reductionPercentage: number;
  estimatedCostBefore: number;
  estimatedCostAfter: number;
  estimatedCostSaved: number;
  latencyMs: number;
  cacheHit: boolean;
  cacheSimilarity?: number;
  optimizationMode: OptimizationMode;
  explainability: ExplainabilityItem[];
  originalModel: string;
  targetModel: string;
  provider: string;
}

export interface ModelPricingSpec {
  id?: string;
  providerId: string;
  modelId: string;
  displayName: string;
  contextWindow: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export interface RoutingPolicyConfig {
  budget?: 'low' | 'medium' | 'high';
  quality?: 'low' | 'medium' | 'high';
  latency?: 'low' | 'medium' | 'high';
  preferredProvider?: string;
}

export interface BenchmarkSubmission {
  name: string;
  description?: string;
  messages: ChatMessage[];
  targetModel?: string;
  mode?: OptimizationMode;
}

export interface BenchmarkReport {
  id: string;
  name: string;
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  reductionPercentage: number;
  qualityScore: number;
  latencyMs: number;
  costSaved: number;
}

export interface DashboardMetricsSummary {
  totalRequests: number;
  totalOriginalTokens: number;
  totalOptimizedTokens: number;
  totalTokensSaved: number;
  averageReductionPercentage: number;
  totalEstimatedCost: number;
  totalOptimizedCost: number;
  totalMoneySaved: number;
  cacheHitRate: number;
  averageLatencyMs: number;
  requestsByModel: Record<string, number>;
  requestsByProvider: Record<string, number>;
  timeSeries: {
    date: string;
    requests: number;
    originalTokens: number;
    optimizedTokens: number;
    tokensSaved: number;
    costSaved: number;
  }[];
}
