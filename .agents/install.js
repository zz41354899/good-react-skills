#!/usr/bin/env node

/**
 * Installation CLI for Good React Skills
 * Thin wrapper that delegates to lib/installer.js
 */

const { SkillInstaller } = require('./lib/installer');

// Run installer
const installer = new SkillInstaller();

const args = process.argv.slice(2);
const firstArg = args[0];

// Validate agent
const validAgents = ['all', 'cursor', 'windsurf', 'claude', 'copilot'];
const validCommands = ['list', 'help'];

// Determine if first arg is a command or an agent
let command = null;
let agent = 'all';

if (validCommands.includes(firstArg)) {
  // First arg is a command
  command = firstArg;
  agent = args[1] || 'all';
} else if (validAgents.includes(firstArg)) {
  // First arg is an agent
  agent = firstArg;
} else if (firstArg) {
  // Invalid argument
  console.error(`❌ Invalid argument: ${firstArg}`);
  console.error(`Valid commands: ${validCommands.join(', ')}`);
  console.error(`Valid agents: ${validAgents.join(', ')}`);
  process.exit(1);
}

if (command === 'list') {
  installer.listSkills();
} else if (command === 'help') {
  console.log('\n📚 Good React Skills - Installation CLI\n');
  console.log('Usage:');
  console.log('  node install.js [command] [agent]\n');
  console.log('Commands:');
  console.log('  (none)    Install and verify for all agents (default)');
  console.log('  list      List all available slash commands');
  console.log('  help      Show this help message\n');
  console.log('Agents:');
  console.log('  all       All agents (default)');
  console.log('  cursor    Cursor only');
  console.log('  windsurf  Windsurf only');
  console.log('  claude    Claude Code only');
  console.log('  copilot   GitHub Copilot only\n');
  console.log('Examples:');
  console.log('  node install.js');
  console.log('  node install.js cursor');
  console.log('  node install.js windsurf');
  console.log('  node install.js list\n');
} else {
  // No command, run installation
  if (!validAgents.includes(agent)) {
    console.error(`❌ Invalid agent: ${agent}`);
    console.error(`Valid agents: ${validAgents.join(', ')}`);
    process.exit(1);
  }
  
  installer.install(agent);
}
