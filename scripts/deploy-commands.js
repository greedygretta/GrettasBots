#!/usr/bin/env node
require('dotenv').config();
const { deployCommands } = require('../src/utils/deployCommands');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // Optional: for faster guild-only deployment

if (!TOKEN || !CLIENT_ID) {
  console.error('ERROR: Missing DISCORD_TOKEN or CLIENT_ID in environment variables.');
  console.error('Please add them to your .env file.');
  process.exit(1);
}

const isGuildOnly = process.argv.includes('--guild');

if (isGuildOnly && !GUILD_ID) {
  console.error('ERROR: --guild flag requires GUILD_ID in .env');
  process.exit(1);
}

deployCommands(TOKEN, CLIENT_ID, isGuildOnly ? GUILD_ID : null)
  .then(() => {
    console.log('✅ Command deployment complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Command deployment failed:', err);
    process.exit(1);
  });
