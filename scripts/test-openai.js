#!/usr/bin/env node
require('dotenv').config();
const openaiService = require('../src/lib/openaiService');

async function test() {
  console.log('🧪 Testing OpenAI Service...\n');

  if (!openaiService.isAvailable()) {
    console.error('❌ OpenAI service is not configured.');
    console.error('   Add OPENAI_API_KEY to your .env file to enable AI professors.');
    process.exit(1);
  }

  console.log('✅ OpenAI API key found');
  console.log(`📊 Using model: ${openaiService.model}\n`);

  try {
    console.log('🤔 Asking a test question...');
    const result = await openaiService.chat(
      'You are a helpful assistant.',
      'Say "Hello! I am working correctly." in one sentence.',
      { maxTokens: 50 }
    );

    console.log('\n✅ Response received:');
    console.log(`   "${result.content}"`);
    console.log(`\n📊 Token usage: ${result.usage?.total_tokens || 'N/A'} tokens`);
    console.log(`   Finish reason: ${result.finishReason}\n`);
    
    console.log('✅ OpenAI service is working correctly!');
    console.log('   Your AI professors are ready to help.\n');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

test();
