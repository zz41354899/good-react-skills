---
name: check-naming
description: Naming conventions
---

# Naming Conventions Skill

**Command**: `/check-naming`  
**Category**: Coding Conventions

## 📋 Quick Reference

### Components
```typescript
// ✅ PascalCase
export const UserCard = () => {}
export const ProductList = () => {}
```

### Variables & Functions
```typescript
// ✅ camelCase
const userName = 'John';
const isActive = true;
const handleClick = () => {};
```

### Constants
```typescript
// ✅ UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
```

### Files
```typescript
// ✅ kebab-case
user-card.tsx
api-client.ts
use-auth.ts
```

### Type Aliases & Interfaces
```typescript
// ✅ PascalCase
interface UserProfile {}
type ApiResponse = {};
```

## 🎯 Decision Tree

```
What am I naming?
├─ Component? → PascalCase (UserCard)
├─ Variable/Function? → camelCase (userName, handleClick)
├─ Constant? → UPPER_SNAKE_CASE (API_URL)
├─ File? → kebab-case (user-card.tsx)
└─ Type/Interface? → PascalCase (UserProfile)
```

## ✅ Examples

### Good
```typescript
// Component
export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const MAX_DISPLAY_NAME_LENGTH = 50;
  
  const handleUpdateProfile = async () => {
    // ...
  };
  
  return <div>{user.name}</div>;
};
```

### Bad
```typescript
// ❌ Wrong cases
export const userProfileCard = () => {}; // Should be PascalCase
const UserName = 'John'; // Should be camelCase
const api_url = 'https://...'; // Should be UPPER_SNAKE_CASE
```

## 📚 Full Documentation

See `../../../references/coding-conventions.md#naming-conventions` for complete guide.
