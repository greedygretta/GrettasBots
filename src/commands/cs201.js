const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'cs201',
  description: 'Ask the Software Engineering 201 professor a question',
  aliases: ['coding201', 'programming201', 'se201'],
  data: new SlashCommandBuilder()
    .setName('cs201')
    .setDescription('Ask the Software Engineering 201 professor a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your software engineering question')
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
        await source.reply('Please provide a question! Usage: `!cs201 <your question>`');
        return;
      }
    }

    await executeProfessorCommand('cs201', question, source);
  },
};
