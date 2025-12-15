# Backend Structure Documentation

## 📁 Cấu trúc thư mục

```
backend/src/
├── modules/                    # Feature modules
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── users/                  # User management
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   ├── user-profile.entity.ts
│   │   │   └── user-stats.entity.ts
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   ├── practice/               # Practice sessions
│   │   ├── practice.module.ts
│   │   ├── practice.controller.ts
│   │   ├── practice.service.ts
│   │   ├── entities/
│   │   │   ├── practice-session.entity.ts
│   │   │   ├── practice-answer.entity.ts
│   │   │   └── draft-answer.entity.ts
│   │   └── dto/
│   │       ├── start-session.dto.ts
│   │       ├── save-progress.dto.ts
│   │       ├── submit-session.dto.ts
│   │       └── save-draft.dto.ts
│   ├── exams/                  # Mock exams (TODO)
│   ├── questions/              # Question bank (TODO)
│   ├── ai-scoring/             # AI scoring service (TODO)
│   ├── teacher/                # Teacher portal (TODO)
│   ├── admin/                  # Admin panel (TODO)
│   ├── payments/               # Payment integration (TODO)
│   └── gamification/           # Achievements, XP (TODO)
│
├── common/                     # Shared resources
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── exceptions/
│   ├── filters/
│   │   └── all-exceptions.filter.ts
│   └── pipes/
│
├── core/                       # Core modules
│   ├── database/
│   │   └── database.module.ts
│   ├── logger/
│   │   ├── logger.module.ts
│   │   └── winston-logger.service.ts
│   └── mailer/
│
├── guards/                     # Auth guards
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
│
├── shared/                     # Shared utilities
│   ├── utils/
│   ├── types/
│   └── interfaces/
│
├── app.module.ts               # Root module
└── main.ts                     # Application entry point
```

## 🎯 Modules đã hoàn thiện

### 1. Auth Module (`modules/auth/`)
- ✅ **auth.module.ts** - Module configuration
- ✅ **auth.controller.ts** - Endpoints: `/auth/register`, `/auth/login`, `/auth/profile`
- ✅ **auth.service.ts** - Business logic: registration, login, JWT generation
- ✅ **jwt.strategy.ts** - JWT token validation
- ✅ **local.strategy.ts** - Local authentication
- ✅ **DTOs**: RegisterDto, LoginDto

### 2. Users Module (`modules/users/`)
- ✅ **users.module.ts** - Module configuration
- ✅ **users.controller.ts** - Endpoints: `/users/profile`, `/users/stats`
- ✅ **users.service.ts** - User management logic
- ✅ **Entities**:
  - `user.entity.ts` - User table (id, email, password, name, status)
  - `role.entity.ts` - Roles (student, teacher, admin)
  - `user-profile.entity.ts` - Extended profile info
  - `user-stats.entity.ts` - Learning statistics
- ✅ **DTOs**: UpdateProfileDto

### 3. Practice Module (`modules/practice/`)
- ✅ **practice.module.ts** - Module configuration
- ✅ **practice.controller.ts** - Practice endpoints
- ✅ **practice.service.ts** - Session management, auto-save, scoring
- ✅ **Entities**:
  - `practice-session.entity.ts` - Practice sessions
  - `practice-answer.entity.ts` - User answers
  - `draft-answer.entity.ts` - Writing drafts
- ✅ **DTOs**: StartSessionDto, SaveProgressDto, SubmitSessionDto, SaveDraftDto

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register      # Đăng ký
POST   /api/auth/login         # Đăng nhập
GET    /api/auth/profile       # Lấy profile (protected)
POST   /api/auth/refresh       # Refresh token (protected)
POST   /api/auth/logout        # Đăng xuất (protected)
```

### Users
```
GET    /api/users/profile      # Lấy profile đầy đủ (protected)
GET    /api/users/stats        # Lấy thống kê học tập (protected)
PATCH  /api/users/profile      # Cập nhật profile (protected)
```

### Practice
```
POST   /api/practice/sessions           # Bắt đầu session
PATCH  /api/practice/sessions/:id/save  # Auto-save progress
POST   /api/practice/sessions/:id/submit # Submit session
GET    /api/practice/sessions           # Lấy lịch sử
GET    /api/practice/sessions/:id       # Chi tiết session
POST   /api/practice/drafts             # Lưu draft
GET    /api/practice/drafts/:taskId     # Lấy draft
DELETE /api/practice/drafts/:id         # Xóa draft
```

## 🔒 Authentication & Authorization

### JWT Strategy
- Token expiry: 7 days
- Payload: `{ sub: userId, email, roles }`
- Header: `Authorization: Bearer <token>`

### Guards
- **JwtAuthGuard** - Bảo vệ tất cả routes (trừ @Public)
- **RolesGuard** - Check quyền theo role

### Decorators
- `@Public()` - Cho phép truy cập public
- `@Roles('admin', 'teacher')` - Giới hạn theo roles

## 🗄️ Database Entities

### User System
- `users` - User accounts
- `roles` - Role definitions
- `user_roles` - Many-to-many junction
- `user_profiles` - Extended user info
- `user_stats` - Learning statistics

### Practice System
- `practice_sessions` - Practice attempts
- `practice_answers` - Individual answers
- `draft_answers` - Writing drafts with auto-save

## 🚀 Chạy ứng dụng

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Migration
```bash
# Generate migration
npm run migration:generate -- src/migrations/InitialSchema

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=vstep

# JWT
JWT_SECRET=your-secret-key

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

## 📚 Swagger Documentation

Access at: `http://localhost:3000/api/docs`

## 🔜 TODO Modules

### Priority 1 (MVP)
- [ ] **Questions Module** - Question bank management
- [ ] **Exams Module** - Mock exam sessions
- [ ] **AI Scoring Module** - Integration with Python AI service

### Priority 2 (Phase 2)
- [ ] **Teacher Module** - Teacher portal
- [ ] **Gamification Module** - Achievements, XP, badges

### Priority 3 (Phase 3)
- [ ] **Admin Module** - Full admin panel
- [ ] **Payments Module** - VNPay/MoMo integration

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **ORM**: TypeORM
- **Database**: MySQL
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT + Passport
- **Logger**: Winston
- **Language**: TypeScript

## 📋 Conventions

### Naming
- **Entities**: PascalCase (e.g., `User`, `PracticeSession`)
- **Files**: kebab-case (e.g., `user.entity.ts`, `auth.service.ts`)
- **DTOs**: PascalCase with suffix (e.g., `RegisterDto`)
- **Endpoints**: kebab-case (e.g., `/practice-sessions`)

### Structure
- Controllers: Thin, only HTTP concerns
- Services: Business logic
- Repositories: Auto-generated by TypeORM
- DTOs: Validation with class-validator

### Error Handling
- Use NestJS built-in exceptions
- Global exception filter catches all errors
- Consistent error response format

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔐 Security

- Password hashing: bcrypt (salt rounds: 10)
- JWT validation on every protected route
- Input validation via class-validator
- CORS enabled for frontend URL
- SQL injection prevention via TypeORM
- XSS protection via sanitization

## 📈 Performance

- Database connection pooling
- Query optimization with TypeORM
- Lazy loading for relations
- Caching strategy (Redis - TODO)
- Rate limiting (TODO)

## 🐛 Known Issues

- [ ] Need to implement refresh token blacklist
- [ ] Need Redis for caching
- [ ] Need RabbitMQ for AI queue
- [ ] Need S3 for file storage

## 📞 Support

For issues, please check:
- Swagger docs: `/api/docs`
- TypeORM logs in development mode
- Winston logs for errors
