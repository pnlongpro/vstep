# Hướng dẫn phát triển - Nền tảng luyện thi VSTEP với AI

## Tổng quan kiến trúc

Đây là nền tảng luyện thi VSTEP (Vietnamese Standardized Test of English Proficiency) theo kiến trúc **microservices**, tích hợp AI chấm điểm tự động cho phần Writing và Speaking.

### Phân chia Service

```
[API Gateway]
    ├── User Service (Xác thực, RBAC, Hồ sơ, Thanh toán)
    ├── Exam Service (Ngân hàng câu hỏi, Mock test, Luyện tập, Chấm R/L)
    ├── AI Service (Chấm Writing/Speaking - Python FastAPI + GPU)
    ├── Teacher Service (Chấm thủ công, Feedback, Quản lý lớp)
    └── Admin Service (CRUD, Dashboard quản trị)
```

**Quan trọng**: AI Service **hoàn toàn tách rời** (tech stack khác, xử lý bất đồng bộ qua queue). Không được đặt logic AI scoring vào main backend services.

## Công nghệ sử dụng

- **Main Backend**: NestJS (TypeScript) - xử lý User/Exam/Teacher/Admin services
- **AI Service**: Python FastAPI + Deep Learning models + GPU processing
- **Frontend**: React + TypeScript + NextJS + TailwindCSS
- **Database**: MySQL (primary) + Redis (cache) + S3-compatible storage (audio files)
- **Queue**: RabbitMQ/Kafka cho xử lý AI bất đồng bộ
- **Auth**: JWT + OAuth2 (Google, Facebook, Apple)
- **ORM**: TypeORM cho tương tác database và migrations
- **Logging**: Winston cho structured logging
- **API Docs**: Swagger/OpenAPI annotations trên controllers

## Cấu trúc Backend Project

```
src/
├── modules/                     # Mỗi module là 1 domain chức năng
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── strategies/
│   ├── users/
│   ├── exams/
│   │   ├── exam.controller.ts
│   │   ├── exam.service.ts
│   │   ├── exam.repository.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── exam.module.ts
│   │   └── helpers/
│   ├── questions/
│   ├── attempts/
│   ├── ai-scoring/
│   └── media/
│
├── common/
│   ├── decorators/
│   ├── exceptions/
│   ├── filters/                 # Global exception filter
│   ├── guards/                  # JWT, Roles
│   ├── interceptors/
│   ├── pipes/
│   └── constants/
│
├── core/
│   ├── config/                  # ConfigModule
│   ├── database/                # TypeORM module
│   ├── logger/                  # Winston
│   └── mailer/
│
├── shared/
│   ├── utils/
│   ├── types/
│   └── interfaces/
│
├── migrations/
└── main.ts
```

**Quy tắc quan trọng**:
- Controllers phải gọn - chỉ xử lý HTTP concerns, delegate cho services
- Services chứa business logic - inject repositories qua TypeORM
- DTOs dùng `class-validator` để tự động validate (`@IsString()`, `@IsEnum()`, etc.)
- Tất cả protected routes phải dùng `@UseGuards(JwtAuthGuard, RolesGuard)`
- Migrations được track trong `migrations/` - không được sửa entities trực tiếp trên production

## Cấu trúc Data Model

### Hệ thống bảng chính

#### **1. User & Authentication**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `users` | Lưu thông tin người dùng cơ bản (email, password hash, name, status). Là bảng trung tâm liên kết với tất cả bảng khác |
| `roles` | Danh mục vai trò (Student/Teacher/Admin). Định nghĩa quyền hạn và tính năng theo vai trò |
| `user_roles` | Bảng trung gian Many-to-Many giữa users và roles. Một user có thể có nhiều vai trò |
| `user_profiles` | Thông tin mở rộng của user (avatar, phone, location, current_level, target_level, target_date, bio, join_date) |
| `user_stats` | Thống kê học tập (total_hours, tests_completed, current_streak, longest_streak, average_score, xp, level) |
| `user_settings` | Cài đặt cá nhân (notifications, privacy, study preferences như daily_goal, auto_play, playback_speed) |
| `user_transactions` | Lịch sử giao dịch thanh toán (amount, payment_method, status, transaction_id từ VNPay/MoMo) |
| `user_packages` | Gói học đã mua (plan: free/basic/premium/vip, start_date, end_date, auto_renew) |

#### **2. Exam & Question Bank**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `exam_sets` | Bộ đề thi hoàn chỉnh theo level (A2/B1/B2/C1). Mỗi set có title, description, duration. Một set chứa 4 sections |
| `exam_sections` | Phần thi trong bộ đề (Reading/Listening/Writing/Speaking). Mỗi section có duration riêng, passage/audio, và danh sách questions |
| `questions` | Ngân hàng câu hỏi chung (type: multiple_choice/true_false/matching/fill_blank/essay/speaking_task). Có thể tái sử dụng cho nhiều đề |
| `question_options` | Các đáp án cho câu hỏi trắc nghiệm (label: A/B/C/D, text, is_correct) |
| `exam_attempts` | Một lượt thi của user (status: in_progress/completed/abandoned). Lưu start_time, end_time, current_section, auto_save_version |
| `exam_answers` | Câu trả lời chi tiết cho từng question trong attempt (answer, is_correct, time_spent). Auto-save mỗi 10 giây |

#### **3. AI Evaluation Results**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `ai_writing_results` | Kết quả chấm AI cho Writing (overall_score, task_achievement, coherence_cohesion, lexical_resource, grammatical_range). Kèm feedback text, suggestions array, grammar_errors với position và correction |
| `ai_speaking_results` | Kết quả chấm AI cho Speaking (overall_score, pronunciation, fluency, grammar, vocabulary). Kèm transcript đầy đủ, words_per_minute, feedback và suggestions |
| `audio_storage` | Metadata file audio đã mã hóa (file_path trên S3, encryption_key, duration, file_size, mime_type). Liên kết với speaking attempts |

#### **4. Practice Mode**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `practice_sessions` | Lượt luyện tập đơn kỹ năng (skill: reading/listening/writing/speaking, mode: practice/mock_test, level: A2-C1). Khác exam_attempts ở chỗ không có thời gian nghiêm ngặt, có draft saving |
| `draft_answers` | Lưu bản nháp trả lời (dùng cho Writing practice). Auto-save vào localStorage + database để user có thể tiếp tục sau |

#### **5. Gamification**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `achievements` | Danh mục huy hiệu (name, description, icon, xp_reward). VD: "7-day Streak", "100 Tests", "Writing Hero" |
| `user_achievements` | Bảng trung gian user đã unlock achievement nào (unlocked_at timestamp) |
| `leaderboard_entries` | Bảng xếp hạng theo period (weekly/monthly/all-time) và level (A2-C1). Lưu rank, xp, badges_count |
| `activity_logs` | Nhật ký hoạt động user (type: practice/exam/achievement, title, description, metadata JSON) |

#### **6. Teacher Portal**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `teacher_classes` | Lớp học do giáo viên quản lý (name, description, student_count, start_date, end_date) |
| `class_students` | Bảng trung gian giữa classes và students (enrolled_at, status: active/inactive) |
| `teacher_reviews` | Nhận xét thủ công của giáo viên cho bài làm (text_feedback, audio_feedback_url, score_override, reviewed_at). Liên kết với exam_answers hoặc practice_sessions |
| `assignments` | Bài tập giáo viên giao (title, description, skill, level, due_date, created_by teacher_id) |

#### **7. Admin & System**

| Bảng | Mô tả chi tiết |
|------|----------------|
| `system_logs` | Log hệ thống và bảo mật (level: info/warn/error, message, metadata JSON, user_id nếu có) |
| `ai_job_queue` | Hàng đợi job AI scoring (job_id, type: writing/speaking, status: pending/processing/completed/failed, payload JSON, result JSON, processing_time) |
| `feedback_reports` | Báo lỗi/góp ý từ users (type: bug/suggestion, title, description, screenshot_url, status: pending/resolved) |

### Mối quan hệ chính
- `exam_sets` (1) → (N) `exam_sections` → (N) `questions` + `question_options`
- `exam_attempts` (1 user session) → (N) `exam_answers` (individual responses)
- `users` ↔ `user_roles` ↔ `roles` (Many-to-Many RBAC)
- `ai_writing_results` / `ai_speaking_results` (lưu kết quả AI scoring riêng biệt)

**Pattern quan trọng**: 
- Mỗi exam attempt auto-saves mỗi 10 giây
- Audio files được mã hóa AES256 trước khi upload lên S3
- AI scoring là async process, kết quả trả về < 5 giây

## Luồng xử lý chính

### Pipeline chấm AI Writing
```
Text → Tiền xử lý → AI Model → Chấm 4 tiêu chí (0-10) → Phát hiện lỗi grammar → Tạo gợi ý → JSON response → Lưu DB
```

**Chi tiết 4 tiêu chí**:
- Task Achievement (Hoàn thành yêu cầu đề bài)
- Coherence & Cohesion (Mạch lạc và liên kết)
- Lexical Resource (Vốn từ vựng)
- Grammatical Range & Accuracy (Ngữ pháp)

### Pipeline chấm AI Speaking
## Quy ước phát triển

### Thiết kế API
- **Kiến trúc API-first**: Tất cả endpoints trả về JSON, được thiết kế cho cả web và mobile clients
- Mục tiêu response time: Reading/Listening auto-scoring (ngay lập tức), AI scoring (< 5s)
- Ví dụ endpoints: `POST /attempt`, `POST /writing/submit`, `POST /speaking/upload`, `POST /ai/writing/score`

### Bảo mật
- Tất cả file uploads (đặc biệt audio) → mã hóa AES256 trước khi lưu S3
- JWT tokens cho authentication qua `JwtAuthGuard` - được extract bởi `jwt.strategy.ts`
- Áp dụng RBAC: `@UseGuards(RolesGuard)` + `@Roles('student', 'teacher', 'admin')` decorators
- DTOs ngăn chặn injection attacks - tất cả inputs được validate qua `class-validator`
- CSRF/XSS protection được bật trong NestJS middleware
- HTTPS mọi nơi, Winston logs các sự kiện bảo mật vào bảng `system_logs`

### Practice Mode vs Mock Test Mode
- **Practice Mode**: Tập trung vào đơn kỹ năng, feedback ngay lập tức, lưu draft, không giới hạn thời gian
- **Mock Test**: Mô phỏng bài thi đầy đủ 4 kỹ năng, auto-save mỗi 10s, tự động nộp bài khi hết giờ, giới hạn số lượt thi/ngày (cả với user chưa đăng nhập)

## Hệ thống Gamification

- XP kiếm được từ mỗi bài tập hoàn thành + bonus streak liên tục
- Huy hiệu (Badges): Streak 7 ngày, thành tựu theo kỹ năng (Writing Hero, Listening Master, etc.)
- Bảng xếp hạng tuần/tháng được phân theo level VSTEP (A2/B1/B2/C1)

## Tính năng theo vai trò

### Student Dashboard
- Theo dõi tiến độ với biểu đồ (ChartJS/ECharts), điểm số theo từng kỹ năng
- Lộ trình học tập do AI tạo dựa trên level hiện tại vs mục tiêu
- Lịch sử mock test với feedback chi tiết từ AI
- Quản lý gói học/subscription

### Teacher Portal
- Hàng đợi bài nộp cần chấm thủ công
- Khả năng feedback bằng text + audio
- Quản lý lớp học và tạo bài tập
- Phân tích tiến độ học viên

### Admin Panel
- CRUD đầy đủ: users, teachers, exam sets, question bank
- Giám sát hàng đợi AI job queue
- Dashboard doanh thu và transaction logsdback
- Subscription/package management
## Các giai đoạn phát triển (Hiện tại: MVP)

**MVP (4 tuần)**: Auth + Reading/Listening practice + AI Writing cơ bản + RL mock tests + Student dashboard
**Phase 2**: AI Speaking + Learning roadmap + Gamification + Teacher portal
**Phase 3**: Admin panel đầy đủ + Advanced analytics + Mobile app + Billing/subscription

## Lỗi thường gặp cần tránh

- **KHÔNG** trộn lẫn AI processing vào main backend services - luôn dùng kiến trúc queue-based async
- **KHÔNG** quên auto-save mỗi 10 giây cho mock tests - mất dữ liệu rất ảnh hưởng UX
- File audio **BẮT BUỘC** phải mã hóa trước khi lưu - yêu cầu compliance
- RBAC checks **bắt buộc** trên mọi endpoint - luôn apply cả `JwtAuthGuard` và `RolesGuard`
- Cache exam sets và question bank tích cực (Redis) - pattern high read, low write
- **KHÔNG BAO GIỜ** bỏ qua DTOs - tất cả request bodies phải đi qua validation layer
- Dùng TypeORM transactions cho các thao tác multi-table (exam attempts + answers)
- **KHÔNG** đặt business logic trong controllers - extract ra services để dễ test

## File tham khảo

- `requirement.md` - Yêu cầu hệ thống và đặc tả đầy đủ (Tiếng Việt)
- `FE/STRUCTURE.md` - Kiến trúc Frontend Next.js
- `FE/MIGRATION.md` - Chi tiết migration components
- Don't mix AI processing in main backend services - always use queue-based async architecture
- Don't forget 10-second auto-save for mock tests - data loss is critical for UX
- Audio files MUST be encrypted before storage - compliance requirement
- RBAC checks are mandatory on every endpoint - always apply both `JwtAuthGuard` and `RolesGuard`
- Cache exam sets and question bank aggressively (Redis) - high read, low write pattern
- Never bypass DTOs - all request bodies must go through validation layer
- Use TypeORM transactions for multi-table operations (exam attempts + answers)
- Don't put business logic in controllers - extract to services for testability

## Reference Files

- `requirement.md` - Complete system requirements and specifications (Vietnamese)
