# TypeScript Error Solutions

**Command**: `/typescript-error`  
**Category**: TypeScript

## 🎯 Common Errors & Solutions

### 1. Type 'any' is not allowed

```typescript
// ❌ BAD
const data: any = await fetch('/api/users');

// ✅ GOOD
interface User {
  id: string;
  name: string;
}
const data: User[] = await fetch('/api/users').then(res => res.json());

// ✅ BETTER - When type is truly unknown
const data: unknown = await fetch('/api/users').then(res => res.json());
if (isUserArray(data)) {
  // Now TypeScript knows data is User[]
}
```

### 2. Property does not exist on type

```typescript
// ❌ BAD
const user = {};
user.name = 'John'; // Error: Property 'name' does not exist

// ✅ GOOD
interface User {
  name: string;
  email: string;
}
const user: User = {
  name: 'John',
  email: 'john@example.com',
};
```

### 3. Argument of type 'X' is not assignable to parameter of type 'Y'

```typescript
// ❌ BAD
const handleClick = (id: number) => {};
handleClick('123'); // Error

// ✅ GOOD - Convert type
handleClick(Number('123'));

// ✅ BETTER - Fix at source
const id: number = 123;
handleClick(id);
```

### 4. Object is possibly 'null' or 'undefined'

```typescript
// ❌ BAD
const user = users.find(u => u.id === id);
console.log(user.name); // Error: Object is possibly 'undefined'

// ✅ GOOD - Optional chaining
console.log(user?.name);

// ✅ GOOD - Type guard
if (user) {
  console.log(user.name);
}

// ✅ GOOD - Non-null assertion (only if you're certain)
console.log(user!.name);
```

### 5. Type 'string | undefined' is not assignable to type 'string'

```typescript
// ❌ BAD
interface Props {
  name: string;
}
const name: string | undefined = getName();
<Component name={name} /> // Error

// ✅ GOOD - Provide default
<Component name={name ?? 'Default'} />

// ✅ GOOD - Conditional render
{name && <Component name={name} />}

// ✅ GOOD - Type guard
if (name) {
  <Component name={name} />
}
```

## 🛠️ Type Guards

```typescript
// String type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Object type guard
interface User {
  id: string;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// Usage
const data: unknown = await fetchData();
if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}
```

## 📋 Best Practices

1. **Never use `any`** - Use `unknown` with type guards
2. **Define interfaces** - For all props, state, API responses
3. **Use type guards** - For runtime type checking
4. **Enable strict mode** - In tsconfig.json
5. **Use optional chaining** - For nullable values

## 📚 Full Documentation

See `../../../references/coding-conventions.md#typescript-error-examples--type-safety`
