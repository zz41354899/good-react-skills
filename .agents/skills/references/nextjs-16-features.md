# Next.js 16.2 New Features

**Quick Reference**: Latest Next.js features with Turbopack and enhanced Server Actions

---

## Turbopack (Stable)

### Development Mode
**Speed**: 10x faster than Webpack
**Usage**: Default in Next.js 16

```bash
# Automatically uses Turbopack in dev
npm run dev

# Build with Turbopack (production)
npm run build
```

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is now default, no config needed
  experimental: {
    // Optional: Turbopack-specific optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;
```

---

## Enhanced Server Actions

### Progressive Enhancement
**New**: Forms work without JavaScript

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;
  
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  const todo = await db.todo.create({
    data: { title, completed: false }
  });
  
  revalidatePath('/todos');
  return { success: true, todo };
}

// app/todos/page.tsx
import { createTodo } from './actions';

export default function TodosPage() {
  return (
    <form action={createTodo}>
      <input name="title" required />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### Server Action Validation
**New**: Built-in validation with Zod

```typescript
'use server';

import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(3).max(100),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function createTodo(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    priority: formData.get('priority'),
  };
  
  // Validate with Zod
  const result = todoSchema.safeParse(rawData);
  
  if (!result.success) {
    return { 
      error: result.error.flatten().fieldErrors 
    };
  }
  
  const todo = await db.todo.create({
    data: result.data
  });
  
  revalidatePath('/todos');
  return { success: true, todo };
}
```

### Optimistic Updates with Server Actions
**Pattern**: Combine with useOptimistic

```typescript
'use client';

import { useOptimistic } from 'react';
import { likeTodo } from './actions';

export function TodoItem({ todo }: { todo: Todo }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    todo.likes,
    (state) => state + 1
  );
  
  async function handleLike() {
    addOptimisticLike();
    await likeTodo(todo.id);
  }
  
  return (
    <div>
      <h3>{todo.title}</h3>
      <button onClick={handleLike}>
        ❤️ {optimisticLikes}
      </button>
    </div>
  );
}
```

---

## Partial Prerendering (PPR)

### Hybrid Static + Dynamic
**New**: Static shell with dynamic content

```typescript
// app/product/[id]/page.tsx
export const experimental_ppr = true;

export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Static: Prerendered at build time
  const product = await getProduct(params.id);
  
  return (
    <div>
      {/* Static content */}
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      
      {/* Dynamic content: Streamed at request time */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />
      </Suspense>
      
      <Suspense fallback={<StockSkeleton />}>
        <StockStatus productId={params.id} />
      </Suspense>
    </div>
  );
}

// Dynamic components
async function Reviews({ productId }: { productId: string }) {
  const reviews = await getReviews(productId); // Dynamic
  return <ReviewList reviews={reviews} />;
}

async function StockStatus({ productId }: { productId: string }) {
  const stock = await getStock(productId); // Real-time
  return <div>In stock: {stock}</div>;
}
```

---

## Improved Caching

### Fine-grained Cache Control

```typescript
// app/posts/[id]/page.tsx
import { unstable_cache } from 'next/cache';

// Cache function results
const getCachedPost = unstable_cache(
  async (id: string) => {
    return await db.post.findUnique({ where: { id } });
  },
  ['post'], // Cache key
  {
    revalidate: 3600, // 1 hour
    tags: ['posts'], // For revalidation
  }
);

export default async function PostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await getCachedPost(params.id);
  return <article>{post.content}</article>;
}

// Revalidate on demand
'use server';

import { revalidateTag } from 'next/cache';

export async function updatePost(id: string, data: any) {
  await db.post.update({ where: { id }, data });
  revalidateTag('posts'); // Invalidate all posts cache
}
```

### Request Memoization
**Automatic**: Deduplicates identical requests

```typescript
// Multiple calls to same function are deduplicated
async function getUser(id: string) {
  return await db.user.findUnique({ where: { id } });
}

export default async function Page() {
  // These 3 calls result in only 1 database query
  const user1 = await getUser('123');
  const user2 = await getUser('123');
  const user3 = await getUser('123');
  
  return <div>{user1.name}</div>;
}
```

---

## Metadata API Improvements

### Dynamic Metadata with Async

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

---

## Streaming Improvements

### Granular Loading States

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Each section streams independently */}
      <Suspense fallback={<CardSkeleton />}>
        <RevenueCard />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <UsersCard />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Each component fetches its own data
async function RevenueCard() {
  const revenue = await getRevenue(); // Slow query
  return <Card title="Revenue" value={revenue} />;
}

async function UsersCard() {
  const users = await getUserCount(); // Fast query
  return <Card title="Users" value={users} />;
}
```

---

## Route Handlers Improvements

### Streaming Responses

```typescript
// app/api/stream/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        const data = await fetchData(i);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Typed Route Handlers

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const result = userSchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }
  
  const user = await db.user.update({
    where: { id: params.id },
    data: result.data,
  });
  
  return NextResponse.json(user);
}
```

---

## Image Optimization

### Enhanced Image Component

```typescript
import Image from 'next/image';

export function ProductImage({ product }: { product: Product }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={800}
      height={600}
      priority={product.featured}
      placeholder="blur"
      blurDataURL={product.blurDataUrl}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      quality={90}
      loading={product.featured ? 'eager' : 'lazy'}
    />
  );
}
```

---

## Middleware Improvements

### Edge Runtime Optimizations

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  
  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // A/B testing
  if (pathname === '/') {
    const bucket = Math.random() < 0.5 ? 'a' : 'b';
    const response = NextResponse.next();
    response.cookies.set('bucket', bucket);
    return response;
  }
  
  // Geolocation redirect
  const country = request.geo?.country || 'US';
  if (pathname === '/store' && country !== 'US') {
    return NextResponse.redirect(
      new URL(`/store/${country.toLowerCase()}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Best Practices

### 1. Use PPR for Hybrid Pages
```typescript
// ✅ Good: Static shell + dynamic content
export const experimental_ppr = true;

<div>
  <StaticHeader />
  <Suspense fallback={<Skeleton />}>
    <DynamicContent />
  </Suspense>
</div>
```

### 2. Leverage Server Actions
```typescript
// ✅ Good: Progressive enhancement
<form action={serverAction}>
  <input name="email" />
  <button>Submit</button>
</form>

// ❌ Bad: Client-side only
<form onSubmit={handleSubmit}>
  <input onChange={e => setEmail(e.target.value)} />
  <button>Submit</button>
</form>
```

### 3. Optimize with Streaming
```typescript
// ✅ Good: Independent suspense boundaries
<Suspense fallback={<Skeleton />}>
  <FastComponent />
</Suspense>
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>

// ❌ Bad: Single suspense for all
<Suspense fallback={<Skeleton />}>
  <FastComponent />
  <SlowComponent />
</Suspense>
```
