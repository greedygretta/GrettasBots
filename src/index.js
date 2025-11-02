require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const CommandManager = require('./utils/commandManager');
const logger = require('./utils/logger');

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!';
const commandManager = new CommandManager();

if (!TOKEN) {
  logger.error('Missing DISCORD_TOKEN in environment. Copy .env.example to .env and add your token.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
  logger.info(`Client ID: ${client.user.id}`);
  const commandsPath = path.join(__dirname, 'commands');
  commandManager.loadCommands(commandsPath);
  logger.info('Bot is ready!');
  logger.info('Tip: Run "npm run deploy-commands" to register slash commands');
});

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const [cmd, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);
    
    const executed = await commandManager.executeCommand(cmd, message, args);
    if (!executed) {
      logger.info(`Unknown command: ${cmd}`);
    }
  } catch (err) {
    logger.error('Error handling message:', err);
    try {
      await message.reply('An error occurred while processing your command.');
    } catch (replyErr) {
      logger.error('Failed to send error message:', replyErr);
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const executed = await commandManager.executeCommand(interaction.commandName, interaction, []);
    if (!executed) {
      logger.warn(`Unknown slash command: ${interaction.commandName}`);
      await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
  } catch (err) {
    logger.error('Error handling interaction:', err);
    try {
      const errorMessage = { content: 'An error occurred while processing your command.', ephemeral: true };
      if (interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else if (!interaction.replied) {
        await interaction.reply(errorMessage);
      }
    } catch (replyErr) {
      logger.error('Failed to send error message:', replyErr);
    }
  }
});

client.login(TOKEN).catch((err) => {
  logger.error('Failed to login:', err);
  process.exit(1);
});
