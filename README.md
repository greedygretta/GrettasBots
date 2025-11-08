# Library GIF Awesome Bot

A Discord bot that sends random library-themed GIFs using the Tenor API!

## Features
- Responds to `!librarygif` command
- Fetches random library-themed GIFs from Tenor
- Easy to set up and configure

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- A Discord Bot Token
- (Optional) A Tenor API Key

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/greedygretta/GrettasBots.git
cd GrettasBots
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
copy .env.example .env
```

Edit `.env` and add your tokens:
```env
DISCORD_TOKEN=your_discord_bot_token_here
TENOR_API_KEY=your_tenor_api_key_here  # Optional
```

4. **Start the bot**
```bash
npm start
```

## Setting Up Your Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Copy the bot token and add it to your `.env` file
5. Under "Privileged Gateway Intents", enable:
   - MESSAGE CONTENT INTENT
6. Save changes

## Inviting the Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "OAuth2" → "URL Generator"
4. Select the following scopes:
   - `bot`
   - `applications.commands`
5. Select bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
6. Copy the generated URL and open it in your browser
7. Select your server and authorize the bot

## Using the Bot

Once the bot is in your server and running, you can use:
```
!librarygif
```

The bot will respond with a random library-themed GIF.

## Getting a Tenor API Key (Optional)

1. Go to [Tenor's API Dashboard](https://tenor.com/developer/dashboard)
2. Sign in or create an account
3. Create a new API key
4. Add the key to your `.env` file as `TENOR_API_KEY`

## Troubleshooting

### Bot doesn't respond to commands
- Ensure the bot is online (should show green dot in Discord)
- Check that MESSAGE CONTENT INTENT is enabled in Discord Developer Portal
- Verify the bot has correct permissions in your server

### No GIFs appearing
- If using Tenor: Check your API key is correct in `.env`
- Ensure the bot has "Embed Links" permission
- Check the console output for any error messages

### Bot goes offline
- Check your `DISCORD_TOKEN` is correct
- Ensure your Node.js version is up to date
- Look for any error messages in the console

## Development

### File Structure
```
├── src/
│   ├── commands/        # Command handlers
│   ├── lib/            # Core functionality
│   └── utils/          # Utility functions
├── tests/              # Test files
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore rules
└── package.json       # Project dependencies
```

### Running Tests
```bash
npm test
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT

## Support
Open an issue on GitHub for support requests.

---
*Remember to never share your Discord bot token or Tenor API key publicly!*
