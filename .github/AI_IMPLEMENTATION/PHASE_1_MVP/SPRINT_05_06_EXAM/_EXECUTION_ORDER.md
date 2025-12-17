# Sprint 05-06: Exam Module - Execution Order

## 🎯 Sprint Goal
Implement full Mock Test với 4 kỹ năng, theo format VSTEP chính thức.

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| Duration | 2 weeks |
| Total Tasks | 16 |
| Backend Tasks | 8 |
| Frontend Tasks | 8 |
| Estimated Hours | 64h |

---

## 📋 Task List

### Week 5: Backend Core

| Priority | Task ID | Task Name | Hours | Dependencies |
|----------|---------|-----------|-------|--------------|
| P0 | BE-020 | Exam Attempt Entity | 4h | BE-010 |
| P0 | BE-021 | Exam Attempt Service | 8h | BE-020 |
| P0 | BE-022 | Exam Section Controller | 4h | BE-021 |
| P0 | BE-023 | Exam Timer Service | 4h | BE-021 |
| P0 | BE-024 | Exam Answer Service | 6h | BE-021 |
| P1 | BE-025 | Exam Result Calculator | 6h | BE-024, BE-013 |
| P1 | BE-026 | Exam History Service | 4h | BE-021 |
| P1 | BE-027 | Exam Statistics Service | 4h | BE-026 |

### Week 6: Frontend Implementation

| Priority | Task ID | Task Name | Hours | Dependencies |
|----------|---------|-----------|-------|--------------|
| P0 | FE-020 | Exam API Service | 4h | - |
| P0 | FE-021 | Exam Selection Page | 6h | FE-020 |
| P0 | FE-022 | Exam Room Page | 10h | FE-021 |
| P0 | FE-023 | Exam Section Navigation | 4h | FE-022 |
| P0 | FE-024 | Exam Timer Component | 4h | FE-022 |
| P1 | FE-025 | Exam Result Page | 8h | FE-020 |
| P1 | FE-026 | Exam History Page | 4h | FE-020 |
| P1 | FE-027 | Exam Certificate Preview | 4h | FE-025 |

---

## 🔗 Dependency Graph

```
BE-010 (Questions) ─┬─> BE-020 (Attempt Entity)
                    │
BE-013 (Scoring) ───┼─> BE-025 (Result Calculator)
                    │
                    └─> BE-021 (Attempt Service)
                            │
                            ├─> BE-022 (Section Controller)
                            ├─> BE-023 (Timer Service)
                            ├─> BE-024 (Answer Service)
                            └─> BE-026 (History Service)
                                    │
                                    └─> BE-027 (Statistics)

FE-020 (API) ───┬─> FE-021 (Selection Page)
                │       │
                │       └─> FE-022 (Exam Room)
                │               │
                │               ├─> FE-023 (Section Nav)
                │               └─> FE-024 (Timer)
                │
                ├─> FE-025 (Result Page)
                │       │
                │       └─> FE-027 (Certificate)
                │
                └─> FE-026 (History Page)
```

---

## 🎯 Key Features

### Exam Flow
1. **Exam Selection**: Chọn level (A2-C1) và bắt đầu thi
2. **Section Sequence**: Reading → Listening → Writing → Speaking
3. **Strict Timing**: Mỗi section có time limit riêng
4. **Auto Submit**: Tự động nộp bài khi hết giờ
5. **No Navigation Back**: Không được quay lại section đã hoàn thành

### Timing Rules (VSTEP Format)
| Section | Duration | Questions |
|---------|----------|-----------|
| Reading | 60 min | 40 questions |
| Listening | 40 min | 35 questions |
| Writing | 60 min | 2 tasks |
| Speaking | 12 min | 3 parts |

### Result Features
- Overall VSTEP score (1-10)
- Per-skill breakdown
- Certificate preview (PDF)
- Historical comparison
- Recommendations

---

## ✅ Acceptance Criteria

### Backend
- [ ] Exam attempt CRUD complete
- [ ] Section timing enforced
- [ ] Auto-submit on time expiry
- [ ] VSTEP score calculation accurate
- [ ] History with filtering

### Frontend
- [ ] Exam selection với level cards
- [ ] Exam room với section tabs
- [ ] Timer countdown per section
- [ ] Progress bar per section
- [ ] Result với certificate preview
- [ ] History với charts

---

## 📁 File Structure

```
BE/src/modules/exams/
├── entities/
│   ├── exam-attempt.entity.ts
│   └── exam-answer.entity.ts
├── dto/
│   ├── create-attempt.dto.ts
│   ├── submit-section.dto.ts
│   └── exam-filter.dto.ts
├── services/
│   ├── exam-attempt.service.ts
│   ├── exam-timer.service.ts
│   ├── exam-answer.service.ts
│   ├── exam-result.service.ts
│   └── exam-history.service.ts
└── controllers/
    └── exam.controller.ts

FE/src/app/exam/
├── page.tsx (Selection)
├── [attemptId]/
│   ├── page.tsx (Exam Room)
│   ├── [section]/
│   │   └── page.tsx
│   └── result/
│       └── page.tsx
└── history/
    └── page.tsx
```

---

## ⏭️ Next Sprint

**Sprint 07-08: Dashboard Module**
- Student dashboard với analytics
- Progress tracking
- Learning roadmap
- Gamification elements
