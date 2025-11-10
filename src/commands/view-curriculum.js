const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const characterCardManager = require('../lib/characterCards');
const curriculumManager = require('../lib/curriculumManager');

module.exports = {
  name: 'view-curriculum',
  description: 'View the current curriculum',
  aliases: ['curriculum-view', 'show-curriculum'],
  data: new SlashCommandBuilder()
    .setName('view-curriculum')
    .setDescription('View the current curriculum')
    .addStringOption(option =>
      option
        .setName('professor')
        .setDescription('Which professor')
        .setRequired(true)
        .addChoices(
          { name: '🏛️ Philosophy', value: 'philosophy' },
          { name: '📜 Latin', value: 'latin' },
          { name: '📚 Research/Library Science', value: 'librarian' },
          { name: '💻 Software Engineering 101', value: 'cs101' },
          { name: '⚙️ Software Engineering 201', value: 'cs201' }
        )
    ),
  
  async execute(source, args) {
    const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
    
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
      
      if (!professorId || !['philosophy', 'latin', 'librarian', 'cs101', 'cs201'].includes(professorId)) {
        await source.reply('Usage: `!view-curriculum <philosophy|latin|librarian|cs101|cs201>`');
        return;
      }
    }

    // Get curriculum
    const curriculumData = curriculumManager.getCurriculum(guildId, professorId);
    
    if (!curriculumData) {
      const msg = `❌ No curriculum found for ${professorId}. Use \`/create-curriculum\` to create one!`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    const curriculum = curriculumData.curriculum;
    const progress = curriculumManager.getProgress(guildId, professorId);
    const displayConfig = characterCardManager.getDisplayConfig(professorId);

    // Create main embed
    const embed = new EmbedBuilder()
      .setColor(displayConfig.color)
      .setTitle(`${displayConfig.icon} ${curriculum.title || 'Course Curriculum'}`)
      .setDescription(curriculum.description || 'College-level curriculum')
      .addFields(
        { name: 'Total Weeks', value: `${curriculum.weeks.length}`, inline: true },
        { name: 'Current Week', value: `${progress.currentWeek}`, inline: true },
        { name: 'Professor', value: displayConfig.name, inline: true }
      );

    // Add current week details
    const currentWeek = curriculum.weeks.find(w => w.week === progress.currentWeek);
    if (currentWeek) {
      embed.addFields({
        name: `📍 Week ${currentWeek.week}: ${currentWeek.topic}`,
        value: currentWeek.description || 'No description',
        inline: false
      });

      if (currentWeek.readings && currentWeek.readings.length > 0) {
        embed.addFields({
          name: '📚 Readings',
          value: currentWeek.readings.slice(0, 3).map(r => `• ${r}`).join('\n'),
          inline: false
        });
      }
    }

    // Add upcoming weeks preview
    const upcomingWeeks = curriculum.weeks
      .filter(w => w.week > progress.currentWeek && w.week <= progress.currentWeek + 2)
      .map(w => `**Week ${w.week}**: ${w.topic}`)
      .join('\n');

    if (upcomingWeeks) {
      embed.addFields({
        name: '🔜 Coming Up',
        value: upcomingWeeks,
        inline: false
      });
    }

    embed.setFooter({ text: 'Use /homework to get this week\'s assignment' });

    if (isInteraction) {
      await source.reply({ embeds: [embed] });
    } else {
      await source.reply({ embeds: [embed] });
    }
  },
};
