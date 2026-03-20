# Good React Skills

A comprehensive React and TypeScript best practices skill guide following the [Agent Skills](https://agentskills.io) specification.

## 📋 Overview

This skill guide provides complete best practices for modern React development, including:

- ✅ React component design patterns
- ✅ Advanced TypeScript techniques
- ✅ Next.js 16.2 | App Router, Server Components, Turbopack
- ✅ Performance optimization strategies
- ✅ Testing best practices
- ✅ Common pitfalls and solutions

**📝 Language Note**: While this documentation is written in English for universal accessibility, it fully supports Traditional Chinese (正體中文) user interactions. AI agents can respond in Traditional Chinese when users communicate in that language.

## 📁 Directory Structure

```
good-react-skills/
├── README.md                   # Project documentation
├── .agents/                    # 🎯 Agent Skills Package
│   ├── skills/                # All skills and documentation
│   │   ├── README.md          # Skills package overview
│   │   ├── CONSTITUTION.md           # 📜 Complete reference
│   │   ├── SKILL-QUICK-REFERENCE.md  # 📖 Quick reference
│   │   ├── naming/            # Naming conventions skill
│   │   ├── forms/             # Form validation skill
│   │   ├── data-fetching/     # Data fetching skill
│   │   ├── state-management/  # State management skill
│   │   ├── useeffect/         # useEffect decision skill
│   │   ├── typescript/        # TypeScript error skill
│   │   ├── nextjs/            # Next.js patterns skill
│   │   └── references/        # Reference docs
│   │       ├── examples.md           # Code examples
│   │       ├── react-19-features.md  # React 19 features
│   │       └── nextjs-16-features.md # Next.js 16 features
│   └── lib/                   # Utility libraries
└── .agentskills/              # Agent configurations
    ├── cursor.json
    ├── windsurf.json
    └── claude.json
```

## 📦 Installation

**Note**: The `.agentskills` directory with configuration files must be included in the NPM package for auto-detection to work.

### Option 1: NPM (Recommended)

```bash
# Install globally
npm install -g good-react-skills

# Or use npx (no installation needed)
npx good-react-skills

# Install for specific agent
npx good-react-skills cursor
npx good-react-skills windsurf
npx good-react-skills claude
```

### Option 2: GitHub

```bash
# Clone the repository
git clone https://github.com/zz41354899/good-react-skills.git
cd good-react-skills

# Run installation
node .agents/install.js

# Or install for specific agent
node .agents/install.js cursor
node .agents/install.js windsurf
node .agents/install.js claude
```

### Verify Installation

```bash
# Check all available commands
node .agents/install.js list

# Show help
node .agents/install.js help
```

## � Quick Start

### For AI Agents

1. **Complete Guide**: Consult [`.agents/skills/CONSTITUTION.md`](./.agents/skills/CONSTITUTION.md) for comprehensive reference
2. **Quick Reference**: Use [`.agents/skills/SKILL-QUICK-REFERENCE.md`](./.agents/skills/SKILL-QUICK-REFERENCE.md) for rapid lookup
3. **Skill Overview**: Check [`.agents/skills/SKILL.md`](./.agents/skills/SKILL.md) for main concepts
4. **Copy Code**: Get ready-to-use examples from [`.agents/skills/references/examples.md`](./.agents/skills/references/examples.md)
5. **Use Slash Commands**: Type `/check-naming`, `/form-validation`, etc. for instant access

### For Developers

1. **Complete reference** → Read [`.agents/skills/CONSTITUTION.md`](./.agents/skills/CONSTITUTION.md)
2. **Quick answer** → Check [`.agents/skills/SKILL-QUICK-REFERENCE.md`](./.agents/skills/SKILL-QUICK-REFERENCE.md)
3. **Code examples** → Browse [`.agents/skills/references/examples.md`](./.agents/skills/references/examples.md)
4. **Skills overview** → See [`.agents/README.md`](./.agents/README.md)

### Deep Dive

**Core Documentation**:
- **Constitution**: [`.agents/skills/CONSTITUTION.md`](./.agents/skills/CONSTITUTION.md) - Complete reference with all patterns
- **Quick Reference**: [`.agents/skills/SKILL-QUICK-REFERENCE.md`](./.agents/skills/SKILL-QUICK-REFERENCE.md) - Fast lookup
- **Code Examples**: [`.agents/skills/references/examples.md`](./.agents/skills/references/examples.md) - Ready-to-use code

**Modern Features**:
- **React 19**: [`.agents/skills/references/react-19-features.md`](./.agents/skills/references/react-19-features.md)
- **Next.js 16**: [`.agents/skills/references/nextjs-16-features.md`](./.agents/skills/references/nextjs-16-features.md)

## 🎯 Core Principles

### 1. Prefer Functional Components with Hooks
```typescript
export const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
  return <div>{name}</div>;
};
```

### 2. Avoid Overusing useEffect
```typescript
// ✅ Calculate during render
const filteredTodos = todos.filter(t => t.status === filter);

// ❌ Unnecessary effect
useEffect(() => {
  setFilteredTodos(todos.filter(t => t.status === filter));
}, [todos, filter]);
```

### 3. Use TypeScript for Type Safety
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}
```

### 4. Use Modern Tooling
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Testing**: Vitest + React Testing Library

## 📚 Learning Resources

### Official Documentation
- [React Official Documentation](https://react.dev/learn)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

### Recommended Tools
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

## 🤝 Contributing

This skill guide evolves with the React ecosystem. Suggestions and improvements are welcome!

## 📄 License

MIT License

## 🎯 How to Validate AI Agent Learning

### For AI Agents: Verify You've Learned This Skill

**Method 1: Quick Test** (5 minutes)
- Read [`.agents/skills/SKILL-QUICK-REFERENCE.md`](./.agents/skills/SKILL-QUICK-REFERENCE.md)
- Answer the validation questions at the end
- Score 5/5 → You understand basics

**Method 2: Code Test** (30 minutes)
- Try to write code for scenarios in [`.agents/skills/references/examples.md`](./.agents/skills/references/examples.md)
- Can write without looking → You can apply knowledge

**Method 3: Complete Validation** (2 hours)
- Answer all questions in [`.agents/skills/CONSTITUTION.md`](./.agents/skills/CONSTITUTION.md#-knowledge-validation)
- Pass all 3 levels → You've mastered the skill

**Method 4: Weekly Checkpoints**
- Follow [`.agents/skills/AI-LEARNING-GUIDE.md`](./.agents/skills/AI-LEARNING-GUIDE.md)
- Complete weekly self-assessment with test questions
- Pass all 5 weeks → Full mastery

### Validation Indicators

**You've learned this skill if you can**:
- [ ] Create components without looking at examples
- [ ] Explain why each pattern is used
- [ ] Identify anti-patterns in code
- [ ] Make architectural decisions
- [ ] Debug TypeScript errors
- [ ] Optimize based on profiling
- [ ] Design reusable patterns
- [ ] Teach concepts to others

**If you can't**: Return to [`.agents/skills/AI-LEARNING-GUIDE.md`](./.agents/skills/AI-LEARNING-GUIDE.md) and focus on weak areas.

---

## 🤖 AI Agent Integration

This skill package is compatible with major AI coding agents:

### Supported Agents
- ✅ **Cursor** - AI-powered code editor
- ✅ **Windsurf** - AI coding assistant  
- ✅ **Claude Code** - Anthropic's coding agent
- ✅ **GitHub Copilot** - Compatible through standard patterns

### Installation by Agent

#### For Cursor Users
```bash
# NPM
npx good-react-skills cursor

# GitHub
node .agents/install.js cursor
```
**What gets installed**:
- ✅ Skills directory
- ✅ Main documentation (CONSTITUTION.md, AI-LEARNING-GUIDE.md, etc.)
- ✅ Cursor configuration (`.agentskills/cursor.json`)

#### For Windsurf Users
```bash
# NPM
npx good-react-skills windsurf

# GitHub
node .agents/install.js windsurf
```
**What gets installed**:
- ✅ Skills directory
- ✅ Main documentation
- ✅ Windsurf configuration (`.agentskills/windsurf.json`)
- ✅ **7 Workflow files** (`.windsurf/workflows/`)
  - `/check-naming` - Naming conventions
  - `/form-validation` - Form validation
  - `/should-use-effect` - useEffect decision tree
  - `/state-management` - State management
  - `/data-fetching` - Data fetching
  - `/server-or-client` - Server/Client component decision
  - `/typescript-error` - TypeScript error solutions

#### For Claude Code Users
```bash
# NPM
npx good-react-skills claude

# GitHub
node .agents/install.js claude
```
**What gets installed**:
- ✅ Skills directory
- ✅ Main documentation
- ✅ Claude configuration (`.agentskills/claude.json`)

#### Install All Agents
```bash
# NPM
npx good-react-skills

# GitHub
node .agents/install.js
```
**What gets installed**:
- ✅ Everything for all agents (Cursor, Windsurf, Claude)

### Quick Setup

**Auto-Detection**:
1. After installation, your AI agent will automatically detect the configurations
2. Cursor/Windsurf/Claude will load skills from `.agentskills/` directory
3. Start using slash commands immediately!

**Configuration Files**:
- `.agentskills/skill.json` - Main manifest
- `.agentskills/cursor.json` - Cursor-specific
- `.agentskills/windsurf.json` - Windsurf-specific
- `.agentskills/claude.json` - Claude-specific

### How Agents Use This Skill

1. **Primary Reference**: `.agents/skills/CONSTITUTION.md` for complete guidance
2. **Quick Lookup**: `.agents/skills/SKILL-QUICK-REFERENCE.md` for rapid reference
3. **Slash Commands**: Use `/` commands for instant access (e.g., `/check-naming`, `/form-validation`)
4. **Uncertainty Protocol**: Follow self-check when unsure
5. **Code Examples**: `.agents/skills/references/examples.md` for ready-to-use code
6. **Validation**: Built-in self-assessment mechanisms

### ⚡ Slash Commands

Quick access to skills via slash commands:

```
/check-naming            - 命名規範
/should-use-effect       - useEffect 決策樹
/state-management        - 狀態管理
/form-validation         - 表單驗證
/data-fetching           - 資料獲取
/server-or-client        - Server/Client 決策
/typescript-error        - TypeScript 錯誤
```

See [`.agents/README.md`](./.agents/README.md) for complete skill list and integration documentation.

---

## 🔗 Related Links

- [Agent Skills Specification](https://agentskills.io/home)
- [Agent Skills Documentation](https://agentskills.io/specification)

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-20  
**Tech Stack**: React 19.2, TypeScript 5.x, Next.js 16.2  
**Agent Compatible**: Cursor, Windsurf, Claude Code, GitHub Copilot
