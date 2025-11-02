require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { getRandomLibraryGif } = require('./lib/gifProvider');
const logger = require('./utils/logger');

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!';

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
  // Note: slash command registration can be added later. For the MVP we provide a prefix command (!librarygif).
});

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const [cmd, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);
    if (cmd.toLowerCase() === 'librarygif') {
      await message.channel.sendTyping();
      const gif = await getRandomLibraryGif();
      if (!gif || !gif.url) {
        await message.reply('Sorry, I could not find a library GIF right now. Please try again later.');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('📚 Library GIF')
        .setDescription('Here you go — enjoy!')
        .setImage(gif.url)
        .setFooter({ text: `Source: ${gif.source}${gif.id ? ` • id: ${gif.id}` : ''}` });

      await message.reply({ embeds: [embed] });
    }
  } catch (err) {
    logger.error('Error handling message:', err);
    // Do not crash the bot on handler errors
  }
});

client.login(TOKEN).catch((err) => {
  logger.error('Failed to login:', err);
  process.exit(1);
});
