import { ChatMessage, RoutingPolicy, RoutingPolicyConfig } from '@promptx/shared';

export interface RouteDecision {
  targetModel: string;
  provider: string;
  reason: string;
  estimatedComplexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX';
}

export class ModelRouter {
  public routeRequest(
    requestedModel: string,
    messages: ChatMessage[],
    policy: RoutingPolicy = 'DIRECT',
    policyConfig?: RoutingPolicyConfig
  ): RouteDecision {
    if (policy === 'DIRECT' || !policyConfig) {
      return {
        targetModel: requestedModel,
        provider: this.detectProvider(requestedModel),
        reason: 'Direct pass-through routing policy.',
        estimatedComplexity: 'MEDIUM'
      };
    }

    const complexity = this.assessComplexity(messages);

    if (policyConfig.budget === 'low' || policy === 'COST_OPTIMIZED') {
      if (complexity === 'SIMPLE') {
        return {
          targetModel: 'gpt-4o-mini',
          provider: 'openai',
          reason: 'Routed simple task to low-cost model (GPT-4o Mini) per cost optimization policy.',
          estimatedComplexity: complexity
        };
      }
      if (complexity === 'MEDIUM') {
        return {
          targetModel: 'gemini-1.5-flash',
          provider: 'gemini',
          reason: 'Routed medium task to high-throughput Flash model per cost policy.',
          estimatedComplexity: complexity
        };
      }
    }

    if (policyConfig.quality === 'high' || policy === 'PERFORMANCE_OPTIMIZED') {
      if (complexity === 'COMPLEX') {
        return {
          targetModel: 'claude-3-5-sonnet-20241022',
          provider: 'anthropic',
          reason: 'Routed complex reasoning task to frontier model (Claude 3.5 Sonnet) per quality policy.',
          estimatedComplexity: complexity
        };
      }
    }

    return {
      targetModel: requestedModel,
      provider: this.detectProvider(requestedModel),
      reason: `Defaulted to target requested model ${requestedModel}.`,
      estimatedComplexity: complexity
    };
  }

  private assessComplexity(messages: ChatMessage[]): 'SIMPLE' | 'MEDIUM' | 'COMPLEX' {
    const text = messages.map(m => m.content).join(' ');
    const length = text.length;

    // Check for code synthesis, mathematical reasoning, multi-step logic
    const complexKeywords = ['refactor', 'algorithm', 'architecture', 'proof', 'implement', 'database schema', 'debug stacktrace'];
    const hasComplexKeyword = complexKeywords.some(kw => text.toLowerCase().includes(kw));

    if (length < 300 && !hasComplexKeyword) return 'SIMPLE';
    if (length > 3000 || hasComplexKeyword) return 'COMPLEX';
    return 'MEDIUM';
  }

  private detectProvider(modelId: string): string {
    const lower = modelId.toLowerCase();
    if (lower.startsWith('gpt') || lower.startsWith('o1') || lower.startsWith('o3')) return 'openai';
    if (lower.startsWith('claude')) return 'anthropic';
    if (lower.startsWith('gemini')) return 'gemini';
    if (lower.startsWith('llama') || lower.startsWith('mistral')) return 'ollama';
    return 'openai';
  }
}

export const defaultModelRouter = new ModelRouter();
