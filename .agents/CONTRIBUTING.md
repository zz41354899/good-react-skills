# Contributing to React Skills

## Adding New Skills

### 1. Create Skill Directory

```bash
mkdir -p .agents/skills/your-skill-name
```

### 2. Create SKILL.md

```markdown
# Your Skill Name

**Command**: `/your-command`  
**Category**: Your Category

## 🎯 Quick Start

Brief description of what this skill does.

## 📋 Pattern

Code examples and patterns.

## ✅ Examples

Practical examples.

## 📚 Full Documentation

Link to complete documentation.
```

### 3. Required Sections

Every skill MUST have:
- **Command**: The slash command to invoke it
- **Category**: Classification (Forms, Data, TypeScript, etc.)
- **Quick Start**: Brief overview
- **Examples**: Code examples
- **Full Documentation**: Link to detailed docs

### 4. File Structure

```
.agents/skills/your-skill/
├── SKILL.md          # Main skill file (required)
├── examples/         # Optional: Additional examples
└── README.md         # Optional: Extended documentation
```

## Skill Categories

- **Coding Conventions**: Naming, formatting, style
- **Forms**: Form handling and validation
- **Data Management**: Data fetching, caching
- **State Management**: State solutions
- **React Patterns**: Hooks, components
- **TypeScript**: Type safety, errors
- **Next.js**: Server/Client components, routing
- **Performance**: Optimization techniques
- **Testing**: Testing strategies
- **Clean Code**: Code organization

## Best Practices

1. **Keep it focused**: One skill = one concept
2. **Provide examples**: Show, don't just tell
3. **Link to docs**: Reference complete documentation
4. **Use decision trees**: Help agents make choices
5. **Include anti-patterns**: Show what NOT to do

## Testing Your Skill

1. Ensure SKILL.md is valid markdown
2. Test slash command works
3. Verify examples are correct
4. Check links to documentation

## Pull Request Process

1. Create skill in `.agents/skills/`
2. Update this CONTRIBUTING.md if needed
3. Test with at least one agent (Cursor/Windsurf/Claude)
4. Submit PR with description

## Questions?

Open an issue or discussion on GitHub.
