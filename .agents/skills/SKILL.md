# React Skills - Quick Reference

**Version**: 1.0.0  
**Category**: Frontend Development  
**Technologies**: React 19.2, TypeScript 5.x, Next.js 16.2

## 📖 About This Skill

This is the main skill file for React development best practices. It provides quick reference for:
- Component design patterns
- TypeScript usage
- State management
- Form handling
- Performance optimization
- Next.js patterns

## 🎯 How to Use

**For AI Agents**: This skill is designed to be accessed via slash commands or direct reference.

**Available Commands**:
- `/check-naming` - Naming conventions
- `/should-use-effect` - useEffect decision tree
- `/state-management` - State management guide
- `/form-validation` - Form validation patterns
- `/data-fetching` - Data fetching best practices
- `/server-or-client` - Server/Client component decision
- `/typescript-error` - TypeScript error solutions

## 📚 Core Principles

### 1. Type Safety First
- Always use TypeScript with strict mode
- Never use `any` - use `unknown` with type guards
- Define explicit interfaces for props and state

### 2. Component Design
- Functional components with hooks
- Composition over inheritance
- Single Responsibility Principle
- Props interface before implementation

### 3. Avoid useEffect Overuse
- Calculate during render when possible
- Use React Query for data fetching
- Only use for external system synchronization

### 4. State Management Hierarchy
1. **Local state** - useState for component-specific state
2. **UI state** - React Context for theme, locale
3. **Server state** - React Query for API data
4. **Complex state** - Zustand for global app state

### 5. Forms
- React Hook Form for form handling
- Zod for validation schemas
- useActionState (React 19) for submissions

### 6. Performance
- Measure before optimizing
- Avoid premature memoization
- Use React DevTools Profiler

### 7. Next.js Patterns
- Server Components by default
- Client Components only when needed
- Server Actions for mutations

## 📋 Quick Reference

See `CONSTITUTION.md` for complete documentation.
See `references/examples.md` for code examples.

## 🔗 Related Documentation

- `references/react-19-features.md` - React 19 new features
- `references/nextjs-16-features.md` - Next.js 16 patterns
- `CONSTITUTION.md` - Complete reference guide
- `SKILL-QUICK-REFERENCE.md` - Quick lookup guide
