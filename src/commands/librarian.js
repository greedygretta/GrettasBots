const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'librarian',
  description: 'Ask the research librarian for help finding information',
  aliases: ['research', 'ask-librarian', 'library-help'],
  data: new SlashCommandBuilder()
    .setName('librarian')
    .setDescription('Ask the research librarian for help finding information')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your research question or topic')
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
        await source.reply('Please provide a research question! Usage: `!librarian <your question>`');
        return;
      }
    }

    await executeProfessorCommand('librarian', question, source);
  },
};
