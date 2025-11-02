'use strict';
const { EmbedBuilder } = require('discord.js');
const openaiService = require('./openaiService');
const characterCardManager = require('./characterCards');
const logger = require('../utils/logger');

async function executeProfessorCommand(professorType, question, source) {
  const isInteraction = source.isCommand?.() || source.isChatInputCommand?.();
  
  // Get character configuration
  const character = characterCardManager.getCharacter(professorType);
  if (!character) {
    throw new Error(`Unknown professor type: ${professorType}`);
  }

  const systemPrompt = characterCardManager.buildSystemPrompt(professorType);
  const displayConfig = characterCardManager.getDisplayConfig(professorType);
  
  if (!systemPrompt || !displayConfig) {
    throw new Error(`Failed to load configuration for ${professorType}`);
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
    const result = await openaiService.chat(systemPrompt, question);
    
    // Split response if too long (Discord limit is 4096 for embed description)
    const chunks = splitResponse(result.content, 4000);
    
    for (let i = 0; i < chunks.length; i++) {
      const embed = new EmbedBuilder()
        .setColor(displayConfig.color)
        .setTitle(`${displayConfig.icon} ${displayConfig.name}`)
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

module.exports = { executeProfessorCommand };
