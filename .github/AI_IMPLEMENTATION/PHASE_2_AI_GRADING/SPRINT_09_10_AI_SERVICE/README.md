# Sprint 09-10: AI Grading Service

> **Duration**: 2 tuần
> **Focus**: AI Service setup, Writing Grader, Speaking Grader

---

## 🎯 Sprint Goals

1. ✅ Setup Python FastAPI AI Service
2. ✅ Integrate RabbitMQ message queue
3. ✅ Implement GPT-4 Writing Grader
4. ✅ Implement Whisper Speaking Grader
5. ✅ Connect NestJS với AI Service
6. ✅ Build FE progress UI cho AI scoring

---

## 📂 Task Structure

### AI Service Tasks (Python)
| Task ID | Name | Priority | Hours |
|---------|------|----------|-------|
| AI-001 | FastAPI Project Setup | P0 | 4h |
| AI-002 | RabbitMQ Integration | P0 | 4h |
| AI-003 | AI Job Queue Schema | P0 | 3h |
| AI-004 | GPT-4 Writing Scorer | P0 | 8h |
| AI-005 | Whisper STT Integration | P0 | 8h |
| AI-006 | Pronunciation Analyzer | P1 | 8h |
| AI-007 | Speaking Scorer Pipeline | P0 | 6h |

### Backend Tasks (NestJS)
| Task ID | Name | Priority | Hours |
|---------|------|----------|-------|
| BE-036 | AI Writing Submit Endpoint | P0 | 4h |
| BE-037 | Writing Job Producer | P0 | 4h |
| BE-038 | Writing Result Callback | P0 | 4h |
| BE-039 | Speaking Audio Upload | P0 | 4h |
| BE-040 | Speaking Job Producer | P0 | 4h |
| BE-041 | Speaking Result Callback | P0 | 4h |

### Frontend Tasks (Next.js)
| Task ID | Name | Priority | Hours |
|---------|------|----------|-------|
| FE-038 | Writing AI Progress UI | P1 | 4h |
| FE-039 | Speaking Record Component | P0 | 6h |
| FE-040 | Speaking AI Progress UI | P1 | 4h |
| FE-041 | AI Feedback Display | P0 | 5h |

---

## 📊 Sprint Summary

| Category | Tasks | Hours |
|----------|-------|-------|
| AI Service | 7 | 41h |
| Backend | 6 | 24h |
| Frontend | 4 | 19h |
| **Total** | **17** | **84h** |

---

## 🔗 Dependencies

```
Phase 1 Complete
      │
      ▼
AI-001 (FastAPI Setup)
      │
      ├──► AI-002 (RabbitMQ)
      │         │
      │         ▼
      │    AI-003 (Job Schema)
      │         │
      ├─────────┼─────────┐
      ▼         ▼         ▼
  BE-036    BE-039    AI-004
  (Writing) (Speaking) (GPT Scorer)
```

---

## ⚠️ Technical Notes

### AI Service là project riêng biệt
- Tách hoàn toàn khỏi NestJS backend
- Communication qua RabbitMQ
- Có thể scale độc lập
- Cần GPU cho Whisper

### FE Component Mapping

> **Xem file:** `FE_COMPONENT_MAPPING.md`

Một số components đã có sẵn:
- `components/writing/WritingExercise.tsx` - Có text editor
- `components/speaking/SpeakingExercise.tsx` - Có audio recorder

**Action:** EXTEND các components này để hiển thị AI progress và feedback.

---

## 🚀 Execution Order

### Week 9: Foundation + Writing
1. AI-001 → AI-002 → AI-003 (Infrastructure)
2. AI-004 (GPT Scorer)
3. BE-036 → BE-037 → BE-038 (NestJS integration)
4. FE-038 (Progress UI)

### Week 10: Speaking
1. AI-005 → AI-006 (Whisper + Pronunciation)
2. AI-007 (Speaking Pipeline)
3. BE-039 → BE-040 → BE-041 (NestJS integration)
4. FE-039 → FE-040 → FE-041 (Frontend)
