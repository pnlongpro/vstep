# VSTEP Backend - Quick Start Guide

## 🎯 Tổng quan

Backend được xây dựng với **NestJS** theo kiến trúc **microservices**, tổ chức theo **modules** độc lập.

## 📦 Modules đã hoàn thiện

### 1. **Auth Module** (`src/modules/auth/`)
Xác thực và quản lý phiên đăng nhập.

**Endpoints:**
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập (trả về JWT token)
- `GET /api/auth/profile` - Lấy thông tin user hiện tại
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất

**Files:**
- `auth.controller.ts` - HTTP endpoints
- `auth.service.ts` - Business logic (bcrypt, JWT)
- `jwt.strategy.ts` - JWT validation strategy
- `dto/register.dto.ts` - Validation cho đăng ký
- `dto/login.dto.ts` - Validation cho đăng nhập

---

### 2. **Users Module** (`src/modules/users/`)
Quản lý thông tin người dùng, profile và thống kê.

**Endpoints:**
- `GET /api/users/profile` - Lấy profile đầy đủ
- `GET /api/users/stats` - Lấy thống kê học tập
- `PATCH /api/users/profile` - Cập nhật profile

**Entities:**
- `user.entity.ts` - Bảng users (id, email, password, name, status)
- `role.entity.ts` - Bảng roles (student/teacher/admin)
- `user-profile.entity.ts` - Thông tin mở rộng (avatar, phone, level)
- `user-stats.entity.ts` - Thống kê học tập (XP, streak, scores)

---

### 3. **Practice Module** (`src/modules/practice/`)
Quản lý các phiên luyện tập đơn kỹ năng.

**Endpoints:**
- `POST /api/practice/sessions` - Bắt đầu session
- `PATCH /api/practice/sessions/:id/save` - Auto-save progress
- `POST /api/practice/sessions/:id/submit` - Submit session
- `GET /api/practice/sessions` - Lịch sử practice
- `GET /api/practice/sessions/:id` - Chi tiết session
- `POST /api/practice/drafts` - Lưu draft Writing
- `GET /api/practice/drafts/:taskId` - Lấy draft
- `DELETE /api/practice/drafts/:id` - Xóa draft

**Entities:**
- `practice-session.entity.ts` - Sessions (skill, mode, level, score)
- `practice-answer.entity.ts` - Câu trả lời từng câu
- `draft-answer.entity.ts` - Bản nháp Writing với auto-save

---

## 🔒 Authentication Flow

```
1. User registers → Password được hash (bcrypt)
2. User login → Verify password → Generate JWT token
3. Client gửi request với header: Authorization: Bearer <token>
4. JwtAuthGuard validate token → Extract user info
5. RolesGuard check permissions
6. Route handler xử lý request
```

---

## 🗄️ Database Schema

### User System
```sql
users (id, email, password, name, status)
  ├─ user_profiles (avatar, phone, current_level, target_level)
  ├─ user_stats (xp, level, streak, scores per skill)
  └─ user_roles ←→ roles (student, teacher, admin)
```

### Practice System
```sql
practice_sessions (user_id, skill, mode, level, score, status)
  ├─ practice_answers (question_id, answer, is_correct)
  └─ draft_answers (task_id, content, word_count)
```

---

## 🚀 Cài đặt và chạy

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Setup database
```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE vstep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure environment
```bash
cp .env.example .env
# Sửa DB_PASSWORD, JWT_SECRET trong .env
```

### 4. Run migrations (nếu có)
```bash
npm run migration:run
```

### 5. Start development server
```bash
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3000`
Swagger docs tại: `http://localhost:3000/api/docs`

---

## 📡 Test API với curl

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Nguyen Van A"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

Response sẽ trả về `token`, dùng cho các request sau.

### Get Profile (với token)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your_token_here>"
```

### Start Practice Session
```bash
curl -X POST http://localhost:3000/api/practice/sessions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "skill": "reading",
    "mode": "part",
    "level": "B1",
    "exerciseId": 1,
    "partNumber": 1
  }'
```

---

## 🛡️ Guards & Decorators

### Global Guards (áp dụng tự động)
- **JwtAuthGuard** - Bảo vệ tất cả routes, yêu cầu JWT token
- **RolesGuard** - Kiểm tra quyền theo role

### Decorators sử dụng trong Controllers
```typescript
@Public()  // Cho phép truy cập không cần token (register, login)
@Roles('admin', 'teacher')  // Chỉ admin/teacher mới truy cập được
@UseGuards(JwtAuthGuard)  // Yêu cầu JWT token (ít dùng vì global)
```

---

## 📝 DTO Validation

Tất cả request body đều được validate tự động qua `class-validator`:

```typescript
export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}
```

Nếu validation fail → HTTP 400 với error messages.

---

## 🔧 Cấu trúc một Module chuẩn

```
module-name/
├── module-name.module.ts        # Module definition
├── module-name.controller.ts    # HTTP endpoints
├── module-name.service.ts       # Business logic
├── entities/                    # TypeORM entities
│   └── entity-name.entity.ts
└── dto/                         # Data Transfer Objects
    ├── create-dto.ts
    └── update-dto.ts
```

**Quy tắc:**
- Controllers: Thin, chỉ xử lý HTTP
- Services: Business logic, inject repositories
- Entities: Map với database tables
- DTOs: Validate input/output

---

## 🐛 Debug & Logs

### Winston Logger
Logs được ghi tự động với các level:
- `error` - Lỗi nghiêm trọng
- `warn` - Cảnh báo
- `info` - Thông tin chung
- `debug` - Chi tiết debug (chỉ trong dev)

### TypeORM Query Logs
Trong development mode, tất cả SQL queries được log ra console.

### Swagger UI
Truy cập `http://localhost:3000/api/docs` để test API trực tiếp.

---

## 🔄 Workflow phát triển

### 1. Tạo Module mới
```bash
nest g module modules/example
nest g controller modules/example
nest g service modules/example
```

### 2. Tạo Entity
```bash
nest g class modules/example/entities/example.entity --no-spec
```

### 3. Tạo DTOs
```bash
nest g class modules/example/dto/create-example.dto --no-spec
nest g class modules/example/dto/update-example.dto --no-spec
```

### 4. Import vào AppModule
```typescript
@Module({
  imports: [
    // ... existing modules
    ExampleModule,
  ],
})
```

---

## 📚 Resources

- NestJS Docs: https://docs.nestjs.com
- TypeORM Docs: https://typeorm.io
- Swagger Docs: http://localhost:3000/api/docs
- Backend Structure: `BACKEND_STRUCTURE.md`
- Practice Flow Analysis: `../PRACTICE_FLOW_ANALYSIS.md`

---

## 🚧 TODO - Modules cần phát triển tiếp

### Priority 1 (MVP)
- [ ] **Questions Module** - CRUD question bank
- [ ] **Exams Module** - Mock exam sessions (4 skills)
- [ ] **AI Scoring Module** - Integrate với Python AI service

### Priority 2
- [ ] **Teacher Module** - Teacher portal, manual grading
- [ ] **Gamification Module** - Achievements, badges, leaderboard
- [ ] **Admin Module** - Full admin CRUD panel

### Priority 3
- [ ] **Payments Module** - VNPay/MoMo integration
- [ ] **Notifications Module** - Email, push notifications
- [ ] **Analytics Module** - Advanced learning analytics

---

## 💡 Tips

1. **Development**: Dùng `npm run start:dev` để auto-reload khi sửa code
2. **Testing**: Dùng Swagger UI để test endpoints nhanh
3. **Database**: Dùng `synchronize: true` trong dev, nhưng **KHÔNG** dùng trong production
4. **Migrations**: Luôn tạo migration cho mọi thay đổi schema trong production
5. **Environment**: Không commit file `.env` vào git

---

## 🤝 Collaboration

Khi làm việc nhóm:
- Tạo branch riêng cho feature: `git checkout -b feature/module-name`
- Commit với message rõ ràng: `feat: add practice module`
- Tạo Pull Request để review code
- Update `BACKEND_STRUCTURE.md` khi thêm module mới
