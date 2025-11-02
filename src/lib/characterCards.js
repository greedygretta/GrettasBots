'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CharacterCardManager {
  constructor() {
    this.characters = new Map();
    this.loadCharacters();
  }

  loadCharacters() {
    const charactersPath = path.join(__dirname, '../data/characters');
    
    if (!fs.existsSync(charactersPath)) {
      logger.warn('Characters directory not found. Using default configurations.');
      return;
    }

    const files = fs.readdirSync(charactersPath).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const filePath = path.join(charactersPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const character = JSON.parse(content);
        
        if (!character.id) {
          logger.warn(`Character file ${file} missing 'id' field. Skipping.`);
          continue;
        }
        
        this.characters.set(character.id, character);
        logger.info(`Loaded character card: ${character.name || character.id}`);
      } catch (err) {
        logger.error(`Failed to load character file ${file}:`, err);
      }
    }
  }

  getCharacter(id) {
    return this.characters.get(id);
  }

  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  buildSystemPrompt(characterId) {
    const character = this.getCharacter(characterId);
    if (!character) {
      return null;
    }

    const parts = [];

    // Basic identity
    parts.push(`You are ${character.name}, a ${character.title}.`);

    // Personality traits
    if (character.personality?.traits) {
      parts.push(`\nYour personality: ${character.personality.traits.join(', ')}.`);
    }

    // Speaking style
    if (character.personality?.speaking_style) {
      parts.push(`Speaking style: ${character.personality.speaking_style}.`);
    }

    // Quirks
    if (character.personality?.quirks && character.personality.quirks.length > 0) {
      parts.push(`\nYour quirks: ${character.personality.quirks.join('; ')}.`);
    }

    // Backstory
    if (character.backstory) {
      const bg = character.backstory;
      const bgParts = [];
      if (bg.education) bgParts.push(bg.education);
      if (bg.specialization) bgParts.push(`You specialize in ${bg.specialization}`);
      if (bg.years_teaching || bg.years_experience) {
        const years = bg.years_teaching || bg.years_experience;
        bgParts.push(`You have ${years} years of experience`);
      }
      if (bgParts.length > 0) {
        parts.push(`\nBackground: ${bgParts.join('. ')}.`);
      }
    }

    // Teaching/helping approach
    const approach = character.teaching_approach || character.helping_approach;
    if (approach) {
      if (approach.method) {
        parts.push(`\nYour approach: ${approach.method}.`);
      }
      if (approach.preferences && approach.preferences.length > 0) {
        parts.push(`You prefer to: ${approach.preferences.slice(0, 3).join('; ')}.`);
      }
    }

    // Expertise
    if (character.expertise?.strongest_areas) {
      parts.push(`\nYour main expertise: ${character.expertise.strongest_areas.slice(0, 4).join(', ')}.`);
    }

    // Response guidelines
    if (character.response_guidelines) {
      const guidelines = character.response_guidelines;
      if (guidelines.typical_length) {
        parts.push(`\nKeep responses around ${guidelines.typical_length}.`);
      }
      if (guidelines.tone) {
        parts.push(`Maintain a ${guidelines.tone} tone.`);
      }
      if (guidelines.structure) {
        parts.push(`Response structure: ${guidelines.structure}.`);
      }
      if (guidelines.special_notes) {
        parts.push(`Important: ${guidelines.special_notes}`);
      }
    }

    return parts.join(' ');
  }

  getDisplayConfig(characterId) {
    const character = this.getCharacter(characterId);
    if (!character) {
      return null;
    }

    return {
      name: character.name || character.title,
      icon: character.icon || '🎓',
      color: typeof character.color === 'string' 
        ? parseInt(character.color, 16) 
        : character.color || 0x5865F2
    };
  }
}

const characterCardManager = new CharacterCardManager();
module.exports = characterCardManager;
