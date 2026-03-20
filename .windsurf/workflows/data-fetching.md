# Data Fetching Skill

**Command**: `/data-fetching`  
**Category**: Data Management

## 🎯 Rule: Use React Query, Not useEffect

**Never** use useEffect for data fetching. Always use React Query.

## 📋 Basic Pattern

```typescript
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

export const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<User>;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
};
```

## 🔄 Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const UpdateUserForm = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name: 'New Name' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Updating...' : 'Update'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
    </form>
  );
};
```

## 🚀 Next.js Server Components

For Next.js, prefer Server Components when possible:

```typescript
// app/users/[id]/page.tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## ❌ Anti-Pattern

```typescript
// ❌ DON'T DO THIS
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(setData);
}, []);
```

## ✅ Correct Pattern

```typescript
// ✅ DO THIS
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch('/api/users');
    return res.json();
  },
});
```

## 📚 Full Documentation

See `../../../SKILL.md#3-data-fetching`
