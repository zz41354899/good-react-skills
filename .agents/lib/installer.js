/**
 * SkillInstaller - Main installation logic for Good React Skills
 * Handles verification and setup for different AI agents
 */

const fs = require('fs');
const path = require('path');
const { SkillCLI } = require('./cli');

class SkillInstaller {
  constructor() {
    this.skillsDir = path.join(__dirname, '..', 'skills');
    this.configDir = path.join(__dirname, '..', '..', '.agentskills');
    this.cli = new SkillCLI(this.skillsDir);
  }

  /**
   * Run installation
   */
  async install(agent = 'all') {
    console.log('🚀 Installing Good React Skills...\n');

    // Check if skills directory exists in package
    if (!this.checkSkillsDirectory()) {
      console.error('❌ Error: Skills directory not found in package');
      process.exit(1);
    }

    // Copy skills directory to user's project
    this.copySkillsToProject();

    // Check if config directory exists, create if not
    if (!this.checkConfigDirectory()) {
      console.log('📁 Creating .agentskills directory...');
      this.createConfigDirectory(agent);
    }

    // Auto-detect available agents if 'all' is specified
    let targetAgents = [agent];
    if (agent === 'all') {
      const detectedAgents = this.detectAvailableAgents();
      if (detectedAgents.length > 0) {
        targetAgents = detectedAgents;
        console.log('🔍 Auto-detected agents from config files:');
        detectedAgents.forEach(a => {
          console.log(`   ✅ ${this.getAgentName(a)}`);
        });
        console.log('');
      } else {
        console.log('⚠️  No agent config files found in .agentskills/');
        console.log('   Please ensure cursor.json, windsurf.json, or claude.json exists.\n');
      }
    }

    // Create Windsurf workflows if needed
    if (targetAgents.includes('windsurf')) {
      this.createWindsurfWorkflows();
    }

    // Display installation info
    this.displayInfo(agent, targetAgents);

    // Verify installation
    this.verifyInstallation(agent);

    console.log('\n✅ Installation complete!\n');
    this.displayNextSteps(agent, targetAgents);
  }

  /**
   * Check if skills directory exists
   */
  checkSkillsDirectory() {
    return fs.existsSync(this.skillsDir);
  }

  /**
   * Check if config directory exists
   */
  checkConfigDirectory() {
    return fs.existsSync(this.configDir);
  }

  /**
   * Copy skills directory to user's project
   */
  copySkillsToProject() {
    const userSkillsDir = path.join(process.cwd(), '.agents', 'skills');
    
    // Skip if already exists
    if (fs.existsSync(userSkillsDir)) {
      return;
    }

    console.log('📚 Copying skills to your project...');
    
    // Create .agents directory if needed
    const userAgentsDir = path.join(process.cwd(), '.agents');
    if (!fs.existsSync(userAgentsDir)) {
      fs.mkdirSync(userAgentsDir, { recursive: true });
    }

    // Copy entire skills directory
    this.copyDirectory(this.skillsDir, userSkillsDir);
    console.log('   ✅ Skills copied successfully\n');
  }

  /**
   * Recursively copy directory
   */
  copyDirectory(src, dest) {
    // Create destination directory
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy subdirectory
        this.copyDirectory(srcPath, destPath);
      } else {
        // Copy file
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  /**
   * Create config directory and generate config files
   */
  createConfigDirectory(agent = 'all') {
    // Create directory
    fs.mkdirSync(this.configDir, { recursive: true });
    
    // Try to copy from package first
    const packageRoot = path.join(__dirname, '..', '..');
    const sourceDir = path.join(packageRoot, '.agentskills');
    
    if (fs.existsSync(sourceDir) && sourceDir !== this.configDir) {
      // Copy from package (NPM scenario)
      const files = fs.readdirSync(sourceDir);
      files.forEach(file => {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(this.configDir, file);
        
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`   ✅ Copied ${file}`);
        }
      });
    } else {
      // Generate config files (local development scenario)
      console.log('   📝 Generating config files...');
      
      const agentsToGenerate = agent === 'all' ? ['cursor', 'windsurf', 'claude'] : [agent];
      
      agentsToGenerate.forEach(a => {
        this.generateConfigFile(a);
      });
    }
    
    console.log('');
  }

  /**
   * Generate a config file for specific agent
   */
  generateConfigFile(agent) {
    const configPath = path.join(this.configDir, `${agent}.json`);
    
    // Skip if already exists
    if (fs.existsSync(configPath)) {
      return;
    }
    
    const configs = {
      cursor: {
        name: "Good React Skills",
        version: "1.0.0",
        type: "skill",
        skillsDirectory: ".agents/skills",
        activation: {
          keywords: ["react", "typescript", "nextjs", "component", "hook", "validation", "form", "state management"],
          filePatterns: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"]
        },
        instructions: {
          primary: "Follow the principles and patterns defined in CONSTITUTION.md",
          onUncertainty: "When uncertain about any React concept, consult the documentation using the uncertainty protocol defined in CONSTITUTION.md",
          language: "Respond in Traditional Chinese (正體中文) when user communicates in that language, even though documentation is in English",
          validation: "Before providing answers, verify against SKILL.md checkpoints and cite sources",
          skillAccess: "Use slash commands to access specific skills from .agents/skills/ directory"
        }
      },
      windsurf: {
        name: "Good React Skills",
        version: "1.0.0",
        type: "skill",
        skillsDirectory: ".agents/skills",
        workflows: {
          enabled: true,
          directory: ".windsurf/workflows",
          commands: {
            "/check-naming": "check-naming.md",
            "/form-validation": "form-validation.md",
            "/should-use-effect": "should-use-effect.md",
            "/state-management": "state-management.md",
            "/data-fetching": "data-fetching.md",
            "/server-or-client": "server-or-client.md",
            "/typescript-error": "typescript-error.md"
          }
        },
        language: {
          documentation: "English",
          userInteraction: "Traditional Chinese (正體中文) + English",
          autoDetect: true
        }
      },
      claude: {
        skill_name: "good-react-skills",
        skill_version: "1.0.0",
        skill_type: "comprehensive-knowledge-base",
        skills_directory: ".agents/skills",
        language: {
          documentation: "English",
          userInteraction: "Traditional Chinese (正體中文) + English",
          autoDetect: true
        }
      }
    };
    
    const config = configs[agent];
    if (config) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`   ✅ Generated ${agent}.json`);
    }
  }

  /**
   * Detect available agents from config files
   */
  detectAvailableAgents() {
    const agents = [];
    
    if (fs.existsSync(path.join(this.configDir, 'cursor.json'))) {
      agents.push('cursor');
    }
    if (fs.existsSync(path.join(this.configDir, 'windsurf.json'))) {
      agents.push('windsurf');
    }
    if (fs.existsSync(path.join(this.configDir, 'claude.json'))) {
      agents.push('claude');
    }
    
    return agents;
  }

  /**
   * Create Windsurf workflows directory and copy skill files
   */
  createWindsurfWorkflows() {
    // Point to user's current working directory
    const workflowsDir = path.join(process.cwd(), '.windsurf', 'workflows');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    // Workflow mappings: source skill -> destination workflow
    const workflows = [
      { source: 'naming/SKILL.md', dest: 'check-naming.md' },
      { source: 'forms/SKILL.md', dest: 'form-validation.md' },
      { source: 'useeffect/SKILL.md', dest: 'should-use-effect.md' },
      { source: 'state-management/SKILL.md', dest: 'state-management.md' },
      { source: 'data-fetching/SKILL.md', dest: 'data-fetching.md' },
      { source: 'nextjs/SKILL.md', dest: 'server-or-client.md' },
      { source: 'typescript/SKILL.md', dest: 'typescript-error.md' },
    ];

    // Copy each workflow file
    workflows.forEach(({ source, dest }) => {
      const sourcePath = path.join(this.skillsDir, source);
      const destPath = path.join(workflowsDir, dest);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  /**
   * Display installation information
   */
  displayInfo(agent = 'all', targetAgents = null) {
    console.log('📦 Package Information:');
    console.log('   Name: Good React Skills');
    console.log('   Version: 1.0.0');
    console.log('   Technologies: React 19.2, TypeScript 5.x, Next.js 16.2\n');

    console.log('📁 Installation Paths:');
    console.log(`   Skills: ${this.skillsDir}`);
    console.log(`   Config: ${this.configDir}\n`);

    if (agent === 'all' && targetAgents && targetAgents.length > 0) {
      console.log('🤖 Installing for Detected Agents:');
      targetAgents.forEach(a => {
        console.log(`   ✅ ${this.getAgentName(a)}`);
      });
      console.log('');
    } else if (agent === 'all') {
      console.log('🤖 Installing for All Agents:');
      console.log('   ✅ Cursor');
      console.log('   ✅ Windsurf');
      console.log('   ✅ Claude Code');
      console.log('   ✅ GitHub Copilot\n');
    } else {
      console.log(`🤖 Installing for: ${this.getAgentName(agent)}\n`);
    }

    console.log('🌍 Language Support:');
    console.log('   📖 Documentation: English');
    console.log('   💬 User Interaction: Traditional Chinese (正體中文) + English');
    console.log('   🤖 AI Auto-detects: Responds in user\'s language\n');
  }

  /**
   * Get agent display name
   */
  getAgentName(agent) {
    const names = {
      'cursor': 'Cursor',
      'windsurf': 'Windsurf',
      'claude': 'Claude Code',
      'copilot': 'GitHub Copilot',
      'all': 'All Agents'
    };
    return names[agent] || agent;
  }

  /**
   * Verify installation
   */
  verifyInstallation(agent = 'all') {
    console.log('🔍 Verifying installation...\n');

    const windsurfWorkflowsDir = path.join(__dirname, '..', '..', '.windsurf', 'workflows');

    // Common checks for all agents
    const commonChecks = [
      { name: 'Skills directory', path: this.skillsDir, agents: ['all'] },
      { name: 'CONSTITUTION.md', path: path.join(this.skillsDir, 'CONSTITUTION.md'), agents: ['all'] },
      { name: 'SKILL-QUICK-REFERENCE.md', path: path.join(this.skillsDir, 'SKILL-QUICK-REFERENCE.md'), agents: ['all'] },
    ];

    // Agent-specific checks
    const agentChecks = {
      cursor: [
        { name: 'Cursor config', path: path.join(this.configDir, 'cursor.json') },
      ],
      windsurf: [
        { name: 'Windsurf config', path: path.join(this.configDir, 'windsurf.json') },
        { name: 'Windsurf workflows', path: windsurfWorkflowsDir },
        { name: '/check-naming workflow', path: path.join(windsurfWorkflowsDir, 'check-naming.md') },
        { name: '/form-validation workflow', path: path.join(windsurfWorkflowsDir, 'form-validation.md') },
        { name: '/should-use-effect workflow', path: path.join(windsurfWorkflowsDir, 'should-use-effect.md') },
        { name: '/state-management workflow', path: path.join(windsurfWorkflowsDir, 'state-management.md') },
        { name: '/data-fetching workflow', path: path.join(windsurfWorkflowsDir, 'data-fetching.md') },
        { name: '/server-or-client workflow', path: path.join(windsurfWorkflowsDir, 'server-or-client.md') },
        { name: '/typescript-error workflow', path: path.join(windsurfWorkflowsDir, 'typescript-error.md') },
      ],
      claude: [
        { name: 'Claude config', path: path.join(this.configDir, 'claude.json') },
      ],
    };

    // Build checks list based on agent
    let checks = [...commonChecks];
    
    if (agent === 'all') {
      // Add all agent-specific checks
      Object.values(agentChecks).forEach(agentCheckList => {
        checks = checks.concat(agentCheckList);
      });
    } else if (agentChecks[agent]) {
      // Add specific agent checks
      checks = checks.concat(agentChecks[agent]);
    }

    let allPassed = true;

    checks.forEach(check => {
      const exists = fs.existsSync(check.path);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} ${check.name}`);
      if (!exists) allPassed = false;
    });

    if (!allPassed) {
      console.log('\n⚠️  Some files are missing. Installation may be incomplete.');
    } else {
      console.log('\n✅ All files verified successfully!');
      
      // Show slash commands if Windsurf workflows are verified
      if (agent === 'windsurf' || agent === 'all') {
        console.log('\n⚡ Slash Commands Ready:');
        console.log('   Type these commands in Windsurf to access workflows:');
        console.log('   /check-naming, /form-validation, /should-use-effect');
        console.log('   /state-management, /data-fetching, /server-or-client');
        console.log('   /typescript-error');
      }
    }
  }

  /**
   * Display next steps based on agent
   */
  displayNextSteps(agent = 'all', targetAgents = null) {
    console.log('📚 Next steps:\n');

    // Use detected agents if available
    const agentsToShow = targetAgents || [agent];
    
    if (agentsToShow.includes('cursor') || agent === 'cursor') {
      console.log('   🎯 Cursor:');
      console.log('      1. Cursor will auto-detect .agentskills/cursor.json');
      console.log('      2. Skills available in React/TypeScript files');
      console.log('      3. Use slash commands: /check-naming, /form-validation\n');
    }

    if (agentsToShow.includes('windsurf') || agent === 'windsurf') {
      console.log('   🌊 Windsurf:');
      console.log('      1. Windsurf will auto-detect .agentskills/windsurf.json');
      console.log('      2. Workflows available in .windsurf/workflows/');
      console.log('      3. Type / to see available commands');
      console.log('      4. Supports Traditional Chinese (正體中文) input\n');
    }

    if (agentsToShow.includes('claude') || agent === 'claude') {
      console.log('   🤖 Claude Code:');
      console.log('      1. Claude will use .agentskills/claude.json');
      console.log('      2. Access skills via slash commands');
      console.log('      3. Full uncertainty protocol support\n');
    }

    console.log('   📖 Start Learning:');
    console.log('      Read .agents/skills/CONSTITUTION.md for complete guide\n');
  }

  /**
   * List available skills
   */
  listSkills() {
    // Use CLI module to get skills
    const skills = this.cli.getAvailableSkills();
    
    console.log('\n⚡ Available Slash Commands:\n');
    
    skills.forEach(skill => {
      console.log(`   ${skill.command.padEnd(25)} - ${skill.description}`);
    });

    console.log('\n📖 Main Documentation:\n');
    console.log('   .agents/skills/CONSTITUTION.md          - Complete reference');
    console.log('   .agents/skills/SKILL-QUICK-REFERENCE.md - Quick reference');
    console.log('   .agents/skills/references/examples.md   - Code examples\n');
  }
}

module.exports = { SkillInstaller };
module.exports = { SkillInstaller };
