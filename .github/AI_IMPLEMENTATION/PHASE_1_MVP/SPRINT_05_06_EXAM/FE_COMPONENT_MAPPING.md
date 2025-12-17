# Sprint 05-06 FE Component Mapping

> ⚠️ **ĐỌC KỸ TRƯỚC KHI IMPLEMENT** - Hướng dẫn cho AI và Developer

## Existing Components trong `FE/src/components/exam/`

| File | Mô tả | Dòng | Hành động |
|------|-------|------|-----------|
| `ExamInterface.tsx` | **MASSIVE** - Full exam session UI | ~1379 lines | 🚫 **KHÔNG VIẾT LẠI** |
| `PreExamInstructions.tsx` | Hướng dẫn trước thi | ~200 lines | ✅ EXTEND only |
| `AudioLevelMeter.tsx` | Audio level visualization | ~50 lines | ✅ EXTEND only |
| `PreparationTimer.tsx` | Timer cho preparation phase | ~80 lines | ✅ EXTEND only |
| `SkillTransitionModal.tsx` | Modal chuyển skill | ~100 lines | ✅ EXTEND only |
| `IncompletePartModal.tsx` | Modal warning incomplete | ~80 lines | ✅ EXTEND only |
| `SpeakingPreparationModal.tsx` | Speaking prep modal | ~120 lines | ✅ EXTEND only |
| `TransitionCountdownModal.tsx` | Countdown between sections | ~60 lines | ✅ EXTEND only |
| `RecordingCountdownModal.tsx` | Recording countdown | ~50 lines | ✅ EXTEND only |
| `exam-room.tsx` | Exam room container | ~200 lines | ✅ EXTEND only |
| `ReadingData.ts` | Mock data | N/A | Replace với API |
| `WritingData.ts` | Mock data | N/A | Replace với API |
| `SpeakingData.ts` | Mock data | N/A | Replace với API |

## 🚨 ExamInterface.tsx - ĐẶC BIỆT QUAN TRỌNG!

Component này **~1379 dòng**, đã có đầy đủ:
- ✅ Timer component với countdown
- ✅ Section navigation (Reading/Listening/Writing/Speaking)
- ✅ Question grid với status indicators
- ✅ Answer rendering cho tất cả question types
- ✅ Audio player cho Listening
- ✅ Text editor cho Writing
- ✅ Audio recorder cho Speaking
- ✅ Flagged question system
- ✅ Progress visualization
- ✅ Pre-submit review modal
- ✅ Skill transition handling

### Điều cần làm:
```
❌ KHÔNG tạo lại UI
✅ Tích hợp API calls
✅ Replace mock data với real API
✅ Add React Query hooks
✅ Connect to Zustand store
✅ Handle real-time timer sync
```

## FE Task Mapping

| Task ID | Tên Task | Action |
|---------|----------|--------|
| FE-020 | Exam API Service | ✅ CREATE - API service mới |
| FE-021 | Exam Selection Page | ⚠️ CHECK ExamInterface có exam selection chưa |
| FE-022 | Exam Session Layout | 🚫 KHÔNG TẠO MỚI - ExamInterface.tsx ĐÃ CÓ |
| FE-023 | Exam Timer Component | 🚫 Timer đã có trong ExamInterface |
| FE-024 | Exam Navigation | 🚫 Navigation đã có trong ExamInterface |
| FE-025 | Exam Submission Flow | ⚠️ EXTEND ExamInterface submission logic |
| FE-026 | Exam Result Page | ⚠️ CHECK existing result components |
| FE-027 | Certificate Download | ✅ CREATE - Chưa có |

## Approach cho Sprint này

### 1. FE-020: Exam API Service
```typescript
// CREATE: features/exam/exam.api.ts
// CREATE: features/exam/exam.hooks.ts
// CREATE: features/exam/exam.store.ts
// CREATE: features/exam/exam.types.ts
```

### 2. FE-021-025: Exam Session
**KHÔNG tạo components mới!**
```typescript
// MODIFY: components/exam/ExamInterface.tsx
// - Import useExamApi, useExamStore
// - Replace mock data với API calls
// - Add React Query mutations
```

### 3. FE-026: Exam Result
```typescript
// CHECK xem có ExamResult component chưa
// Nếu chưa có -> CREATE
// Nếu có -> EXTEND với API
```

### 4. FE-027: Certificate
```typescript
// CREATE: components/exam/CertificateDownload.tsx
// CREATE: app/(dashboard)/certificates/[id]/page.tsx
```

## Estimated Hours Revision

| Task | Original | Revised | Lý do |
|------|----------|---------|-------|
| FE-020 | 4h | 4h | API service mới |
| FE-021 | 6h | 3h | Chỉ page wrapper |
| FE-022 | 8h | 2h | ExamInterface đã có |
| FE-023 | 4h | 1h | Timer đã có |
| FE-024 | 5h | 1h | Navigation đã có |
| FE-025 | 5h | 3h | Extend submission logic |
| FE-026 | 8h | 5h | Result page cần check |
| FE-027 | 4h | 4h | Tạo mới |
| **Total** | **44h** | **23h** | **Tiết kiệm 21h** |

---

> 📝 **Note**: ExamInterface.tsx là component lớn nhất trong codebase. Việc tạo lại sẽ mất nhiều thời gian và gây duplicate code.
