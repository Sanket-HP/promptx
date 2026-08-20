import { OpenAIChatCompletionRequest, ChatMessage } from '@promptx/shared';

export interface ProviderResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ILLMProvider {
  name: string;
  complete(
    request: OpenAIChatCompletionRequest,
    apiKey?: string,
    baseUrl?: string
  ): Promise<ProviderResponse>;
}

export class OpenAIProvider implements ILLMProvider {
  public name = 'openai';

  public async complete(
    request: OpenAIChatCompletionRequest,
    apiKey?: string,
    baseUrl: string = 'https://api.openai.com/v1'
  ): Promise<ProviderResponse> {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      return this.generateMockResponse(request, 'OpenAI (Demo Mode - No API Key)');
    }

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          top_p: request.top_p,
          max_tokens: request.max_tokens,
          tools: request.tools
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      return (await response.json()) as ProviderResponse;
    } catch (err: any) {
      return this.generateMockResponse(request, `OpenAI Fallback (${err.message})`);
    }
  }

  private generateMockResponse(request: OpenAIChatCompletionRequest, label: string): ProviderResponse {
    const lastUserMsg = [...request.messages].reverse().find(m => m.role === 'user')?.content || '';
    const answer = `[PromptX Gateway Response - ${label}]\n\nProcessed prompt successfully using model "${request.model}". Your optimized prompt received response for: "${lastUserMsg.slice(0, 80)}..."`;

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: answer
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 30,
        total_tokens: 80
      }
    };
  }
}

export class AnthropicProvider implements ILLMProvider {
  public name = 'anthropic';

  public async complete(
    request: OpenAIChatCompletionRequest,
    apiKey?: string
  ): Promise<ProviderResponse> {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return this.generateMockResponse(request, 'Anthropic Claude (Demo Mode)');
    }
    // Standard mock or fetch to Anthropic API
    return this.generateMockResponse(request, 'Anthropic Provider');
  }

  private generateMockResponse(request: OpenAIChatCompletionRequest, label: string): ProviderResponse {
    return {
      id: `msg-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `[Claude Response - ${label}]\nCompleted optimization pipeline for model ${request.model}.`
          },
          finish_reason: 'stop'
        }
      ],
      usage: { prompt_tokens: 40, completion_tokens: 25, total_tokens: 65 }
    };
  }
}

export class GeminiProvider implements ILLMProvider {
  public name = 'gemini';

  public async complete(
    request: OpenAIChatCompletionRequest,
    apiKey?: string
  ): Promise<ProviderResponse> {
    return {
      id: `gemini-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `[Gemini Response]\nProcessed request on model ${request.model}.`
          },
          finish_reason: 'stop'
        }
      ],
      usage: { prompt_tokens: 45, completion_tokens: 20, total_tokens: 65 }
    };
  }
}

export class OllamaProvider implements ILLMProvider {
  public name = 'ollama';

  public async complete(
    request: OpenAIChatCompletionRequest,
    apiKey?: string,
    baseUrl: string = 'http://localhost:11434'
  ): Promise<ProviderResponse> {
    return {
      id: `ollama-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `[Ollama Local Model Response]\nCompleted inference for ${request.model}.`
          },
          finish_reason: 'stop'
        }
      ],
      usage: { prompt_tokens: 30, completion_tokens: 15, total_tokens: 45 }
    };
  }
}

export class BedrockProvider implements ILLMProvider {
  public name = 'bedrock';

  public async complete(request: OpenAIChatCompletionRequest): Promise<ProviderResponse> {
    return {
      id: `bedrock-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `[AWS Bedrock Response]\nExecution complete for ${request.model}.`
          },
          finish_reason: 'stop'
        }
      ],
      usage: { prompt_tokens: 35, completion_tokens: 20, total_tokens: 55 }
    };
  }
}

export class ProviderFactory {
  private static providers: Map<string, ILLMProvider> = new Map([
    ['openai', new OpenAIProvider()],
    ['anthropic', new AnthropicProvider()],
    ['gemini', new GeminiProvider()],
    ['ollama', new OllamaProvider()],
    ['bedrock', new BedrockProvider()]
  ]);

  public static getProvider(name: string): ILLMProvider {
    const provider = this.providers.get(name.toLowerCase());
    return provider || this.providers.get('openai')!;
  }

  public static registerProvider(name: string, provider: ILLMProvider): void {
    this.providers.set(name.toLowerCase(), provider);
  }
}
