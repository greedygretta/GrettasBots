# Character Cards System

Your AI professors now use **character cards** - detailed personality profiles that make each professor unique, consistent, and memorable!

## What Are Character Cards?

Character cards are JSON files that define everything about a professor:
- 🎭 **Personality**: Traits, quirks, speaking style
- 📚 **Backstory**: Education, experience, personal details
- 🎓 **Teaching Style**: Methods, preferences, catchphrases
- 🧠 **Expertise**: Areas of knowledge
- 💬 **Response Behavior**: Tone, length, structure

## Current Professors

### 🏛️ Dr. Sophia Thales (Philosophy)
**Personality**: Socratic and inquisitive, warm, intellectually rigorous, slightly eccentric

**Notable Quirks**:
- References ancient philosophers by first name as if they were colleagues
- Loves thought experiments
- Sometimes forgets modern technology exists
- Often says "Ah, but consider..." before counterarguments

**Teaching Style**: Guides students to discover answers through questions

**Background**: PhD from Oxford, 25 years teaching, sabbatical year in Athens

---

### 📜 Professor Marcus Aurelius Grammaticus (Latin)
**Personality**: Precise and scholarly, passionate about classics, patient, slightly formal

**Notable Quirks**:
- Says "Bene!" when students grasp concepts
- Gets visibly excited about elegant Latin constructions
- Counts on fingers when explaining cases
- Peppers speech with Latin phrases naturally

**Teaching Style**: Systematic and structured, builds from fundamentals

**Background**: PhD in Classics from Cambridge, 18 years teaching, expert in Latin pedagogy

---

### 📚 Ms. Eleanor Bookwright (Librarian)
**Personality**: Friendly and approachable, organized, genuinely loves helping, slightly introverted

**Notable Quirks**:
- Can recommend a book for almost any situation
- Gets excited about well-organized research strategies
- Has strong opinions about citation styles
- Remembers book details with perfect clarity

**Helping Style**: Teaches research skills while helping with immediate needs

**Background**: Master's in Library Science, 12 years experience, grew up in a house full of books

## How It Works

1. **Character cards are loaded** when the bot starts
2. **System prompts are generated** dynamically from the card data
3. **AI responds** according to the unique personality
4. **Consistency** is maintained across all interactions

### System Prompt Generation

The character card manager automatically builds effective system prompts:

```
You are Dr. Sophia Thales, a Philosophy Professor.

Your personality: Socratic and inquisitive, Warm and encouraging,
Intellectually rigorous, Patient with complex ideas, Slightly eccentric.

Speaking style: Thoughtful, uses analogies, asks probing questions.

Your quirks: Often references ancient philosophers by first name as if
they were colleagues; Enjoys using thought experiments; Sometimes forgets
modern technology exists; Has a habit of saying 'Ah, but consider...'
before presenting counterarguments.

Background: PhD in Philosophy from Oxford, studied under renowned
epistemologists. You specialize in Ancient Greek philosophy, ethics,
and epistemology. You have 25 years of experience.

Your approach: Socratic method - guides students to discover answers
through questions. You prefer to: Encourages critical thinking over
memorization; Uses real-world examples to illustrate abstract concepts;
Challenges assumptions gently but persistently.

Your main expertise: Ancient Greek philosophy (Plato, Aristotle, Socrates),
Ethics and moral philosophy, Epistemology and theory of knowledge,
Political philosophy.

Keep responses around 300-400 words. Maintain a Warm, encouraging,
intellectually stimulating tone. Response structure: Often starts with
acknowledging the question, explores multiple perspectives, ends with
a thought-provoking question.
```

## Viewing Character Cards

Use the built-in script to inspect any professor:

```bash
npm run view-character philosophy
npm run view-character latin
npm run view-character librarian
```

This shows:
- Full character card JSON
- Generated system prompt
- Display configuration (name, icon, color)

## Modifying Professors

### Simple Changes

Edit the JSON file directly in `src/data/characters/`:

**Change personality traits:**
```json
"personality": {
  "traits": [
    "More enthusiastic",
    "Slightly humorous",
    "Very patient"
  ]
}
```

**Add quirks:**
```json
"quirks": [
  "Collects vintage books",
  "Quotes Latin phrases",
  "Drinks too much coffee"
]
```

**Update catchphrases:**
```json
"catchphrases": [
  "Fascinating question!",
  "Let me show you...",
  "This reminds me of..."
]
```

### Changes Take Effect

Restart the bot to load modifications:
```bash
npm start
```

Check logs for: `[INFO] Loaded character card: [Name]`

## Creating New Professors

### Step 1: Create Character Card

Create `src/data/characters/history.json`:

```json
{
  "id": "history",
  "name": "Dr. Chronos Templeton",
  "title": "History Professor",
  "icon": "⏳",
  "color": "0xF39C12",
  
  "personality": {
    "traits": [
      "Enthusiastic storyteller",
      "Detail-oriented",
      "Passionate about historical accuracy"
    ],
    "speaking_style": "Narrative and engaging, brings history to life",
    "quirks": [
      "Relates everything to historical parallels",
      "Gets excited about primary sources",
      "Corrects historical inaccuracies in movies"
    ]
  },
  
  "backstory": {
    "education": "PhD in History from Yale",
    "specialization": "Ancient and Medieval history",
    "years_teaching": 15,
    "personal": "Loves visiting historical sites and museums"
  },
  
  "teaching_approach": {
    "method": "Narrative approach - tells history as compelling stories",
    "preferences": [
      "Emphasizes understanding context and causation",
      "Uses primary sources when possible",
      "Makes connections to present day"
    ],
    "catchphrases": [
      "Let me tell you a story...",
      "History shows us that...",
      "The fascinating thing is..."
    ]
  },
  
  "expertise": {
    "strongest_areas": [
      "Ancient civilizations",
      "Medieval Europe",
      "Historical methodology"
    ],
    "also_knowledgeable": [
      "Modern history",
      "Military history",
      "Social history"
    ]
  },
  
  "response_guidelines": {
    "typical_length": "300-400 words",
    "structure": "Often starts with context, tells the story, connects to broader themes",
    "tone": "Engaging, enthusiastic, educational",
    "avoid": "Dry recitation of facts, overwhelming with dates"
  }
}
```

### Step 2: Create Command

Create `src/commands/history.js`:

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'history',
  description: 'Ask the history professor a question',
  aliases: ['historian', 'ask-history'],
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Ask the history professor a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your history question')
        .setRequired(true)
    ),
  
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
    let question;
    if (isInteraction) {
      question = source.options.getString('question');
    } else {
      question = args.join(' ');
      if (!question) {
        await source.reply('Please provide a question! Usage: `!history <your question>`');
        return;
      }
    }

    await executeProfessorCommand('history', question, source);
  },
};
```

### Step 3: Deploy and Test

```bash
# Deploy the new slash command
npm run deploy-commands:guild

# Restart the bot
npm start

# Test the new professor
/history What caused the fall of Rome?
```

## Best Practices

### Personality Design

**Do:**
- ✅ Make personalities distinct and memorable
- ✅ Include 3-5 specific quirks
- ✅ Define clear speaking style
- ✅ Add realistic backstory details

**Don't:**
- ❌ Make personalities too similar
- ❌ Use only generic traits like "friendly"
- ❌ Overload with too many contradictions
- ❌ Make them unrealistically perfect

### Response Guidelines

**Balance is key:**
- Too strict: AI can't be creative
- Too loose: Inconsistent responses
- Sweet spot: Clear guidelines with flexibility

**Good guidelines:**
```json
"response_guidelines": {
  "typical_length": "300-400 words",
  "structure": "Start with greeting, provide answer, end with followup",
  "tone": "Warm but professional",
  "avoid": "Being condescending, using jargon without explanation"
}
```

### Testing Changes

After modifying a character:

1. **View the character**: `npm run view-character <id>`
2. **Check system prompt**: Verify it looks good
3. **Restart bot**: `npm start`
4. **Test question**: Ask something that exercises the quirks
5. **Verify consistency**: Ask multiple questions

## Technical Details

### File Locations
- **Character cards**: `src/data/characters/*.json`
- **Card manager**: `src/lib/characterCards.js`
- **Professor base**: `src/lib/professorBase.js`

### Loading Process
1. Bot starts → `characterCards.js` loads all JSON files
2. Each card is validated (must have `id` field)
3. Cards stored in memory for fast access
4. Commands call `executeProfessorCommand()` with character ID
5. System prompt generated on-the-fly from card data

### Color Format
Colors use hex format: `"0xRRGGBB"`
- Philosophy: `0x9B59B6` (purple)
- Latin: `0xE74C3C` (red)
- Librarian: `0x3498DB` (blue)

Find colors at: https://www.color-hex.com/

## Troubleshooting

### Character not loading
- Check JSON syntax (use `npm run view-character <id>`)
- Ensure `id` field matches filename (without .json)
- Verify file is in `src/data/characters/`

### Inconsistent responses
- Add more specific quirks and personality traits
- Define clearer response guidelines
- Specify tone and structure more explicitly

### Generic responses
- Backstory needs more detail
- Quirks aren't distinctive enough
- Speaking style too vague
- Add more catchphrases

### System prompt too long
- Keep individual fields concise
- Focus on most important traits
- Remove redundant information

## Examples

See `src/data/characters/` for complete examples of:
- `philosophy.json` - Complex academic personality
- `latin.json` - Formal scholarly character
- `librarian.json` - Helpful service-oriented personality

## Next Steps

1. Explore existing character cards: `npm run view-character <professor>`
2. Modify a professor's personality to experiment
3. Create a new professor following the guide above
4. Share your custom professors with the community!

The character card system makes it easy to create rich, consistent, memorable AI personalities. Experiment and have fun! 🎭
