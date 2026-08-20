import { ChatMessage } from '@promptx/shared';
import * as crypto from 'crypto';

export interface CachedPayload {
  id: string;
  projectId: string;
  promptHash: string;
  systemHash: string;
  promptText: string;
  responseText: string;
  model: string;
  tokens: number;
  createdAt: number;
  hitCount: number;
}

export class SemanticCache {
  private cacheMap: Map<string, CachedPayload> = new Map();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 5000) {
    this.maxCacheSize = maxCacheSize;
  }

  public hashText(text: string): string {
    return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  }

  public extractPromptStrings(messages: ChatMessage[]): { systemText: string; userText: string } {
    const systemText = messages
      .filter(m => m.role === 'system')
      .map(m => m.content)
      .join('\n');

    const userText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    return { systemText, userText };
  }

  public async set(
    projectId: string,
    messages: ChatMessage[],
    model: string,
    responseText: string,
    tokensSaved: number
  ): Promise<CachedPayload> {
    const { systemText, userText } = this.extractPromptStrings(messages);
    const systemHash = this.hashText(systemText);
    const promptHash = this.hashText(userText);
    const id = `${projectId}:${model}:${promptHash.slice(0, 16)}`;

    const entry: CachedPayload = {
      id,
      projectId,
      promptHash,
      systemHash,
      promptText: userText,
      responseText,
      model,
      tokens: tokensSaved,
      createdAt: Date.now(),
      hitCount: 0
    };

    if (this.cacheMap.size >= this.maxCacheSize) {
      // LRU / oldest eviction
      const firstKey = this.cacheMap.keys().next().value;
      if (firstKey) this.cacheMap.delete(firstKey);
    }

    this.cacheMap.set(id, entry);
    return entry;
  }

  public async get(
    projectId: string,
    messages: ChatMessage[],
    model: string,
    similarityThreshold: number = 0.90
  ): Promise<{
    hit: boolean;
    similarityScore: number;
    cachedEntry?: CachedPayload;
  }> {
    const { systemText, userText } = this.extractPromptStrings(messages);
    const systemHash = this.hashText(systemText);
    const targetHash = this.hashText(userText);

    // 1. Check exact match first (Similarity 1.0)
    const exactId = `${projectId}:${model}:${targetHash.slice(0, 16)}`;
    const exactMatch = this.cacheMap.get(exactId);

    if (exactMatch && exactMatch.systemHash === systemHash) {
      exactMatch.hitCount++;
      return {
        hit: true,
        similarityScore: 1.0,
        cachedEntry: exactMatch
      };
    }

    // 2. Perform N-gram semantic similarity search across cached prompts for same project/model
    let bestMatch: CachedPayload | undefined = undefined;
    let maxSimilarity = 0;

    for (const entry of this.cacheMap.values()) {
      if (entry.projectId !== projectId || entry.model !== model) continue;
      if (entry.systemHash !== systemHash) continue; // Ensure system context matches

      const similarity = this.calculateSimilarity(userText, entry.promptText);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatch = entry;
      }
    }

    if (bestMatch && maxSimilarity >= similarityThreshold) {
      bestMatch.hitCount++;
      return {
        hit: true,
        similarityScore: parseFloat(maxSimilarity.toFixed(4)),
        cachedEntry: bestMatch
      };
    }

    return {
      hit: false,
      similarityScore: parseFloat(maxSimilarity.toFixed(4))
    };
  }

  public calculateSimilarity(textA: string, textB: string): number {
    const normA = textA.toLowerCase().trim();
    const normB = textB.toLowerCase().trim();

    if (normA === normB) return 1.0;
    if (!normA || !normB) return 0.0;

    // Word trigram set matching
    const getTrigrams = (text: string): Set<string> => {
      const words = text.split(/\s+/);
      const trigrams = new Set<string>();
      for (let i = 0; i < words.length - 2; i++) {
        trigrams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
      if (trigrams.size === 0) {
        for (let i = 0; i < words.length; i++) {
          trigrams.add(words[i]);
        }
      }
      return trigrams;
    };

    const triA = getTrigrams(normA);
    const triB = getTrigrams(normB);

    let intersection = 0;
    for (const item of triA) {
      if (triB.has(item)) intersection++;
    }

    const union = triA.size + triB.size - intersection;
    return union > 0 ? intersection / union : 0.0;
  }
}

export const defaultSemanticCache = new SemanticCache();
