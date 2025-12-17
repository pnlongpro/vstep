# Sprint 03-04: Practice Module - Execution Order

## 📋 Sprint Overview

| Sprint | Duration | Focus |
|--------|----------|-------|
| 03 | Week 5-6 | Practice Infrastructure + Reading |
| 04 | Week 7-8 | Listening + Writing Practice |

---

## 🎯 Sprint Goals

### Sprint 03 Goals
- Practice infrastructure và question rendering
- Reading practice full implementation
- Question bank integration
- Progress tracking cơ bản

### Sprint 04 Goals
- Listening practice với audio player
- Writing practice với AI scoring
- Practice history và statistics

---

## 📦 Task Breakdown

### Backend Tasks (BE-010 → BE-020)

```
BE-010: Question Bank Entities
    ↓
BE-011: Practice Session Service
    ↓
BE-012: Reading Questions API
    ↓
BE-013: Listening Questions API
    ↓
BE-014: Writing Questions API
    ↓
BE-015: Answer Submission Service
    ↓
BE-016: Auto-Scoring (R/L)
    ↓
BE-017: AI Writing Score Queue
    ↓
BE-018: Practice Progress Tracking
    ↓
BE-019: Practice Statistics API
    ↓
BE-020: Draft Auto-Save
```

### Frontend Tasks (FE-008 → FE-020)

```
FE-008: Practice API Service
    ↓
FE-009: Question Components
    ↓
FE-010: Reading Practice Page
    ↓
FE-011: Listening Practice Page
    ↓
FE-012: Audio Player Component
    ↓
FE-013: Writing Practice Page
    ↓
FE-014: Rich Text Editor
    ↓
FE-015: Timer Component
    ↓
FE-016: Progress Bar Component
    ↓
FE-017: Result Summary Page
    ↓
FE-018: Practice History Page
    ↓
FE-019: Practice Store (Zustand)
    ↓
FE-020: Auto-Save Hook
```

---

## 🔄 Dependency Graph

```
                    ┌─────────────────────────────────┐
                    │        BE-010: Entities         │
                    └────────────────┬────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│  BE-012: Read   │     │  BE-013: Listen    │     │  BE-014: Write  │
└────────┬────────┘     └─────────┬──────────┘     └────────┬────────┘
         │                        │                          │
         └────────────────────────┼──────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │     BE-015: Answer Submit       │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
          ┌─────────────────┐               ┌─────────────────┐
          │  BE-016: Auto   │               │  BE-017: AI     │
          │  Score (R/L)    │               │  Queue (W/S)    │
          └─────────────────┘               └─────────────────┘
```

---

## 📝 Execution Order

### Week 5: Practice Infrastructure

| Order | Task ID | Task Name | Est. Hours |
|-------|---------|-----------|------------|
| 1 | BE-010 | Question Bank Entities | 8h |
| 2 | BE-011 | Practice Session Service | 6h |
| 3 | FE-008 | Practice API Service | 4h |
| 4 | FE-009 | Question Components | 8h |
| 5 | FE-015 | Timer Component | 3h |
| 6 | FE-016 | Progress Bar Component | 2h |

### Week 6: Reading Practice

| Order | Task ID | Task Name | Est. Hours |
|-------|---------|-----------|------------|
| 7 | BE-012 | Reading Questions API | 6h |
| 8 | FE-010 | Reading Practice Page | 8h |
| 9 | BE-015 | Answer Submission Service | 6h |
| 10 | BE-016 | Auto-Scoring (R/L) | 4h |
| 11 | FE-019 | Practice Store (Zustand) | 4h |
| 12 | FE-020 | Auto-Save Hook | 3h |

### Week 7: Listening Practice

| Order | Task ID | Task Name | Est. Hours |
|-------|---------|-----------|------------|
| 13 | BE-013 | Listening Questions API | 6h |
| 14 | FE-012 | Audio Player Component | 6h |
| 15 | FE-011 | Listening Practice Page | 8h |
| 16 | BE-018 | Practice Progress Tracking | 4h |

### Week 8: Writing Practice

| Order | Task ID | Task Name | Est. Hours |
|-------|---------|-----------|------------|
| 17 | BE-014 | Writing Questions API | 4h |
| 18 | FE-014 | Rich Text Editor | 6h |
| 19 | FE-013 | Writing Practice Page | 8h |
| 20 | BE-017 | AI Writing Score Queue | 6h |
| 21 | BE-019 | Practice Statistics API | 4h |
| 22 | FE-017 | Result Summary Page | 4h |
| 23 | FE-018 | Practice History Page | 4h |
| 24 | BE-020 | Draft Auto-Save | 3h |

---

## 🔧 Key Technical Decisions

### Question Types

```typescript
enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE_NG = 'true_false_ng',
  MATCHING = 'matching',
  FILL_BLANK = 'fill_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
}
```

### Auto-Save Strategy

```
- Draft saved to localStorage every 5 seconds
- Synced to database every 30 seconds
- Conflict resolution: server wins
- Offline support via Service Worker
```

### Audio Player Features

```
- Play/pause/seek controls
- Playback speed (0.75x - 2x)
- Waveform visualization
- Progress bar with timestamps
- Keyboard shortcuts
- Loop section feature
```

### AI Scoring Queue

```
- RabbitMQ for job queue
- Max processing time: 5 seconds
- Retry policy: 3 attempts
- Dead letter queue for failures
- Webhook callback on completion
```

---

## ✅ Sprint Completion Criteria

### Sprint 03 Done When:
- [ ] Question entities created with migrations
- [ ] Reading practice end-to-end working
- [ ] Question components render all types
- [ ] Auto-scoring for Reading accurate

### Sprint 04 Done When:
- [ ] Listening practice with audio player
- [ ] Writing practice with rich editor
- [ ] AI scoring queue integrated
- [ ] Practice history shows all attempts
- [ ] Statistics calculated correctly

---

## 📂 Files to Create

```
SPRINT_03_04_PRACTICE/
├── _EXECUTION_ORDER.md (this file)
├── BE-010_QUESTION_ENTITIES.md
├── BE-011_PRACTICE_SESSION.md
├── BE-012_READING_API.md
├── BE-013_LISTENING_API.md
├── BE-014_WRITING_API.md
├── BE-015_ANSWER_SUBMIT.md
├── BE-016_AUTO_SCORING.md
├── BE-017_AI_QUEUE.md
├── BE-018_PROGRESS_TRACKING.md
├── BE-019_STATISTICS_API.md
├── BE-020_DRAFT_AUTOSAVE.md
├── FE-008_PRACTICE_API.md
├── FE-009_QUESTION_COMPONENTS.md
├── FE-010_READING_PAGE.md
├── FE-011_LISTENING_PAGE.md
├── FE-012_AUDIO_PLAYER.md
├── FE-013_WRITING_PAGE.md
├── FE-014_RICH_EDITOR.md
├── FE-015_TIMER.md
├── FE-016_PROGRESS_BAR.md
├── FE-017_RESULT_SUMMARY.md
├── FE-018_PRACTICE_HISTORY.md
├── FE-019_PRACTICE_STORE.md
└── FE-020_AUTOSAVE_HOOK.md
```

---

## ⏭️ Next Sprint

→ `SPRINT_05_06_EXAM/` - Mock Test & Full Exam Implementation
