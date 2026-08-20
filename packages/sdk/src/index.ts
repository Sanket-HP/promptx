import { OpenAIChatCompletionRequest } from '@promptx/shared';

export interface PromptXOptions {
  apiKey: string;
  baseUrl?: string;
}

export class PromptX {
  private apiKey: string;
  private baseUrl: string;

  public chat: {
    completions: {
      create: (params: OpenAIChatCompletionRequest) => Promise<any>;
    };
  };

  constructor(options: PromptXOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'http://localhost:4000';

    this.chat = {
      completions: {
        create: (params: OpenAIChatCompletionRequest) => this.createChatCompletion(params)
      }
    };
  }

  private async createChatCompletion(params: OpenAIChatCompletionRequest): Promise<any> {
    const url = `${this.baseUrl}/v1/chat/completions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PromptX Gateway Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }
}

export default PromptX;
