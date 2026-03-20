# React Skills for AI Agents

**Version**: 1.0.0  
**Compatible**: Cursor, Windsurf, Claude Code, GitHub Copilot

## 📦 What is This?

A comprehensive skill package for AI coding agents to learn and apply React 19.2, TypeScript 5.x, and Next.js 16.2 best practices.

## ⚡ Quick Start

### For AI Agents

Use slash commands to access skills:

```
/check-naming          - Naming conventions
/should-use-effect     - useEffect decision tree
/state-management      - State management guide
/form-validation       - Form validation patterns
/data-fetching         - Data fetching best practices
/server-or-client      - Server/Client component decision
/typescript-error      - TypeScript error solutions
```

### For Developers

1. **Clone or download** this repository
2. **Configure your agent** (Cursor/Windsurf/Claude)
3. **Start coding** - agents will use these skills automatically

## 📁 Structure

```
.agents/
├── skills/                 # Skill modules
│   ├── SKILL.md           # Main skill overview
│   ├── naming/            # Naming conventions
│   ├── forms/             # Form validation
│   ├── data-fetching/     # Data fetching patterns
│   ├── state-management/  # State management
│   ├── useeffect/         # useEffect decisions
│   ├── typescript/        # TypeScript solutions
│   └── nextjs/            # Next.js patterns
├── lib/                   # Utility libraries
│   ├── cli.js            # Command-line interface
│   └── installer.js      # Installation logic
├── CONTRIBUTING.md        # Contribution guide
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🎯 Available Skills

### Coding Conventions
- `/check-naming` - PascalCase, camelCase, UPPER_SNAKE_CASE

### Forms
- `/form-validation` - React Hook Form + Zod patterns

### Data Management
- `/data-fetching` - React Query best practices
- `/state-management` - useState, Context, React Query, Zustand

### React Patterns
- `/should-use-effect` - When to use/avoid useEffect

### TypeScript
- `/typescript-error` - Common errors and solutions

### Next.js
- `/server-or-client` - Server vs Client Component decision

## 🤖 Agent Configuration

### Cursor

Cursor automatically detects `.agents/skills/` directory.

### Windsurf

Add to your Windsurf workspace - skills load automatically.

### Claude Code

Reference skills in your Claude configuration.

## 📚 Full Documentation

Complete documentation available in skills directory:
- `skills/CONSTITUTION.md` - Complete reference
- `skills/SKILL-QUICK-REFERENCE.md` - Quick reference
- `skills/SKILL.md` - Skill overview
- `skills/references/` - Code examples and guides

## 🔧 Technologies

- **React**: 19.2
- **TypeScript**: 5.x
- **Next.js**: 16.2
- **Libraries**: React Query, React Hook Form, Zod, Zustand

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding new skills.

## 📄 License

MIT License - See [LICENSE](./LICENSE) file.

## 🔗 Links

- [Main Documentation](../README.md)
- [NPM Package](https://www.npmjs.com/package/good-react-skills)
- [GitHub Repository](https://github.com/zz41354899/good-react-skills)

---

**Made for AI Agents** 🤖 **by Developers** 👨‍💻
