# Code Examples

Ready-to-use code examples for React, TypeScript, and Next.js best practices.

## 📋 Table of Contents

- [Component Patterns](#component-patterns)
- [TypeScript Patterns](#typescript-patterns)
- [State Management](#state-management)
- [Forms](#forms)
- [Data Fetching](#data-fetching)
- [Next.js Patterns](#nextjs-patterns)
- [Performance](#performance)

---

## Component Patterns

### Basic Functional Component

```typescript
// UserCard.tsx
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email, avatar }) => {
  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} />}
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};
```

### Component with Children

```typescript
// Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
```

### Compound Component Pattern

```typescript
// Tabs.tsx
interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="tabs-list">{children}</div>;
};

export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  return (
    <button
      className={context.activeTab === value ? 'active' : ''}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) return null;
  return <div className="tabs-content">{children}</div>;
};
```

---

## TypeScript Patterns

### Discriminated Unions

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: string };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function UserProfile() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'loading' });

  // TypeScript narrows the type based on status
  if (state.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (state.status === 'error') {
    return <div>Error: {state.error}</div>;
  }

  // TypeScript knows state.data exists here
  return <div>{state.data.name}</div>;
}
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <UserCard {...user} />}
  keyExtractor={(user) => user.id}
/>
```

### Type Guards

```typescript
interface User {
  type: 'user';
  name: string;
  email: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

type Person = User | Admin;

function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

function PersonCard({ person }: { person: Person }) {
  if (isAdmin(person)) {
    // TypeScript knows person is Admin here
    return <div>Admin: {person.permissions.join(', ')}</div>;
  }

  // TypeScript knows person is User here
  return <div>User: {person.email}</div>;
}
```

---

## State Management

### Local State (useState)

```typescript
export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};
```

### Derived State (Calculate During Render)

```typescript
export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // ✅ Calculate during render - no useEffect needed
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div>
      <p>{activeCount} items left</p>
      <FilterButtons filter={filter} setFilter={setFilter} />
      <ul>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};
```

### Context for UI State

```typescript
// theme-context.tsx
type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

---

## Forms

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input {...register('age', { valueAsNumber: true })} type="number" />
        {errors.age && <span>{errors.age.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

### React 19 useActionState

```typescript
'use client';

import { useActionState } from 'react';
import { createUser } from './actions';

export function UserForm() {
  const [state, formAction, isPending] = useActionState(createUser, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      
      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">User created!</p>}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}

// actions.ts (Server Action)
'use server';

export async function createUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  try {
    await db.user.create({ data: { name, email } });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

---

## Data Fetching

### React Query (TanStack Query)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch users
export function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Create user mutation
export function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.error && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---

## Next.js Patterns

### Server Component (Default)

```typescript
// app/users/page.tsx
async function getUsers() {
  const users = await db.user.findMany();
  return users;
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Client Component

```typescript
// components/Counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Server Action

```typescript
// app/users/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  await db.user.create({
    data: { name, email },
  });

  revalidatePath('/users');
}

// app/users/page.tsx
import { createUser } from './actions';

export default function UsersPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Composition: Server + Client

```typescript
// app/dashboard/page.tsx (Server Component)
import { ClientCounter } from './ClientCounter';

async function getStats() {
  const stats = await db.stats.findFirst();
  return stats;
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {stats.totalUsers}</p>
      
      {/* Client Component for interactivity */}
      <ClientCounter initialCount={stats.totalUsers} />
    </div>
  );
}

// app/dashboard/ClientCounter.tsx (Client Component)
'use client';

import { useState } from 'react';

export function ClientCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## Performance

### React.memo (Use Sparingly)

```typescript
// ✅ Good use case: expensive render with stable props
export const ExpensiveList = React.memo(({ items }: { items: Item[] }) => {
  // Expensive computation
  const processedItems = items.map((item) => expensiveOperation(item));

  return (
    <ul>
      {processedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

// ❌ Bad: premature optimization
export const SimpleComponent = React.memo(({ text }: { text: string }) => {
  return <p>{text}</p>;
});
```

### useMemo for Expensive Calculations

```typescript
export function ProductList({ products, filter }: Props) {
  // ✅ Good: expensive filtering operation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Expensive computation
      return expensiveFilterLogic(p, filter);
    });
  }, [products, filter]);

  return (
    <ul>
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  );
}
```

### useCallback for Stable References

```typescript
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // ✅ Good: callback passed to memoized child
  const handleToggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <MemoizedTodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </ul>
  );
}

const MemoizedTodoItem = React.memo(TodoItem);
```

---

## Common Patterns Summary

### ✅ Do This

```typescript
// Calculate during render
const filteredItems = items.filter(predicate);

// Use React Query for server data
const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Type-safe props
interface Props {
  name: string;
  onSubmit: (data: FormData) => void;
}

// Server Components by default (Next.js)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### ❌ Don't Do This

```typescript
// ❌ Don't use useEffect for derived state
useEffect(() => {
  setFilteredItems(items.filter(predicate));
}, [items]);

// ❌ Don't use any
function Component(props: any) {}

// ❌ Don't make everything a Client Component
'use client';
export default function Page() {
  const data = await fetchData(); // Error!
}

// ❌ Don't premature optimize
const value = useMemo(() => x + y, [x, y]); // Unnecessary
```

---

**For more patterns, see `CONSTITUTION.md`**
