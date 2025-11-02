'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class CommandManager {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
  }

  loadCommands(commandsPath) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      try {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if (!command.name || typeof command.execute !== 'function') {
          logger.warn(`Command file ${file} is missing required properties (name, execute). Skipping.`);
          continue;
        }
        
        this.commands.set(command.name.toLowerCase(), command);
        logger.info(`Loaded command: ${command.name}`);
        
        if (command.aliases && Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
          }
        }
      } catch (err) {
        logger.error(`Failed to load command file ${file}:`, err);
      }
    }
    
    logger.info(`Successfully loaded ${this.commands.size} command(s)`);
  }

  getCommand(commandName) {
    const name = commandName.toLowerCase();
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }

  getAllCommands() {
    return Array.from(this.commands.values());
  }

  async executeCommand(commandName, message, args) {
    const command = this.getCommand(commandName);
    
    if (!command) {
      return false;
    }
    
    try {
      await command.execute(message, args);
      return true;
    } catch (err) {
      logger.error(`Error executing command ${commandName}:`, err);
      throw err;
    }
  }
}

module.exports = CommandManager;
