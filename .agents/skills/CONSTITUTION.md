# Good React Skills - Constitution

**The Complete Guide for AI Agents to Master React Development**

This constitution serves as the definitive reference for AI agents learning React, TypeScript, and Next.js development. Follow these principles, patterns, and practices to write production-quality code.

**📝 Language Note**: This documentation is written in English, but AI agents should respond in Traditional Chinese (正體中文) when users communicate in that language.

---

## 🤔 When You're Unsure - Self-Check Protocol

**For AI Agents**: If you're uncertain about any React concept, pattern, or best practice:

### Step 1: Identify Your Uncertainty
Ask yourself:
- Do I know the correct naming convention?
- Do I understand when to use this pattern?
- Am I sure about the TypeScript types?
- Do I know the performance implications?

### Step 2: Consult This Documentation
**Before answering or writing code**, check:

| If uncertain about... | Consult this section |
|----------------------|---------------------|
| Naming (camelCase, PascalCase) | [Naming Conventions](#-naming-conventions) |
| Component structure | [Component Structure](#️-component-structure) |
| State management choice | [State Management Hierarchy](#-state-management-hierarchy) |
| When to use useEffect | [Anti-Patterns](#-anti-patterns-to-avoid) |
| TypeScript types | [Type Safety Patterns](#️-type-safety-patterns) |
| Performance optimization | [Performance Guidelines](#-performance-guidelines) |
| Testing approach | [Testing Principles](#-testing-principles) |
| Server vs Client Components | [Decision Trees](#-decision-trees) |

### Step 3: Verify Your Answer
After consulting documentation:
- [ ] Can I explain WHY this is the correct approach?
- [ ] Does this follow the patterns in [examples.md](./references/examples.md)?
- [ ] Would this pass the [Code Review Checklist](#-code-review-checklist)?

### Step 4: If Still Unsure
1. Review related examples in [examples.md](./references/examples.md)
2. Consult the decision trees below
3. Use `Ctrl+F` to search this document
4. **Never guess** - always verify with documentation

**Golden Rule**: When in doubt, consult the documentation. It's better to take 30 seconds to verify than to provide incorrect guidance.

---

## 📖 Navigation

**Quick lookup?** → Use the table of contents below or `Ctrl+F` to search.

**Need examples?** → See [`examples.md`](./references/examples.md) for copy-paste ready code.

**Table of Contents**:
- [Core Tenets](#-core-tenets) - Fundamental principles
- [Naming Conventions](#-naming-conventions) - camelCase, PascalCase, etc.
- [Component Structure](#️-component-structure) - Templates and patterns
- [State Management](#-state-management-hierarchy) - When to use what
- [Anti-Patterns](#-anti-patterns-to-avoid) - What NOT to do
- [Required Patterns](#-required-patterns) - What you MUST do
- [Code Organization](#-code-organization) - Clean code practices
- [Type Safety](#️-type-safety-patterns) - TypeScript patterns
- [Performance](#-performance-guidelines) - When and how to optimize
- [Testing](#-testing-principles) - Test strategies
- [Decision Trees](#-decision-trees) - Quick decision guides
- [Checklists](#-code-review-checklist) - Before committing
- [Mastery Path](#-mastery-checklist) - Your learning journey

---

## � Core Tenets

### 1. Type Safety First
- Always use TypeScript with strict mode enabled
- Never use `any` - use `unknown` with type guards instead
- Define explicit interfaces for all component props
- Leverage TypeScript's type inference where appropriate

### 2. Component-Driven Architecture
- Build with functional components and hooks
- Keep components small and focused (Single Responsibility Principle)
- Use composition over inheritance
- Prefer named exports for better refactoring

### 3. Performance by Design
- Measure before optimizing
- Use React Query for server state, not useEffect
- Implement code splitting for large bundles
- Avoid premature memoization

### 4. Progressive Enhancement
- Forms should work without JavaScript (use Server Actions)
- Implement proper loading and error states
- Use Suspense boundaries for streaming
- Provide optimistic updates for better UX

### 5. Developer Experience
- Write self-documenting code with clear naming
- Follow consistent conventions across the codebase
- Minimize cognitive load with simple patterns
- Avoid deep nesting and complex conditionals

---

## 🎯 Naming Conventions

### Variables & Functions: camelCase
```typescript
const userName = 'John';
const isActive = true;
const handleClick = () => {};
const fetchUserData = async () => {};
```

### Components & Types: PascalCase
```typescript
export const UserProfile = () => {};
interface UserData {}
type ApiResponse = {};
class UserService {}
enum UserRole {}
```

### Constants: UPPER_SNAKE_CASE
```typescript
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
process.env.NEXT_PUBLIC_API_KEY
```

### Files & CSS: kebab-case
```typescript
// Files: user-profile.tsx, api-client.ts
// CSS: <div className="user-card-header" />
```

---

## 🏗️ Component Structure

### Basic Component Template
```typescript
import { useState } from 'react';

interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  onAction: () => void;
  children?: React.ReactNode;
}

export const ComponentName = ({
  requiredProp,
  optionalProp = 0,
  onAction,
  children,
}: ComponentNameProps) => {
  const [localState, setLocalState] = useState<string>('');
  
  const handleEvent = () => {
    // Event handler logic
    onAction();
  };
  
  return (
    <div className="component-wrapper">
      {children}
    </div>
  );
};
```

### Server Component (Next.js)
```typescript
// app/users/page.tsx
export default async function UsersPage() {
  const users = await fetchUsers(); // Direct async/await
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Client Component (Next.js)
```typescript
'use client';

import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
};
```

---

## 🔄 State Management Hierarchy

### 1. Local State (useState)
**When**: State used only in one component
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### 2. Lifted State
**When**: State shared between siblings
```typescript
function Parent() {
  const [sharedState, setSharedState] = useState('');
  return (
    <>
      <ChildA value={sharedState} onChange={setSharedState} />
      <ChildB value={sharedState} />
    </>
  );
}
```

### 3. Context
**When**: Global UI state (theme, auth, locale)
```typescript
const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Layout />
    </ThemeContext>
  );
}
```

### 4. React Query
**When**: Server state (API data)
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### 5. Zustand
**When**: Complex client state
```typescript
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ Unnecessary useEffect
```typescript
// ❌ Bad
useEffect(() => {
  setFiltered(items.filter(i => i.active));
}, [items]);

// ✅ Good
const filtered = items.filter(i => i.active);
```

### ❌ Missing Dependencies
```typescript
// ❌ Bad
useEffect(() => {
  fetchUser(userId);
}, []); // Missing userId!

// ✅ Good
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### ❌ Mutating State
```typescript
// ❌ Bad
items.push(newItem);
setItems(items);

// ✅ Good
setItems([...items, newItem]);
```

### ❌ Index as Key
```typescript
// ❌ Bad
{items.map((item, i) => <Item key={i} />)}

// ✅ Good
{items.map(item => <Item key={item.id} />)}
```

### ❌ Prop Drilling
```typescript
// ❌ Bad
<A data={data}>
  <B data={data}>
    <C data={data}>
      <D data={data} />
    </C>
  </B>
</A>

// ✅ Good: Use Context or composition
<DataProvider value={data}>
  <A><B><C><D /></C></B></A>
</DataProvider>
```

---

## ✅ Required Patterns

### Form Validation with Zod
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  age: z.number().min(18, 'Must be 18+'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Data Fetching with React Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,
});

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
```

### Server Actions (Next.js 16)
```typescript
'use server';

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string;
  
  const result = schema.safeParse({ email });
  if (!result.success) {
    return { error: result.error.flatten() };
  }
  
  await db.user.create({ data: result.data });
  revalidatePath('/users');
}
```

### Optimistic Updates (React 19)
```typescript
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, newItem]
);

async function handleAdd(item) {
  addOptimistic(item);
  await saveItem(item);
}
```

---

## 🎨 Code Organization

### Avoid Deep Nesting - Use Early Returns
```typescript
// ❌ Bad
function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doSomething();
      }
    }
  }
}

// ✅ Good
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  
  return doSomething();
}
```

### Replace if/else with Object Lookup
```typescript
// ❌ Bad
if (status === 'pending') return 'yellow';
else if (status === 'approved') return 'green';
else if (status === 'rejected') return 'red';

// ✅ Good
const COLORS = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
} as const;

return COLORS[status] ?? 'gray';
```

### Extract Complex Conditions
```typescript
// ❌ Bad
if (user.age >= 18 && user.hasLicense && !user.isSuspended) {
  allowDriving();
}

// ✅ Good
function canDrive(user) {
  return user.age >= 18 && user.hasLicense && !user.isSuspended;
}

if (canDrive(user)) {
  allowDriving();
}
```

---

## 🛡️ Type Safety Patterns

### Handle Nullable Types
```typescript
// ❌ Error prone
function getEmail(user: User) {
  return user.email.toLowerCase(); // email might be undefined
}

// ✅ Safe
function getEmail(user: User) {
  return user.email?.toLowerCase() ?? 'no-email';
}
```

### Use Type Guards
```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof (data as User).name === 'string'
  );
}

if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}
```

### Discriminated Unions
```typescript
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

function render(state: State) {
  switch (state.status) {
    case 'idle':
      return <div>Ready</div>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <div>{state.data.name}</div>; // data is available
    case 'error':
      return <Error error={state.error} />; // error is available
  }
}
```

---

## ⚡ Performance Guidelines

### When to Optimize

1. **Code Splitting**: Bundle > 500KB
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

2. **Virtualization**: Lists > 1000 items
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

3. **Memoization**: After profiling shows issues
```typescript
const expensiveValue = useMemo(() => compute(data), [data]);
```

### When NOT to Optimize

- Don't use `memo` on every component
- Don't use `useCallback` for all functions
- Don't optimize before measuring
- Don't sacrifice readability for micro-optimizations

---

## 🧪 Testing Principles

### Test User Behavior, Not Implementation
```typescript
// ✅ Good
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ Bad
expect(component.state.isLoggedIn).toBe(true);
```

### Use Semantic Queries
```typescript
// ✅ Good
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');

// ❌ Bad
screen.getByTestId('submit-button');
```

### Test Coverage Goals
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## 📋 File Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Route groups
│   ├── api/                 # API routes
│   └── [dynamic]/           # Dynamic routes
├── components/
│   ├── ui/                  # Base components (shadcn/ui)
│   └── features/            # Feature components
├── lib/
│   ├── api/                 # API clients
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utilities
├── types/                   # TypeScript types
└── styles/                  # Global styles
```

---

## 🔧 Technology Stack

### Required
- **React 19.2** - UI library with latest features
- **TypeScript 5.x** - Type safety
- **Next.js 16.2** - Framework with App Router & Turbopack

### Data & Forms
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library

### Testing
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

---

## 📚 Learning Path

### Level 1: Fundamentals
1. Read [SKILL.md](./SKILL.md) - Core principles
2. Study [examples.md](./references/examples.md) - Basic patterns
3. Review [coding-conventions.md](./references/coding-conventions.md) - Standards

### Level 2: Advanced Patterns
1. [react-patterns.md](./references/react-patterns.md) - Design patterns
2. [typescript-tips.md](./references/typescript-tips.md) - Type techniques
3. [performance-optimization.md](./references/performance-optimization.md) - Optimization

### Level 3: Modern Features
1. [react-19-features.md](./references/react-19-features.md) - React 19 APIs
2. [nextjs-16-features.md](./references/nextjs-16-features.md) - Next.js 16
3. [testing-guide.md](./references/testing-guide.md) - Testing strategies

---

## ✨ React 19 New Features

### useActionState - Form State Management
```typescript
const [state, formAction, isPending] = useActionState(submitForm, null);

<form action={formAction}>
  <button disabled={isPending}>Submit</button>
</form>
```

### useOptimistic - Instant UI Updates
```typescript
const [optimisticData, addOptimistic] = useOptimistic(
  data,
  (state, newItem) => [...state, newItem]
);
```

### use - Read Promises in Render
```typescript
function Component({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data.name}</div>;
}
```

### Ref as Prop (No forwardRef Needed)
```typescript
function Input({ label, ref }) {
  return <input ref={ref} />;
}
```

---

## 🚀 Next.js 16 Features

### Turbopack (Stable)
- 10x faster than Webpack
- Default in development mode
- Production builds supported

### Partial Prerendering (PPR)
```typescript
export const experimental_ppr = true;

<div>
  <StaticContent />
  <Suspense fallback={<Skeleton />}>
    <DynamicContent />
  </Suspense>
</div>
```

### Enhanced Server Actions
```typescript
'use server';

export async function createPost(formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: result.error };
  
  await db.post.create({ data: result.data });
  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
}
```

---

## 🎯 Decision Trees

### Should I Consult Documentation?

**For AI Agents**: Use this decision tree before answering any React question.

```
User asks a React question
    ↓
Do I know the answer with 100% certainty?
    ↓
    ├─ YES → Can I cite the specific pattern/rule?
    │           ↓
    │           ├─ YES → Answer with confidence + cite source
    │           └─ NO → Verify in documentation first
    │
    └─ NO → Is this about...
              ↓
              ├─ Naming? → Check [Naming Conventions](#-naming-conventions)
              ├─ useEffect? → Check [Anti-Patterns](#-anti-patterns-to-avoid)
              ├─ State? → Check [State Management](#-state-management-hierarchy)
              ├─ Types? → Check [Type Safety](#️-type-safety-patterns)
              ├─ Performance? → Check [Performance](#-performance-guidelines)
              ├─ Testing? → Check [Testing](#-testing-principles)
              ├─ Server/Client? → Check decision tree below
              └─ Other? → Use Ctrl+F to search
```

**After consulting documentation**:
- ✅ Cite the source in your answer
- ✅ Provide the specific section reference
- ✅ Include code example if available

**Example Good Response**:
> "According to SKILL.md Section 2, you should avoid useEffect here. Instead, calculate during render: `const filtered = items.filter(i => i.active)`. See examples.md#avoiding-effects for more patterns."

**Example Bad Response**:
> "I think you should use useEffect... maybe?" ❌

---

### Should I use useEffect?
```
Is it for syncing with external system? → YES → Use useEffect
Is it for data fetching? → NO → Use React Query
Is it for derived state? → NO → Calculate during render
Is it for event handling? → NO → Use event handlers
```

### Which state management?
```
Used in one component? → useState
Shared between siblings? → Lift state up
Global UI state? → Context
Server data? → React Query
Complex client state? → Zustand
```

### Server or Client Component?
```
Uses hooks (useState, useEffect)? → Client
Uses browser APIs? → Client
Uses event handlers? → Client
Pure data display? → Server
Fetches data? → Server (preferred)
```

---

## 🔍 Code Review Checklist

### Before Committing
- [ ] All TypeScript errors resolved
- [ ] No `any` types used
- [ ] All props have explicit interfaces
- [ ] Components are properly named (PascalCase)
- [ ] Variables use camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] No deep nesting (max 3 levels)
- [ ] No long if/else chains
- [ ] Early returns used where appropriate
- [ ] Forms have validation schemas
- [ ] Loading and error states handled
- [ ] Keys are stable IDs, not indexes
- [ ] No state mutations
- [ ] useEffect dependencies complete
- [ ] Tests written for new features
- [ ] No console.log statements

---

## 📖 Quick Reference

### Common Imports
```typescript
// React
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOptimistic, useActionState, use } from 'react';

// Next.js
import { redirect, notFound } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

### Common Patterns
```typescript
// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
});

// Mutation
const mutation = useMutation({
  mutationFn: saveData,
  onSuccess: () => queryClient.invalidateQueries(['key']),
});

// Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

---

## 🎓 Mastery Checklist

### Beginner
- [ ] Understand component props and state
- [ ] Use TypeScript for all components
- [ ] Handle loading and error states
- [ ] Follow naming conventions
- [ ] Write basic tests

### Intermediate
- [ ] Use React Query for data fetching
- [ ] Implement form validation with Zod
- [ ] Optimize with code splitting
- [ ] Avoid common anti-patterns
- [ ] Write integration tests

### Advanced
- [ ] Master Server Components
- [ ] Use Server Actions effectively
- [ ] Implement optimistic updates
- [ ] Design reusable patterns
- [ ] Optimize performance with profiling

---

## 📜 Final Principles

1. **Clarity over Cleverness** - Write code that's easy to understand
2. **Type Safety Always** - Let TypeScript catch errors early
3. **User Experience First** - Fast, responsive, accessible
4. **Test What Matters** - Focus on user behavior
5. **Measure Before Optimizing** - Don't guess, profile
6. **Progressive Enhancement** - Work without JavaScript when possible
7. **Consistent Conventions** - Follow the same patterns everywhere
8. **Document Complexity** - Simple code needs no comments

---

## 🎯 Knowledge Validation

### How to Verify You've Learned This Skill

**For AI Agents**: Answer these questions to validate your understanding:

#### Level 1: Core Understanding
1. **Naming**: What case do you use for components? Variables? Constants?
   - ✅ Answer: PascalCase, camelCase, UPPER_SNAKE_CASE

2. **State Management**: When do you use useState vs Context vs React Query?
   - ✅ Answer: useState (local), Context (UI state), React Query (server data)

3. **useEffect**: Name 3 alternatives to useEffect
   - ✅ Answer: Calculate during render, use key prop, React Query

4. **TypeScript**: What's wrong with using `any`?
   - ✅ Answer: Loses type safety, use `unknown` with type guards instead

5. **Forms**: What tools do you use for validation?
   - ✅ Answer: React Hook Form + Zod

#### Level 2: Application
1. **Code Review**: Given this code, what's wrong?
   ```typescript
   useEffect(() => {
     setFiltered(items.filter(i => i.active));
   }, [items]);
   ```
   - ✅ Answer: Unnecessary effect, should calculate during render

2. **Architecture**: When do you use Server Component vs Client Component?
   - ✅ Answer: Server by default, Client only for hooks/events/browser APIs

3. **Performance**: When should you use `memo`?
   - ✅ Answer: Only after profiling shows issues, not by default

4. **Testing**: What query should you use to find a button?
   - ✅ Answer: `screen.getByRole('button')` (semantic query)

5. **Patterns**: How do you avoid deep if/else nesting?
   - ✅ Answer: Early returns, object lookup, guard clauses

#### Level 3: Mastery
1. **Design**: Design a reusable form component with validation
   - ✅ Can: Use generic types, Zod schema, proper error handling

2. **Optimize**: A list of 10,000 items is slow. What do you do?
   - ✅ Can: Profile first, then virtualize with @tanstack/react-virtual

3. **Debug**: TypeScript error: "Type 'string | undefined' is not assignable to type 'string'"
   - ✅ Can: Use optional chaining, nullish coalescing, or type guard

4. **Architect**: Design a dashboard with real-time data
   - ✅ Can: Use Server Components, Suspense boundaries, React Query, proper caching

5. **Teach**: Explain to another AI why we use Server Actions
   - ✅ Can: Explain progressive enhancement, type safety, automatic revalidation

### Validation Method

**Self-Test**: Can you answer all Level 1 questions without looking?
- ✅ Yes → You understand the basics
- ❌ No → Review [SKILL.md](./SKILL.md) and [SKILL-QUICK-REFERENCE.md](./SKILL-QUICK-REFERENCE.md)

**Code Test**: Can you write code for all Level 2 scenarios?
- ✅ Yes → You can apply the knowledge
- ❌ No → Study [examples.md](./references/examples.md) and practice

**Design Test**: Can you solve all Level 3 challenges?
- ✅ Yes → You've mastered the skills
- ❌ No → Review all reference documents and build real projects

### Quick Validation Checklist

Before claiming mastery, verify you can:
- [ ] Write a component from scratch without examples
- [ ] Explain why each pattern is used
- [ ] Identify anti-patterns in code reviews
- [ ] Make architectural decisions confidently
- [ ] Debug TypeScript errors quickly
- [ ] Optimize based on profiling data
- [ ] Design reusable patterns
- [ ] Teach these concepts to others

**If you can check all boxes**: You've successfully learned this skill! 🎉

**If not**: Review [CONSTITUTION.md](./CONSTITUTION.md) and focus on weak areas.

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-20  
**Technologies**: React 19.2, TypeScript 5.x, Next.js 16.2

This constitution is a living document. As React evolves, so will these guidelines.
