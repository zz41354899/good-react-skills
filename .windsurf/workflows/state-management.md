# State Management Skill

**Command**: `/state-management`  
**Category**: State Management

## 🎯 Decision Tree

```
What kind of state?
├─ Component-specific? → useState
├─ UI state (theme, locale)? → React Context
├─ Server data (API)? → React Query
└─ Complex global state? → Zustand
```

## 1️⃣ Local State (useState)

For component-specific state:

```typescript
export const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## 2️⃣ UI State (React Context)

For theme, locale, user preferences:

```typescript
// theme-context.tsx
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

## 3️⃣ Server State (React Query)

For API data:

```typescript
import { useQuery } from '@tanstack/react-query';

export const UserList = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
  });

  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};
```

## 4️⃣ Complex Global State (Zustand)

For shopping cart, complex app state:

```typescript
// store.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  clearCart: () => set({ items: [] }),
}));

// Usage
export const Cart = () => {
  const { items, addItem, removeItem } = useCartStore();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
```

## 📊 Comparison

| Use Case | Solution | When to Use |
|----------|----------|-------------|
| Form input value | useState | Component-specific |
| Toggle visibility | useState | Component-specific |
| Theme/Locale | Context | Shared UI state |
| User data from API | React Query | Server data |
| Shopping cart | Zustand | Complex global state |

## 📚 Full Documentation

See `../../../CONSTITUTION.md#state-management-hierarchy`
