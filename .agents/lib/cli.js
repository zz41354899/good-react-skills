/**
 * CLI utilities for agent skills
 * Provides command-line interface for skill management
 */

const fs = require('fs');
const path = require('path');

class SkillCLI {
  constructor(skillsDir = '.agents/skills') {
    this.skillsDir = skillsDir;
  }

  /**
   * List all available skills
   */
  listSkills() {
    const skills = this.getAvailableSkills();
    console.log('Available Skills:');
    skills.forEach(skill => {
      console.log(`  /${skill.command} - ${skill.description}`);
    });
  }

  /**
   * Get all available skills from directory structure
   */
  getAvailableSkills() {
    const skills = [];
    const skillDirs = fs.readdirSync(this.skillsDir, { withFileTypes: true });
    
    skillDirs.forEach(dir => {
      if (dir.isDirectory()) {
        const skillPath = path.join(this.skillsDir, dir.name, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
          const content = fs.readFileSync(skillPath, 'utf-8');
          const command = this.extractCommand(content);
          const description = this.extractDescription(content);
          
          if (command) {
            skills.push({
              name: dir.name,
              command,
              description,
              path: skillPath,
            });
          }
        }
      }
    });
    
    return skills;
  }

  /**
   * Extract command from skill markdown
   */
  extractCommand(content) {
    const match = content.match(/\*\*Command\*\*:\s*`([^`]+)`/);
    return match ? match[1] : null;
  }

  /**
   * Extract description from skill markdown
   */
  extractDescription(content) {
    const match = content.match(/\*\*Category\*\*:\s*(.+)/);
    return match ? match[1] : '';
  }

  /**
   * Display skill content
   */
  showSkill(command) {
    const skills = this.getAvailableSkills();
    const skill = skills.find(s => s.command === command);
    
    if (!skill) {
      console.error(`Skill not found: ${command}`);
      return;
    }
    
    const content = fs.readFileSync(skill.path, 'utf-8');
    console.log(content);
  }
}

module.exports = { SkillCLI };
