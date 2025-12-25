# 🤖 AI Implementation Guide - VSTEPRO

## 📋 Mục đích

Thư mục này chứa các task cards được thiết kế để AI (GitHub Copilot, Claude, ChatGPT, etc.) có thể:

1. **Hiểu context** đầy đủ của dự án
2. **Implement từng task** một cách chính xác
3. **Đảm bảo consistency** giữa các phần
4. **Tự validate** kết quả

---

## 🚀 Quy trình làm việc

### Bước 1: Đọc Global Rules

Trước khi bắt đầu bất kỳ task nào, **BẮT BUỘC** đọc:
- `00_GLOBAL_RULES.md` - Quy tắc coding
- `01_PROJECT_CONTEXT.md` - Context dự án

### Bước 2: Chọn Phase và Sprint

1. Mở folder Phase tương ứng (VD: `PHASE_1_MVP/`)
2. Đọc `_EXECUTION_ORDER.md` để hiểu thứ tự
3. Chọn Sprint cần làm

### Bước 3: Thực hiện Task

Mỗi task file (VD: `BE-001_DB_CORE.md`) chứa:
- **Context**: Mô tả task
- **Requirements**: Yêu cầu chi tiết
- **Implementation**: Code mẫu/hướng dẫn
- **Acceptance Criteria**: Điều kiện hoàn thành
- **Dependencies**: Task phụ thuộc

### Bước 4: Validate

Sau khi hoàn thành, check với file QA tương ứng.

---

## 🎯 Quy tắc cho AI

### ✅ PHẢI làm:

1. **Đọc context trước khi code**
   - Hiểu rõ yêu cầu và mục tiêu
   - Xác định dependencies
   - Review code hiện tại

2. **Tuân thủ coding conventions** trong `00_GLOBAL_RULES.md`
   - Naming conventions
   - File structure
   - Code style

3. **Check dependencies** trước khi implement
   - Đảm bảo các task phụ thuộc đã hoàn thành
   - Verify APIs/functions cần thiết đã tồn tại

4. **Viết tests** cho mọi function
   - Unit tests
   - Integration tests
   - Edge cases

5. **Comment code** bằng tiếng Việt nếu logic phức tạp
   - Giải thích business logic
   - Document parameters và return values
   - Warning cho các edge cases

### ❌ KHÔNG được:

1. **KHÔNG** bỏ qua validation
   - Input validation
   - Type checking
   - Error handling

2. **KHÔNG** hardcode values
   - Sử dụng constants
   - Environment variables
   - Configuration files

3. **KHÔNG** tạo file mới ngoài scope
   - Follow file structure đã định nghĩa
   - Hỏi trước khi tạo file mới

4. **KHÔNG** sửa file config không liên quan
   - Chỉ modify files trong scope
   - Document changes nếu cần thiết

5. **KHÔNG** skip error handling
   - Try-catch cho async operations
   - User-friendly error messages
   - Logging cho debugging

---

## 📁 Cấu trúc Project VSTEPRO

```
vstepro/
├── components/           # React components
│   ├── admin/           # Admin dashboard components
│   ├── teacher/         # Teacher dashboard components
│   ├── student/         # Student dashboard components
│   └── shared/          # Shared components
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom CSS
├── types/               # TypeScript types
├── utils/               # Utility functions
├── data/                # Mock data & constants
└── docs/                # Documentation
    └── tasks/           # Task cards for AI
```

---

## 🎨 Design System Rules

### Colors
- **Primary**: Blue (#2563EB) - Cho Student role và main actions
- **Secondary**: Orange - Cho highlights và secondary actions
- **Admin**: Red (#DC2626) - Cho admin dashboard
- **Teacher**: Purple (#9333EA) - Cho teacher dashboard

### Layout
- **Max-width container**: 1360px
- **Sidebar width**: 256px (w-64) - Fixed
- **Spacing**: Tailwind spacing scale
- **Border radius**: rounded-lg, rounded-xl

### Typography
- **KHÔNG** dùng Tailwind font classes (text-2xl, font-bold, leading-none)
- Typography được define trong `/styles/globals.css`
- Only override nếu user yêu cầu cụ thể

---

## 🔧 Technical Stack

### Frontend
- **Framework**: React với TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: lucide-react
- **Charts**: recharts
- **Forms**: react-hook-form@7.55.0
- **Animations**: motion/react (Framer Motion)

### Backend (Future)
- **Runtime**: Node.js
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API cho Writing/Speaking scoring
- **File Storage**: Supabase Storage

---

## 📝 Coding Standards

### React Components

```tsx
// ✅ GOOD: Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg transition-colors ${
        variant === 'primary' 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-orange-500 text-white hover:bg-orange-600'
      }`}
    >
      {label}
    </button>
  );
}
```

```tsx
// ❌ BAD: No types, inline styles, hardcoded values
export function Button(props) {
  return (
    <button onClick={props.onClick} style={{backgroundColor: '#2563EB'}}>
      {props.label}
    </button>
  );
}
```

### State Management

```tsx
// ✅ GOOD: Clear state with TypeScript
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Assignment[]>([]);
```

```tsx
// ❌ BAD: No types, unclear naming
const [loading, setLoading] = useState();
const [err, setErr] = useState();
const [d, setD] = useState([]);
```

### File Naming

```
✅ GOOD:
- AdminDashboard.tsx
- StudentHomePage.tsx
- useAuth.ts
- assignmentTypes.ts

❌ BAD:
- admin-dashboard.tsx
- studenthomepage.tsx
- authHook.ts
- assignment_types.ts
```

---

## 🧪 Testing Guidelines

### Unit Tests

```tsx
// Test file: Button.test.tsx
describe('Button', () => {
  it('should render with primary variant', () => {
    render(<Button label="Click me" onClick={jest.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔄 Git Workflow

### Commit Messages

```
✅ GOOD:
- feat: Add upload functionality to Admin Materials page
- fix: Resolve modal closing issue in Assignment Library
- refactor: Extract common upload component
- docs: Update AI Implementation Guide

❌ BAD:
- update code
- fix bug
- changes
- WIP
```

### Branch Naming

```
✅ GOOD:
- feature/admin-material-upload
- fix/modal-close-bug
- refactor/upload-component

❌ BAD:
- new-feature
- bug-fix
- temp
```

---

## 📊 Performance Guidelines

### Optimization Rules

1. **Use React.memo** for expensive components
2. **useMemo** for expensive calculations
3. **useCallback** for callback functions
4. **Lazy load** images with ImageWithFallback
5. **Code splitting** with dynamic imports

### Example

```tsx
// ✅ GOOD: Memoized component
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  return <div>{/* render */}</div>;
});

// ❌ BAD: Re-renders on every parent update
export function ExpensiveComponent({ data }: Props) {
  const processedData = data.map(item => expensiveOperation(item));
  return <div>{/* render */}</div>;
}
```

---

## 🐛 Error Handling

### Best Practices

```tsx
// ✅ GOOD: Comprehensive error handling
async function fetchAssignments() {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await api.getAssignments();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setAssignments(data);
    
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Đã xảy ra lỗi không xác định';
    
    setError(errorMessage);
    console.error('Error fetching assignments:', err);
    
    // Optional: Show toast notification
    toast.error(errorMessage);
    
  } finally {
    setIsLoading(false);
  }
}

// ❌ BAD: No error handling
async function fetchAssignments() {
  const data = await api.getAssignments();
  setAssignments(data);
}
```

---

## 📦 Component Structure

### Recommended Pattern

```tsx
// 1. Imports
import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

// 2. Types/Interfaces
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

// 3. Constants
const ACCEPTED_FILE_TYPES = '.pdf,.docx,.pptx';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// 4. Component
export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  // 4a. State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 4b. Effects
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setError(null);
    }
  }, [isOpen]);

  // 4c. Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File quá lớn. Tối đa 50MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // 4d. Render helpers
  if (!isOpen) return null;

  // 4e. JSX
  return (
    <div className="modal">
      {/* Modal content */}
    </div>
  );
}
```

---

## 🎓 VSTEPRO Specific Rules

### 1. Role-Based Colors

```tsx
// ✅ GOOD: Use role-specific colors
const roleColors = {
  student: 'blue',   // #2563EB
  teacher: 'purple', // #9333EA
  admin: 'red',      // #DC2626
  uploader: 'yellow',
};

<button className="bg-blue-600">Student Action</button>
<button className="bg-red-600">Admin Action</button>
```

### 2. Dashboard Layout

```tsx
// ✅ GOOD: Consistent dashboard structure
<div className="flex">
  <Sidebar className="w-64 fixed" /> {/* 256px fixed */}
  <main className="ml-64 flex-1">
    <div className="max-w-[1360px] mx-auto p-6">
      {/* Content */}
    </div>
  </main>
</div>
```

### 3. Modal Patterns

```tsx
// ✅ GOOD: Consistent modal structure
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Modal Title</h2>
          <button onClick={onClose}>
            <X className="size-6" />
          </button>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="p-6 space-y-4">
        {/* Form fields */}
      </div>
    </div>
  </div>
)}
```

### 4. Form Patterns

```tsx
// ✅ GOOD: Consistent form structure
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Field Label {required && '*'}
  </label>
  <input
    type="text"
    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
    placeholder="Enter value..."
  />
</div>
```

### 5. Upload Component Pattern

```tsx
// ✅ GOOD: Standard upload UI
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload tài liệu *
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
  <div className="mt-2 text-xs text-gray-500">
    💡 Hoặc có thể nhập đường link URL trực tiếp:
  </div>
  <input
    type="url"
    className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
    placeholder="https://drive.google.com/file/..."
  />
</div>
```

---

## 📚 Resources & References

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

### VSTEPRO Specific
- Project Context: `01_PROJECT_CONTEXT.md`
- API Documentation: `/docs/api/`
- Component Library: `/docs/components/`
- Design System: `/docs/design/`

---

## 🤝 Collaboration

### AI-to-AI Handoff

Khi chuyển giao task giữa các AI sessions:

1. **Document state hiện tại**
   ```markdown
   ## Current State
   - Completed: Admin Material Upload
   - In Progress: Teacher Material Upload
   - Blocked: Student Material Access (waiting for API)
   ```

2. **List changes made**
   ```markdown
   ## Changes
   - Added Upload component to AdminStudyMaterialsTab.tsx
   - Added Upload component to AdminClassMaterialsTab.tsx
   - Updated imports to include Upload, File icons
   ```

3. **Next steps**
   ```markdown
   ## Next Steps
   - Add file validation logic
   - Implement actual upload to Supabase Storage
   - Add progress bar for large files
   ```

---

## ✅ Pre-deployment Checklist

Trước khi consider task "done":

- [ ] Code compile without errors
- [ ] No TypeScript errors
- [ ] No console.log() in production code
- [ ] All imports are used
- [ ] Responsive design works (check mobile)
- [ ] Accessibility: keyboard navigation works
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Comments added for complex logic
- [ ] File named correctly
- [ ] Follows project structure
- [ ] No hardcoded values
- [ ] Constants extracted properly
- [ ] Git commit message is clear

---

## 🎯 Success Metrics

### Code Quality
- **0** TypeScript errors
- **0** ESLint warnings
- **> 80%** code coverage (future)
- **< 3** levels of nesting

### Performance
- **< 100ms** component render time
- **< 1s** API response time
- **< 3s** page load time

### User Experience
- **< 2 clicks** to common actions
- **100%** keyboard accessible
- **WCAG AA** compliance

---

## 📞 Support & Questions

Nếu AI encounter issues:

1. **Check documentation** trong `/docs`
2. **Review similar implementations** trong codebase
3. **Follow patterns** đã established
4. **Ask for clarification** trong task comments

---

**Last Updated**: December 21, 2024  
**Version**: 1.0.0  
**Maintained by**: VSTEPRO Development Team
