# Slash Commands Setup Guide

Your bot now supports **both prefix commands and slash commands** simultaneously!

## Quick Start

### 1. Get Your Client ID

Your bot's Client ID is the same as its Application ID:

1. Go to https://discord.com/developers/applications
2. Select your application
3. Copy the **Application ID** from the General Information page
4. Add it to your `.env` file:

```env
CLIENT_ID=your_application_id_here
```

### 2. Deploy Commands

Choose one of these deployment methods:

#### Option A: Guild Deployment (Instant, for testing)

Best for development - changes appear immediately in your test server.

1. Add your test server's Guild ID to `.env`:
   ```env
   GUILD_ID=your_guild_id_here
   ```
   (Right-click your server → Copy Server ID - requires Developer Mode enabled)

2. Run:
   ```bash
   npm run deploy-commands:guild
   ```

#### Option B: Global Deployment (1 hour delay)

For production - commands appear in all servers where your bot is installed.

```bash
npm run deploy-commands
```

**Note:** Global commands take up to 1 hour to propagate across Discord.

### 3. Start Your Bot

```bash
npm start
```

Your bot now responds to:
- **Prefix commands**: `!librarygif`, `!library`, `!gif`
- **Slash commands**: `/librarygif`

## Command Structure

Commands now support both interaction types:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'commandname',
  description: 'What it does',
  aliases: ['alias1'],  // For prefix commands only
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('What it does'),
  
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
    if (isInteraction) {
      await source.reply('Slash command response');
    } else {
      await source.reply('Prefix command response');
    }
  },
};
```

## Troubleshooting

### "Unknown command" error
- Make sure you've deployed commands: `npm run deploy-commands`
- For guild commands, verify `GUILD_ID` is correct
- Global commands take up to 1 hour to appear

### Commands don't show up in Discord
- Ensure your bot has `applications.commands` scope
- Re-invite bot with proper scopes: https://discord.com/developers/applications → OAuth2 → URL Generator
  - Select: `bot` + `applications.commands`
  - Copy and use the generated URL

### Bot not responding to slash commands
- Check bot logs for errors
- Verify `CLIENT_ID` in `.env` matches your bot's Application ID
- Ensure bot has proper permissions in your server

## Migration Notes

**Existing functionality preserved:**
- ✅ All prefix commands still work (`!librarygif`, etc.)
- ✅ No breaking changes to existing features
- ✅ GIF fetching works identically for both command types

**What's new:**
- ✅ Slash commands with autocomplete UI
- ✅ Better Discord integration
- ✅ Hybrid support (both types work simultaneously)

## Next Steps

1. Test both command types: `!librarygif` and `/librarygif`
2. Create new commands using the template in `src/commands/README.md`
3. Deploy after adding new commands
4. Consider transitioning fully to slash commands in the future
