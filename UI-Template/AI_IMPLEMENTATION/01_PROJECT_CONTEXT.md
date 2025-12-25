# 🎯 Project Context - VSTEPRO

**Version**: 1.0.0  
**Last Updated**: December 21, 2024

---

## 📝 Project Overview

### What is VSTEPRO?

**VSTEPRO** là nền tảng luyện thi VSTEP (Vietnamese Standardized Test of English Proficiency) toàn diện với:

- ✅ **4 kỹ năng**: Reading, Listening, Writing, Speaking
- ✅ **4 cấp độ**: A2, B1, B2, C1 theo CEFR
- ✅ **AI-powered grading**: Chấm tự động Writing/Speaking với feedback chi tiết
- ✅ **Multi-role system**: Student, Teacher, Admin, Uploader
- ✅ **Practice & Mock tests**: Luyện tập và thi thử theo format chuẩn

---

## 🎯 Business Goals

### Primary Goals

1. **Democratize VSTEP prep** - Ai cũng có thể luyện thi VSTEP chất lượng cao
2. **AI-powered feedback** - Feedback tức thì, chi tiết, cá nhân hóa
3. **Teacher efficiency** - Giảm workload cho giáo viên, tăng quality
4. **Data-driven insights** - Analytics để cải thiện học tập

### Target Users

| Role | Description | Key Features |
|------|-------------|--------------|
| **Student** | Học viên luyện thi VSTEP | Practice, Mock tests, AI feedback, Progress tracking |
| **Teacher** | Giáo viên dạy VSTEP | Assign homework, Grade manually, Track student progress |
| **Admin** | Quản trị hệ thống | User management, Content management, Analytics |
| **Uploader** | Người tạo nội dung | Upload exercises, Create tests, Manage materials |

---

## 🏗️ System Architecture

### Frontend Stack

```typescript
const FRONTEND_STACK = {
  framework: 'React 18',
  language: 'TypeScript',
  styling: 'Tailwind CSS v4.0',
  icons: 'lucide-react',
  charts: 'recharts',
  forms: 'react-hook-form@7.55.0',
  animations: 'motion/react (Framer Motion)',
  state: 'React Hooks (useState, useContext)',
  routing: 'React Router (future)',
};
```

### Backend Stack (Future)

```typescript
const BACKEND_STACK = {
  runtime: 'Node.js 18+',
  framework: 'NestJS',
  database: 'PostgreSQL (via Supabase)',
  orm: 'Prisma',
  auth: 'Supabase Auth',
  storage: 'Supabase Storage',
  ai: 'OpenAI API (GPT-4)',
};
```

### AI Grading Service

```typescript
const AI_SERVICE = {
  framework: 'FastAPI (Python)',
  models: {
    writing: 'GPT-4-turbo',
    speaking: 'Whisper (transcription) + GPT-4 (grading)',
  },
  scoring: 'VSTEP rubric-based (0-4 scale)',
};
```

---

## 🎨 Design System

### Color Palette

```typescript
// CORE COLORS - TOÀN BỘ WEBSITE
const PRIMARY_COLOR = '#2563EB';   // Blue - Student, main actions
const SECONDARY_COLOR = '#F97316'; // Orange - Highlights, CTAs

// ROLE-SPECIFIC COLORS - CHỈ TRONG DASHBOARD
const ROLE_COLORS = {
  student: '#2563EB',    // Blue
  teacher: '#9333EA',    // Purple  
  admin: '#DC2626',      // Red
  uploader: '#EAB308',   // Yellow
};

// SEMANTIC COLORS
const SEMANTIC_COLORS = {
  success: '#10B981',    // Green
  warning: '#F59E0B',    // Amber
  error: '#EF4444',      // Red
  info: '#3B82F6',       // Blue
};
```

**⚠️ IMPORTANT:**
- Toàn bộ website chỉ dùng **Blue (#2563EB)** và **Orange (#F97316)**
- Role colors chỉ xuất hiện trong dashboard của role đó
- VD: Admin dashboard → Red accent, Student dashboard → Blue accent

### Layout System

```typescript
const LAYOUT_SPECS = {
  // Container
  maxWidth: '1360px',
  padding: '1.5rem', // p-6
  
  // Sidebar
  sidebarWidth: '256px',  // w-64
  sidebarPosition: 'fixed',
  sidebarBackground: 'bg-gray-900',
  
  // Header
  headerHeight: '64px',
  headerPosition: 'sticky',
  
  // Content
  contentMarginLeft: '256px', // ml-64 (for sidebar)
  contentMaxWidth: '1360px',
  
  // Grid
  gridGap: '1rem',      // gap-4
  gridCols: '1fr 1fr',  // grid-cols-2
};
```

### Typography

```css
/* Defined in /styles/globals.css */

/* KHÔNG dùng Tailwind typography classes! */
/* VD: text-2xl, font-bold, leading-tight */

/* CHỈ dùng HTML semantic tags */
<h1> /* Auto styled from globals.css */
<h2>
<h3>
<p>
<span>
```

**Typography Scale:**
- **h1**: 36px / 900 weight
- **h2**: 24px / 700 weight
- **h3**: 20px / 600 weight
- **body**: 16px / 400 weight
- **small**: 14px / 400 weight

---

## 📦 Project Structure

### Current Structure

```
vstepro/
├── components/
│   ├── admin/                    # Admin dashboard
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminMaterialsManagementPage.tsx
│   │   ├── AdminStudyMaterialsTab.tsx
│   │   ├── AdminClassMaterialsTab.tsx
│   │   ├── AdminAssignmentLibraryPage.tsx
│   │   └── ...
│   │
│   ├── teacher/                  # Teacher dashboard
│   │   ├── TeacherDashboard.tsx
│   │   ├── AssignHomeworkPage.tsx
│   │   ├── LearningGoalsPage.tsx
│   │   ├── AttendancePage.tsx
│   │   └── ...
│   │
│   ├── student/                  # Student dashboard
│   │   ├── StudentDashboard.tsx
│   │   ├── PracticeHome.tsx
│   │   ├── ReadingPractice.tsx
│   │   └── ...
│   │
│   ├── shared/                   # Shared components
│   │   └── SwitchRoleButton.tsx
│   │
│   └── ui/                       # Reusable UI primitives
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ...
│
├── styles/
│   └── globals.css              # Tailwind + custom styles
│
├── data/                        # Mock data & constants
│   └── mockData.ts
│
├── types/                       # TypeScript types
│   └── index.ts
│
├── utils/                       # Utility functions
│   └── helpers.ts
│
├── docs/                        # Documentation
│   └── ...
│
├── AI_IMPLEMENTATION/           # AI implementation guides
│   ├── README.md
│   ├── 00_GLOBAL_RULES.md
│   ├── 01_PROJECT_CONTEXT.md
│   └── ...
│
├── App.tsx                      # Main entry component
├── index.tsx                    # Root render
└── package.json
```

---

## 🔐 Authentication & Roles

### Role System

```typescript
type UserRole = 'student' | 'teacher' | 'admin' | 'uploader';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}
```

### Role Permissions

| Feature | Student | Teacher | Admin | Uploader |
|---------|---------|---------|-------|----------|
| Practice exercises | ✅ | ✅ | ✅ | ✅ |
| Mock tests | ✅ | ✅ | ✅ | ✅ |
| View own results | ✅ | ✅ | ✅ | ✅ |
| Assign homework | ❌ | ✅ | ✅ | ❌ |
| View student progress | ❌ | ✅ | ✅ | ❌ |
| Manage users | ❌ | ❌ | ✅ | ❌ |
| Upload materials | ❌ | ❌ | ✅ | ✅ |
| Edit exercises | ❌ | ❌ | ✅ | ✅ |
| System analytics | ❌ | ❌ | ✅ | ❌ |

### Switch Role Feature

```typescript
// User có thể switch role realtime
<SwitchRoleButton
  currentRole="student"
  onRoleChange={(newRole) => setRole(newRole)}
/>

// Floating button ở góc phải màn hình
// Colors:
// - Blue: Student
// - Purple: Teacher  
// - Red: Admin
// - Yellow: Uploader
```

---

## 📚 Features Breakdown

### Phase 1: MVP (Current)

#### ✅ Completed

1. **Multi-role Dashboard System**
   - Student Dashboard với Practice Home
   - Teacher Dashboard với Assign Homework, Learning Goals, Attendance
   - Admin Dashboard với User Management, Material Management
   - Switch Role Button

2. **Material Management (Admin)**
   - Study Materials Tab (Textbook/Lecture/Exercise)
   - Class Materials Tab (Textbook/Media)
   - Upload functionality with drag & drop
   - Material approval workflow

3. **Assignment Library (Admin)**
   - Manage lessons/sessions
   - Manage assignments
   - Edit/Delete functionality

4. **Free Plan Features**
   - Daily quota tracking
   - 3 free mock tests
   - AI Speaking/Writing limits

#### 🚧 In Progress

- Backend integration với Supabase
- Real authentication
- Database setup

#### 📋 Planned

- Practice exercises (Reading/Listening)
- AI grading service (Writing/Speaking)
- Results & analytics
- Payment integration

---

## 🎯 VSTEP Test Format

### Test Structure

```typescript
interface VSTEPTest {
  reading: {
    parts: 4,
    questions: 40,
    time: 60, // minutes
    skills: ['Skimming', 'Scanning', 'Detail reading', 'Inference'],
  },
  listening: {
    parts: 3,
    questions: 35,
    time: 40, // minutes
    skills: ['Main idea', 'Detail', 'Inference', 'Speaker attitude'],
  },
  writing: {
    tasks: 2,
    task1: 'Describe graph/chart (150 words)',
    task2: 'Argumentative essay (250 words)',
    time: 60, // minutes
    scoring: 'AI-graded (0-4 scale)',
  },
  speaking: {
    parts: 3,
    part1: 'Interview (3 mins)',
    part2: 'Long turn (4 mins)',
    part3: 'Discussion (5 mins)',
    time: 12, // minutes
    scoring: 'AI-graded (0-4 scale)',
  },
}
```

### Scoring System

```typescript
type VSTEPScore = 0 | 1 | 2 | 3 | 4;

interface ScoreMapping {
  0: 'Below A2',
  1: 'A2',
  2: 'B1',
  3: 'B2',
  4: 'C1',
}

// Overall band calculation
// Average of 4 skills, rounded to nearest 0.5
```

---

## 🔌 API Design (Future)

### REST API Endpoints

```typescript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

// Users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

// Exercises
GET    /api/exercises?skill=reading&level=B1
GET    /api/exercises/:id
POST   /api/exercises
PUT    /api/exercises/:id
DELETE /api/exercises/:id

// Submissions
POST   /api/submissions
GET    /api/submissions/:id
GET    /api/submissions/user/:userId

// AI Grading
POST   /api/grade/writing
POST   /api/grade/speaking

// Analytics
GET    /api/analytics/user/:userId
GET    /api/analytics/class/:classId
```

### Response Format

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

---

## 📊 Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  fullName: string;
  role: 'student' | 'teacher' | 'admin' | 'uploader';
  avatar?: string;
  subscription?: 'free' | 'premium';
  dailyQuota: {
    aiWriting: number;
    aiSpeaking: number;
    mockTests: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Exercise Model

```typescript
interface Exercise {
  id: string;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  type: 'practice' | 'mock_test';
  
  // Reading/Listening specific
  questions?: Question[];
  passages?: Passage[];
  audioUrl?: string;
  
  // Writing/Speaking specific
  prompt?: string;
  wordLimit?: number;
  timeLimit?: number;
  
  createdBy: string; // User ID
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### Submission Model

```typescript
interface Submission {
  id: string;
  exerciseId: string;
  userId: string;
  
  // Reading/Listening
  answers?: {
    questionId: string;
    answer: string | string[];
    isCorrect?: boolean;
  }[];
  
  // Writing/Speaking
  content?: string;
  audioUrl?: string;
  
  // Grading
  score?: number;
  feedback?: {
    overall: string;
    criteria: {
      taskAchievement?: number;
      coherenceCohesion?: number;
      lexicalResource?: number;
      grammaticalRange?: number;
    };
  };
  
  gradedBy?: 'auto' | 'ai' | 'teacher';
  gradedAt?: Date;
  
  createdAt: Date;
}
```

---

## 🎨 UI/UX Patterns

### Dashboard Layout

```tsx
// Standard dashboard structure
<div className="flex">
  {/* Sidebar - Fixed, 256px */}
  <aside className="w-64 fixed h-screen bg-gray-900">
    <nav>{/* Navigation items */}</nav>
  </aside>
  
  {/* Main content - Offset by sidebar width */}
  <main className="ml-64 flex-1">
    <div className="max-w-[1360px] mx-auto p-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Modal Pattern

```tsx
// Standard modal with sticky header
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2>Modal Title</h2>
          <button onClick={onClose}><X /></button>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="p-6 space-y-4">
        {/* Content */}
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
    Label {required && '*'}
  </label>
  <input
    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
    placeholder="Placeholder..."
  />
  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
</div>
```

### Card Pattern

```tsx
// Standard content card
<div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
  <div className="flex items-center justify-between mb-4">
    <h3>Card Title</h3>
    <button>Action</button>
  </div>
  <div>{/* Card content */}</div>
</div>
```

---

## 🔧 Development Workflow

### Git Workflow

```bash
# Branch naming
feature/admin-material-upload
fix/modal-close-bug
refactor/upload-component

# Commit messages
feat: Add upload functionality to Admin Materials
fix: Resolve modal closing issue
refactor: Extract common upload component
docs: Update AI Implementation Guide
```

### Code Review Checklist

- [ ] Follows 00_GLOBAL_RULES.md
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design works
- [ ] Accessibility checked
- [ ] Tests written
- [ ] No console.log()
- [ ] No hardcoded values

---

## 📚 External Dependencies

### NPM Packages

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "latest",
    "recharts": "latest",
    "react-hook-form": "7.55.0",
    "motion": "latest",
    "react-slick": "latest",
    "react-responsive-masonry": "latest",
    "react-dnd": "latest",
    "sonner": "2.0.3"
  }
}
```

### Library Usage Notes

```typescript
// Icons - ALWAYS verify icon exists first!
import { Upload, X } from 'lucide-react';

// Forms
import { useForm } from 'react-hook-form@7.55.0';

// Animation
import { motion } from 'motion/react';

// Toast
import { toast } from 'sonner@2.0.3';

// Charts
import { LineChart, BarChart } from 'recharts';
```

---

## 🎯 Success Metrics

### Performance Targets

```typescript
const PERFORMANCE_TARGETS = {
  // Page load
  firstContentfulPaint: '< 1.5s',
  largestContentfulPaint: '< 2.5s',
  timeToInteractive: '< 3.5s',
  
  // Component render
  componentRenderTime: '< 100ms',
  
  // API response
  apiResponseTime: '< 1s',
  
  // User interaction
  clickToAction: '< 200ms',
};
```

### Quality Metrics

```typescript
const QUALITY_METRICS = {
  // Code
  typescriptErrors: 0,
  eslintWarnings: 0,
  testCoverage: '>80%',
  
  // UX
  mobileResponsive: '100%',
  keyboardAccessible: '100%',
  wcagCompliance: 'AA',
  
  // Business
  userSatisfaction: '>4.5/5',
  taskCompletionRate: '>90%',
};
```

---

## 🚀 Deployment

### Environments

```typescript
const ENVIRONMENTS = {
  development: {
    url: 'http://localhost:3000',
    api: 'http://localhost:8000',
  },
  staging: {
    url: 'https://staging.vstepro.com',
    api: 'https://api-staging.vstepro.com',
  },
  production: {
    url: 'https://vstepro.com',
    api: 'https://api.vstepro.com',
  },
};
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
```

---

## 🤝 Team Conventions

### Communication

- **Code comments**: Tiếng Việt cho business logic
- **Documentation**: English for technical, Việt for user-facing
- **Commit messages**: English
- **PR descriptions**: English with Vietnamese context if needed

### Code Review

- Review within 24 hours
- Approval needed from 1 senior dev
- All CI checks must pass
- No merge without tests

---

## 📖 References

### Documentation

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Internal

- `/docs/api` - API documentation
- `/docs/components` - Component library
- `/docs/design` - Design system
- `/AI_IMPLEMENTATION` - Implementation guides

---

**Version**: 1.0.0  
**Last Updated**: December 21, 2024  
**Maintained by**: VSTEPRO Development Team
