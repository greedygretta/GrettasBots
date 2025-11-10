const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const openaiService = require('../lib/openaiService');
const characterCardManager = require('../lib/characterCards');
const curriculumManager = require('../lib/curriculumManager');
const logger = require('../utils/logger');

module.exports = {
  name: 'homework',
  description: 'Get homework assignment for a specific week',
  aliases: ['assignment', 'get-homework'],
  data: new SlashCommandBuilder()
    .setName('homework')
    .setDescription('Get homework assignment for a specific week')
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
    )
    .addIntegerOption(option =>
      option
        .setName('week')
        .setDescription('Week number (leave empty for current week)')
        .setMinValue(1)
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

    let professorId, weekNumber;
    
    if (isInteraction) {
      professorId = source.options.getString('professor');
      weekNumber = source.options.getInteger('week');
    } else {
      // Parse: !homework philosophy 3
      professorId = args[0]?.toLowerCase();
      weekNumber = args[1] ? parseInt(args[1]) : null;
      
      if (!professorId || !['philosophy', 'latin', 'librarian', 'cs101', 'cs201'].includes(professorId)) {
        await source.reply('Usage: `!homework <philosophy|latin|librarian|cs101|cs201> [week]`\nExample: `!homework cs101 3`');
        return;
      }
    }

    // Get curriculum
    const curriculumData = curriculumManager.getCurriculum(guildId, professorId);
    
    if (!curriculumData) {
      const msg = `❌ No curriculum found for ${professorId}. Use \`/create-curriculum\` first!`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    const curriculum = curriculumData.curriculum;
    const progress = curriculumManager.getProgress(guildId, professorId);
    
    // Determine which week
    const targetWeek = weekNumber || progress.currentWeek;
    
    if (targetWeek < 1 || targetWeek > curriculum.weeks.length) {
      const msg = `❌ Invalid week number. This curriculum has ${curriculum.weeks.length} weeks.`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    const weekData = curriculum.weeks.find(w => w.week === targetWeek);
    
    if (!weekData) {
      const msg = `❌ Week ${targetWeek} not found in curriculum.`;
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    // Check if OpenAI is available
    if (!openaiService.isAvailable()) {
      const msg = '❌ OpenAI is not configured. Cannot generate detailed homework.';
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    const displayConfig = characterCardManager.getDisplayConfig(professorId);

    // Defer reply
    if (isInteraction) {
      await source.deferReply();
    } else {
      await source.channel.sendTyping();
    }

    try {
      // Generate detailed homework using AI
      const systemPrompt = characterCardManager.buildSystemPrompt(professorId);
      
      const prompt = `Based on the curriculum for Week ${targetWeek}, create a detailed homework assignment.

Week ${targetWeek}: ${weekData.topic}
Description: ${weekData.description}
${weekData.readings ? `Readings: ${weekData.readings.join(', ')}` : ''}
Assignment Brief: ${weekData.assignment}

Create a comprehensive homework assignment that:
1. Includes clear instructions
2. Has specific deliverables
3. Provides a suggested timeline
4. Includes any necessary resources or tips
5. Reflects your teaching style and expertise

Keep it rigorous but achievable for college students. Be specific and practical.`;

      const result = await openaiService.chat(systemPrompt, prompt, { maxTokens: 1000 });

      // Create homework embed
      const embed = new EmbedBuilder()
        .setColor(displayConfig.color)
        .setTitle(`${displayConfig.icon} Week ${targetWeek} Homework: ${weekData.topic}`)
        .setDescription(result.content)
        .addFields(
          { name: '📅 Week', value: `${targetWeek} of ${curriculum.weeks.length}`, inline: true },
          { name: '👨‍🏫 Professor', value: displayConfig.name, inline: true }
        );

      if (weekData.readings && weekData.readings.length > 0) {
        embed.addFields({
          name: '📚 Required Readings',
          value: weekData.readings.slice(0, 5).map(r => `• ${r}`).join('\n'),
          inline: false
        });
      }

      embed.setFooter({ 
        text: `Tokens used: ${result.usage?.total_tokens || 'N/A'} • Use /view-curriculum to see full course`
      });

      if (isInteraction) {
        await source.editReply({ embeds: [embed] });
      } else {
        await source.reply({ embeds: [embed] });
      }

    } catch (err) {
      logger.error('Error generating homework:', err);
      const errorMsg = `❌ Failed to generate homework: ${err.message}`;
      
      if (isInteraction) {
        if (source.deferred) {
          await source.editReply({ content: errorMsg, embeds: [] });
        } else {
          await source.reply({ content: errorMsg, ephemeral: true });
        }
      } else {
        await source.reply(errorMsg);
      }
    }
  },
};
