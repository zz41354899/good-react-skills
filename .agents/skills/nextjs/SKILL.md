# Next.js Server/Client Component Decision

**Command**: `/server-or-client`  
**Category**: Next.js

## 🎯 Decision Tree

```
Does it need...
├─ User interaction (onClick, onChange)? → Client Component
├─ React hooks (useState, useEffect)? → Client Component
├─ Browser APIs (localStorage, window)? → Client Component
├─ Event listeners? → Client Component
└─ None of the above? → Server Component (default)
```

## 🖥️ Server Components (Default)

Use Server Components by default. They:
- Reduce JavaScript bundle size
- Have direct database access
- Keep sensitive data on server
- Improve initial page load

```typescript
// app/users/page.tsx
// This is a Server Component by default

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
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 💻 Client Components

Use `'use client'` when you need:
- Interactivity (onClick, onChange)
- State (useState, useReducer)
- Effects (useEffect)
- Browser APIs
- Event listeners

```typescript
// components/counter.tsx
'use client';

import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

## 🔄 Composition Pattern

Keep Server Components at the top, Client Components at the leaves:

```typescript
// app/page.tsx (Server Component)
import { Counter } from '@/components/counter'; // Client Component

async function getData() {
  return await db.data.findMany();
}

export default async function HomePage() {
  const data = await getData();
  
  return (
    <div>
      <h1>Server Component</h1>
      <p>Data from database: {data.length} items</p>
      
      {/* Client Component for interactivity */}
      <Counter />
    </div>
  );
}
```

## 📊 Comparison

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Data fetching | ✅ Direct DB access | ❌ API routes only |
| Interactivity | ❌ No | ✅ Yes |
| Hooks | ❌ No | ✅ Yes |
| Bundle size | ✅ Zero JS | ❌ Adds JS |
| SEO | ✅ Excellent | ⚠️ Depends |

## ✅ Examples

### Server Component Use Cases
- Displaying static content
- Fetching data from database
- Accessing backend resources
- Rendering without interactivity

### Client Component Use Cases
- Forms with validation
- Interactive widgets
- Real-time updates
- Browser API usage

## 📚 Full Documentation

See `../../../SKILL.md#8-nextjs`
