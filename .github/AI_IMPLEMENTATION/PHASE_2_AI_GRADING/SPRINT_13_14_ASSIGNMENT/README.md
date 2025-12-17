# Sprint 13-14: Assignment System

## 🎯 Sprint Goal

Xây dựng hệ thống Bài tập (Assignment) hoàn chỉnh cho giáo viên giao bài và học viên làm bài:

- **BE**: Assignment entity, CRUD, submission system, grading
- **FE**: Assignment creation UI, question selector, student submission view

---

## 📋 Task Overview

| Task ID | Loại | Tên Task | Priority | Hours |
|---------|------|----------|----------|-------|
| BE-050 | 🔧 BE | Assignment Entity & Migration | P0 | 4h |
| BE-051 | 🔧 BE | Assignment CRUD Service | P0 | 6h |
| BE-052 | 🔧 BE | Assignment Submission System | P0 | 6h |
| BE-053 | 🔧 BE | Assignment Notification | P1 | 4h |
| FE-051 | 🎨 FE | Assignment List Page | P0 | 5h |
| FE-052 | 🎨 FE | Create Assignment Modal | P0 | 8h |
| FE-053 | 🎨 FE | Question Selector Component | P0 | 6h |
| FE-054 | 🎨 FE | Assignment Detail Page | P0 | 6h |
| FE-055 | 🎨 FE | Student Assignment View | P0 | 6h |
| FE-056 | 🎨 FE | Assignment Submission Review | P1 | 5h |

**Tổng**: 4 BE tasks + 6 FE tasks = **56 giờ**

---

## 🗃️ Database Schema

### Assignments Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| class_id | UUID | FK → classes.id, ON DELETE CASCADE |
| created_by | UUID | FK → users.id (teacher) |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| skill | ENUM | 'reading', 'listening', 'writing', 'speaking' |
| level | ENUM | 'A2', 'B1', 'B2', 'C1' |
| due_date | DATETIME | NOT NULL |
| time_limit | INT | Minutes, nullable (unlimited if null) |
| max_attempts | INT | Default 1 |
| status | ENUM | 'draft', 'published', 'closed' |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Assignment Questions Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| assignment_id | UUID | FK → assignments.id, ON DELETE CASCADE |
| question_id | UUID | FK → questions.id |
| order_index | INT | Position in assignment |

### Assignment Submissions Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| assignment_id | UUID | FK → assignments.id |
| student_id | UUID | FK → users.id |
| status | ENUM | 'in_progress', 'submitted', 'graded' |
| started_at | DATETIME | |
| submitted_at | DATETIME | Nullable |
| attempt_number | INT | 1, 2, 3... |
| score | DECIMAL(4,2) | Nullable |
| teacher_feedback | TEXT | Nullable |
| created_at | DATETIME | |

### Submission Answers Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| submission_id | UUID | FK → assignment_submissions.id |
| question_id | UUID | FK → questions.id |
| answer | TEXT | Student's answer |
| is_correct | BOOLEAN | Nullable (for objective questions) |
| score | DECIMAL(4,2) | For subjective questions |
| ai_feedback | JSON | AI scoring result if applicable |
| created_at | DATETIME | |

---

## 🔗 API Endpoints

### Assignments (Teacher)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/classes/:classId/assignments | List assignments in class |
| POST | /api/classes/:classId/assignments | Create new assignment |
| GET | /api/assignments/:id | Get assignment details |
| PUT | /api/assignments/:id | Update assignment |
| DELETE | /api/assignments/:id | Delete assignment (soft) |
| POST | /api/assignments/:id/publish | Publish assignment |
| POST | /api/assignments/:id/close | Close assignment |
| GET | /api/assignments/:id/submissions | List all submissions |

### Submissions (Student)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students/assignments | List my assignments (all classes) |
| POST | /api/assignments/:id/start | Start an attempt |
| GET | /api/submissions/:id | Get my submission |
| PUT | /api/submissions/:id | Save answers |
| POST | /api/submissions/:id/submit | Submit final answers |

### Grading (Teacher)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/submissions/:id | Get submission for grading |
| PUT | /api/submissions/:id/grade | Grade submission |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Teacher FE     │────▶│  Assignments    │
│  - Create/Edit  │     │  Controller     │
│  - Review       │     └────────┬────────┘
└─────────────────┘              │
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│  Student FE     │────▶│  Submissions    │
│  - Do homework  │     │  Controller     │
│  - View result  │     └────────┬────────┘
└─────────────────┘              │
                                 ▼
                        ┌─────────────────┐
                        │  AI Service     │
                        │  (Writing/Spkg) │
                        └─────────────────┘
```

---

## 📱 UI Screens

### Teacher Views
1. **Assignment List**: Table với filters (skill, status, due date)
2. **Create Assignment**: Modal với question selector
3. **Assignment Detail**: Overview + submissions list
4. **Submission Review**: Student answers + grading form

### Student Views
1. **My Assignments**: Grid cards với due dates
2. **Do Assignment**: Test-taking interface
3. **View Result**: Scores + feedback

---

## ⚙️ Business Rules

1. **Status Flow**:
   - `draft` → `published` → `closed`
   - Cannot go backwards
   - Cannot edit after published (except extending due date)

2. **Attempts**:
   - Default 1 attempt
   - Teacher can allow multiple attempts
   - Best score or last score (configurable)

3. **Due Date**:
   - Late submissions marked with flag
   - Can be extended by teacher
   - Auto-close option available

4. **Grading**:
   - R/L questions: Auto-graded
   - Writing: AI first, then teacher review
   - Speaking: AI first, then teacher review

---

## 📁 File Structure

```
# Backend
src/modules/assignments/
├── entities/
│   ├── assignment.entity.ts
│   ├── assignment-question.entity.ts
│   ├── assignment-submission.entity.ts
│   └── submission-answer.entity.ts
├── dto/
│   ├── create-assignment.dto.ts
│   ├── update-assignment.dto.ts
│   ├── submit-answer.dto.ts
│   └── grade-submission.dto.ts
├── assignments.service.ts
├── submissions.service.ts
├── assignments.controller.ts
├── submissions.controller.ts
└── assignments.module.ts

# Frontend
src/features/teacher/assignments/
├── components/
│   ├── AssignmentListContainer.tsx
│   ├── CreateAssignmentModal.tsx
│   ├── QuestionSelector.tsx
│   ├── AssignmentDetailContainer.tsx
│   └── SubmissionReviewContainer.tsx
├── hooks/
│   ├── useAssignments.ts
│   └── useSubmissions.ts
└── types.ts

src/features/student/assignments/
├── components/
│   ├── StudentAssignmentList.tsx
│   ├── DoAssignmentContainer.tsx
│   └── AssignmentResultContainer.tsx
└── hooks/
    └── useStudentAssignments.ts
```

---

## 📆 Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| Week 1 | BE-050, BE-051, FE-051, FE-052 | Entity + CRUD + List + Create |
| Week 2 | BE-052, FE-053, FE-054 | Submission + Question Selector + Detail |
| Week 3 | BE-053, FE-055, FE-056 | Notification + Student View + Review |

---

## 🎓 Dependencies

- Sprint 11-12: Class Management (classes, students)
- Sprint 09-10: AI Service (for W/S scoring)
- Phase 1: Question Bank, Exam Attempts
