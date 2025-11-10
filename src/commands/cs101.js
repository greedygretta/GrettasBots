const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'cs101',
  description: 'Ask the Software Engineering 101 professor a question',
  aliases: ['coding101', 'programming101', 'se101'],
  data: new SlashCommandBuilder()
    .setName('cs101')
    .setDescription('Ask the Software Engineering 101 professor a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your programming question')
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
        await source.reply('Please provide a question! Usage: `!cs101 <your question>`');
        return;
      }
    }

    await executeProfessorCommand('cs101', question, source);
  },
};
