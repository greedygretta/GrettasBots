const { SlashCommandBuilder } = require('discord.js');
const { executeProfessorCommand } = require('../lib/professorBase');

module.exports = {
  name: 'philosophy',
  description: 'Ask the philosophy professor a question',
  aliases: ['philo', 'philosopher'],
  data: new SlashCommandBuilder()
    .setName('philosophy')
    .setDescription('Ask the philosophy professor a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your philosophical question')
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
        await source.reply('Please provide a question! Usage: `!philosophy <your question>`');
        return;
      }
    }

    await executeProfessorCommand('philosophy', question, source);
  },
};
