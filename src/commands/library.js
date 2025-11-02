// Placeholder command module (for future slash-command registration)
module.exports = {
  name: 'librarygif',
  description: 'Send a random library GIF',
  async execute(interaction) {
    // This file is a placeholder. The current MVP uses a prefix command in src/index.js.
    await interaction.reply('This bot currently supports a prefix command (!librarygif). Slash commands will be added later.');
  },
};
