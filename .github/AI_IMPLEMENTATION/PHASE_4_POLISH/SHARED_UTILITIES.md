# Shared Utilities & Design System

> **Các utilities và config cần migrate từ UI-Template**
>
> Updated: 19/12/2024

---

## 📋 Overview

UI-Template có các shared files cần migrate sang FE project để đảm bảo consistency.

---

## 📁 Files to Migrate

### 1. Design System Constants

**Source:** `UI-Template/constants/layout.ts`
**Target:** `FE/src/constants/layout.ts`

```typescript
// Layout constants for consistent spacing and sizing
export const LAYOUT = {
  CONTAINER: 'max-w-7xl mx-auto px-6',
  CONTAINER_NARROW: 'max-w-5xl mx-auto px-6',
  CONTAINER_SMALL: 'max-w-3xl mx-auto px-6',
};

export const SPACING = {
  PAGE_PADDING: 'px-6 py-8',
  SECTION_GAP: 'space-y-6',
  CARD_PADDING: 'p-6',
  GRID_GAP: 'gap-6',
};

export const HEADINGS = {
  PAGE_TITLE: 'text-3xl font-bold text-gray-900 mb-8',
  SECTION_TITLE: 'text-2xl font-bold text-gray-900 mb-6',
  CARD_TITLE: 'text-lg font-semibold text-gray-900 mb-3',
};

export const COMPONENTS = {
  BUTTON_HEIGHT: 'h-10',
  INPUT_HEIGHT: 'h-10',
  ROUNDED: 'rounded-lg',
  SHADOW: 'shadow-sm',
};
```

---

### 2. Footer Configuration

**Source:** `UI-Template/config/footerConfig.ts`
**Target:** `FE/src/config/footerConfig.ts`

```typescript
export interface FooterConfig {
  brand: { name: string; tagline: string; description: string; };
  contact: { email: string; phone: string; organization: string; };
  sections: FooterSection[];
  socialLinks: SocialLink[];
  legalLinks: FooterLink[];
}

// Default config with Vietnamese content
export const defaultFooterConfig: FooterConfig = {
  brand: {
    name: 'VSTEPRO',
    tagline: 'Nền tảng luyện thi VSTEP Online',
    description: 'Luyện thi VSTEP 4 kỹ năng...',
  },
  // ... full config
};
```

---

### 3. Auth Service (Client-side)

**Source:** `UI-Template/utils/authService.ts`
**Target:** `FE/src/lib/authService.ts`

Note: Đây là mock service cho development. Production sẽ dùng real API.

```typescript
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin' | 'uploader';
}

export function getAuthState(): AuthState { ... }
export function saveAuthState(user: User, token: string): void { ... }
export function clearAuthState(): void { ... }
```

---

### 4. Development Helpers

**Source:** `UI-Template/utils/devHelpers.ts`
**Target:** `FE/src/lib/devHelpers.ts`

```typescript
// Quick login for development testing
export function quickLogin(role: 'student' | 'teacher' | 'admin' | 'uploader'): void { ... }
export function quickLogout(): void { ... }
export function getAuthStatus(): void { ... }

// Auto-attached to window in development
// Usage: quickLogin('teacher')
```

---

### 5. Assignment Library Data

**Source:** `UI-Template/data/assignmentLibraryData.ts`
**Target:** `FE/src/data/assignmentLibraryData.ts`

```typescript
export type CourseType = 'VSTEP Complete' | 'VSTEP Foundation' | ...;

export interface Assignment {
  id: number;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  estimatedTime: number;
  course: CourseType;
}

export interface SessionData {
  id: string;
  sessionNumber: number;
  title: string;
  course: CourseType;
  assignments: Assignment[];
}

export const assignmentLibraryData: Record<CourseType, SessionData[]> = { ... };
```

---

### 6. Teacher Class Data

**Source:** `UI-Template/data/teacherClassData.ts`
**Target:** `FE/src/data/teacherClassData.ts`

```typescript
export interface TeacherClass {
  id: number;
  name: string;
  code: string;
  course: string;
  level: 'B1' | 'B2' | 'C1';
  students: number;
  schedule: string;
  status: 'active' | 'completed' | 'upcoming';
}

export const teacherClasses: TeacherClass[] = [ ... ];
```

---

### 7. Study Materials Data

**Source:** `UI-Template/components/teacher/studyMaterialsData.ts`
**Target:** `FE/src/data/studyMaterialsData.ts`

```typescript
export type StudyCategory = 'all' | 'textbook' | 'lecture' | 'exercise';

export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx';
  category: StudyCategory;
  skill?: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  level?: 'A2' | 'B1' | 'B2' | 'C1';
  size: string;
  views: number;
  downloads: number;
}
```

---

### 8. Class Materials Data

**Source:** `UI-Template/components/teacher/classMaterialsData.ts`
**Target:** `FE/src/data/classMaterialsData.ts`

```typescript
export type ClassCategory = 'textbook' | 'media';

export interface TextbookMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx';
  category: 'textbook';
  // ...
}

export interface MediaMaterial {
  id: string;
  name: string;
  type: 'video' | 'audio';
  category: 'media';
  duration: string;
  // ...
}
```

---

### 9. Course Configurations

**Source:** `UI-Template/components/teacher/courseConfigs.ts`
**Target:** `FE/src/data/courseConfigs.ts`

```typescript
export const courseConfigs: Record<string, { sessions: number, titles: string[] }> = {
  'VSTEP Complete': {
    sessions: 10,
    titles: [
      'Giới thiệu & Từ vựng cơ bản',
      'Reading Skills - Skimming & Scanning',
      // ...
    ]
  },
  // ...other courses
};

export const getSessionTitle = (courseName: string, session: number): string => { ... };
```

---

## 📋 Migration Tasks

| Task ID | File | Priority | Hours |
|---------|------|----------|-------|
| UTIL-001 | layout.ts | P1 | 0.5h |
| UTIL-002 | footerConfig.ts | P2 | 1h |
| UTIL-003 | authService.ts | P1 | 1h |
| UTIL-004 | devHelpers.ts | P3 | 0.5h |
| UTIL-005 | assignmentLibraryData.ts | P1 | 2h |
| UTIL-006 | teacherClassData.ts | P1 | 1h |
| UTIL-007 | studyMaterialsData.ts | P2 | 2h |
| UTIL-008 | classMaterialsData.ts | P2 | 2h |
| UTIL-009 | courseConfigs.ts | P1 | 1h |

**Total:** 9 tasks, ~11h

---

## ✅ Migration Checklist

- [ ] Create `FE/src/constants/` folder if not exists
- [ ] Create `FE/src/config/` folder if not exists
- [ ] Create `FE/src/data/` folder if not exists
- [ ] Copy and adapt each file
- [ ] Update imports in existing components
- [ ] Test with existing features
- [ ] Remove duplicate/conflicting data

---

## 🔗 Notes

1. **Mock Data vs Real API**: These data files are for development/prototyping. Production should fetch from API.

2. **Types**: Ensure TypeScript types are exported and used consistently.

3. **Naming**: Keep consistent naming with existing FE conventions.
