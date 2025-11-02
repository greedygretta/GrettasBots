const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getRandomLibraryGif } = require('../lib/gifProvider');
const logger = require('../utils/logger');

module.exports = {
  name: 'librarygif',
  description: 'Send a random library GIF',
  aliases: ['library', 'gif'],
  data: new SlashCommandBuilder()
    .setName('librarygif')
    .setDescription('Send a random library GIF'),
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    try {
      if (!isInteraction) {
        await source.channel.sendTyping();
      } else {
        await source.deferReply();
      }
      
      const gif = await getRandomLibraryGif();
      
      if (!gif || !gif.url) {
        const errorMsg = 'Sorry, I could not find a library GIF right now. Please try again later.';
        if (isInteraction) {
          await source.editReply(errorMsg);
        } else {
          await source.reply(errorMsg);
        }
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('📚 Library GIF')
        .setDescription('Here you go — enjoy!')
        .setImage(gif.url)
        .setFooter({ text: `Source: ${gif.source}${gif.id ? ` • id: ${gif.id}` : ''}` });

      if (isInteraction) {
        await source.editReply({ embeds: [embed] });
      } else {
        await source.reply({ embeds: [embed] });
      }
    } catch (err) {
      logger.error('Error in librarygif command:', err);
      const errorMsg = 'An error occurred while fetching the GIF. Please try again later.';
      try {
        if (isInteraction) {
          if (source.deferred) {
            await source.editReply(errorMsg);
          } else {
            await source.reply({ content: errorMsg, ephemeral: true });
          }
        } else {
          await source.reply(errorMsg);
        }
      } catch (replyErr) {
        logger.error('Failed to send error message:', replyErr);
      }
    }
  },
};
