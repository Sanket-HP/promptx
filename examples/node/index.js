// Node.js example using standard OpenAI client pointing to PromptX Gateway Base URL
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.PROMPTX_API_KEY || 'sk-px-demo12345678',
  baseURL: 'http://localhost:4000/v1' // Zero application code changes!
});

async function main() {
  console.log('Sending request to PromptX API Gateway...');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'As an AI language model, please act as a customer support assistant. As an AI language model, please act as a customer support assistant.'
      },
      {
        role: 'user',
        content: 'What are your operating hours?'
      }
    ]
  });

  console.log('Response from LLM:', response.choices[0].message.content);
  console.log('PromptX Metadata:', response._promptx);
}

main().catch(console.error);
