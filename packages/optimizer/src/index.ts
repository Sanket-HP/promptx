import { ChatMessage, OptimizationMode, ExplainabilityItem } from '@promptx/shared';
import { OpenAITokenizer } from '@promptx/token-engine';

export interface OptimizationResult {
  optimizedMessages: ChatMessage[];
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  reductionPercentage: number;
  explainability: ExplainabilityItem[];
}

export class PromptOptimizer {
  private tokenizer: OpenAITokenizer;

  constructor() {
    this.tokenizer = new OpenAITokenizer();
  }

  public optimize(
    messages: ChatMessage[],
    mode: OptimizationMode = 'BALANCED'
  ): OptimizationResult {
    const originalTokens = this.tokenizer.countMessagesTokens(messages);
    const explainability: ExplainabilityItem[] = [];

    // Deep clone messages array to prevent mutating input
    let currentMessages: ChatMessage[] = messages.map(msg => ({ ...msg }));

    // Step 1: Remove redundant whitespace and duplicate newlines
    currentMessages = this.cleanWhitespace(currentMessages, mode, explainability);

    // Step 2: Remove repetitive system instruction boilerplate
    currentMessages = this.deduplicateSystemInstructions(currentMessages, mode, explainability);

    // Step 3: Strip verbose conversational filler & AI preamble
    currentMessages = this.stripConversationalBoilerplate(currentMessages, mode, explainability);

    // Step 4: Remove duplicated lines & repetitive document context across turns
    currentMessages = this.deduplicateRepeatedContext(currentMessages, mode, explainability);

    // Step 5: Mode-based context pruning (Aggressive mode compresses long background blocks)
    if (mode === 'AGGRESSIVE') {
      currentMessages = this.applyAggressiveCompression(currentMessages, explainability);
    }

    const optimizedTokens = this.tokenizer.countMessagesTokens(currentMessages);
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    const reductionPercentage =
      originalTokens > 0
        ? parseFloat(((tokensSaved / originalTokens) * 100).toFixed(2))
        : 0;

    return {
      optimizedMessages: currentMessages,
      originalTokens,
      optimizedTokens,
      tokensSaved,
      reductionPercentage,
      explainability
    };
  }

  private cleanWhitespace(
    messages: ChatMessage[],
    mode: OptimizationMode,
    explainability: ExplainabilityItem[]
  ): ChatMessage[] {
    let tokensSavedTotal = 0;
    const cleaned = messages.map(msg => {
      if (!msg.content) return msg;
      const initialTokens = this.tokenizer.countTokens(msg.content);
      let content = msg.content
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      const newTokens = this.tokenizer.countTokens(content);
      tokensSavedTotal += Math.max(0, initialTokens - newTokens);
      return { ...msg, content };
    });

    if (tokensSavedTotal > 0) {
      explainability.push({
        technique: 'WHITESPACE_CLEANUP',
        description: 'Stripped redundant whitespace, carriage returns, and excessive line breaks.',
        tokensSaved: tokensSavedTotal
      });
    }

    return cleaned;
  }

  private deduplicateSystemInstructions(
    messages: ChatMessage[],
    mode: OptimizationMode,
    explainability: ExplainabilityItem[]
  ): ChatMessage[] {
    const systemMessages = messages.filter(m => m.role === 'system');
    if (systemMessages.length <= 1) return messages;

    // If multiple system messages exist, merge unique instructions into a single system message
    const initialTokens = this.tokenizer.countMessagesTokens(messages);
    const combinedSystemText = systemMessages.map(s => s.content).join('\n\n');
    const uniqueLines = Array.from(new Set(combinedSystemText.split('\n'))).join('\n');

    const nonSystem = messages.filter(m => m.role !== 'system');
    const newMessages: ChatMessage[] = [
      { role: 'system', content: uniqueLines },
      ...nonSystem
    ];

    const newTokens = this.tokenizer.countMessagesTokens(newMessages);
    const saved = Math.max(0, initialTokens - newTokens);

    if (saved > 0) {
      explainability.push({
        technique: 'DUPLICATE_SYSTEM_PRUNED',
        description: 'Deduplicated multiple system prompts into a consolidated instruction set.',
        tokensSaved: saved
      });
    }

    return newMessages;
  }

  private stripConversationalBoilerplate(
    messages: ChatMessage[],
    mode: OptimizationMode,
    explainability: ExplainabilityItem[]
  ): ChatMessage[] {
    let tokensSavedTotal = 0;
    const fillerPatterns = [
      /As an AI (language model|assistant),( please| make sure to| I want you to)?/gi,
      /I am going to ask you a question and I need you to answer carefully\.?/gi,
      /Please make sure to provide a thorough, accurate, and detailed explanation for the following query\.?/gi,
      /Note: Make sure your answer is completely accurate and free of errors\.?/gi,
      /If you understand these instructions, please acknowledge\.?/gi
    ];

    const processed = messages.map(msg => {
      if (msg.role !== 'user' && msg.role !== 'system') return msg;
      let content = msg.content;
      const startTokens = this.tokenizer.countTokens(content);

      for (const pattern of fillerPatterns) {
        content = content.replace(pattern, '').trim();
      }

      const endTokens = this.tokenizer.countTokens(content);
      tokensSavedTotal += Math.max(0, startTokens - endTokens);

      return { ...msg, content };
    });

    if (tokensSavedTotal > 0) {
      explainability.push({
        technique: 'BOILERPLATE_STRIPPED',
        description: 'Removed unnecessary AI assistant boilerplate, greetings, and repetitive preamble.',
        tokensSaved: tokensSavedTotal
      });
    }

    return processed;
  }

  private deduplicateRepeatedContext(
    messages: ChatMessage[],
    mode: OptimizationMode,
    explainability: ExplainabilityItem[]
  ): ChatMessage[] {
    let tokensSavedTotal = 0;
    const seenSentences = new Set<string>();

    const processed = messages.map(msg => {
      // Don't modify code blocks or JSON payloads
      if (msg.content.includes('```') || (msg.content.startsWith('{') && msg.content.endsWith('}'))) {
        return msg;
      }

      const paragraphs = msg.content.split('\n\n');
      const filteredParagraphs: string[] = [];

      for (const para of paragraphs) {
        const normalized = para.trim().toLowerCase();
        if (normalized.length > 40 && seenSentences.has(normalized)) {
          // Found duplicate long paragraph
          const saved = this.tokenizer.countTokens(para);
          tokensSavedTotal += saved;
          continue;
        }
        if (normalized.length > 40) {
          seenSentences.add(normalized);
        }
        filteredParagraphs.push(para);
      }

      return { ...msg, content: filteredParagraphs.join('\n\n') };
    });

    if (tokensSavedTotal > 0) {
      explainability.push({
        technique: 'REPEATED_CONTEXT_DEDUPLICATED',
        description: 'Deduplicated identical paragraph blocks and document fragments across prompt messages.',
        tokensSaved: tokensSavedTotal
      });
    }

    return processed;
  }

  private applyAggressiveCompression(
    messages: ChatMessage[],
    explainability: ExplainabilityItem[]
  ): ChatMessage[] {
    let tokensSavedTotal = 0;

    const compressed = messages.map(msg => {
      if (msg.role !== 'user') return msg;
      if (msg.content.includes('```')) return msg; // Protect code blocks

      const lines = msg.content.split('\n');
      const keptLines: string[] = [];

      for (const line of lines) {
        // Remove purely low-value decorative lines or long dash dividers
        if (/^[-=*#]{5,}$/.test(line.trim())) {
          tokensSavedTotal += this.tokenizer.countTokens(line);
          continue;
        }
        keptLines.push(line);
      }

      return { ...msg, content: keptLines.join('\n') };
    });

    if (tokensSavedTotal > 0) {
      explainability.push({
        technique: 'AGGRESSIVE_SYNTAX_PRUNING',
        description: 'Stripped decorative markdown dividers and low-information structural markers.',
        tokensSaved: tokensSavedTotal
      });
    }

    return compressed;
  }
}

export const defaultOptimizer = new PromptOptimizer();
