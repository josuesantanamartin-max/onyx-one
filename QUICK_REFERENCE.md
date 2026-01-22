# Quick Reference: Using New Code Quality Features

## 🎯 Error Handling

### Using the Error Handler Hook

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyComponent() {
  const { showError, showSuccess, showWarning, showInfo } = useErrorHandler();

  const handleAction = async () => {
    try {
      await someAsyncOperation();
      showSuccess('Operation completed!');
    } catch (error) {
      showError(error); // Automatically formats and displays
    }
  };
}
```

### Using the Async Hook

```typescript
import { useAsync } from '../hooks/useAsync';

function DataComponent() {
  const { data, loading, error, execute } = useAsync(fetchData);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
      <button onClick={() => execute()}>Load Data</button>
    </div>
  );
}
```

### Creating Custom Errors

```typescript
import { AppError, ErrorCodes } from '../utils/errorHandler';

throw new AppError(
  'Insufficient balance for this transaction',
  ErrorCodes.INSUFFICIENT_BALANCE,
  'medium'
);
```

---

## ✅ Data Validation

### Validating Transaction Data

```typescript
import { validateTransaction } from '../schemas/transaction.schema';
import { formatZodErrors } from '../utils/validation';

const formData = {
  type: 'EXPENSE',
  amount: 50.00,
  date: '2026-01-22',
  category: 'Food',
  accountId: 'acc123',
  description: 'Groceries'
};

const result = validateTransaction(formData);

if (!result.success) {
  const errors = formatZodErrors(result.error);
  console.log(errors);
  // { amount: 'Amount must be greater than 0', ... }
} else {
  // Use validated data
  saveTransaction(result.data);
}
```

### Validating Account Data

```typescript
import { validateAccount } from '../schemas/account.schema';

const accountData = {
  name: 'My Credit Card',
  type: 'CREDIT',
  balance: 0,
  currency: 'EUR',
  creditLimit: 5000,
  cutoffDay: 25,
  paymentDay: 5
};

const result = validateAccount(accountData);
```

### Validating Budget Data

```typescript
import { validateBudget } from '../schemas/budget.schema';

const budgetData = {
  category: 'Food',
  limit: 600,
  period: 'MONTHLY',
  budgetType: 'FIXED'
};

const result = validateBudget(budgetData);
```

---

## 🔒 API Security (Future Integration)

### Using the Gemini API Client

> [!NOTE]
> These functions will replace direct calls to GoogleGenAI once integrated.

```typescript
import { generateContent, generateContentWithImage } from '../services/geminiApiClient';

// Text generation
const response = await generateContent('Analyze my finances');

// Image + text generation
const response = await generateContentWithImage(
  'What ingredients are in this image?',
  base64ImageData,
  'image/webp'
);
```

### Migration Example

**Before (Direct API Call):**
```typescript
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: prompt,
});
```

**After (Using Proxy):**
```typescript
import { generateContent } from '../services/geminiApiClient';
const response = await generateContent(prompt);
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test services/__tests__/geminiService.test.ts
```

### Writing a Test

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myModule';

describe('MyModule', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

---

## 📋 Common Patterns

### Form Validation Pattern

```typescript
import { useState } from 'react';
import { validateTransaction } from '../schemas/transaction.schema';
import { useErrorHandler } from '../hooks/useErrorHandler';

function TransactionForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useErrorHandler();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const result = validateTransaction(formData);
    
    if (!result.success) {
      const validationErrors = formatZodErrors(result.error);
      setErrors(validationErrors);
      showError(new Error('Please fix validation errors'));
      return;
    }
    
    // Submit validated data
    submitTransaction(result.data);
    showSuccess('Transaction created!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {errors.amount && <span className="error">{errors.amount}</span>}
    </form>
  );
}
```

### Async Operation Pattern

```typescript
import { useAsync } from '../hooks/useAsync';
import { useErrorHandler } from '../hooks/useErrorHandler';

function DataLoader() {
  const { showSuccess } = useErrorHandler();
  
  const { data, loading, execute } = useAsync(
    async (id) => {
      const response = await fetch(`/api/data/${id}`);
      return response.json();
    },
    {
      onSuccess: () => showSuccess('Data loaded!'),
    }
  );

  return (
    <div>
      <button onClick={() => execute('123')} disabled={loading}>
        {loading ? 'Loading...' : 'Load Data'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## 🎨 Toast Notification Types

```typescript
const { showSuccess, showError, showWarning, showInfo } = useErrorHandler();

// Success (green, 3s)
showSuccess('Transaction saved successfully!');

// Error (red, 5-8s based on severity)
showError(new Error('Failed to save transaction'));

// Warning (yellow, 5s)
showWarning('Your budget is almost exceeded');

// Info (blue, 4s)
showInfo('New feature available!');
```

---

## 🔧 Troubleshooting

### Tests Not Running

```bash
# Clear cache
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Run type check
npm run type-check

# Check specific file
npx tsc --noEmit path/to/file.ts
```

### Validation Not Working

```typescript
// Make sure to import from the correct schema
import { validateTransaction } from '../schemas/transaction.schema';

// Check the result structure
const result = validateTransaction(data);
console.log(result.success); // boolean
console.log(result.error); // ZodError if validation failed
console.log(result.data); // validated data if successful
```

---

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
