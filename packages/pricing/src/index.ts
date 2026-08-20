import { ModelPricingSpec } from '@promptx/shared';

export const DEFAULT_MODEL_PRICING: ModelPricingSpec[] = [
  // OpenAI Models
  {
    providerId: 'openai',
    modelId: 'gpt-4o',
    displayName: 'GPT-4o',
    contextWindow: 128000,
    inputCostPer1k: 0.0025, // $2.50 per 1M tokens = $0.0025 / 1k
    outputCostPer1k: 0.0100 // $10.00 per 1M tokens = $0.0100 / 1k
  },
  {
    providerId: 'openai',
    modelId: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    contextWindow: 128000,
    inputCostPer1k: 0.00015, // $0.15 per 1M tokens
    outputCostPer1k: 0.00060  // $0.60 per 1M tokens
  },
  {
    providerId: 'openai',
    modelId: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    contextWindow: 128000,
    inputCostPer1k: 0.0100,
    outputCostPer1k: 0.0300
  },
  {
    providerId: 'openai',
    modelId: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    contextWindow: 16385,
    inputCostPer1k: 0.0005,
    outputCostPer1k: 0.0015
  },
  // Anthropic Models
  {
    providerId: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet',
    contextWindow: 200000,
    inputCostPer1k: 0.0030, // $3.00 per 1M tokens
    outputCostPer1k: 0.0150  // $15.00 per 1M tokens
  },
  {
    providerId: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    contextWindow: 200000,
    inputCostPer1k: 0.00025, // $0.25 per 1M tokens
    outputCostPer1k: 0.00125  // $1.25 per 1M tokens
  },
  // Google Gemini Models
  {
    providerId: 'gemini',
    modelId: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    contextWindow: 1000000,
    inputCostPer1k: 0.00125, // $1.25 per 1M tokens
    outputCostPer1k: 0.00500  // $5.00 per 1M tokens
  },
  {
    providerId: 'gemini',
    modelId: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    contextWindow: 1000000,
    inputCostPer1k: 0.000075, // $0.075 per 1M tokens
    outputCostPer1k: 0.000300  // $0.30 per 1M tokens
  },
  // Ollama / Local Models (Zero cost)
  {
    providerId: 'ollama',
    modelId: 'llama3',
    displayName: 'Llama 3 (Local)',
    contextWindow: 8192,
    inputCostPer1k: 0.0000,
    outputCostPer1k: 0.0000
  },
  {
    providerId: 'ollama',
    modelId: 'mistral',
    displayName: 'Mistral 7B (Local)',
    contextWindow: 32768,
    inputCostPer1k: 0.0000,
    outputCostPer1k: 0.0000
  }
];

export class PricingRegistry {
  private registry: Map<string, ModelPricingSpec> = new Map();

  constructor(initialSpecs: ModelPricingSpec[] = DEFAULT_MODEL_PRICING) {
    for (const spec of initialSpecs) {
      this.registerModel(spec);
    }
  }

  public registerModel(spec: ModelPricingSpec): void {
    const key = `${spec.providerId}:${spec.modelId}`.toLowerCase();
    this.registry.set(key, spec);
    // Also set fallback by modelId alone
    this.registry.set(spec.modelId.toLowerCase(), spec);
  }

  public getModelPricing(modelId: string, providerId?: string): ModelPricingSpec {
    if (providerId) {
      const key = `${providerId}:${modelId}`.toLowerCase();
      if (this.registry.has(key)) return this.registry.get(key)!;
    }
    const directMatch = this.registry.get(modelId.toLowerCase());
    if (directMatch) return directMatch;

    // Fallback default pricing if unknown model
    return {
      providerId: providerId || 'openai',
      modelId: modelId,
      displayName: modelId,
      contextWindow: 128000,
      inputCostPer1k: 0.0015,
      outputCostPer1k: 0.0020
    };
  }

  public calculateInputCost(modelId: string, tokens: number, providerId?: string): number {
    const pricing = this.getModelPricing(modelId, providerId);
    return (tokens / 1000) * pricing.inputCostPer1k;
  }

  public calculateOutputCost(modelId: string, tokens: number, providerId?: string): number {
    const pricing = this.getModelPricing(modelId, providerId);
    return (tokens / 1000) * pricing.outputCostPer1k;
  }

  public getAllPricingSpecs(): ModelPricingSpec[] {
    const uniqueSpecs = new Set<ModelPricingSpec>();
    for (const spec of this.registry.values()) {
      uniqueSpecs.add(spec);
    }
    return Array.from(uniqueSpecs);
  }
}

export const pricingRegistry = new PricingRegistry();
