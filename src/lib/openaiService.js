'use strict';
const OpenAI = require('openai');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.warn('OPENAI_API_KEY not found. AI professor commands will not work.');
      this.client = null;
      return;
    }
    
    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.maxTokens = 800;
  }

  isAvailable() {
    return this.client !== null;
  }

  async chat(systemPrompt, userMessage, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not configured. Please add OPENAI_API_KEY to your .env file.');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? this.maxTokens;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return {
        content: content.trim(),
        usage: response.usage,
        finishReason: response.choices[0]?.finish_reason
      };
    } catch (err) {
      logger.error('OpenAI API error:', err);
      
      if (err.status === 429) {
        throw new Error('OpenAI rate limit reached. Please try again in a moment.');
      } else if (err.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      } else if (err.status === 500 || err.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error('Failed to get response from OpenAI. Please try again.');
    }
  }
}

const openaiService = new OpenAIService();
module.exports = openaiService;
