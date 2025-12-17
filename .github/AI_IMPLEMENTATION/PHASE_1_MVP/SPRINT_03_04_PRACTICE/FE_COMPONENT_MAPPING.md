# 🎨 Sprint 03-04 - FE Component Mapping

> **⚠️ ĐỌC TRƯỚC KHI IMPLEMENT BẤT KỲ FE TASK NÀO TRONG SPRINT NÀY**

---

## 📁 Existing Components & Files

### Skill Exercise Components (Already Exist!)

| Path | Status | Notes |
|------|--------|-------|
| `components/reading/ReadingExercise.tsx` | ✅ Exists | Full reading exercise UI |
| `components/reading/ReadingResult.tsx` | ✅ Exists | Reading result display |
| `components/listening/ListeningExercise.tsx` | ✅ Exists | Full listening exercise with audio |
| `components/listening/ListeningResult.tsx` | ✅ Exists | Listening result display |
| `components/writing/WritingExercise.tsx` | ✅ Exists | Writing exercise UI |
| `components/writing/WritingResult.tsx` | ✅ Exists | Writing result display |
| `components/speaking/SpeakingExercise.tsx` | ✅ Exists | Speaking exercise with recording |
| `components/speaking/SpeakingResult.tsx` | ✅ Exists | Speaking result display |
| `components/PracticeHome.tsx` | ✅ Exists | ~788 lines - VERY complete! |
| `components/practice/practice-component.tsx` | ✅ Exists | Generic practice component |

### Practice Pages

| Path | Status |
|------|--------|
| `app/(dashboard)/practice/` | Check if exists |
| `app/(dashboard)/practice/reading/` | Check if exists |
| `app/(dashboard)/practice/listening/` | Check if exists |
| `app/(dashboard)/practice/writing/` | Check if exists |
| `app/(dashboard)/practice/speaking/` | Check if exists |

### Features Module (Check if exists)

| Path | Status | Action |
|------|--------|--------|
| `features/practice/` | ❌ May not exist | CREATE new |
| `services/practice.service.ts` | ❌ May not exist | CREATE new |

---

## 📋 Task Action Summary

| Task | Current Approach | ⚠️ NEW APPROACH |
|------|-----------------|-----------------|
| FE-008 | Create practice API | ✅ **CREATE** `services/practice.service.ts` (mới) |
| FE-009 | Create question components | ✅ **CREATE** reusable question components (cần thiết) |
| FE-010 | Create Reading page | **INTEGRATE** existing `ReadingExercise.tsx` với API |
| FE-011 | Create Listening page | **INTEGRATE** existing `ListeningExercise.tsx` với API |
| FE-013 | Create Writing page | **INTEGRATE** existing `WritingExercise.tsx` với API |
| FE-014 | Create Result Summary | **REFACTOR** use existing Result components |
| FE-015 | Create practice store | ✅ **CREATE** `features/practice/practice.store.ts` (mới) |
| FE-016 | Create Practice Home | 🚫 **DON'T REWRITE** - Existing `PracticeHome.tsx` is 788 lines! Just integrate API |
| FE-017 | Create Level Selection | **EXTRACT** from existing or create modal |
| FE-018 | Create Practice History | ✅ **CREATE** new page (không có sẵn) |

---

## 🔧 What EXISTS vs What to ADD

### FE-010: Reading Practice

**Existing (`ReadingExercise.tsx`):**
```tsx
- Passage display ✅
- Question rendering ✅
- Answer selection ✅
- Timer display ✅
- Navigation ✅
```

**Chỉ cần thêm:**
```tsx
- API data fetching với React Query
- Submit answers to backend
- Replace mock data với real API
```

### FE-016: Practice Home

**Existing (`PracticeHome.tsx`) - ~788 lines!:**
```tsx
- Skill cards (Reading/Listening/Writing/Speaking) ✅
- Level selection UI ✅
- Stats display ✅
- Quick actions ✅
- Recent practice history ✅
```

**⚠️ ĐỌC FILE NÀY TRƯỚC - ĐÃ RẤT HOÀN CHỈNH!**

**Chỉ cần thêm:**
```tsx
- Wire up với practice.service.ts
- Replace mock data với API calls
- Add React Query hooks
```

---

## 📝 Implementation Pattern

```typescript
// ✅ CORRECT - Create new service
// src/services/practice.service.ts (NEW - không có sẵn)
export const practiceService = {
  getQuestions: (skill, level) => apiClient.get('/practice/questions', {...}),
  submitAnswers: (data) => apiClient.post('/practice/submit', data),
};

// ✅ CORRECT - Create React Query hook
// src/hooks/usePractice.ts (NEW)
export function usePracticeQuestions(skill: string, level: string) {
  return useQuery({
    queryKey: ['practice', skill, level],
    queryFn: () => practiceService.getQuestions(skill, level),
  });
}

// ⚠️ CORRECT - UPDATE existing component
// Update: src/components/reading/ReadingExercise.tsx
// REPLACE mock data với hook, giữ nguyên UI
```

```tsx
// ❌ WRONG - Viết lại UI đã có
// src/components/practice/ReadingPractice.tsx (NEW - WRONG!)
export default function ReadingPractice() {
  return <div>New Reading UI...</div>
}

// ✅ CORRECT - Dùng component đã có
// src/app/(dashboard)/practice/reading/page.tsx
import { ReadingExercise } from '@/components/reading/ReadingExercise';
import { usePracticeQuestions } from '@/hooks/usePractice';

export default function ReadingPracticePage() {
  const { data, isLoading } = usePracticeQuestions('reading', level);
  
  if (isLoading) return <Skeleton />;
  
  return <ReadingExercise questions={data.questions} />;
}
```
