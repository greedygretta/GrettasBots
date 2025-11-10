const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const openaiService = require('../lib/openaiService');
const characterCardManager = require('../lib/characterCards');
const curriculumManager = require('../lib/curriculumManager');
const logger = require('../utils/logger');

module.exports = {
  name: 'create-curriculum',
  description: 'Create a college-level curriculum for this course',
  aliases: ['curriculum', 'create-course'],
  data: new SlashCommandBuilder()
    .setName('create-curriculum')
    .setDescription('Create a college-level curriculum for this course')
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
        .setName('weeks')
        .setDescription('Number of weeks (default: 15)')
        .setMinValue(4)
        .setMaxValue(20)
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

    let professorId, weeks;
    
    if (isInteraction) {
      professorId = source.options.getString('professor');
      weeks = source.options.getInteger('weeks') || 15;
    } else {
      // Parse prefix command: !create-curriculum philosophy 15
      professorId = args[0]?.toLowerCase();
      weeks = parseInt(args[1]) || 15;
      
      if (!professorId || !['philosophy', 'latin', 'librarian', 'cs101', 'cs201'].includes(professorId)) {
        await source.reply('Usage: `!create-curriculum <philosophy|latin|librarian|cs101|cs201> [weeks]`\nExample: `!create-curriculum cs101 15`');
        return;
      }
      
      if (weeks < 4 || weeks > 20) {
        await source.reply('Number of weeks must be between 4 and 20.');
        return;
      }
    }

    // Check if OpenAI is available
    if (!openaiService.isAvailable()) {
      const msg = '❌ OpenAI is not configured. Cannot generate curriculum.';
      if (isInteraction) {
        await source.reply({ content: msg, ephemeral: true });
      } else {
        await source.reply(msg);
      }
      return;
    }

    // Get character info
    const character = characterCardManager.getCharacter(professorId);
    if (!character) {
      const msg = `❌ Unknown professor: ${professorId}`;
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
      // Generate curriculum using AI
      const prompt = `Create a comprehensive ${weeks}-week college-level curriculum for your subject area. 

Structure your response as a JSON object with this format:
{
  "title": "Course Title",
  "description": "Brief course description",
  "weeks": [
    {
      "week": 1,
      "topic": "Topic name",
      "description": "What will be covered",
      "readings": ["Reading 1", "Reading 2"],
      "assignment": "Brief description of homework/assignment"
    }
  ]
}

Make it academically rigorous, appropriate for college students, and true to your teaching style and expertise.`;

      const systemPrompt = characterCardManager.buildSystemPrompt(professorId);
      
      const result = await openaiService.chat(
        systemPrompt + '\n\nYou are creating a curriculum. Respond ONLY with valid JSON, no other text.',
        prompt,
        { maxTokens: 2000 }
      );

      // Parse the JSON response
      let curriculum;
      try {
        // Try to extract JSON from the response
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          curriculum = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseErr) {
        logger.error('Failed to parse curriculum JSON:', parseErr);
        throw new Error('Failed to parse curriculum. Please try again.');
      }

      // Validate curriculum structure
      if (!curriculum.weeks || !Array.isArray(curriculum.weeks)) {
        throw new Error('Invalid curriculum format');
      }

      // Save curriculum
      const saved = curriculumManager.saveCurriculum(guildId, professorId, curriculum);
      if (!saved) {
        throw new Error('Failed to save curriculum');
      }

      // Create response embed
      const embed = new EmbedBuilder()
        .setColor(displayConfig.color)
        .setTitle(`${displayConfig.icon} ${curriculum.title || 'Course Curriculum'}`)
        .setDescription(curriculum.description || 'A comprehensive college-level course')
        .addFields(
          { name: 'Duration', value: `${weeks} weeks`, inline: true },
          { name: 'Current Week', value: '1', inline: true },
          { name: 'Professor', value: displayConfig.name, inline: true }
        );

      // Add preview of first 3 weeks
      const preview = curriculum.weeks.slice(0, 3).map(w => 
        `**Week ${w.week}**: ${w.topic}`
      ).join('\n');
      
      embed.addFields({ 
        name: 'Preview', 
        value: preview + (curriculum.weeks.length > 3 ? '\n*...and more*' : ''),
        inline: false 
      });

      embed.setFooter({ text: 'Use /view-curriculum to see the full curriculum • Use /homework to get assignments' });

      if (isInteraction) {
        await source.editReply({ embeds: [embed] });
      } else {
        await source.reply({ embeds: [embed] });
      }

    } catch (err) {
      logger.error('Error creating curriculum:', err);
      const errorMsg = `❌ Failed to create curriculum: ${err.message}`;
      
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
