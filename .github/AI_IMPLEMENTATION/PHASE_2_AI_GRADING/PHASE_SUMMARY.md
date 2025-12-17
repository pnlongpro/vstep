# PHASE 2: AI Grading & Class Management

> **Duration**: 6 tuần (Sprint 09-14)
> **Focus**: AI Service integration, Teacher Portal, Assignment System

---

## 🎯 Phase Overview

Phase 2 tập trung vào:
1. **AI Grading Service** - Tích hợp chấm điểm tự động Writing/Speaking
2. **Class Management** - Teacher portal quản lý lớp học
3. **Assignment System** - Hệ thống giao bài và theo dõi

---

## 📂 Sprint Structure

```
PHASE_2_AI_GRADING/
├── PHASE_SUMMARY.md           # File này
├── _EXECUTION_ORDER.md        # Thứ tự thực hiện
├── _AI_ARCHITECTURE.md        # Kiến trúc AI Service
│
├── SPRINT_09_10_AI_SERVICE/   # AI Grading (2 tuần)
│   ├── README.md
│   ├── BE-036 to BE-043       # Backend tasks
│   └── FE-038 to FE-043       # Frontend tasks
│
├── SPRINT_11_12_CLASS/        # Class Management (2 tuần)
│   ├── README.md
│   ├── BE-044 to BE-051       # Backend tasks
│   └── FE-044 to FE-051       # Frontend tasks
│
└── SPRINT_13_14_ASSIGNMENT/   # Assignment System (2 tuần)
    ├── README.md
    ├── BE-052 to BE-059       # Backend tasks
    └── FE-052 to FE-059       # Frontend tasks
```

---

## 🔗 Dependencies from Phase 1

| Phase 1 Output | Phase 2 Usage |
|----------------|---------------|
| Auth System | Teacher authentication |
| Practice Module | Question bank reuse |
| Exam Module | AI scoring integration |
| Dashboard | Teacher analytics |

---

## 📊 Sprint Summary

### Sprint 09-10: AI Grading Service
- **AI Service** (Python FastAPI) setup
- **Writing Grading**: GPT-4 based scoring với 4 tiêu chí VSTEP
- **Speaking Grading**: Whisper STT + pronunciation analysis
- **Queue System**: RabbitMQ job processing
- **FE Integration**: Real-time scoring progress

### Sprint 11-12: Class Management
- **Teacher Portal**: Giao diện quản lý cho giáo viên
- **Class CRUD**: Tạo/sửa/xóa lớp học
- **Student Management**: Thêm học viên vào lớp
- **Materials**: Upload tài liệu học tập
- **Analytics**: Thống kê tiến độ lớp

### Sprint 13-14: Assignment System
- **Assignment CRUD**: Tạo bài tập từ question bank
- **Deadline Management**: Hạn nộp và nhắc nhở
- **Submission Tracking**: Theo dõi bài nộp
- **Manual Grading**: Giáo viên chấm bổ sung
- **Feedback System**: Nhận xét chi tiết

---

## ⚠️ Technical Notes

### AI Service Architecture
```
┌────────────────────────────────────────────────────────────┐
│                    NestJS Backend                          │
│  POST /ai/writing/submit → RabbitMQ → AI Worker           │
│  POST /ai/speaking/submit → RabbitMQ → AI Worker          │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                 Python FastAPI (AI Service)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Worker    │  │   Worker    │  │   Worker    │        │
│  │ (Writing)   │  │ (Speaking)  │  │ (Speaking)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                │                │               │
│         ▼                ▼                ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   GPT-4     │  │   Whisper   │  │ Pronunciation│       │
│  │   Scorer    │  │    STT      │  │   Analyzer   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└────────────────────────────────────────────────────────────┘
```

### Teacher Role UI
- Sidebar màu **purple** (teacher theme)
- Access: Class management, Assignments, Student analytics
- Dashboard riêng với teacher-specific metrics

---

## 📋 Estimated Hours

| Sprint | BE Tasks | FE Tasks | Total |
|--------|----------|----------|-------|
| 09-10 AI | 40h | 30h | 70h |
| 11-12 Class | 35h | 35h | 70h |
| 13-14 Assignment | 35h | 35h | 70h |
| **Total** | **110h** | **100h** | **210h** |

---

## 🚀 Ready to Start

1. Đọc `_AI_ARCHITECTURE.md` để hiểu AI Service
2. Check `_EXECUTION_ORDER.md` cho thứ tự tasks
3. Bắt đầu với Sprint 09-10 AI Service
