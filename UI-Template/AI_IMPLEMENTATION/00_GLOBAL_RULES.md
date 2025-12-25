# 📜 Global Rules - VSTEPRO

**Version**: 1.0.0  
**Last Updated**: December 21, 2024

---

## ⚠️ Luật bắt buộc

> **AI PHẢI đọc file này trước khi implement BẤT KỲ task nào!**

---

## 🎯 Core Principles

### 1. Convention over Configuration

✅ Follow patterns đã established  
✅ Don't reinvent the wheel  
✅ Consistency > Creativity

### 2. Type Safety First

✅ Everything must be typed (TypeScript)  
✅ No `any` types  
✅ Strict mode enabled

### 3. User Experience First

✅ Fast response time  
✅ Clear error messages  
✅ Accessible UI (keyboard navigation)

---

## 📁 File Structure

### Folder Organization

```
vstepro/
├── components/              # React components
│   ├── admin/              # Admin-specific
│   ├── teacher/            # Teacher-specific
│   ├── student/            # Student-specific
│   ├── shared/             # Shared across roles
│   └── ui/                 # Reusable UI primitives
│
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── types/                  # TypeScript type definitions
├── data/                   # Mock data & constants
├── styles/                 # Global styles
│   └── globals.css         # Tailwind + custom CSS
│
├── docs/                   # Documentation
└── AI_IMPLEMENTATION/      # This folder
```

### File Naming

```typescript
// ✅ GOOD
components/AdminDashboard.tsx
hooks/useAuth.ts
utils/formatDate.ts
types/user.ts

// ❌ BAD
components/admin-dashboard.tsx
hooks/auth.ts
utils/format_date.ts
types/userTypes.ts
```

**Rules:**
- **Components**: PascalCase (AdminDashboard.tsx)
- **Hooks**: camelCase with `use` prefix (useAuth.ts)
- **Utils**: camelCase (formatDate.ts)
- **Types**: camelCase (user.ts)
- **Constants**: UPPER_SNAKE_CASE in file (MAX_FILE_SIZE)

---

## 🎨 Design System

### Colors

```typescript
// PRIMARY COLORS - CHỈ CÓ 2 MÀU CHÍNH!
const COLORS = {
  primary: '#2563EB',    // Blue - Student role, main actions
  secondary: '#F97316',  // Orange - Highlights, secondary actions
};

// ROLE-SPECIFIC COLORS
const ROLE_COLORS = {
  student: '#2563EB',    // Blue
  teacher: '#9333EA',    // Purple
  admin: '#DC2626',      // Red
  uploader: '#EAB308',   // Yellow
};
```

**⚠️ LUẬT QUAN TRỌNG:**
- Chỉ dùng 2 màu primary (Blue) và secondary (Orange) cho toàn bộ website
- Role colors chỉ dùng trong dashboard của role tương ứng
- Không tạo thêm màu mới ngoài palette này

### Layout

```typescript
const LAYOUT = {
  containerMaxWidth: '1360px',  // Max width for content
  sidebarWidth: '256px',        // w-64 in Tailwind
  headerHeight: '64px',         // Fixed header
  spacing: 'Tailwind scale',    // p-4, p-6, gap-4, etc.
};
```

### Typography

**⚠️ CRITICAL RULE:**
```tsx
// ❌ KHÔNG BAO GIỜ dùng Tailwind typography classes
<h1 className="text-2xl font-bold leading-tight">Title</h1>

// ✅ CHỈ dùng HTML tags, styles defined in globals.css
<h1>Title</h1>

// ✅ ONLY override khi user yêu cầu cụ thể
<h1 className="text-4xl">Custom Size Title</h1>
```

Typography được define trong `/styles/globals.css`. **KHÔNG override** trừ khi user yêu cầu.

### Spacing

```typescript
// ✅ GOOD: Consistent spacing
<div className="p-6 space-y-4">
  <div className="mb-3">...</div>
  <div className="gap-4">...</div>
</div>

// ❌ BAD: Random spacing
<div style={{padding: '23px'}}>
  <div style={{marginBottom: '17px'}}>...</div>
</div>
```

**Use Tailwind spacing scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24...

### Border Radius

```typescript
const RADIUS = {
  small: 'rounded-lg',   // 8px
  medium: 'rounded-xl',  // 12px
  large: 'rounded-2xl',  // 16px
  full: 'rounded-full',  // 9999px
};
```

---

## 💻 Code Conventions

### TypeScript

```typescript
// ✅ GOOD: Explicit types
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'uploader';
}

function getUser(id: string): Promise<User> {
  return api.fetchUser(id);
}

// ❌ BAD: Any types
function getUser(id: any): Promise<any> {
  return api.fetchUser(id);
}
```

**Rules:**
- Always define interfaces for objects
- Use union types for enums
- No `any` type (use `unknown` if needed)
- Export types from `/types` folder

### React Components

```typescript
// ✅ GOOD: Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg transition-colors ${
        variant === 'primary'
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
}

// ❌ BAD: Class component, no types
class Button extends React.Component {
  render() {
    return <button onClick={this.props.onClick}>{this.props.label}</button>;
  }
}
```

### Component Structure

```typescript
// Standard structure cho mọi component

// 1. Imports
import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

// 2. Types/Interfaces
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 3. Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = '.pdf,.docx,.pptx';

// 4. Component
export function Modal({ isOpen, onClose }: ModalProps) {
  // 4a. State
  const [file, setFile] = useState<File | null>(null);
  
  // 4b. Effects
  useEffect(() => {
    if (!isOpen) setFile(null);
  }, [isOpen]);
  
  // 4c. Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };
  
  // 4d. Render guard
  if (!isOpen) return null;
  
  // 4e. JSX
  return <div>...</div>;
}
```

### State Management

```typescript
// ✅ GOOD: Typed state
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Assignment[]>([]);

// ❌ BAD: No types
const [loading, setLoading] = useState();
const [err, setErr] = useState();
const [d, setD] = useState([]);
```

### Naming Conventions

```typescript
// Variables & Functions: camelCase
const userName = 'John';
function getUserName() { return userName; }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const API_BASE_URL = 'https://api.vstepro.com';

// Components: PascalCase
function UserProfile() { return <div>...</div>; }

// Interfaces/Types: PascalCase
interface UserProfile {
  name: string;
  email: string;
}

// Boolean variables: is/has/can prefix
const isLoading = false;
const hasPermission = true;
const canEdit = false;

// Event handlers: handle prefix
const handleClick = () => { ... };
const handleSubmit = () => { ... };
const handleChange = () => { ... };
```

---

## 🎭 UI Patterns

### Modal Pattern

```tsx
// Standard modal structure
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Title</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-6" />
          </button>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="p-6 space-y-4">
        {/* Content here */}
      </div>
    </div>
  </div>
)}
```

### Form Pattern

```tsx
// Standard form field
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Field Label {required && <span className="text-red-600">*</span>}
  </label>
  <input
    type="text"
    value={value}
    onChange={onChange}
    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
    placeholder="Enter value..."
  />
  {error && (
    <p className="mt-1 text-sm text-red-600">{error}</p>
  )}
</div>
```

### Upload Pattern

```tsx
// Standard upload UI
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload File *
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-500 transition-colors">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-3 p-4 bg-red-50 rounded-full">
        <Upload className="size-8 text-red-600" />
      </div>
      <label className="cursor-pointer">
        <span className="text-red-600 hover:text-red-700 font-medium">
          Click để chọn file
        </span>
        <span className="text-gray-600"> hoặc kéo thả file vào đây</span>
        <input type="file" className="hidden" accept=".pdf,.docx" />
      </label>
      <p className="text-xs text-gray-500 mt-2">
        Hỗ trợ: PDF, DOCX - Tối đa 50MB
      </p>
    </div>
  </div>
</div>
```

### Dashboard Layout

```tsx
// Standard dashboard structure
<div className="flex">
  {/* Sidebar - Fixed */}
  <aside className="w-64 fixed h-screen bg-gray-900">
    {/* Sidebar content */}
  </aside>
  
  {/* Main content */}
  <main className="ml-64 flex-1">
    <div className="max-w-[1360px] mx-auto p-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

---

## 🔧 Technical Rules

### Imports

```typescript
// ✅ GOOD: Organized imports
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { Upload, X } from 'lucide-react';

// 3. Internal components
import { Button } from './components/Button';

// 4. Utils & types
import { formatDate } from './utils/formatDate';
import type { User } from './types/user';

// ❌ BAD: Random order
import { formatDate } from './utils/formatDate';
import { useState } from 'react';
import type { User } from './types/user';
import { Upload } from 'lucide-react';
```

### Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
async function fetchData() {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await api.getData();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setData(data);
    
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Đã xảy ra lỗi không xác định';
    
    setError(errorMessage);
    console.error('Error fetching data:', err);
    
  } finally {
    setIsLoading(false);
  }
}

// ❌ BAD: No error handling
async function fetchData() {
  const data = await api.getData();
  setData(data);
}
```

### Constants

```typescript
// ✅ GOOD: Centralized constants
// constants/files.ts
export const FILE_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024,
  ACCEPTED_TYPES: {
    document: '.pdf,.docx,.pptx',
    media: 'video/*,audio/*',
  },
  SIZE_LABELS: {
    document: '50MB',
    media: '500MB',
  },
} as const;

// ❌ BAD: Hardcoded values
<input type="file" accept=".pdf,.docx,.pptx" />
{file.size > 52428800 && <p>File quá lớn</p>}
```

---

## 🧪 Testing Rules

### Test File Structure

```typescript
// Component: Button.tsx
// Test: Button.test.tsx (same folder)

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={jest.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={jest.fn()} disabled />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

### Test Coverage

**Required coverage:**
- Unit tests: > 80%
- Integration tests: > 60%
- E2E tests: Critical paths only

---

## 🔒 Security Rules

### Secrets Management

```typescript
// ✅ GOOD: Environment variables
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// ❌ BAD: Hardcoded secrets
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Input Validation

```typescript
// ✅ GOOD: Validate all inputs
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleEmailSubmit(email: string) {
  if (!validateEmail(email)) {
    setError('Email không hợp lệ');
    return;
  }
  // Process email
}

// ❌ BAD: No validation
function handleEmailSubmit(email: string) {
  api.sendEmail(email);
}
```

---

## 📊 Performance Rules

### Optimization

```typescript
// ✅ GOOD: Memoization
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <div>{/* render */}</div>;
});

// ❌ BAD: No optimization
export function ExpensiveComponent({ data }: Props) {
  const processedData = data.map(item => expensiveOperation(item));
  const handleClick = () => console.log('clicked');
  return <div>{/* render */}</div>;
}
```

---

## 🚫 Forbidden Practices

### NEVER do these:

```typescript
// ❌ 1. NEVER use var
var x = 10;

// ❌ 2. NEVER use any
function process(data: any) { }

// ❌ 3. NEVER ignore TypeScript errors
// @ts-ignore
const result = undefinedFunction();

// ❌ 4. NEVER hardcode credentials
const apiKey = 'sk-1234567890';

// ❌ 5. NEVER mutate props
function Component({ data }) {
  data.name = 'New name'; // NEVER!
}

// ❌ 6. NEVER use inline styles (except dynamic values)
<div style={{color: 'red', fontSize: '16px'}}>Text</div>

// ❌ 7. NEVER commit console.log
console.log('Debug info'); // Remove before commit

// ❌ 8. NEVER use Math.random() for keys
<div key={Math.random()}>Item</div>

// ❌ 9. NEVER skip error boundaries
// Always wrap risky components in ErrorBoundary

// ❌ 10. NEVER use localStorage for sensitive data
localStorage.setItem('password', '12345');
```

---

## ✅ Validation Checklist

Trước khi consider task "done":

- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All imports are used
- [ ] No console.log() in code
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Types properly defined
- [ ] Tests written and passing
- [ ] Responsive design works
- [ ] Accessibility checked
- [ ] Comments added for complex logic
- [ ] File named correctly
- [ ] Follows design system
- [ ] No hardcoded values
- [ ] Git commit message clear

---

## 📏 Code Quality Metrics

### Thresholds

```typescript
const QUALITY_THRESHOLDS = {
  maxFunctionLength: 50,        // lines
  maxFileLength: 500,           // lines
  maxNestingLevel: 3,           // levels
  minTestCoverage: 80,          // percent
  maxCyclomaticComplexity: 10,  // McCabe
};
```

**If exceeded:**
- Refactor function into smaller pieces
- Split file into modules
- Simplify logic
- Add more tests

---

## 🎯 Summary

### Top 10 Rules

1. ✅ **Read this file before any task**
2. ✅ **Use TypeScript with strict types**
3. ✅ **Follow design system colors (Blue/Orange only)**
4. ✅ **No Tailwind typography classes**
5. ✅ **Consistent naming conventions**
6. ✅ **Comprehensive error handling**
7. ✅ **Write tests for all functions**
8. ✅ **Use constants, no hardcoded values**
9. ✅ **Validate inputs, sanitize outputs**
10. ✅ **Self-validate before marking done**

---

**Remember**: These rules exist to ensure **consistency**, **quality**, and **maintainability**. Follow them strictly.

**Version**: 1.0.0  
**Last Updated**: December 21, 2024
