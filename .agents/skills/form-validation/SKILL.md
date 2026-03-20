---
name: form-validation
description: Form validation patterns
---

# Form Validation Skill

**Command**: `/form-validation`  
**Category**: Forms

## 🎯 Quick Start

Use **React Hook Form** + **Zod** for all form handling and validation.

## 📋 Basic Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

// 2. Use in component
export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## 🔥 React 19 Pattern (useActionState)

```typescript
'use client';

import { useActionState } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };
      
      const result = schema.safeParse(data);
      if (!result.success) {
        return { error: result.error.flatten() };
      }
      
      // Process form
      return { success: true };
    },
    null
  );

  return (
    <form action={formAction}>
      <input name="email" disabled={isPending} />
      <input name="password" type="password" disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {state?.error && <div>Error: {JSON.stringify(state.error)}</div>}
    </form>
  );
}
```

## ✅ Validation Rules

### Email
```typescript
z.string().email('Invalid email format')
```

### Password
```typescript
z.string()
  .min(8, 'Min 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[0-9]/, 'Must contain number')
```

### Confirm Password
```typescript
z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

## 📚 Full Documentation

See `../../../references/coding-conventions.md#form-validation-best-practices`
