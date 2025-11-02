# Commands Directory

This directory contains all bot commands. Each command is automatically loaded by the CommandManager.

## Creating a New Command

To create a new command, add a new `.js` file to this directory with the following structure:

```javascript
const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'commandname',           // Required: command name (lowercase)
  description: 'Command description',  // Required: what the command does
  aliases: ['alias1', 'alias2'], // Optional: alternative names for prefix commands
  data: new SlashCommandBuilder()      // Required: slash command definition
    .setName('commandname')
    .setDescription('Command description'),
  
  async execute(source, args) {
    // Required: command logic
    // source: Discord.js Message (prefix) or ChatInputCommandInteraction (slash)
    // args: Array of command arguments (for prefix commands)
    
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
    try {
      // Your command logic here
      if (isInteraction) {
        await source.reply('Response');
      } else {
        await source.reply('Response');
      }
    } catch (err) {
      logger.error('Error in commandname:', err);
      const errorMsg = 'An error occurred.';
      if (isInteraction) {
        await source.reply({ content: errorMsg, ephemeral: true });
      } else {
        await source.reply(errorMsg);
      }
    }
  },
};
```

## Command Template

Copy this template to get started:

```javascript
const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'mycommand',
  description: 'Does something cool',
  aliases: [],
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('Does something cool'),
  
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
    try {
      const response = 'Hello from mycommand!';
      if (isInteraction) {
        await source.reply(response);
      } else {
        await source.reply(response);
      }
    } catch (err) {
      logger.error('Error in mycommand:', err);
      const errorMsg = 'An error occurred while executing this command.';
      if (isInteraction) {
        await source.reply({ content: errorMsg, ephemeral: true });
      } else {
        await source.reply(errorMsg);
      }
    }
  },
};
```

## Examples

- **library.js**: Fetches and displays a random library GIF
  - Prefix: `!librarygif`, `!library`, `!gif`
  - Slash: `/librarygif`
  - Uses external API (Tenor)
  - Creates embed response
  - Works with both prefix and slash commands

## Slash Command Deployment

After creating or updating commands:

```bash
# Deploy globally (takes up to 1 hour to propagate)
npm run deploy-commands

# Deploy to a specific guild (instant, for testing)
npm run deploy-commands:guild
```

Make sure you have `CLIENT_ID` and optionally `GUILD_ID` in your `.env` file.

## Notes

- Commands are loaded automatically when the bot starts
- Use the logger utility for consistent logging
- Always handle errors within your execute function
- The bot prefix is `!` (configured in `src/index.js`)
- Both prefix commands and slash commands are supported simultaneously
