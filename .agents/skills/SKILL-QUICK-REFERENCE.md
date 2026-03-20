# React Skills - Quick Reference Guide

**Version**: 1.0.0  
**Last Updated**: 2024  
**Technologies**: React 19.2, TypeScript 5.x, Next.js 16.2

## 🎯 Purpose

This guide provides quick answers to common React development questions. Use `Ctrl+F` to search for specific topics.

**For complete details**, see [`CONSTITUTION.md`](./CONSTITUTION.md)  
**For code examples**, see [`references/examples.md`](./references/examples.md)

---

## 📋 Quick Decision Trees

### Should I use useEffect?

```
Do you need to...
├─ Fetch data? → Use React Query
├─ Calculate derived state? → Calculate during render
├─ Sync with external system (DOM, browser API)? → Use useEffect
└─ Update state based on props? → Calculate during render
```

### Which state management?

```
What kind of state?
├─ Component-specific? → useState
├─ UI state (theme, locale)? → React Context
├─ Server data (API)? → React Query
└─ Complex global state? → Zustand
```

### Server or Client Component? (Next.js)

```
Does it need...
├─ User interaction (onClick, onChange)? → Client Component
├─ React hooks (useState, useEffect)? → Client Component
├─ Browser APIs (localStorage, window)? → Client Component
└─ None of the above? → Server Component (default)
```

---

## 🏗️ Component Patterns

### Basic Component Structure

```typescript
// 1. Imports
import { useState } from 'react';

// 2. Types/Interfaces
interface UserCardProps {
  name: string;
  email: string;
}

// 3. Component
export const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Event handlers
  const handleClick = () => setIsExpanded(!isExpanded);

  // 6. Render
  return (
    <div onClick={handleClick}>
      <h3>{name}</h3>
      {isExpanded && <p>{email}</p>}
    </div>
  );
};
```

### Component Checklist

- ✅ PascalCase naming
- ✅ Props interface defined first
- ✅ Named export
- ✅ TypeScript strict mode
- ✅ Single responsibility

---

## 🔤 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `UserCard`, `ProductList` |
| **Files (Components)** | PascalCase | `UserCard.tsx` |
| **Hooks** | camelCase, start with `use` | `useAuth`, `useLocalStorage` |
| **Functions** | camelCase | `handleClick`, `fetchUsers` |
| **Variables** | camelCase | `userName`, `isLoading` |
| **Constants** | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| **Types/Interfaces** | PascalCase | `User`, `UserCardProps` |
| **Enums** | PascalCase | `UserRole`, `Status` |

---

## 🎨 TypeScript Patterns

### Props Interface

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// ❌ Avoid
type ButtonProps = {
  variant: string;  // Too loose
  onClick: any;     // Never use any
};
```

### Event Handlers

```typescript
// ✅ Correct types
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### Discriminated Unions

```typescript
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// TypeScript narrows the type
if (state.status === 'success') {
  console.log(state.data); // TypeScript knows data exists
}
```

---

## 🔄 State Management

### Local State

```typescript
// ✅ Use for component-specific state
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

### Derived State

```typescript
// ✅ Calculate during render - NO useEffect needed
const filteredTodos = todos.filter(t => t.status === filter);
const activeCount = todos.filter(t => !t.completed).length;

// ❌ Don't do this
useEffect(() => {
  setFilteredTodos(todos.filter(t => t.status === filter));
}, [todos, filter]);
```

### Context (UI State)

```typescript
// ✅ Use for theme, locale, user preferences
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### React Query (Server State)

```typescript
// ✅ Use for API data
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

---

## 📝 Forms

### React Hook Form + Zod

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### React 19 useActionState

```typescript
'use client';

const [state, formAction, isPending] = useActionState(createUser, null);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>Submit</button>
</form>
```

---

## 🌐 Next.js Patterns

### Server Component (Default)

```typescript
// app/users/page.tsx
async function getUsers() {
  const users = await db.user.findMany();
  return users;
}

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}
```

### Client Component

```typescript
// components/Counter.tsx
'use client';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Action

```typescript
// app/users/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  await db.user.create({ data: { name } });
  revalidatePath('/users');
}
```

---

## ⚡ Performance

### When to Optimize

```typescript
// ✅ Measure first with React DevTools Profiler
// ✅ Only optimize if there's a real performance issue
// ❌ Don't prematurely optimize

// Use React.memo for expensive components with stable props
const ExpensiveList = React.memo(({ items }) => {
  // Expensive rendering logic
});

// Use useMemo for expensive calculations
const sortedItems = useMemo(() => 
  items.sort((a, b) => expensiveCompare(a, b)),
  [items]
);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## ❌ Common Anti-Patterns

### Don't: useEffect for Derived State

```typescript
// ❌ Bad
useEffect(() => {
  setFilteredItems(items.filter(predicate));
}, [items]);

// ✅ Good
const filteredItems = items.filter(predicate);
```

### Don't: Unnecessary State

```typescript
// ❌ Bad
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const fullName = `${firstName} ${lastName}`;
```

### Don't: Prop Drilling

```typescript
// ❌ Bad - passing props through many levels
<Parent>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user} />
    </GrandChild>
  </Child>
</Parent>

// ✅ Good - use Context
const UserContext = createContext<User | undefined>(undefined);

<UserProvider value={user}>
  <Parent>
    <Child>
      <GrandChild>
        <GreatGrandChild />
      </GrandChild>
    </Child>
  </Parent>
</UserProvider>
```

---

## 🧪 Testing Quick Tips

```typescript
// ✅ Test user behavior, not implementation
test('submits form with valid data', async () => {
  render(<UserForm />);
  
  await userEvent.type(screen.getByLabelText('Name'), 'John');
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Success!')).toBeInTheDocument();
});

// ❌ Don't test implementation details
test('calls setState when button clicked', () => {
  // This is testing implementation, not behavior
});
```

---

## 🔍 When Uncertain

### Self-Check Protocol

1. **Naming**: Does it follow conventions?
   - Components: PascalCase
   - Functions/variables: camelCase
   - Constants: UPPER_SNAKE_CASE

2. **useEffect**: Do I really need it?
   - For derived state? → NO, calculate during render
   - For data fetching? → NO, use React Query
   - For external system sync? → YES

3. **State**: What's the right tool?
   - Component-specific → useState
   - UI state → Context
   - Server data → React Query
   - Complex global → Zustand

4. **Types**: Is it type-safe?
   - No `any` types
   - Explicit interfaces for props
   - Type guards for unions

5. **Server/Client** (Next.js): Which component type?
   - Needs interactivity? → Client
   - Just rendering data? → Server

### If Still Unsure

1. Check [`CONSTITUTION.md`](./CONSTITUTION.md) for complete guidance
2. See [`references/examples.md`](./references/examples.md) for code examples
3. Use slash commands: `/check-naming`, `/should-use-effect`, etc.

---

## 📚 Related Documentation

- **Complete Reference**: [`CONSTITUTION.md`](./CONSTITUTION.md)
- **Code Examples**: [`references/examples.md`](./references/examples.md)
- **React 19 Features**: [`references/react-19-features.md`](./references/react-19-features.md)
- **Next.js 16 Features**: [`references/nextjs-16-features.md`](./references/nextjs-16-features.md)

---

## ⚡ Slash Commands

Quick access via slash commands:

- `/check-naming` - Naming conventions
- `/should-use-effect` - useEffect decision tree
- `/state-management` - State management guide
- `/form-validation` - Form validation patterns
- `/data-fetching` - Data fetching with React Query
- `/server-or-client` - Server/Client component decision
- `/typescript-error` - TypeScript troubleshooting

---

**Remember**: When in doubt, consult the documentation. It's better to verify than to guess!
