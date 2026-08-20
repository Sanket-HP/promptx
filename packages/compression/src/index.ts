import { ChatMessage, ExplainabilityItem } from '@promptx/shared';
import { OpenAITokenizer } from '@promptx/token-engine';

export interface RAGChunk {
  id: string;
  documentTitle?: string;
  content: string;
  score?: number;
}

export class ContextCompressor {
  private tokenizer: OpenAITokenizer;

  constructor() {
    this.tokenizer = new OpenAITokenizer();
  }

  public compressContext(
    messages: ChatMessage[],
    maxTargetTokens: number = 8000,
    explainability: ExplainabilityItem[] = []
  ): ChatMessage[] {
    const totalTokens = this.tokenizer.countMessagesTokens(messages);
    if (totalTokens <= maxTargetTokens) {
      return messages;
    }

    const initialCount = totalTokens;

    // Separate system messages, current user turn, and historical context
    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystem = messages.filter(m => m.role !== 'system');

    if (nonSystem.length === 0) return messages;

    const latestUserTurn = nonSystem[nonSystem.length - 1];
    const historyTurns = nonSystem.slice(0, nonSystem.length - 1);

    // Score and prune history turns (give recency bonus to newer messages)
    const scoredHistory = historyTurns.map((msg, index) => {
      const recencyWeight = (index + 1) / historyTurns.length; // 0.1 to 1.0
      const entityBonus = this.containsEntitiesOrCode(msg.content) ? 0.3 : 0;
      const score = recencyWeight + entityBonus;
      return { msg, score, tokens: this.tokenizer.countTokens(msg.content) };
    });

    // Sort by score descending and keep high-value turns until maxTargetTokens limit
    let currentTotal =
      this.tokenizer.countMessagesTokens(systemMessages) +
      this.tokenizer.countTokens(latestUserTurn.content);

    const keptHistory: ChatMessage[] = [];

    // Keep systematically from newest to oldest if score is high
    for (let i = scoredHistory.length - 1; i >= 0; i--) {
      const item = scoredHistory[i];
      if (currentTotal + item.tokens < maxTargetTokens || item.score > 0.9) {
        keptHistory.unshift(item.msg);
        currentTotal += item.tokens;
      }
    }

    const result = [...systemMessages, ...keptHistory, latestUserTurn];
    const finalTokens = this.tokenizer.countMessagesTokens(result);
    const saved = Math.max(0, initialCount - finalTokens);

    if (saved > 0) {
      explainability.push({
        technique: 'CONTEXT_WINDOW_PRUNING',
        description: `Pruned ${historyTurns.length - keptHistory.length} low-importance historical turns using recency & entity relevance scoring.`,
        tokensSaved: saved
      });
    }

    return result;
  }

  private containsEntitiesOrCode(text: string): boolean {
    if (!text) return false;
    // Check for code blocks, URLs, emails, dates, numbers, or specific identifiers
    if (text.includes('```') || text.includes('http://') || text.includes('https://')) return true;
    if (/\b\d{4}-\d{2}-\d{2}\b/.test(text) || /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) return true;
    return false;
  }
}

export class RAGOptimizer {
  private tokenizer: OpenAITokenizer;

  constructor() {
    this.tokenizer = new OpenAITokenizer();
  }

  public optimizeChunks(
    chunks: RAGChunk[],
    query: string,
    topK: number = 5,
    minRelevanceScore: number = 0.25,
    explainability: ExplainabilityItem[] = []
  ): RAGChunk[] {
    if (!chunks || chunks.length === 0) return [];

    const initialTokens = chunks.reduce((acc, c) => acc + this.tokenizer.countTokens(c.content), 0);
    const queryTerms = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 3));

    // 1. Score chunks based on term matching and provided score
    const scoredChunks = chunks.map(chunk => {
      let termMatches = 0;
      const lowerContent = chunk.content.toLowerCase();
      for (const term of queryTerms) {
        if (lowerContent.includes(term)) termMatches++;
      }

      const matchRatio = queryTerms.size > 0 ? termMatches / queryTerms.size : 0.5;
      const baseScore = chunk.score !== undefined ? chunk.score : 0.5;
      const finalScore = baseScore * 0.6 + matchRatio * 0.4;

      return { ...chunk, calculatedScore: finalScore };
    });

    // 2. Filter out low relevance chunks
    const relevantChunks = scoredChunks.filter(c => c.calculatedScore >= minRelevanceScore);

    // 3. Deduplicate overlapping chunks
    const deduplicatedChunks: typeof relevantChunks = [];
    for (const chunk of relevantChunks) {
      const isDuplicate = deduplicatedChunks.some(existing => {
        const similarity = this.textOverlapSimilarity(chunk.content, existing.content);
        return similarity > 0.75;
      });

      if (!isDuplicate) {
        deduplicatedChunks.push(chunk);
      }
    }

    // 4. Rank and top-k select
    deduplicatedChunks.sort((a, b) => b.calculatedScore - a.calculatedScore);
    const selected = deduplicatedChunks.slice(0, topK);

    const finalTokens = selected.reduce((acc, c) => acc + this.tokenizer.countTokens(c.content), 0);
    const tokensSaved = Math.max(0, initialTokens - finalTokens);

    if (tokensSaved > 0) {
      explainability.push({
        technique: 'RAG_CHUNK_DEDUPLICATION',
        description: `Filtered ${chunks.length - selected.length} redundant or low-relevance document chunks before forwarding to LLM.`,
        tokensSaved
      });
    }

    return selected;
  }

  private textOverlapSimilarity(textA: string, textB: string): number {
    const wordsA = new Set(textA.toLowerCase().split(/\s+/));
    const wordsB = new Set(textB.toLowerCase().split(/\s+/));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }

    const smallest = Math.min(wordsA.size, wordsB.size);
    return intersection / smallest;
  }
}

export class ConversationMemoryCompressor {
  private tokenizer: OpenAITokenizer;

  constructor() {
    this.tokenizer = new OpenAITokenizer();
  }

  public summarizeHistory(messages: ChatMessage[], keepRecentTurns: number = 3): ChatMessage[] {
    if (messages.length <= keepRecentTurns * 2) {
      return messages;
    }

    const systemMsgs = messages.filter(m => m.role === 'system');
    const chatMsgs = messages.filter(m => m.role !== 'system');

    const cutIndex = chatMsgs.length - (keepRecentTurns * 2);
    const olderMsgs = chatMsgs.slice(0, cutIndex);
    const recentMsgs = chatMsgs.slice(cutIndex);

    // Extract core topics / summaries from older messages
    const topics = olderMsgs
      .filter(m => m.role === 'user')
      .map(m => m.content.slice(0, 100).replace(/\n/g, ' '))
      .slice(0, 5);

    const summaryContent = `[SYSTEM SUMMARY OF PREVIOUS CONVERSATION HISTORY]\nTopics discussed: ${topics.join('; ')}`;

    const summaryMessage: ChatMessage = {
      role: 'system',
      content: summaryContent
    };

    return [...systemMsgs, summaryMessage, ...recentMsgs];
  }
}

export const defaultContextCompressor = new ContextCompressor();
export const defaultRAGOptimizer = new RAGOptimizer();
export const defaultMemoryCompressor = new ConversationMemoryCompressor();
