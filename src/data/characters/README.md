# Character Cards

This directory contains character cards for each AI professor. Character cards define the personality, backstory, expertise, and behavior of each professor bot.

## What is a Character Card?

A character card is a JSON file that contains detailed information about a professor's:
- **Identity**: Name, title, appearance (icon, color)
- **Personality**: Traits, speaking style, quirks
- **Backstory**: Education, experience, personal details
- **Teaching Approach**: Methods, preferences, catchphrases
- **Expertise**: Areas of knowledge and specialization
- **Response Guidelines**: Length, tone, structure preferences

## How It Works

1. **Character cards are loaded automatically** when the bot starts
2. **System prompts are generated** from the character card data
3. **Each professor responds** according to their unique personality
4. **Display settings** (name, icon, color) come from the card

## Character Card Structure

```json
{
  "id": "unique_identifier",
  "name": "Professor Full Name",
  "title": "Role/Title",
  "icon": "🎓",
  "color": "0x5865F2",
  
  "personality": {
    "traits": ["trait1", "trait2"],
    "speaking_style": "Description of how they speak",
    "quirks": ["quirk1", "quirk2"]
  },
  
  "backstory": {
    "education": "Educational background",
    "specialization": "Area of focus",
    "years_teaching": 10,
    "notable_work": "Achievements",
    "personal": "Personal details"
  },
  
  "teaching_approach": {
    "method": "Teaching philosophy",
    "preferences": ["preference1", "preference2"],
    "catchphrases": ["phrase1", "phrase2"]
  },
  
  "expertise": {
    "strongest_areas": ["area1", "area2"],
    "also_knowledgeable": ["area1", "area2"]
  },
  
  "response_guidelines": {
    "typical_length": "300-400 words",
    "structure": "How responses are organized",
    "tone": "Overall tone to maintain",
    "avoid": "Things to avoid",
    "special_notes": "Additional guidance"
  }
}
```

## Current Professors

### 🏛️ Philosophy Professor (Dr. Sophia Thales)
- **Personality**: Socratic, inquisitive, warm
- **Specialization**: Ancient Greek philosophy, ethics, epistemology
- **Style**: Uses thought experiments, asks probing questions
- **File**: `philosophy.json`

### 📜 Latin Professor (Professor Marcus Aurelius Grammaticus)
- **Personality**: Precise, scholarly, passionate about classics
- **Specialization**: Classical Latin literature and grammar
- **Style**: Methodical, uses examples from classical texts
- **File**: `latin.json`

### 📚 Research Librarian (Ms. Eleanor Bookwright)
- **Personality**: Friendly, organized, helpful
- **Specialization**: Research methods, information literacy
- **Style**: Practical, suggests resources and strategies
- **File**: `librarian.json`

## Adding a New Professor

1. **Create a new JSON file** in this directory (e.g., `history.json`)
2. **Follow the character card structure** above
3. **Create a command file** in `src/commands/` that calls `executeProfessorCommand`
4. **Deploy slash commands**: `npm run deploy-commands:guild`
5. **Restart the bot** to load the new character

Example minimal character card:
```json
{
  "id": "history",
  "name": "Dr. Chronos",
  "title": "History Professor",
  "icon": "🏛️",
  "color": "0xF39C12",
  "personality": {
    "traits": ["Enthusiastic about stories", "Detail-oriented"],
    "speaking_style": "Narrative and engaging"
  },
  "response_guidelines": {
    "typical_length": "300-400 words",
    "tone": "Engaging and informative"
  }
}
```

## Modifying Existing Professors

Simply edit the JSON file for any professor. Changes take effect when the bot restarts.

**Things you can customize:**
- Name and title
- Icon and color (for Discord embeds)
- Personality traits and quirks
- Backstory details
- Teaching style and catchphrases
- Areas of expertise
- Response tone and length

## Tips for Great Character Cards

**Personality:**
- Be specific about traits (not just "friendly" but "warmly enthusiastic")
- Include 2-3 memorable quirks that make the character unique
- Define speaking style clearly (formal? casual? uses certain phrases?)

**Backstory:**
- Add enough detail to make the character feel real
- Include expertise that justifies their knowledge
- Personal details add authenticity

**Response Guidelines:**
- Clear structure helps consistency
- Define what to avoid as well as what to include
- Special notes can address edge cases

**Balance:**
- Too little detail: Generic responses
- Too much detail: Overwhelming for the AI
- Sweet spot: 2000-3000 characters per card

## Testing Characters

After modifying a character card:

1. Restart the bot: `npm start`
2. Check logs for: `Loaded character card: [Name]`
3. Test with a question: `/philosophy test question`
4. Verify personality comes through in the response

## Technical Details

**File format**: JSON with UTF-8 encoding
**Location**: `src/data/characters/*.json`
**Loader**: `src/lib/characterCards.js`
**Usage**: `src/lib/professorBase.js`

The character card system uses a template system to convert JSON data into effective system prompts for the AI model.
