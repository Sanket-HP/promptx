import { getEncoding } from 'js-tiktoken';
import { ChatMessage } from '@promptx/shared';

export interface ITokenizer {
  countTokens(text: string): number;
  countMessagesTokens(messages: ChatMessage[]): number;
}

export class OpenAITokenizer implements ITokenizer {
  private encoder: any;

  constructor() {
    try {
      this.encoder = getEncoding('cl100k_base');
    } catch {
      this.encoder = null;
    }
  }

  public countTokens(text: string): number {
    if (!text) return 0;
    if (this.encoder) {
      try {
        return this.encoder.encode(text).length;
      } catch {
        // Fallback if encoding fails
      }
    }
    // Fallback: ~4 characters per token average
    return Math.ceil(text.length / 4);
  }

  public countMessagesTokens(messages: ChatMessage[]): number {
    if (!messages || messages.length === 0) return 0;
    let numTokens = 0;
    for (const message of messages) {
      numTokens += 4; // per-message overhead
      if (message.role) numTokens += this.countTokens(message.role);
      if (message.content) numTokens += this.countTokens(message.content);
      if (message.name) numTokens += this.countTokens(message.name);
      if (message.tool_calls) {
        numTokens += this.countTokens(JSON.stringify(message.tool_calls));
      }
    }
    numTokens += 3; // primer for assistant response
    return numTokens;
  }
}

export class ApproximateTokenizer implements ITokenizer {
  public countTokens(text: string): number {
    if (!text) return 0;
    // Word-based + character heuristic approximation
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    return Math.max(Math.ceil(words * 1.3), Math.ceil(chars / 4));
  }

  public countMessagesTokens(messages: ChatMessage[]): number {
    let total = 0;
    for (const msg of messages) {
      total += 4 + this.countTokens(msg.content || '');
    }
    return total + 3;
  }
}

export class TokenAnalyzer {
  private tokenizer: ITokenizer;

  constructor(tokenizer: ITokenizer = new OpenAITokenizer()) {
    this.tokenizer = tokenizer;
  }

  public countText(text: string): number {
    return this.tokenizer.countTokens(text);
  }

  public countMessages(messages: ChatMessage[]): number {
    return this.tokenizer.countMessagesTokens(messages);
  }

  public calculateMetrics(
    originalTokens: number,
    optimizedTokens: number,
    costPer1kInput: number = 0.0025
  ) {
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    const reductionPercentage =
      originalTokens > 0
        ? parseFloat(((tokensSaved / originalTokens) * 100).toFixed(2))
        : 0;

    const estimatedCostBefore = parseFloat(((originalTokens / 1000) * costPer1kInput).toFixed(6));
    const estimatedCostAfter = parseFloat(((optimizedTokens / 1000) * costPer1kInput).toFixed(6));
    const estimatedCostSaved = parseFloat((estimatedCostBefore - estimatedCostAfter).toFixed(6));

    return {
      originalInputTokens: originalTokens,
      optimizedInputTokens: optimizedTokens,
      tokensSaved,
      reductionPercentage,
      estimatedCostBefore,
      estimatedCostAfter,
      estimatedCostSaved: Math.max(0, estimatedCostSaved)
    };
  }
}

export const defaultTokenAnalyzer = new TokenAnalyzer();
