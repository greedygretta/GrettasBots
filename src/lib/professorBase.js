'use strict';
const { EmbedBuilder } = require('discord.js');
const openaiService = require('./openaiService');
const logger = require('../utils/logger');

const PROFESSOR_CONFIGS = {
  philosophy: {
    name: 'Philosophy Professor',
    icon: '🏛️',
    color: 0x9B59B6, // Purple
    systemPrompt: `You are a wise and engaging philosophy professor at a prestigious university. You love the Socratic method and enjoy asking thought-provoking questions to help students think deeply. You reference classical philosophers like Plato, Aristotle, Kant, and Nietzsche when relevant. You're warm, encouraging, and make complex philosophical concepts accessible. Keep responses concise but profound, around 300-400 words. End with a thoughtful question when appropriate.`
  },
  latin: {
    name: 'Latin Professor',
    icon: '📜',
    color: 0xE74C3C, // Red
    systemPrompt: `You are a classical Latin scholar and professor with deep knowledge of Latin grammar, vocabulary, and classical texts. You help students with translations, explain grammatical concepts clearly, and reference works by authors like Cicero, Virgil, and Ovid when relevant. You're patient, precise, and enthusiastic about the beauty of Latin. Provide clear explanations with examples. Keep responses focused and pedagogical, around 300-400 words.`
  },
  librarian: {
    name: 'Research Librarian',
    icon: '📚',
    color: 0x3498DB, // Blue
    systemPrompt: `You are a knowledgeable and friendly research librarian at a university library. You excel at helping people find information, recommending books and resources, and guiding research. You're organized, thorough, and make research accessible and less intimidating. When suggesting resources, be specific but understand you're in a chat context. Keep responses helpful and actionable, around 300-400 words.`
  }
};

async function executeProfessorCommand(professorType, question, source) {
  const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
  const config = PROFESSOR_CONFIGS[professorType];

  if (!config) {
    throw new Error(`Unknown professor type: ${professorType}`);
  }

  if (!openaiService.isAvailable()) {
    const errorMsg = '❌ AI professors are not configured. Please add OPENAI_API_KEY to the environment.';
    if (isInteraction) {
      await source.reply({ content: errorMsg, ephemeral: true });
    } else {
      await source.reply(errorMsg);
    }
    return;
  }

  // Show typing/defer
  if (!isInteraction) {
    await source.channel.sendTyping();
  } else {
    await source.deferReply();
  }

  try {
    const result = await openaiService.chat(config.systemPrompt, question);
    
    // Split response if too long (Discord limit is 4096 for embed description)
    const chunks = splitResponse(result.content, 4000);
    
    for (let i = 0; i < chunks.length; i++) {
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`${config.icon} ${config.name}`)
        .setDescription(chunks[i])
        .setFooter({ 
          text: chunks.length > 1 
            ? `Part ${i + 1}/${chunks.length} • Tokens: ${result.usage?.total_tokens || 'N/A'}` 
            : `Tokens: ${result.usage?.total_tokens || 'N/A'}`
        });

      if (i === 0) {
        embed.addFields({ name: 'Question', value: truncate(question, 1024), inline: false });
      }

      if (isInteraction) {
        if (i === 0) {
          await source.editReply({ embeds: [embed] });
        } else {
          await source.followUp({ embeds: [embed] });
        }
      } else {
        await source.reply({ embeds: [embed] });
      }
    }
  } catch (err) {
    logger.error(`Error in ${professorType} professor:`, err);
    const errorMsg = err.message || 'An error occurred while consulting the professor. Please try again later.';
    
    if (isInteraction) {
      if (source.deferred) {
        await source.editReply({ content: `❌ ${errorMsg}`, embeds: [] });
      } else {
        await source.reply({ content: `❌ ${errorMsg}`, ephemeral: true });
      }
    } else {
      await source.reply(`❌ ${errorMsg}`);
    }
  }
}

function splitResponse(text, maxLength) {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n\n');
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length <= maxLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      if (para.length <= maxLength) {
        currentChunk = para;
      } else {
        const sentences = para.split('. ');
        currentChunk = '';
        
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length <= maxLength - 2) {
            currentChunk += (currentChunk ? '. ' : '') + sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk + '.');
            }
            currentChunk = sentence;
          }
        }
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

module.exports = { executeProfessorCommand, PROFESSOR_CONFIGS };
