const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const curriculumManager = require('../lib/curriculumManager');

module.exports = {
  name: 'reset-curriculum',
  description: 'Reset curriculum progress back to week 1 (Admin only)',
  aliases: ['curriculum-reset'],
  data: new SlashCommandBuilder()
    .setName('reset-curriculum')
    .setDescription('Reset curriculum progress back to week 1 (Admin only)')
    .addStringOption(option =>
      option
        .setName('professor')
        .setDescription('Which professor (philosophy, latin, librarian)')
        .setRequired(true)
        .addChoices(
          { name: '🏛️ Philosophy', value: 'philosophy' },
          { name: '📜 Latin', value: 'latin' },
          { name: '📚 Research/Library Science', value: 'librarian' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
    // Check permissions
    if (!source.member?.permissions?.has(PermissionFlagsBits.Administrator)) {
      const msg = '❌ This command requires Administrator permissions.';
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    // Get guild ID
    const guildId = source.guild?.id;
    if (!guildId) {
      const msg = 'This command must be used in a server, not in DMs.';
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    let professorId;
    
    if (isInteraction) {
      professorId = source.options.getString('professor');
    } else {
      professorId = args[0]?.toLowerCase();
      
      if (!professorId || !['philosophy', 'latin', 'librarian'].includes(professorId)) {
        await source.reply('Usage: `!reset-curriculum <philosophy|latin|librarian>`');
        return;
      }
    }

    // Check if curriculum exists
    const curriculumData = curriculumManager.getCurriculum(guildId, professorId);
    
    if (!curriculumData) {
      const msg = `❌ No curriculum found for ${professorId}.`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    // Reset progress
    const success = curriculumManager.resetProgress(guildId, professorId);
    
    if (success) {
      const msg = `✅ Reset ${professorId} curriculum progress back to Week 1.`;
      if (isInteraction) {
        await source.reply(msg);
      } else {
        await source.reply(msg);
      }
    } else {
      const msg = `❌ Failed to reset curriculum progress.`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
    }
  },
};
