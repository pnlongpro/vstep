# 📦 Project Context - VSTEPRO

> **Tech Stack, Conventions, và Architecture cho AI reference**

---

## 🏗️ System Overview

### Tên dự án
**VSTEPRO** - Vietnamese Standardized Test of English Proficiency Learning Platform

### Mục tiêu
Nền tảng luyện thi VSTEP với AI chấm điểm tự động cho Writing và Speaking.

### Kiến trúc

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                            │
│  Desktop (1440px) │ Tablet (768px) │ Mobile (375px)                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                           │
│  Auth │ Users │ Practice │ Exams │ Classes │ Gamification          │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │   MySQL 8    │ │    Redis     │ │  S3 Storage  │
      │  (Primary)   │ │   (Cache)    │ │   (Media)    │
      └──────────────┘ └──────────────┘ └──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AI SERVICE (Python FastAPI)                      │
│  Queue Worker │ Writing Grader │ Speaking Grader │ Whisper STT     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend (NestJS)

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/core` | ^10.0 | Framework |
| `@nestjs/typeorm` | ^10.0 | ORM |
| `@nestjs/jwt` | ^10.0 | JWT handling |
| `@nestjs/passport` | ^10.0 | Auth strategies |
| `@nestjs/swagger` | ^7.0 | API docs |
| `mysql2` | ^3.0 | MySQL driver |
| `bcrypt` | ^5.0 | Password hashing |
| `class-validator` | ^0.14 | DTO validation |
| `class-transformer` | ^0.5 | Object transformation |

### Frontend (Next.js)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.0 | Framework |
| `react` | ^18.0 | UI library |
| `typescript` | ^5.0 | Type safety |
| `tailwindcss` | ^4.0 | Styling |
| `zustand` | ^4.0 | State management |
| `axios` | ^1.6 | HTTP client |
| `react-hook-form` | ^7.0 | Form handling |
| `lucide-react` | latest | Icons |
| `recharts` | latest | Charts |

### AI Service (Python)

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | ^0.100 | Framework |
| `pika` | ^1.3 | RabbitMQ client |
| `openai` | ^1.0 | GPT integration |
| `whisper` | latest | Speech-to-text |
| `pydantic` | ^2.0 | Validation |

### Infrastructure

| Tool | Purpose |
|------|---------|
| MySQL 8.0 | Primary database |
| Redis 7.x | Caching, sessions |
| RabbitMQ 3.x | Message queue |
| MinIO / S3 | File storage |
| Docker | Containerization |

---

## 📂 Project Structure

### Backend

```
BE/
├── src/
│   ├── main.ts                      # Application entry
│   ├── app.module.ts                # Root module
│   │
│   ├── common/
│   │   ├── decorators/              # Custom decorators
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/                 # Exception filters
│   │   │   └── all-exceptions.filter.ts
│   │   ├── interceptors/            # Request interceptors
│   │   └── pipes/                   # Validation pipes
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── core/
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   └── logger/
│   │       └── logger.module.ts
│   │
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── strategies/
│   │   │       ├── jwt.strategy.ts
│   │   │       └── local.strategy.ts
│   │   │
│   │   ├── users/
│   │   ├── practice/
│   │   ├── exams/
│   │   ├── classes/
│   │   ├── gamification/
│   │   └── notifications/
│   │
│   ├── migrations/
│   │   └── *.ts
│   │
│   └── shared/
│       ├── utils/
│       ├── types/
│       └── interfaces/
│
├── test/
│   ├── e2e/
│   └── unit/
│
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend

```
FE/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   │   ├── home/page.tsx
│   │   │   ├── practice/
│   │   │   ├── exams/
│   │   │   ├── courses/
│   │   │   ├── achievements/
│   │   │   └── profile/
│   │   │
│   │   └── (public)/
│   │       └── page.tsx             # Landing page
│   │
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   └── features/
│   │       ├── auth/
│   │       ├── practice/
│   │       └── exam/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api.ts               # API calls
│   │   │   ├── hooks.ts             # Custom hooks
│   │   │   ├── store.ts             # Zustand store
│   │   │   └── types.ts             # Types
│   │   │
│   │   ├── practice/
│   │   ├── exam/
│   │   └── payment/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── services/
│   │   └── api.ts                   # Axios instance
│   │
│   ├── store/
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       └── helpers.ts
│
├── public/
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 👥 User Roles

| Role | Code | Color | Description |
|------|------|-------|-------------|
| Student | `student` | Blue | Học viên luyện thi |
| Teacher | `teacher` | Purple | Giáo viên quản lý lớp |
| Admin | `admin` | Red | Quản trị hệ thống |
| Uploader | `uploader` | Yellow | Upload đề thi |

---

## 🗄️ Database Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Thông tin người dùng |
| `user_profiles` | Hồ sơ mở rộng |
| `user_stats` | Thống kê học tập |
| `roles` | Vai trò (student, teacher, admin) |
| `permissions` | Quyền hạn |
| `sessions` | Phiên đăng nhập |

### Practice Tables

| Table | Description |
|-------|-------------|
| `exercises` | Bài tập luyện tập |
| `passages` | Đoạn văn/audio |
| `questions` | Câu hỏi |
| `question_options` | Đáp án trắc nghiệm |
| `exercise_submissions` | Bài làm |
| `grading_results` | Kết quả chấm |

### Class Tables

| Table | Description |
|-------|-------------|
| `classes` | Lớp học |
| `class_students` | Học viên trong lớp |
| `assignments` | Bài tập được giao |
| `materials` | Tài liệu |
| `attendance_records` | Điểm danh |

### Exam Tables

| Table | Description |
|-------|-------------|
| `exams` | Bộ đề thi |
| `exam_sections` | Phần thi (R/L/W/S) |
| `mock_exams` | Lượt thi thử |
| `certificates` | Chứng chỉ |

### Gamification Tables

| Table | Description |
|-------|-------------|
| `badges` | Huy hiệu |
| `user_badges` | Huy hiệu đã nhận |
| `goals` | Mục tiêu |
| `user_points` | Điểm XP |

---

## 🔌 API Conventions

### Base URL

```
Development: http://localhost:3000/api
Production:  https://api.vstepro.vn/api
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Success"
}

// Error
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID xxx not found"
  }
}

// Paginated
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

### Auth Headers

```
Authorization: Bearer <access_token>
X-Refresh-Token: <refresh_token>
```

---

## 🎨 Design System

### Colors by Role

```css
/* Student - Blue */
--student-primary: #2563eb;  /* blue-600 */
--student-hover: #1d4ed8;    /* blue-700 */
--student-bg: #eff6ff;       /* blue-50 */

/* Teacher - Purple */
--teacher-primary: #9333ea;  /* purple-600 */
--teacher-hover: #7c3aed;    /* purple-700 */
--teacher-bg: #faf5ff;       /* purple-50 */

/* Admin - Red */
--admin-primary: #dc2626;    /* red-600 */
--admin-hover: #b91c1c;      /* red-700 */
--admin-bg: #fef2f2;         /* red-50 */
```

### Layout Specs

| Element | Value |
|---------|-------|
| Sidebar Width | 320px |
| Max Content Width | 1280px (max-w-7xl) |
| Card Padding | 24px (p-6) |
| Card Border Radius | 12px (rounded-xl) |
| Button Min Height | 44px |

### Typography

```css
h1: 2rem (32px), font-bold
h2: 1.5rem (24px), font-semibold
h3: 1.25rem (20px), font-medium
body: 1rem (16px)
small: 0.875rem (14px)
```

---

## 🔐 Security Checklist

| Item | Implementation |
|------|----------------|
| Password Hashing | bcrypt (10 rounds) |
| JWT Access Token | 15 minutes expiry |
| JWT Refresh Token | 7 days expiry |
| Rate Limiting | 100 req/min per user |
| Input Validation | class-validator DTOs |
| SQL Injection | TypeORM parameterized |
| XSS Prevention | React auto-escaping |
| CORS | Whitelist origins |
| HTTPS | Required in production |

---

## 📚 Reference Docs

| Document | Path | Description |
|----------|------|-------------|
| Database Design | `.github/docs/23-DATABASE-DESIGN_NEW.md` | Full schema |
| API Spec | `.github/docs/24-API-SPECIFICATION.md` | Endpoints |
| User Flows | `.github/docs/25-USER-FLOWS.md` | Flow diagrams |
| NFR | `.github/docs/27-NON-FUNCTIONAL-REQUIREMENTS.md` | Requirements |

---

## 🔧 Environment Variables

### Backend (.env)

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=vstepro

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=vstepro

# AI Service
AI_SERVICE_URL=http://localhost:8000
RABBITMQ_URL=amqp://localhost:5672
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=VSTEPRO
```

---

**📌 Sử dụng context này trong mọi task implementation!**
