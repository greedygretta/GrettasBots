# AI Professor Bots Setup Guide

Your bot now includes **3 AI-powered professor bots** that use OpenAI's GPT models to answer questions!

## Available Professors

### 🏛️ Philosophy Professor
Ask deep philosophical questions and explore ideas with a Socratic guide.

**Commands:**
- Slash: `/philosophy <question>`
- Prefix: `!philosophy <question>`, `!philo <question>`, `!philosopher <question>`

**Examples:**
```
/philosophy What is the meaning of life?
!philo What did Plato mean by the cave allegory?
!philosopher Is free will real?
```

### 📜 Latin Professor  
Get help with Latin translation, grammar, and classical texts.

**Commands:**
- Slash: `/latin <question>`
- Prefix: `!latin <question>`, `!translate-latin <question>`, `!latin-help <question>`

**Examples:**
```
/latin Translate: Carpe diem
!latin What does "veni vidi vici" mean?
!translate-latin How do I conjugate "amare"?
```

### 📚 Research Librarian
Get research help, book recommendations, and information guidance.

**Commands:**
- Slash: `/librarian <question>`
- Prefix: `!librarian <question>`, `!research <question>`, `!ask-librarian <question>`

**Examples:**
```
/librarian I need sources on climate change
!research What are good books about ancient Rome?
!ask-librarian How do I cite sources in APA format?
```

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Add to Environment

Add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=sk-your-key-here
```

**Optional:** Change the AI model (default is `gpt-3.5-turbo`):
```env
OPENAI_MODEL=gpt-4
```

**Note:** GPT-4 is more capable but costs more. GPT-3.5-turbo is recommended for most use cases.

### 3. Deploy Slash Commands

Register the new professor commands:

```bash
# For testing (instant)
npm run deploy-commands:guild

# For production (1 hour delay)
npm run deploy-commands
```

### 4. Start the Bot

```bash
npm start
```

## Cost Information

OpenAI charges per token (roughly per word). Approximate costs:

**GPT-3.5-turbo:**
- ~$0.0015 per 1,000 tokens (~750 words)
- Each professor response: ~$0.001-0.002 (0.1-0.2 cents)

**GPT-4:**
- ~$0.03 per 1,000 tokens (~750 words)  
- Each professor response: ~$0.02-0.04 (2-4 cents)

### Cost Management

The bot limits responses to ~800 tokens to keep costs reasonable. Monitor usage at:
https://platform.openai.com/usage

## How It Works

### System Prompts

Each professor has a unique personality defined by a system prompt:

- **Philosophy Professor**: Uses Socratic method, references classic philosophers
- **Latin Professor**: Scholarly and precise, provides grammatical explanations
- **Librarian**: Friendly and research-focused, gives actionable advice

### Response Format

Responses appear as formatted embeds with:
- Color-coded by professor type
- Original question displayed
- Token usage footer
- Multi-part responses for long answers

### Error Handling

The bot handles:
- Missing API key (warns on startup)
- Rate limits (user-friendly error messages)
- API failures (graceful degradation)
- Long responses (automatic splitting)

## Troubleshooting

### "AI professors are not configured"
- Make sure `OPENAI_API_KEY` is in your `.env` file
- Restart the bot after adding the key
- Check the key is valid at https://platform.openai.com/api-keys

### "OpenAI rate limit reached"
- You've made too many requests too quickly
- Wait a minute and try again
- Consider upgrading your OpenAI plan

### "OpenAI API authentication failed"
- Your API key is invalid or expired
- Generate a new key at https://platform.openai.com/api-keys
- Make sure there are no spaces or quotes around the key in `.env`

### Response is cut off
- The response hit the 800 token limit
- Ask a more specific question
- Or increase `maxTokens` in `src/lib/openaiService.js`

### Bot doesn't respond
- Check bot logs for errors
- Verify OpenAI API is working: https://status.openai.com
- Ensure you have API credits remaining

## Technical Details

### Architecture

**Service Layer:**
- `src/lib/openaiService.js` - OpenAI API client wrapper
- `src/lib/professorBase.js` - Shared professor logic and formatting

**Commands:**
- `src/commands/philosophy.js` - Philosophy professor command
- `src/commands/latin.js` - Latin professor command  
- `src/commands/librarian.js` - Librarian command

### Customization

Edit professor personalities in `src/lib/professorBase.js`:

```javascript
const PROFESSOR_CONFIGS = {
  philosophy: {
    systemPrompt: `Your custom prompt here...`,
    color: 0x9B59B6,
    // ...
  }
};
```

### Adding New Professors

1. Add config to `PROFESSOR_CONFIGS` in `professorBase.js`
2. Create new command file in `src/commands/`
3. Call `executeProfessorCommand('yourtype', question, source)`
4. Deploy commands with `npm run deploy-commands:guild`

## Examples in Action

**Philosophy:**
```
User: /philosophy What is truth?

🏛️ Philosophy Professor
Question: What is truth?

Ah, what a profound question you've posed! Truth has been a central 
concern in philosophy since ancient times. Let me guide you through 
some perspectives...

[Thoughtful AI-generated response exploring correspondence theory,
coherence theory, and pragmatic truth, ending with a Socratic question]

Tokens: 456
```

**Latin:**
```
User: !latin What does "alea iacta est" mean?

📜 Latin Professor  
Question: What does "alea iacta est" mean?

Excellent question! "Alea iacta est" is a famous Latin phrase meaning
"The die is cast." Let me break this down grammatically...

[Detailed explanation with historical context from Julius Caesar]

Tokens: 392
```

## Next Steps

1. Get your OpenAI API key and add it to `.env`
2. Deploy the slash commands
3. Start the bot and try each professor
4. Monitor your OpenAI usage and costs
5. Customize professor personalities if desired
