const { defaultOptimizer } = require('@promptx/optimizer');
const { defaultTokenAnalyzer } = require('@promptx/token-engine');
const { defaultSemanticCache } = require('@promptx/cache');

async function runOptimizationTests() {
  console.log('====================================================');
  console.log('🧪 TOKENFORGE / PROMPTX TOKEN OPTIMIZATION TEST SUITE');
  console.log('====================================================\n');

  const testCases = [
    {
      name: '1. Normal Prompt (Minimal redundant preamble)',
      messages: [
        { role: 'system', content: 'You are a helpful customer support assistant.' },
        { role: 'user', content: 'What are your business opening hours on weekends?' }
      ],
      mode: 'SAFE'
    },
    {
      name: '2. Duplicated System Preamble & AI Boilerplate',
      messages: [
        { role: 'system', content: 'As an AI language model, please act as a customer support assistant. As an AI language model, please act as a customer support assistant.' },
        { role: 'user', content: 'Can you help me reset my password? As an AI model, please assist me.' }
      ],
      mode: 'BALANCED'
    },
    {
      name: '3. Repeated Context & Decorative Paragraphs',
      messages: [
        { role: 'system', content: '========================================\nSYSTEM INSTRUCTIONS\n========================================\n\nPlease answer accurately.\n\nPlease answer accurately.' },
        { role: 'user', content: 'Please review the contract terms below:\n\nSection 1: The provider agrees to supply service.\n\nSection 1: The provider agrees to supply service.' }
      ],
      mode: 'AGGRESSIVE'
    }
  ];

  for (const tc of testCases) {
    console.log(`--- ${tc.name} [Mode: ${tc.mode}] ---`);
    const origTokens = defaultTokenAnalyzer.countMessages(tc.messages);
    const optRes = defaultOptimizer.optimize(tc.messages, tc.mode);
    const optTokens = defaultTokenAnalyzer.countMessages(optRes.optimizedMessages);
    const metrics = defaultTokenAnalyzer.calculateMetrics(origTokens, optTokens, 0.0025);

    console.log(`Original Tokens:  ${metrics.originalInputTokens}`);
    console.log(`Optimized Tokens: ${metrics.optimizedInputTokens}`);
    console.log(`Tokens Saved:     ${metrics.tokensSaved}`);
    console.log(`Reduction %:      ${metrics.reductionPercentage.toFixed(2)}%`);
    console.log(`Explainability:   ${optRes.explainability.map(e => e.ruleName).join(', ')}\n`);
  }

  // 4. Test Semantic Cache (Exact & Trigram Match)
  console.log('--- 4. Semantic Cache Hit / Miss Test ---');
  const cacheMessages = [
    { role: 'system', content: 'You are a technical support assistant.' },
    { role: 'user', content: 'How do I configure custom CORS headers in NestJS?' }
  ];

  await defaultSemanticCache.set('proj-demo-001', cacheMessages, 'gpt-4o', 'Use app.enableCors({ origin: "..." }) in main.ts.', 45);
  const cacheResult = await defaultSemanticCache.get('proj-demo-001', cacheMessages, 'gpt-4o');

  console.log(`Cache Hit:          ${cacheResult.hit}`);
  console.log(`Similarity Score:   ${cacheResult.similarityScore}`);
  console.log(`Tokens Saved (100%): ${cacheResult.cachedEntry?.tokens}`);
  console.log('====================================================\n');
}

runOptimizationTests().catch(console.error);
