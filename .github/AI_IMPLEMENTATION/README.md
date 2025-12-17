# 🤖 AI Implementation Guide - VSTEPRO

> **Hướng dẫn sử dụng AI để implement dự án VSTEPRO**
>
> Version: 1.0  
> Created: 17/12/2024

---

## 📋 Mục đích

Thư mục này chứa các task cards được thiết kế để AI (GitHub Copilot, Claude, ChatGPT, etc.) có thể:

1. **Hiểu context** đầy đủ của dự án
2. **Implement từng task** một cách chính xác
3. **Đảm bảo consistency** giữa các phần
4. **Tự validate** kết quả

---

## 📂 Cấu trúc thư mục

```
AI_IMPLEMENTATION/
├── README.md                    # File này
├── 00_GLOBAL_RULES.md           # Quy tắc chung cho AI
├── 01_PROJECT_CONTEXT.md        # Context dự án
├── 02_FE_COMPONENT_MAPPING.md   # ⭐ Mapping FE components đã có
│
├── PHASE_1_MVP/                 # Phase 1: Core Features (8 tuần)
│   ├── _EXECUTION_ORDER.md      # Thứ tự thực hiện
│   ├── SPRINT_01_02_AUTH/       # Authentication (2 tuần)
│   ├── SPRINT_03_04_PRACTICE/   # Practice System (2 tuần)
│   ├── SPRINT_05_06_EXAM/       # Mock Exam (2 tuần)
│   └── SPRINT_07_08_DASHBOARD/  # Student Dashboard (2 tuần)
│       └── FE_COMPONENT_MAPPING.md  # Sprint-specific mapping
│
├── PHASE_2_AI_GRADING/          # Phase 2: AI Features (6 tuần)
│   ├── _AI_ARCHITECTURE.md      # Kiến trúc AI Service
│   ├── SPRINT_09_10_AI/         # AI Grading Service
│   ├── SPRINT_11_12_CLASS/      # Class Management
│   └── SPRINT_13_14_ASSIGNMENT/ # Assignment System
│
├── PHASE_3_ENTERPRISE/          # Phase 3: Enterprise (6 tuần)
│   ├── ADMIN/                   # Admin Panel
│   ├── GAMIFICATION/            # Badge & Goal System
│   └── PAYMENT/                 # Payment Integration
│
└── QA_REVIEW/                   # QA Checklists
    ├── AUTH_QA.md
    ├── PRACTICE_QA.md
    └── SECURITY_QA.md
```

---

## 🚀 Cách sử dụng

### Bước 1: Đọc Global Rules

Trước khi bắt đầu bất kỳ task nào, **BẮT BUỘC** đọc:
- `00_GLOBAL_RULES.md` - Quy tắc coding
- `01_PROJECT_CONTEXT.md` - Context dự án

### Bước 2: Chọn Phase và Sprint

1. Mở folder Phase tương ứng (VD: `PHASE_1_MVP/`)
2. Đọc `_EXECUTION_ORDER.md` để hiểu thứ tự
3. Chọn Sprint cần làm

### Bước 3: Thực hiện Task

Mỗi task file (VD: `BE-001_DB_CORE.md`) chứa:
- **Context**: Mô tả task
- **Requirements**: Yêu cầu chi tiết
- **Implementation**: Code mẫu/hướng dẫn
- **Acceptance Criteria**: Điều kiện hoàn thành
- **Dependencies**: Task phụ thuộc

### Bước 4: Validate

Sau khi hoàn thành, check với file QA tương ứng.

---

## 🎯 Quy tắc cho AI

### ✅ PHẢI làm:

1. **Đọc context trước khi code**
2. **Tuân thủ coding conventions** trong `00_GLOBAL_RULES.md`
3. **Check dependencies** trước khi implement
4. **Viết tests** cho mọi function
5. **Comment code** bằng tiếng Việt nếu logic phức tạp

### ❌ KHÔNG được:

1. **KHÔNG** bỏ qua validation
2. **KHÔNG** hardcode values
3. **KHÔNG** tạo file mới ngoài scope
4. **KHÔNG** sửa file config không liên quan
5. **KHÔNG** skip error handling

---

## 📊 Progress Tracking

| Phase | Sprints | Status | Progress |
|-------|---------|--------|----------|
| Phase 1: MVP | 1-8 | 🔴 Not Started | 0% |
| Phase 2: AI Grading | 9-14 | 🔴 Not Started | 0% |
| Phase 3: Enterprise | 15-20 | 🔴 Not Started | 0% |
| Phase 4: Launch | 21-24 | 🔴 Not Started | 0% |

---

## 📝 Template cho Task Card

Mỗi task file tuân theo format:

```markdown
# [TASK-ID] Task Name

## 📋 Task Info
- **Phase**: X
- **Sprint**: X-X
- **Priority**: P0/P1/P2
- **Estimated Hours**: Xh
- **Dependencies**: [TASK-IDS]

## 🎯 Objective
[Mô tả ngắn gọn mục tiêu]

## 📝 Requirements
[Chi tiết yêu cầu]

## 💻 Implementation
[Code mẫu, hướng dẫn]

## ✅ Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## 🧪 Testing
[Test cases]

## 📚 References
[Links tới docs liên quan]
```

---

## 🔗 Quick Links

| Document | Description |
|----------|-------------|
| [Global Rules](./00_GLOBAL_RULES.md) | Quy tắc coding chung |
| [Project Context](./01_PROJECT_CONTEXT.md) | Tech stack, conventions |
| [**FE Component Mapping**](./02_FE_COMPONENT_MAPPING.md) | ⭐ **Mapping FE components đã có** |
| [Phase 1 Execution](./PHASE_1_MVP/_EXECUTION_ORDER.md) | Thứ tự MVP tasks |
| [AI Architecture](./PHASE_2_AI_GRADING/_AI_ARCHITECTURE.md) | Kiến trúc AI Service |

---

**⚠️ Lưu ý cho FE tasks:** Đọc `02_FE_COMPONENT_MAPPING.md` trước khi implement!

---

**Bắt đầu với**: `PHASE_1_MVP/SPRINT_01_02_AUTH/BE-001_DB_CORE.md`
