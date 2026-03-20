# React 19.2 New Features

**Quick Reference**: Latest React features for better UX and DX

---

## New Hooks

### useActionState
**Purpose**: Handle form submissions with pending states
**Replaces**: Manual loading state management

```typescript
import { useActionState } from 'react';

// Basic form with server action
function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, {
    message: '',
    error: null,
  });
  
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
      
      {state.error && <p className="error">{state.error}</p>}
      {state.message && <p className="success">{state.message}</p>}
    </form>
  );
}

async function submitContact(prevState: any, formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  try {
    await sendEmail({ email, message });
    return { message: 'Message sent!', error: null };
  } catch (error) {
    return { message: '', error: 'Failed to send message' };
  }
}
```

### useOptimistic
**Purpose**: Instant UI updates while waiting for server
**Use case**: Better perceived performance

```typescript
import { useOptimistic, useTransition } from 'react';

interface Message {
  id: number;
  text: string;
  sending?: boolean;
}

function Chat({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now(), text: newMessage, sending: true }
    ]
  );
  
  const [isPending, startTransition] = useTransition();
  
  async function sendMessage(formData: FormData) {
    const text = formData.get('message') as string;
    
    startTransition(async () => {
      addOptimisticMessage(text);
      await saveMessage(text);
    });
  }
  
  return (
    <div>
      {optimisticMessages.map(msg => (
        <div 
          key={msg.id} 
          style={{ opacity: msg.sending ? 0.5 : 1 }}
        >
          {msg.text}
        </div>
      ))}
      
      <form action={sendMessage}>
        <input name="message" />
        <button disabled={isPending}>Send</button>
      </form>
    </div>
  );
}
```

### useFormStatus
**Purpose**: Access form submission state from child components
**Use case**: Reusable submit buttons

```typescript
import { useFormStatus } from 'react-dom';

// Reusable submit button
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </button>
  );
}

// Use in any form
function LoginForm() {
  return (
    <form action={login}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <SubmitButton>Log in</SubmitButton>
    </form>
  );
}
```

### use (Resource Hook)
**Purpose**: Read promises and context in render
**Use case**: Simplified async data handling

```typescript
import { use } from 'react';

// Read promise directly in render
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Parent component
function App() {
  const userPromise = fetchUser('123');
  
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// Also works with context
function ThemedButton() {
  const theme = use(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

---

## Server Components Improvements

### Async Components (Server Components)
**New**: Can now be async without wrappers

```typescript
// React 19: Direct async component
export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await fetchProduct(params.id);
  const reviews = await fetchReviews(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews data={reviews} />
      </Suspense>
    </div>
  );
}
```

### Server Actions
**Improved**: Better error handling and type safety

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  // Database operation
  const post = await db.post.create({
    data: { title, content }
  });
  
  // Revalidate cache
  revalidatePath('/posts');
  
  // Redirect to new post
  redirect(`/posts/${post.id}`);
}

// Client usage
'use client';

import { useActionState } from 'react';
import { createPost } from './actions';

export function CreatePostForm() {
  const [state, formAction] = useActionState(createPost, null);
  
  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## Document Metadata

### New `<title>` and `<meta>` Support
**Purpose**: Manage metadata in components

```typescript
// React 19: Built-in metadata support
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title} - My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.coverImage} />
      
      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </>
  );
}

// Automatic hoisting to <head>
```

---

## Ref Improvements

### Ref as Prop
**New**: No more `forwardRef` needed

```typescript
// React 19: Direct ref prop
interface InputProps {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ label, ref }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} />
    </div>
  );
}

// Usage: Just pass ref directly
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return <Input label="Email" ref={inputRef} />;
}
```

### Cleanup Functions in Refs
**New**: Refs can return cleanup functions

```typescript
function VideoPlayer({ src }: { src: string }) {
  return (
    <video
      ref={(node) => {
        if (node) {
          node.play();
          
          // Cleanup function
          return () => {
            node.pause();
          };
        }
      }}
      src={src}
    />
  );
}
```

---

## Context Improvements

### Context as Provider
**New**: No more `.Provider` needed

```typescript
import { createContext } from 'react';

// Create context
const ThemeContext = createContext<'light' | 'dark'>('light');

// React 19: Use context directly as provider
function App() {
  return (
    <ThemeContext value="dark">
      <Header />
      <Main />
    </ThemeContext>
  );
}

// Consumer stays the same
function Header() {
  const theme = useContext(ThemeContext);
  return <header className={theme}>Header</header>;
}
```

---

## Hydration Error Improvements

### Better Error Messages
**New**: Detailed hydration mismatch info

```typescript
// React 19 shows exactly what mismatched:
// ❌ Hydration Error:
// Expected: <div>Server content</div>
// Received: <div>Client content</div>
// 
// Common causes:
// - Date.now() or Math.random() in render
// - Browser-only APIs (window, localStorage)
// - Different server/client logic

// Fix with suppressHydrationWarning
function Clock() {
  const [time, setTime] = useState(new Date());
  
  return (
    <div suppressHydrationWarning>
      {time.toLocaleTimeString()}
    </div>
  );
}
```

---

## Migration Guide

### From React 18 to 19

```typescript
// React 18
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label }, ref) => <input ref={ref} />
);

// React 19: No forwardRef needed
function Input({ label, ref }: InputProps & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} />;
}

// React 18: Context Provider
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// React 19: Direct context
<ThemeContext value="dark">
  <App />
</ThemeContext>

// React 18: Manual form state
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
  setLoading(true);
  await submit(e);
  setLoading(false);
};

// React 19: useActionState
const [state, formAction, isPending] = useActionState(submit, null);
```

---

## Best Practices

### 1. Use Server Actions for Mutations
```typescript
// ✅ Good: Server action
'use server';
export async function updateProfile(formData: FormData) {
  await db.user.update({ ... });
  revalidatePath('/profile');
}

// ❌ Bad: Client-side API call
async function updateProfile() {
  await fetch('/api/profile', { method: 'POST', ... });
}
```

### 2. Optimize with useOptimistic
```typescript
// ✅ Good: Instant feedback
const [optimisticLikes, addLike] = useOptimistic(
  likes,
  (state) => state + 1
);

// ❌ Bad: Wait for server
const [likes, setLikes] = useState(0);
await fetch('/api/like');
setLikes(likes + 1);
```

### 3. Use `use` for Conditional Promises
```typescript
// ✅ Good: Conditional promise reading
function UserData({ userId }: { userId: string | null }) {
  if (!userId) return <div>No user</div>;
  
  const userPromise = fetchUser(userId);
  const user = use(userPromise);
  
  return <div>{user.name}</div>;
}
```
