#!/usr/bin/env node
const characterCardManager = require('../src/lib/characterCards');

const professorId = process.argv[2] || 'philosophy';

const character = characterCardManager.getCharacter(professorId);
if (!character) {
  console.error(`❌ Character '${professorId}' not found.`);
  console.log('\nAvailable characters:');
  characterCardManager.getAllCharacters().forEach(c => {
    console.log(`  - ${c.id}: ${c.name}`);
  });
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════════');
console.log(`  ${character.icon} ${character.name}`);
console.log(`  ${character.title}`);
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 CHARACTER CARD\n');
console.log(JSON.stringify(character, null, 2));

console.log('\n\n🤖 GENERATED SYSTEM PROMPT\n');
console.log('─────────────────────────────────────────────────────────────');
const systemPrompt = characterCardManager.buildSystemPrompt(professorId);
console.log(systemPrompt);
console.log('─────────────────────────────────────────────────────────────');

const displayConfig = characterCardManager.getDisplayConfig(professorId);
console.log('\n\n🎨 DISPLAY CONFIG\n');
console.log(`  Name: ${displayConfig.name}`);
console.log(`  Icon: ${displayConfig.icon}`);
console.log(`  Color: #${displayConfig.color.toString(16).padStart(6, '0')}`);

console.log('\n✅ Character loaded successfully!\n');
