# Curriculum & Homework System

Your AI professors can now create **college-level curricula** and assign **homework**!

## Overview

Each professor can generate a comprehensive curriculum that:
- Spans 4-20 weeks (default: 15 weeks)
- Includes topics, readings, and assignments
- Tracks progress per server
- Generates detailed homework on demand

## Commands

### 📚 `/create-curriculum`
**Create a new curriculum for a professor**

**Parameters:**
- `professor` (required): Which professor (philosophy, latin, librarian)
- `weeks` (optional): Number of weeks (4-20, default: 15)

**Example:**
```
/create-curriculum professor:philosophy weeks:15
!create-curriculum philosophy 12
```

**What it does:**
- Uses AI to generate a complete curriculum
- Includes weekly topics, readings, and assignments
- Saves curriculum for your server
- Resets progress to week 1

---

### 👀 `/view-curriculum`
**View the current curriculum**

**Parameters:**
- `professor` (required): Which professor

**Example:**
```
/view-curriculum professor:philosophy
!view-curriculum latin
```

**Shows:**
- Course title and description
- Current week and progress
- Current week's topic and readings
- Preview of upcoming weeks

---

### 📝 `/homework`
**Get homework assignment**

**Parameters:**
- `professor` (required): Which professor
- `week` (optional): Specific week (default: current week)

**Example:**
```
/homework professor:philosophy week:3
!homework philosophy
!homework latin 5
```

**What it does:**
- Generates detailed homework assignment using AI
- Includes instructions, deliverables, timeline
- Shows required readings
- Reflects professor's teaching style

---

### 🔄 `/reset-curriculum`
**Reset progress to week 1 (Admin only)**

**Parameters:**
- `professor` (required): Which professor

**Example:**
```
/reset-curriculum professor:philosophy
!reset-curriculum librarian
```

**Requires:** Administrator permissions

---

## How It Works

### 1. Create a Curriculum

```
/create-curriculum professor:philosophy weeks:15
```

The professor uses AI to generate:
- Course title and description
- 15 weeks of topics
- Reading assignments per week
- Homework descriptions

**Example Philosophy Curriculum:**
```
Week 1: Introduction to Philosophy & Critical Thinking
Week 2: Pre-Socratic Philosophers
Week 3: Socrates and the Socratic Method
Week 4: Plato's Theory of Forms
Week 5: Aristotle's Virtue Ethics
...
```

### 2. View Progress

```
/view-curriculum professor:philosophy
```

Shows:
- Current week (e.g., Week 3)
- What topics are covered this week
- Required readings
- Preview of upcoming weeks

### 3. Get Homework

```
/homework professor:philosophy week:3
```

Generates a detailed assignment:
- Clear instructions
- Specific deliverables (essays, exercises, etc.)
- Suggested timeline
- Resources and tips
- Reflects the professor's personality

**Example Philosophy Homework:**
> **Week 3 Homework: Socrates and the Socratic Method**
>
> Ah, an excellent opportunity to practice what Socrates preached! This week's assignment has two components:
>
> **Part 1: Socratic Dialogue (500 words)**
> Write a dialogue in the style of Plato where Socrates questions someone about the nature of knowledge...
>
> **Part 2: Critical Analysis (300 words)**
> Reflect on how the Socratic method challenges assumptions...
>
> **Timeline:** 
> - Days 1-2: Complete readings
> - Days 3-4: Draft dialogue
> - Days 5-6: Write analysis
> - Day 7: Review and submit

### 4. Advance Through Course

Currently manual - request homework for next week when ready:
```
/homework professor:philosophy week:4
```

## Data Storage

Curricula are stored per server:

**Location:**
- Curricula: `src/data/curricula/{guildId}_{professorId}.json`
- Progress: `src/data/progress/{guildId}_{professorId}.json`

**Example Structure:**
```json
{
  "guildId": "123456789",
  "professorId": "philosophy",
  "createdAt": "2024-11-02T...",
  "curriculum": {
    "title": "Introduction to Philosophy",
    "description": "A comprehensive survey of philosophical thought",
    "weeks": [
      {
        "week": 1,
        "topic": "What is Philosophy?",
        "description": "Introduction to philosophical inquiry",
        "readings": [
          "Plato's Apology (selections)",
          "Russell: The Value of Philosophy"
        ],
        "assignment": "Reflective essay on the nature of philosophy"
      }
    ]
  }
}
```

## Features

### AI-Generated Curricula
- Each curriculum is unique
- Reflects professor's expertise
- Academically rigorous
- Appropriate for college level

### Professor Personalities
Homework reflects each professor's character:

**🏛️ Philosophy (Dr. Sophia Thales):**
- Socratic questioning
- Thought experiments
- Emphasis on critical thinking
- Reflective essays

**📜 Latin (Prof. Marcus Grammaticus):**
- Translation exercises
- Grammar drills
- Classical text analysis
- Composition in Latin

**📚 Librarian (Ms. Eleanor Bookwright):**
- Research projects
- Source evaluation
- Annotated bibliographies
- Literature reviews

### Per-Server Storage
- Each Discord server has its own curricula
- Different servers can have different courses
- Progress tracked independently

## Use Cases

### 1. Study Groups
Create a curriculum for your Discord study group:
```
/create-curriculum professor:philosophy weeks:8
```
Members follow along and discuss homework

### 2. Self-Paced Learning
Work through a curriculum at your own pace:
```
/homework professor:latin week:1
# Complete homework
/homework professor:latin week:2
# And so on...
```

### 3. Multiple Courses
Run multiple courses simultaneously:
```
/create-curriculum professor:philosophy weeks:15
/create-curriculum professor:latin weeks:12
/create-curriculum professor:librarian weeks:10
```

### 4. Semester Planning
Use standard semester length (15 weeks):
```
/create-curriculum professor:philosophy weeks:15
```
One homework assignment per week mirrors college structure

## Examples

### Philosophy Course
```
/create-curriculum professor:philosophy weeks:15
```

**Generated Curriculum:**
- Week 1: Introduction to Philosophy
- Week 2: Pre-Socratic Thinkers
- Week 3: Socrates & Plato
- Week 4: Aristotle's Ethics
- Week 5: Stoicism & Epicureanism
- Week 6: Medieval Philosophy
- Week 7: Descartes & Rationalism
- Week 8: Empiricism (Locke, Hume)
- Week 9: Kant's Critical Philosophy
- Week 10: Hegel & German Idealism
- Week 11: Nietzsche & Existentialism
- Week 12: Phenomenology
- Week 13: Analytic Philosophy
- Week 14: Contemporary Ethics
- Week 15: Final Project

### Latin Course
```
/create-curriculum professor:latin weeks:12
```

**Generated Curriculum:**
- Week 1: Latin Alphabet & Pronunciation
- Week 2: First Declension Nouns
- Week 3: Second Declension & Adjectives
- Week 4: Present Tense Verbs
- Week 5: Third Declension
- Week 6: Perfect Tense
- Week 7: Imperfect & Future
- Week 8: Participles
- Week 9: Subjunctive Mood
- Week 10: Reading Caesar
- Week 11: Reading Cicero
- Week 12: Translation Project

## Tips

### Creating Effective Curricula
- **Shorter courses (8-10 weeks)**: Good for intensive topics
- **Standard semester (15 weeks)**: Comprehensive coverage
- **Longer courses (18-20 weeks)**: Year-long survey courses

### Using Homework
- Request homework at the start of each week
- Work through it before moving to next week
- Use `/view-curriculum` to see what's ahead
- Discuss in your server's channels

### Managing Multiple Courses
- Each professor can have one curriculum per server
- Use different channels for different courses
- Pin homework assignments to channel
- Use threads for homework discussions

## Limitations

### Current Version
- ⚠️ No automatic scheduling (yet)
- ⚠️ Manual week advancement
- ⚠️ One curriculum per professor per server
- ⚠️ No homework submission system

### Future Enhancements
- 🔜 Automatic Monday homework posting
- 🔜 Auto-advance to next week
- 🔜 Homework submission tracking
- 🔜 Grade/feedback system
- 🔜 Multiple courses per professor

## Cost Considerations

### Curriculum Creation
- Uses ~1500-2000 tokens per curriculum
- Cost: ~$0.001-0.002 (0.1-0.2 cents) with gpt-4o-mini
- One-time cost per curriculum

### Homework Generation
- Uses ~800-1000 tokens per homework
- Cost: ~$0.0005-0.001 (0.05-0.1 cents) with gpt-4o-mini
- Per homework request

**Example Costs:**
- Create 3 curricula: ~$0.006 (0.6 cents)
- Generate 45 homework assignments (15 weeks × 3 courses): ~$0.045 (4.5 cents)
- **Total for full semester**: Less than 5 cents! 💰

## Troubleshooting

### "No curriculum found"
- Create one first: `/create-curriculum`
- Check you selected the right professor
- Verify command is run in a server (not DMs)

### "Failed to parse curriculum"
- AI response wasn't valid JSON (rare with gpt-4o-mini)
- Try again - usually works on second attempt
- Check OpenAI API status

### Curriculum seems too easy/hard
- Regenerate: `/create-curriculum` (overwrites existing)
- Professors automatically adjust for college level
- Each generation is unique

### Wrong week shown
- Use `/reset-curriculum` to start over
- Specify week manually: `/homework week:1`
- Check progress: `/view-curriculum`

## Next Steps

1. **Create your first curriculum**: `/create-curriculum professor:philosophy`
2. **View it**: `/view-curriculum professor:philosophy`
3. **Get homework**: `/homework professor:philosophy`
4. **Share in your server!** 🎓

The curriculum system makes your AI professors into full-fledged course instructors!
