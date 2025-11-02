'use strict';
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

async function deployCommands(token, clientId, guildId = null) {
  const commands = [];
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.data) {
      commands.push(command.data.toJSON());
      logger.info(`Prepared slash command: ${command.name}`);
    }
  }

  const rest = new REST().setToken(token);

  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    let data;
    if (guildId) {
      // Guild-specific deployment (faster for testing)
      data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      logger.info(`Successfully registered ${data.length} guild commands for guild ${guildId}`);
    } else {
      // Global deployment (takes up to 1 hour to propagate)
      data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      logger.info(`Successfully registered ${data.length} global commands`);
    }

    return data;
  } catch (error) {
    logger.error('Error deploying commands:', error);
    throw error;
  }
}

module.exports = { deployCommands };
