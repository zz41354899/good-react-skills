---
name: should-use-effect
description: useEffect decision tree
---

# useEffect Decision Skill

**Command**: `/should-use-effect`  
**Category**: React Patterns

## 🎯 Decision Tree

```
Should I use useEffect?
├─ For data fetching? → ❌ NO - Use React Query
├─ For derived state? → ❌ NO - Calculate during render
├─ For event handling? → ❌ NO - Use event handlers
└─ For external system sync? → ✅ YES - Use useEffect
```

## ❌ When NOT to Use useEffect

### 1. Data Fetching
```typescript
// ❌ BAD
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/users').then(res => res.json()).then(setData);
}, []);

// ✅ GOOD
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json()),
});
```

### 2. Derived State
```typescript
// ❌ BAD
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);

// ✅ GOOD
const [items, setItems] = useState([]);
const filteredItems = items.filter(item => item.active); // Calculate during render
```

### 3. Event Handling
```typescript
// ❌ BAD
useEffect(() => {
  const handleClick = () => console.log('clicked');
  button.addEventListener('click', handleClick);
  return () => button.removeEventListener('click', handleClick);
}, []);

// ✅ GOOD
<button onClick={() => console.log('clicked')}>Click</button>
```

## ✅ When to Use useEffect

### 1. External System Synchronization
```typescript
// ✅ WebSocket connection
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (event) => {
    console.log(event.data);
  };
  return () => ws.close();
}, []);
```

### 2. Browser APIs
```typescript
// ✅ Document title
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
```

### 3. Third-party Libraries
```typescript
// ✅ Chart.js initialization
useEffect(() => {
  const chart = new Chart(canvasRef.current, config);
  return () => chart.destroy();
}, []);
```

### 4. Subscriptions
```typescript
// ✅ Event subscription
useEffect(() => {
  const subscription = eventEmitter.subscribe('event', handler);
  return () => subscription.unsubscribe();
}, []);
```

## 🔍 Quick Check

Before using useEffect, ask:
1. Am I fetching data? → Use React Query
2. Am I calculating something? → Do it during render
3. Am I handling an event? → Use event handler
4. Am I syncing with external system? → OK to use useEffect

## 📚 Full Documentation

See `../../../SKILL.md#2-avoid-useeffect-overuse`
