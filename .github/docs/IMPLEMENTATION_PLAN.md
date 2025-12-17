# 📋 VSTEPRO - Implementation Plan

> **Kế hoạch triển khai hệ thống VSTEPRO**
>
> Version: 1.0  
> Last Updated: 17/12/2024  
> Based on: `/home/longpn/projects/vstep/.github/docs/`

---

## 📑 Mục lục

- [1. Executive Summary](#1-executive-summary)
- [2. Current State Analysis](#2-current-state-analysis)
- [3. Implementation Phases](#3-implementation-phases)
- [4. Sprint Breakdown](#4-sprint-breakdown)
- [5. Technical Specifications](#5-technical-specifications)
- [6. Risk Assessment](#6-risk-assessment)
- [7. Resources & Timeline](#7-resources--timeline)

---

## 1. Executive Summary

### 1.1. Tổng quan dự án

| Attribute | Value |
|-----------|-------|
| **Tên dự án** | VSTEPRO - Vietnamese Standardized Test of English Proficiency Platform |
| **Kiến trúc** | Microservices (NestJS Backend + AI Service Python) |
| **Frontend** | Next.js + React + TypeScript + TailwindCSS |
| **Database** | MySQL 8.0+ + Redis (cache) + S3 (storage) |
| **Tổng modules** | 22+ modules |
| **Tổng database tables** | ~74 tables |
| **Tổng API endpoints** | 80+ endpoints |

### 1.2. Mục tiêu Implementation

```
┌────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION GOAL                         │
├────────────────────────────────────────────────────────────────┤
│  MVP (8 tuần)     → Core features hoạt động                    │
│  Phase 2 (6 tuần) → Advanced features + Teacher portal         │
│  Phase 3 (6 tuần) → Admin panel + Mobile + Payment             │
│  Phase 4 (4 tuần) → Optimization + Scale + Launch              │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Current State Analysis

### 2.1. Backend Status

| Component | Status | Notes |
|-----------|--------|-------|
| Project Structure | ✅ Done | NestJS skeleton created |
| Database Module | ✅ Done | TypeORM configured |
| Auth Module | ⚠️ Partial | Basic structure, needs completion |
| Users Module | ⚠️ Partial | Basic structure, needs completion |
| Practice Module | 🔴 Empty | Module declared, no implementation |
| Exams Module | 🔴 Empty | Module declared, no implementation |
| Classes Module | 🔴 Empty | Module declared, no implementation |
| Gamification Module | 🔴 Empty | Module declared, no implementation |
| Notifications Module | 🔴 Empty | Module declared, no implementation |
| Guards (JWT/Roles) | ✅ Done | Working |
| Migrations | ⚠️ Partial | Basic tables only |

### 2.2. Frontend Status

| Component | Status | Notes |
|-----------|--------|-------|
| Project Structure | ✅ Done | Next.js 14 configured |
| Auth Pages | ⚠️ Partial | Routes exist |
| Dashboard Layout | ✅ Done | Responsive sidebar |
| Student Pages | ⚠️ Partial | Routes exist, no API integration |
| Teacher Pages | ⚠️ Partial | Routes exist |
| Admin Pages | ⚠️ Partial | Routes exist |
| API Services | 🔴 Minimal | Basic axios setup only |
| State Management | ⚠️ Partial | Redux/Zustand setup |

### 2.3. Gap Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                      IMPLEMENTATION GAP                         │
├─────────────────────────────────────────────────────────────────┤
│ Backend:                                                        │
│   • 74 database tables → ~10 tables exist (~13%)                │
│   • 80+ API endpoints → ~5 endpoints exist (~6%)                │
│   • 22 modules → 7 declared, 0 fully implemented (0%)           │
│                                                                 │
│ Frontend:                                                       │
│   • UI components from UI-Template ready to migrate             │
│   • 50+ screens documented → ~10 integrated (~20%)              │
│   • API integration: ~5%                                        │
│                                                                 │
│ AI Service:                                                     │
│   • Not started (0%)                                            │
│   • Requires separate Python FastAPI project                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Phases

### 3.1. Phase Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         IMPLEMENTATION ROADMAP                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PHASE 1: MVP (8 weeks)                                                  │
│  ├─ Sprint 1-2: Core Infrastructure + Auth                               │
│  ├─ Sprint 3-4: Practice System (Reading/Listening)                      │
│  ├─ Sprint 5-6: Exam System + Auto Grading                               │
│  └─ Sprint 7-8: Student Dashboard + Integration                          │
│                                                                          │
│  PHASE 2: Advanced Features (6 weeks)                                    │
│  ├─ Sprint 9-10: AI Writing/Speaking Grading                             │
│  ├─ Sprint 11-12: Class Management + Teacher Portal                      │
│  └─ Sprint 13-14: Assignment System                                      │
│                                                                          │
│  PHASE 3: Enterprise (6 weeks)                                           │
│  ├─ Sprint 15-16: Admin Panel + User Management                          │
│  ├─ Sprint 17-18: Gamification + Notifications                           │
│  └─ Sprint 19-20: Payment + Subscription                                 │
│                                                                          │
│  PHASE 4: Scale & Launch (4 weeks)                                       │
│  ├─ Sprint 21-22: Performance Optimization                               │
│  └─ Sprint 23-24: Security Audit + Launch                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Sprint Breakdown

### PHASE 1: MVP (8 weeks)

---

#### Sprint 1-2: Core Infrastructure + Authentication

**Duration**: 2 weeks  
**Goal**: Foundation layer hoàn chỉnh

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-001 | Database schema: Core tables (users, roles, permissions, sessions, profiles) | P0 | 16h | 23-DATABASE |
| BE-002 | User entity + repository | P0 | 8h | 05-USER |
| BE-003 | Auth service (register, login, logout) | P0 | 16h | 01-AUTH |
| BE-004 | JWT strategy + refresh token | P0 | 8h | 01-AUTH |
| BE-005 | Password reset flow | P1 | 8h | 01-AUTH |
| BE-006 | Email verification | P1 | 8h | 01-AUTH |
| BE-007 | OAuth2 integration (Google) | P2 | 8h | 01-AUTH |
| BE-008 | Session management | P1 | 8h | 01-AUTH |
| BE-009 | Login history tracking | P2 | 4h | 01-AUTH |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-001 | Auth API service integration | P0 | 8h | 01-AUTH |
| FE-002 | Login page (form, validation, error handling) | P0 | 8h | 01-AUTH |
| FE-003 | Register page + email verify | P0 | 8h | 01-AUTH |
| FE-004 | Forgot password flow | P1 | 6h | 01-AUTH |
| FE-005 | Protected route wrapper | P0 | 4h | 01-AUTH |
| FE-006 | Auth context/store | P0 | 6h | 01-AUTH |
| FE-007 | Google OAuth button | P2 | 4h | 01-AUTH |

**Database Tables**:
```sql
-- Sprint 1-2 Tables
users, user_profiles, user_stats, user_settings
roles, permissions, role_permissions
sessions, login_history, password_reset_tokens
```

**API Endpoints**:
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email
GET    /auth/me
```

**Deliverables**:
- [ ] User registration + login working
- [ ] JWT auth flow complete
- [ ] Password reset via email
- [ ] Session management
- [ ] Auth pages integrated

---

#### Sprint 3-4: Practice System (Reading/Listening)

**Duration**: 2 weeks  
**Goal**: Core practice functionality

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-010 | Database schema: Exercises, Questions, Passages | P0 | 16h | 23-DATABASE |
| BE-011 | Exercise entity + CRUD service | P0 | 12h | 02-PRACTICE |
| BE-012 | Question entity + types (MCQ, TF, Fill-blank, Matching) | P0 | 12h | 02-PRACTICE |
| BE-013 | Passage entity for reading/listening | P0 | 8h | 02-PRACTICE |
| BE-014 | Exercise submission entity | P0 | 8h | 02-PRACTICE |
| BE-015 | Auto-save submission (draft) | P1 | 8h | 02-PRACTICE |
| BE-016 | Reading exercise flow | P0 | 12h | 02-PRACTICE |
| BE-017 | Listening exercise flow | P0 | 12h | 02-PRACTICE |
| BE-018 | Auto-grading service (R/L) | P0 | 16h | 04-GRADING |
| BE-019 | Exercise result calculation | P0 | 8h | 04-GRADING |
| BE-020 | S3 media upload (audio files) | P1 | 8h | 08-MATERIALS |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-008 | Practice home page | P0 | 8h | 02-PRACTICE |
| FE-009 | Exercise list component | P0 | 8h | 02-PRACTICE |
| FE-010 | Reading exercise interface | P0 | 16h | 02-PRACTICE |
| FE-011 | Listening exercise interface | P0 | 16h | 02-PRACTICE |
| FE-012 | Question types renderer (MCQ, TF, etc.) | P0 | 12h | 02-PRACTICE |
| FE-013 | Timer component | P0 | 4h | 02-PRACTICE |
| FE-014 | Auto-save hook | P1 | 6h | 02-PRACTICE |
| FE-015 | Result display page | P0 | 8h | 02-PRACTICE |
| FE-016 | Audio player component | P0 | 8h | 02-PRACTICE |

**Database Tables**:
```sql
-- Sprint 3-4 Tables
exercises, passages, questions, question_options, question_groups
exercise_submissions, exercise_submission_answers
```

**API Endpoints**:
```
GET    /exercises
GET    /exercises/:id
GET    /exercises/skill/:skill
POST   /exercises/:id/start
POST   /exercises/:id/submit
POST   /exercises/:id/auto-save
GET    /exercises/:id/result
GET    /submissions
GET    /submissions/:id
```

**Deliverables**:
- [ ] Reading practice complete
- [ ] Listening practice complete
- [ ] Auto-grading working
- [ ] Auto-save functional
- [ ] Result display with feedback

---

#### Sprint 5-6: Mock Exam System

**Duration**: 2 weeks  
**Goal**: Full mock exam functionality

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-021 | Database schema: Exams, Sections, Mock Exams | P0 | 12h | 23-DATABASE |
| BE-022 | Exam entity (exam sets) | P0 | 8h | 03-EXAM |
| BE-023 | Exam section entity | P0 | 6h | 03-EXAM |
| BE-024 | Exam-question linking | P0 | 8h | 03-EXAM |
| BE-025 | Mock exam entity | P0 | 8h | 03-EXAM |
| BE-026 | Random exam selection algorithm | P0 | 12h | 03-EXAM |
| BE-027 | Mock exam timer enforcement | P0 | 8h | 03-EXAM |
| BE-028 | Auto-submit on timeout | P0 | 8h | 03-EXAM |
| BE-029 | Mock exam scoring | P0 | 12h | 03-EXAM |
| BE-030 | Certificate generation | P2 | 12h | 03-EXAM |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-017 | Mock exam entry page | P0 | 8h | 03-EXAM |
| FE-018 | Pre-exam instructions modal | P0 | 6h | 03-EXAM |
| FE-019 | Exam interface (full screen) | P0 | 16h | 03-EXAM |
| FE-020 | Skill transition modal | P0 | 6h | 03-EXAM |
| FE-021 | Global timer (172 min) | P0 | 8h | 03-EXAM |
| FE-022 | Auto-submit logic | P0 | 6h | 03-EXAM |
| FE-023 | Mock exam result page | P0 | 12h | 03-EXAM |
| FE-024 | Certificate display | P2 | 8h | 03-EXAM |

**Database Tables**:
```sql
-- Sprint 5-6 Tables
exams, exam_sections, exam_questions
mock_exams, mock_exam_answers, exam_settings
certificates
```

**API Endpoints**:
```
GET    /exams
GET    /exams/:id
POST   /mock-exams/start
GET    /mock-exams/:id
POST   /mock-exams/:id/submit
POST   /mock-exams/:id/auto-save
GET    /mock-exams/:id/result
GET    /certificates/:id
GET    /certificates/verify/:code
```

**Deliverables**:
- [ ] Random exam selection working
- [ ] Full mock exam flow (4 skills)
- [ ] Timer + auto-submit
- [ ] Comprehensive results
- [ ] Certificate generation

---

#### Sprint 7-8: Student Dashboard + Integration

**Duration**: 2 weeks  
**Goal**: Complete student experience

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-031 | Student stats aggregation | P0 | 12h | 09-STUDENT-DASHBOARD |
| BE-032 | Progress tracking service | P0 | 12h | 09-STUDENT-DASHBOARD |
| BE-033 | History listing | P0 | 8h | 09-STUDENT-DASHBOARD |
| BE-034 | Student profile management | P0 | 8h | 05-USER |
| BE-035 | Bookmarks service | P2 | 6h | 02-PRACTICE |
| BE-036 | Study streak calculation | P1 | 8h | 22-GAMIFICATION |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-025 | Student dashboard home | P0 | 12h | 09-STUDENT-DASHBOARD |
| FE-026 | Progress charts (skill radar, trend line) | P0 | 12h | 19-STATISTICS |
| FE-027 | History page | P0 | 8h | 09-STUDENT-DASHBOARD |
| FE-028 | Profile page | P0 | 8h | 05-USER |
| FE-029 | Settings page | P1 | 6h | 05-USER |
| FE-030 | Schedule view (read-only) | P2 | 8h | 15-SCHEDULE |
| FE-031 | Responsive sidebar | P0 | 6h | 09-STUDENT-DASHBOARD |

**API Endpoints**:
```
GET    /students/me/stats
GET    /students/me/progress
GET    /students/me/history
GET    /students/me/schedule
PUT    /users/me/profile
PUT    /users/me/settings
GET    /users/me/bookmarks
POST   /users/me/bookmarks
```

**Deliverables**:
- [ ] Dashboard with stats
- [ ] Progress tracking
- [ ] History page
- [ ] Profile management
- [ ] MVP release ready

---

### PHASE 2: Advanced Features (6 weeks)

---

#### Sprint 9-10: AI Grading System (Writing/Speaking)

**Duration**: 2 weeks  
**Goal**: AI grading for W/S skills

**AI Service Tasks** (Python FastAPI):

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| AI-001 | FastAPI project setup | P0 | 8h | 04-GRADING |
| AI-002 | Writing grading endpoint | P0 | 24h | 04-GRADING |
| AI-003 | Speaking grading endpoint | P0 | 32h | 04-GRADING |
| AI-004 | OpenAI/LLM integration | P0 | 16h | 04-GRADING |
| AI-005 | Queue worker (RabbitMQ) | P0 | 12h | 04-GRADING |
| AI-006 | Audio transcription (Whisper) | P0 | 16h | 04-GRADING |
| AI-007 | Scoring criteria implementation | P0 | 16h | 04-GRADING |
| AI-008 | Feedback generation | P0 | 12h | 04-GRADING |

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-037 | AI grading queue producer | P0 | 12h | 04-GRADING |
| BE-038 | AI result receiver | P0 | 8h | 04-GRADING |
| BE-039 | Writing submission handling | P0 | 8h | 02-PRACTICE |
| BE-040 | Speaking submission + audio upload | P0 | 12h | 02-PRACTICE |
| BE-041 | Grading result entity | P0 | 8h | 04-GRADING |
| BE-042 | AI grading logs | P1 | 6h | 04-GRADING |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-032 | Writing exercise interface | P0 | 16h | 02-PRACTICE |
| FE-033 | Speaking exercise interface | P0 | 20h | 02-PRACTICE |
| FE-034 | Voice recorder component | P0 | 12h | 02-PRACTICE |
| FE-035 | AI result display (detailed feedback) | P0 | 12h | 04-GRADING |
| FE-036 | Loading states for AI grading | P0 | 4h | 04-GRADING |

**Database Tables**:
```sql
-- Sprint 9-10 Tables
grading_results, ai_grading_logs
audio_storage
```

**Deliverables**:
- [ ] Writing AI grading working
- [ ] Speaking AI grading working
- [ ] Voice recording functional
- [ ] Detailed feedback display
- [ ] Queue system operational

---

#### Sprint 11-12: Class Management + Teacher Portal

**Duration**: 2 weeks  
**Goal**: Teacher features complete

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-043 | Class entity + CRUD | P0 | 12h | 06-CLASS |
| BE-044 | Class invitation system (code, link, email) | P0 | 12h | 06-CLASS |
| BE-045 | Class student management | P0 | 8h | 06-CLASS |
| BE-046 | Class schedule entity | P0 | 8h | 15-SCHEDULE |
| BE-047 | Attendance entity + service | P0 | 12h | 14-ATTENDANCE |
| BE-048 | Teacher profile/stats | P0 | 8h | 13-TEACHER-DASHBOARD |
| BE-049 | Materials upload | P0 | 8h | 08-MATERIALS |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-037 | Teacher dashboard home | P0 | 12h | 13-TEACHER-DASHBOARD |
| FE-038 | Class list page | P0 | 8h | 06-CLASS |
| FE-039 | Create class modal | P0 | 8h | 06-CLASS |
| FE-040 | Class detail page (tabs) | P0 | 16h | 06-CLASS |
| FE-041 | Student management tab | P0 | 8h | 06-CLASS |
| FE-042 | Schedule manager | P0 | 16h | 15-SCHEDULE |
| FE-043 | Attendance page | P0 | 12h | 14-ATTENDANCE |
| FE-044 | Materials upload | P0 | 8h | 08-MATERIALS |
| FE-045 | Class invitation UI | P0 | 8h | 06-CLASS |

**Database Tables**:
```sql
-- Sprint 11-12 Tables
classes, class_teachers, class_students, class_invitations
class_schedule, class_sessions
attendance_sessions, attendance_records
materials
```

**API Endpoints**:
```
# Classes
POST   /classes
GET    /classes
GET    /classes/:id
PUT    /classes/:id
DELETE /classes/:id
POST   /classes/:id/invite
POST   /classes/join
GET    /classes/:id/students
POST   /classes/:id/students
DELETE /classes/:id/students/:userId

# Schedule
GET    /classes/:id/schedule
POST   /classes/:id/schedule
PUT    /classes/:id/schedule/:sessionId
DELETE /classes/:id/schedule/:sessionId

# Attendance
GET    /classes/:id/attendance
POST   /classes/:id/attendance
PUT    /attendance/:id
```

**Deliverables**:
- [ ] Teacher can create/manage classes
- [ ] Invitation system working
- [ ] Schedule management
- [ ] Attendance tracking
- [ ] Materials management

---

#### Sprint 13-14: Assignment System

**Duration**: 2 weeks  
**Goal**: Assignment workflow complete

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-050 | Assignment entity + CRUD | P0 | 12h | 07-ASSIGNMENT |
| BE-051 | Assignment submission entity | P0 | 8h | 07-ASSIGNMENT |
| BE-052 | Assignment grading (auto/manual) | P0 | 12h | 07-ASSIGNMENT |
| BE-053 | Due date reminders | P1 | 8h | 20-NOTIFICATION |
| BE-054 | Assignment statistics | P1 | 8h | 07-ASSIGNMENT |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-046 | Assignment creator (3 steps) | P0 | 16h | 07-ASSIGNMENT |
| FE-047 | Assignment list (teacher view) | P0 | 8h | 07-ASSIGNMENT |
| FE-048 | Assignment detail (teacher) | P0 | 12h | 07-ASSIGNMENT |
| FE-049 | Assignment grading interface | P0 | 12h | 07-ASSIGNMENT |
| FE-050 | Assignment list (student view) | P0 | 8h | 07-ASSIGNMENT |
| FE-051 | Assignment submission interface | P0 | 12h | 07-ASSIGNMENT |

**Database Tables**:
```sql
-- Sprint 13-14 Tables
assignments, assignment_exercises
assignment_submissions, assignment_grades
```

**Deliverables**:
- [ ] Teacher can create assignments
- [ ] Student can submit assignments
- [ ] Auto/manual grading
- [ ] Progress tracking

---

### PHASE 3: Enterprise Features (6 weeks)

---

#### Sprint 15-16: Admin Panel + User Management

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-055 | Admin user CRUD | P0 | 12h | 05-USER |
| BE-056 | Role management | P0 | 8h | 05-USER |
| BE-057 | System statistics | P0 | 12h | 16-ADMIN-DASHBOARD |
| BE-058 | Exam approval workflow | P0 | 12h | 17-EXAM-APPROVAL |
| BE-059 | System configuration | P1 | 8h | 18-SYSTEM-CONFIG |
| BE-060 | Audit logging | P1 | 8h | 18-SYSTEM-CONFIG |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-052 | Admin dashboard overview | P0 | 12h | 16-ADMIN-DASHBOARD |
| FE-053 | User management page | P0 | 16h | 05-USER |
| FE-054 | Exam bank + approval | P0 | 16h | 17-EXAM-APPROVAL |
| FE-055 | System configuration UI | P1 | 12h | 18-SYSTEM-CONFIG |
| FE-056 | Transaction logs | P2 | 8h | 16-ADMIN-DASHBOARD |

---

#### Sprint 17-18: Gamification + Notifications

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-061 | Badge system | P0 | 16h | 22-GAMIFICATION |
| BE-062 | Goal system | P0 | 12h | 12-ACHIEVEMENTS |
| BE-063 | Points/XP calculation | P0 | 8h | 22-GAMIFICATION |
| BE-064 | Leaderboard | P1 | 8h | 22-GAMIFICATION |
| BE-065 | Notification service | P0 | 12h | 20-NOTIFICATION |
| BE-066 | WebSocket gateway | P0 | 12h | 20-NOTIFICATION |
| BE-067 | Email notification | P1 | 8h | 20-NOTIFICATION |
| BE-068 | Push notification | P2 | 8h | 20-NOTIFICATION |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-057 | Achievements page | P0 | 12h | 12-ACHIEVEMENTS |
| FE-058 | Badge display components | P0 | 8h | 22-GAMIFICATION |
| FE-059 | Goal setting modal | P0 | 8h | 12-ACHIEVEMENTS |
| FE-060 | Leaderboard page | P1 | 8h | 22-GAMIFICATION |
| FE-061 | Notification center | P0 | 12h | 20-NOTIFICATION |
| FE-062 | Bell icon with badge | P0 | 4h | 20-NOTIFICATION |
| FE-063 | Toast notifications | P0 | 4h | 20-NOTIFICATION |

---

#### Sprint 19-20: Payment + Messaging

**Backend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| BE-069 | Subscription plans | P0 | 12h | 23-DATABASE |
| BE-070 | VNPay integration | P0 | 16h | - |
| BE-071 | MoMo integration | P1 | 12h | - |
| BE-072 | Transaction management | P0 | 8h | - |
| BE-073 | Invoice generation | P1 | 8h | - |
| BE-074 | Messaging system | P0 | 16h | 21-MESSAGING |
| BE-075 | Conversation management | P0 | 8h | 21-MESSAGING |

**Frontend Tasks**:

| Task ID | Task | Priority | Est. Hours | Module Doc |
|---------|------|----------|------------|------------|
| FE-064 | Pricing page | P0 | 8h | - |
| FE-065 | Checkout flow | P0 | 12h | - |
| FE-066 | Payment success/fail pages | P0 | 4h | - |
| FE-067 | Subscription management | P0 | 8h | - |
| FE-068 | Messages page | P0 | 16h | 21-MESSAGING |
| FE-069 | Chat interface | P0 | 12h | 21-MESSAGING |

---

### PHASE 4: Scale & Launch (4 weeks)

---

#### Sprint 21-22: Performance Optimization

**Tasks**:

| Task ID | Task | Priority | Est. Hours |
|---------|------|----------|------------|
| OPT-001 | Database query optimization | P0 | 16h |
| OPT-002 | Redis caching implementation | P0 | 12h |
| OPT-003 | CDN setup for static assets | P0 | 8h |
| OPT-004 | Image optimization | P1 | 8h |
| OPT-005 | Bundle size optimization (FE) | P0 | 12h |
| OPT-006 | Lazy loading implementation | P1 | 8h |
| OPT-007 | Database indexing review | P0 | 8h |
| OPT-008 | Load testing | P0 | 12h |
| OPT-009 | Performance monitoring setup | P0 | 8h |

---

#### Sprint 23-24: Security Audit + Launch

**Tasks**:

| Task ID | Task | Priority | Est. Hours |
|---------|------|----------|------------|
| SEC-001 | Security audit | P0 | 24h |
| SEC-002 | Penetration testing | P0 | 16h |
| SEC-003 | OWASP compliance check | P0 | 12h |
| SEC-004 | API rate limiting | P0 | 8h |
| SEC-005 | Backup strategy implementation | P0 | 8h |
| SEC-006 | Monitoring & alerting | P0 | 12h |
| SEC-007 | Documentation finalization | P1 | 16h |
| SEC-008 | Staging deployment | P0 | 8h |
| SEC-009 | Production deployment | P0 | 12h |
| SEC-010 | Launch checklist verification | P0 | 8h |

---

## 5. Technical Specifications

### 5.1. Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 14.x |
| | React | 18.x |
| | TypeScript | 5.x |
| | TailwindCSS | 4.x |
| | Zustand/Redux | Latest |
| **Backend** | NestJS | 10.x |
| | TypeScript | 5.x |
| | TypeORM | 0.3.x |
| **AI Service** | Python | 3.11+ |
| | FastAPI | 0.100+ |
| | OpenAI | Latest |
| **Database** | MySQL | 8.0+ |
| | Redis | 7.x |
| **Storage** | AWS S3 / MinIO | - |
| **Queue** | RabbitMQ | 3.x |
| **Deployment** | Docker | Latest |
| | Kubernetes (optional) | - |

### 5.2. Database Summary

| Category | Tables Count | Key Tables |
|----------|--------------|------------|
| Core User | 6 | users, user_profiles, sessions |
| Student | 8 | student_profiles, student_progress |
| Teacher | 6 | teacher_profiles, teacher_stats |
| Class | 9 | classes, class_students, attendance |
| Content | 5 | courses, lessons, materials |
| Exam | 8 | exercises, questions, exams |
| Submission | 5 | exercise_submissions, grading_results |
| Mock Exam | 3 | mock_exams, certificates |
| Gamification | 6 | badges, user_badges, goals |
| Notification | 7 | notifications, messages |
| Admin | 5 | audit_logs, system_settings |
| Payment | 6 | transactions, subscriptions |
| **Total** | **~74** | - |

### 5.3. API Endpoints Summary

| Module | Endpoints Count |
|--------|-----------------|
| Auth | 9 |
| Users | 8 |
| Practice | 10 |
| Exams | 12 |
| Classes | 15 |
| Assignments | 8 |
| Gamification | 6 |
| Notifications | 5 |
| Messaging | 5 |
| Admin | 10 |
| **Total** | **~88** |

---

## 6. Risk Assessment

### 6.1. Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI grading latency | High | High | Queue system + caching |
| Database performance | Medium | High | Proper indexing + read replicas |
| Audio storage costs | Medium | Medium | Compression + cleanup policies |
| OpenAI API costs | High | Medium | Token optimization + caching |
| WebSocket scaling | Medium | Medium | Redis pub/sub |

### 6.2. Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | High | High | Strict sprint boundaries |
| Resource shortage | Medium | High | Prioritize MVP features |
| Integration delays | Medium | Medium | Early API contracts |
| Testing gaps | Medium | High | Continuous testing |

---

## 7. Resources & Timeline

### 7.1. Team Structure (Recommended)

| Role | Count | Responsibilities |
|------|-------|-----------------|
| Tech Lead | 1 | Architecture, code review, decisions |
| Backend Developer | 2 | NestJS API, database |
| Frontend Developer | 2 | Next.js, React components |
| AI Engineer | 1 | Python AI service |
| DevOps | 1 | CI/CD, deployment, infrastructure |
| QA | 1 | Testing, quality assurance |

### 7.2. Timeline Summary

| Phase | Duration | Sprints | Deliverable |
|-------|----------|---------|-------------|
| **Phase 1: MVP** | 8 weeks | 1-8 | Core platform working |
| **Phase 2: Advanced** | 6 weeks | 9-14 | AI + Teacher features |
| **Phase 3: Enterprise** | 6 weeks | 15-20 | Admin + Payment |
| **Phase 4: Launch** | 4 weeks | 21-24 | Production ready |
| **Total** | **24 weeks** | **24** | **Full platform** |

### 7.3. Milestones

```
Week 8  → MVP Release (Internal)
Week 14 → Beta Release (Limited users)
Week 20 → Feature Complete
Week 24 → Production Launch
```

---

## 📎 Appendix

### A. Reference Documents

| Document | Path |
|----------|------|
| System Overview | `00-SYSTEM-OVERVIEW.md` |
| Authentication | `01-MODULE-AUTHENTICATION.md` |
| Practice Learning | `02-MODULE-PRACTICE-LEARNING.md` |
| Exam System | `03-MODULE-EXAM-SYSTEM.md` |
| Grading System | `04-MODULE-GRADING-SYSTEM.md` |
| User Management | `05-MODULE-USER-MANAGEMENT.md` |
| Class Management | `06-MODULE-CLASS-MANAGEMENT.md` |
| Assignment Management | `07-MODULE-ASSIGNMENT-MANAGEMENT.md` |
| Student Dashboard | `09-MODULE-STUDENT-DASHBOARD.md` |
| Teacher Dashboard | `13-MODULE-TEACHER-DASHBOARD.md` |
| Admin Dashboard | `16-MODULE-ADMIN-DASHBOARD.md` |
| Gamification | `22-MODULE-GAMIFICATION.md` |
| Database Design | `23-DATABASE-DESIGN_NEW.md` |
| API Specification | `24-API-SPECIFICATION.md` |
| Non-functional Req | `27-NON-FUNCTIONAL-REQUIREMENTS.md` |

### B. Quick Start Commands

```bash
# Backend
cd BE
npm install
npm run migration:run
npm run start:dev

# Frontend
cd FE
npm install
npm run dev

# AI Service (Phase 2)
cd AI
pip install -r requirements.txt
uvicorn main:app --reload
```

---

**Document Version**: 1.0  
**Created**: 17/12/2024  
**Status**: Ready for Review  
**Next Review**: After Sprint 1-2 completion
