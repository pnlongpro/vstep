# 📑 Task Index - VSTEPRO AI Implementation

**Last Updated**: December 21, 2024

---

## 📊 Overview

Toàn bộ project chia thành **3 Phases** với **19 tasks** trong Phase 1 MVP.

### Progress Summary

| Phase | Sprints | Tasks | Status | Completion |
|-------|---------|-------|--------|------------|
| **Phase 1: MVP** | 3 | 19 | 🔴 Not Started | 0% |
| **Phase 2: AI Grading** | 2 | ~10 | ⚪ Planned | 0% |
| **Phase 3: Enterprise** | 2 | ~12 | ⚪ Planned | 0% |
| **Total** | 7 | ~41 | - | 0% |

---

## 🎯 Phase 1: MVP (6 weeks)

### Sprint 01-02: Authentication (Week 1-2)

| ID | Task | Effort | Priority | Status | Assignee |
|----|------|--------|----------|--------|----------|
| **BE-001** | [Database Core Setup](PHASE_1_MVP/SPRINT_01_02_AUTH/BE-001_DB_CORE.md) | 4h | P0 | 🔴 | - |
| **BE-002** | User Entity & Migrations | 3h | P0 | 🔴 | - |
| **BE-003** | Auth Service (Register/Login) | 6h | P0 | 🔴 | - |
| **BE-004** | JWT Strategy & Guards | 4h | P0 | 🔴 | - |
| **FE-001** | Auth API Client | 3h | P0 | 🔴 | - |
| **FE-002** | [Login/Register Pages](PHASE_1_MVP/SPRINT_01_02_AUTH/FE-002_LOGIN_PAGE.md) | 5h | P0 | 🔴 | - |

**Sprint Total**: 25 hours (~3 days)

**QA Checklist**: [AUTH_QA.md](QA_REVIEW/AUTH_QA.md)

---

### Sprint 03-04: Practice Features (Week 3-4)

| ID | Task | Effort | Priority | Status | Assignee |
|----|------|--------|----------|--------|----------|
| **BE-010** | Exercise Schema & Migrations | 5h | P0 | 🔴 | - |
| **BE-011** | Reading Service | 6h | P0 | 🔴 | - |
| **BE-012** | Listening Service | 6h | P0 | 🔴 | - |
| **BE-013** | Question Bank Service | 4h | P1 | 🔴 | - |
| **BE-018** | Auto Grading (Reading/Listening) | 8h | P0 | 🔴 | - |
| **FE-010** | Reading Practice UI | 10h | P0 | 🔴 | - |
| **FE-011** | Listening Practice UI | 10h | P0 | 🔴 | - |
| **FE-012** | Result Display Component | 6h | P0 | 🔴 | - |

**Sprint Total**: 55 hours (~7 days)

**QA Checklist**: PRACTICE_QA.md (to be created)

---

### Sprint 05-06: Results & History (Week 5-6)

| ID | Task | Effort | Priority | Status | Assignee |
|----|------|--------|----------|--------|----------|
| **BE-020** | Result Schema & Migrations | 4h | P0 | 🔴 | - |
| **BE-021** | Scoring Engine | 6h | P0 | 🔴 | - |
| **BE-022** | Progress Tracking Service | 5h | P0 | 🔴 | - |
| **FE-020** | Detailed Result Page | 8h | P0 | 🔴 | - |
| **FE-021** | Progress Dashboard | 10h | P0 | 🔴 | - |

**Sprint Total**: 33 hours (~4 days)

**QA Checklist**: RESULTS_QA.md (to be created)

---

## 🤖 Phase 2: AI Grading (4 weeks)

### Sprint 07-08: AI Infrastructure (Week 7-8)

| ID | Task | Effort | Priority | Status |
|----|------|--------|----------|--------|
| **AI-001** | FastAPI Setup | 6h | P0 | ⚪ |
| **AI-002** | OpenAI Integration | 4h | P0 | ⚪ |
| **AI-003** | Writing Grading Service | 12h | P0 | ⚪ |
| **AI-004** | Speaking Grading Service | 12h | P0 | ⚪ |
| **AI-005** | Whisper Transcription | 8h | P0 | ⚪ |

**Sprint Total**: 42 hours (~5 days)

---

### Sprint 09-10: AI Integration (Week 9-10)

| ID | Task | Effort | Priority | Status |
|----|------|--------|----------|--------|
| **AI-006** | Prompt Engineering | 8h | P0 | ⚪ |
| **AI-007** | Scoring Criteria Implementation | 10h | P0 | ⚪ |
| **FE-030** | Writing Submission UI | 12h | P0 | ⚪ |
| **FE-031** | Speaking Recording UI | 12h | P0 | ⚪ |
| **FE-032** | AI Feedback Display | 8h | P0 | ⚪ |

**Sprint Total**: 50 hours (~6 days)

---

## 🏢 Phase 3: Enterprise (4 weeks)

### Sprint 11-12: Admin Features (Week 11-12)

| ID | Task | Effort | Priority | Status |
|----|------|--------|----------|--------|
| **ADMIN-001** | User Management CRUD | 10h | P0 | ⚪ |
| **ADMIN-002** | Content Management | 12h | P0 | ⚪ |
| **ADMIN-003** | Analytics Dashboard | 14h | P0 | ⚪ |
| **ADMIN-004** | Reporting System | 10h | P1 | ⚪ |

---

### Sprint 13-14: Payment & Deployment (Week 13-14)

| ID | Task | Effort | Priority | Status |
|----|------|--------|----------|--------|
| **PAY-001** | Stripe Integration | 8h | P0 | ⚪ |
| **PAY-002** | Subscription Management | 10h | P0 | ⚪ |
| **PAY-003** | Free Plan Quota System | 8h | P0 | ⚪ |
| **DEPLOY-001** | Production Deployment | 12h | P0 | ⚪ |
| **DEPLOY-002** | Monitoring Setup | 6h | P0 | ⚪ |
| **DEPLOY-003** | Backup & Recovery | 4h | P0 | ⚪ |

---

## 📋 Task Creation Guidelines

### When to Create a New Task

Create new task card when:
- Feature is complex enough (> 2 hours work)
- Multiple dependencies involved
- Requires testing strategy
- Needs documentation
- Affects multiple files

### Task Card Template

```markdown
# [TASK-ID]: Task Title

**Sprint**: XX-XX Name
**Effort**: X hours
**Priority**: P0/P1/P2
**Status**: 🔴/🟡/🟢/⚠️

## Context
Why this task exists

## Requirements
What needs to be done

## Implementation
How to do it (with code examples)

## Testing
How to verify it works

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- TASK-ID-1
- TASK-ID-2
```

---

## 🎯 Priority Levels

| Priority | Meaning | Timeline |
|----------|---------|----------|
| **P0** | Critical - Must have for MVP | This sprint |
| **P1** | Important - Should have | Next sprint |
| **P2** | Nice to have - Could have | Future |

---

## 📊 Status Icons

| Icon | Status | Meaning |
|------|--------|---------|
| 🔴 | Not Started | Chưa bắt đầu |
| 🟡 | In Progress | Đang làm |
| 🟢 | Completed | Đã xong |
| ⚠️ | Blocked | Bị chặn bởi dependency |
| 🔄 | Needs Review | Cần review lại |
| ⚪ | Planned | Đã lên kế hoạch |

---

## 🔗 Quick Links

### Documentation
- [README](README.md) - Getting started guide
- [Global Rules](00_GLOBAL_RULES.md) - Coding standards
- [Project Context](01_PROJECT_CONTEXT.md) - Tech stack & patterns

### Execution Guides
- [Phase 1 Execution Order](PHASE_1_MVP/_EXECUTION_ORDER.md)
- Phase 2 Execution Order (to be created)
- Phase 3 Execution Order (to be created)

### QA Checklists
- [Authentication QA](QA_REVIEW/AUTH_QA.md)
- Practice QA (to be created)
- AI Grading QA (to be created)
- Security QA (to be created)

---

## 🔍 Search by Category

### Backend Tasks

**Database:**
- BE-001: Database Core Setup
- BE-002: User Entity & Migrations
- BE-010: Exercise Schema & Migrations
- BE-020: Result Schema & Migrations

**Services:**
- BE-003: Auth Service
- BE-011: Reading Service
- BE-012: Listening Service
- BE-021: Scoring Engine
- BE-022: Progress Tracking Service

**API:**
- BE-004: JWT Strategy & Guards
- BE-018: Auto Grading Engine

### Frontend Tasks

**Authentication:**
- FE-001: Auth API Client
- FE-002: Login/Register Pages

**Practice:**
- FE-010: Reading Practice UI
- FE-011: Listening Practice UI
- FE-012: Result Display Component

**Results:**
- FE-020: Detailed Result Page
- FE-021: Progress Dashboard

**AI Features:**
- FE-030: Writing Submission UI
- FE-031: Speaking Recording UI
- FE-032: AI Feedback Display

### AI Tasks

- AI-001: FastAPI Setup
- AI-002: OpenAI Integration
- AI-003: Writing Grading Service
- AI-004: Speaking Grading Service
- AI-005: Whisper Transcription
- AI-006: Prompt Engineering
- AI-007: Scoring Criteria Implementation

---

## 📈 Estimated Timeline

```
Week 1-2:   Authentication ✓
Week 3-4:   Practice Features ✓
Week 5-6:   Results & History ✓
            └─> Phase 1 MVP Complete

Week 7-8:   AI Infrastructure ✓
Week 9-10:  AI Integration ✓
            └─> Phase 2 AI Grading Complete

Week 11-12: Admin Features ✓
Week 13-14: Payment & Deployment ✓
            └─> Phase 3 Enterprise Complete

Total: 14 weeks (3.5 months)
```

---

## 🎓 How to Use This Index

### For AI Developers

1. **Start here** to see big picture
2. **Pick a task** based on priority và dependencies
3. **Read task card** for detailed instructions
4. **Follow Global Rules** while implementing
5. **Check QA** before marking complete

### For Human Developers

1. **Review progress** at a glance
2. **Assign tasks** to team members
3. **Track blockers** và dependencies
4. **Monitor velocity** (hours per sprint)
5. **Update status** as work progresses

### For Project Managers

1. **Timeline overview** for planning
2. **Effort estimates** for resource allocation
3. **Dependency map** for critical path
4. **Risk identification** (blocked tasks)
5. **Sprint planning** with clear scope

---

## 🔄 Update Frequency

This index should be updated:
- ✅ **Daily**: Status changes (🔴 → 🟡 → 🟢)
- ✅ **Weekly**: Sprint progress và blockers
- ✅ **Sprint End**: Completion metrics và retrospective
- ✅ **Phase End**: Timeline adjustments

---

## 📞 Support

### For Task Questions
1. Read task card thoroughly
2. Check Global Rules
3. Review Project Context
4. Search similar implementations
5. Ask in team chat if stuck

### For Adding New Tasks
1. Use task template above
2. Follow naming convention (BE-XXX, FE-XXX, AI-XXX)
3. Add to appropriate sprint folder
4. Update this index
5. Notify team of new task

---

**Maintained by**: VSTEPRO Development Team  
**Version**: 1.0.0  
**Next Review**: End of Sprint 01-02
