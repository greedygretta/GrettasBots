const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'latin',
  description: 'Ask the Latin professor for help with translation or grammar',
  aliases: ['translate-latin', 'latin-help'],
  data: new SlashCommandBuilder()
    .setName('latin')
    .setDescription('Ask the Latin professor for help with translation or grammar')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your Latin question or text to translate')
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
        await source.reply('Please provide a question or text to translate! Usage: `!latin <your question>`');
        return;
      }
    }

    await executeProfessorCommand('latin', question, source);
  },
};
