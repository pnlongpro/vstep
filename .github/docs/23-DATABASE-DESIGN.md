# 🗄️ Database Design - Consolidated

> **Tổng hợp thiết kế database toàn hệ thống VSTEPRO**
> 
> File: `23-DATABASE-DESIGN.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Database Overview](#1-database-overview)
- [2. Core Tables](#2-core-tables)
- [3. Practice & Learning Tables](#3-practice--learning-tables)
- [4. Class & Assignment Tables](#4-class--assignment-tables)
- [5. Exam & Certificate Tables](#5-exam--certificate-tables)
- [6. Gamification Tables](#6-gamification-tables)
- [7. Communication Tables](#7-communication-tables)
- [8. Admin & System Tables](#8-admin--system-tables)
- [9. Entity Relationship Diagram](#9-entity-relationship-diagram)
- [10. Indexes & Optimization](#10-indexes--optimization)

---

## 1. Database Overview

### 1.1. Technology Stack

**Database**: mysql

**Features Used**:
- UUID for primary keys
- JSONB for flexible data
- Timestamps for audit trail
- Indexes for performance
- Foreign keys for integrity
- Triggers for automation

### 1.2. Naming Conventions

**Tables**: `snake_case` (e.g., `user_profiles`, `exercise_submissions`)

**Columns**: `camelCase` (e.g., `createdAt`, `fullName`)

**Indexes**: `idx_{table}_{column}` (e.g., `idx_users_email`)

**Foreign Keys**: `fk_{table}_{referenced_table}` (e.g., `fk_submissions_users`)

### 1.3. Statistics

- **Total Tables**: 45+ tables
- **Core Entities**: 10 tables
- **Supporting Tables**: 35+ tables
- **Indexes**: 80+ indexes
- **Relationships**: 60+ foreign keys

---

## 2. Core Tables

### 2.1. users

**Mô tả**: Bảng người dùng chính

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Authentication
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  
  -- Profile
  full_name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  
  -- Role & Status
  role VARCHAR(20) DEFAULT 'student',
    -- 'student' | 'teacher' | 'admin' | 'uploader'
  status VARCHAR(20) DEFAULT 'active',
    -- 'active' | 'suspended' | 'expired'
  
  -- Account Type
  account_type VARCHAR(20) DEFAULT 'free',
    -- 'free' | 'premium' | 'trial'
  premium_expires_at TIMESTAMP,
  trial_started_at TIMESTAMP,
  
  -- Security
  last_login_at TIMESTAMP,
  last_login_ip INET,
  password_changed_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Suspension
  suspension_reason TEXT,
  suspended_by UUID REFERENCES users(id),
  suspended_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
```

---

### 2.2. user_profiles

**Mô tả**: Thông tin profile mở rộng

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Location
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Vietnam',
  
  -- Learning
  target_level VARCHAR(10),
    -- 'A2' | 'B1' | 'B2' | 'C1'
  current_level VARCHAR(10),
  bio TEXT,
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'vi',
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  
  -- Social
  student_code VARCHAR(20) UNIQUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_student_code ON user_profiles(student_code);
```

---

### 2.3. sessions

**Mô tả**: Quản lý phiên đăng nhập

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token
  refresh_token VARCHAR(500) UNIQUE NOT NULL,
  access_token VARCHAR(500),
  
  -- Device Info
  device_name VARCHAR(255),
  device_type VARCHAR(50),
    -- 'desktop' | 'mobile' | 'tablet'
  browser VARCHAR(100),
  os VARCHAR(100),
  
  -- Location
  ip_address INET,
  location VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  
  -- Expiry
  expires_at TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_is_active ON sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

### 2.4. password_reset_tokens

**Mô tả**: Token reset mật khẩu

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
```

---

## 3. Practice & Learning Tables

### 3.1. exercises

**Mô tả**: Ngân hàng bài tập

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Classification
  skill VARCHAR(20) NOT NULL,
    -- 'reading' | 'listening' | 'writing' | 'speaking'
  level VARCHAR(10) NOT NULL,
    -- 'A2' | 'B1' | 'B2' | 'C1'
  type VARCHAR(20) NOT NULL,
    -- 'part_practice' | 'full_test'
  
  -- For part practice
  part_number INTEGER,
    -- Part 1, 2, 3, etc.
  
  -- Content
  content JSONB NOT NULL,
    -- Exercise content (questions, passages, etc.)
  answer_key JSONB NOT NULL,
    -- Correct answers
  
  -- Metadata
  duration_minutes INTEGER,
  question_count INTEGER,
  difficulty VARCHAR(20),
    -- 'easy' | 'medium' | 'hard'
  
  -- Tags
  tags TEXT[],
  
  -- Status
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Stats
  attempt_count INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2),
  
  -- Upload info (if user-contributed)
  uploaded_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_exercises_skill ON exercises(skill);
CREATE INDEX idx_exercises_level ON exercises(level);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_is_public ON exercises(is_public);
CREATE INDEX idx_exercises_skill_level ON exercises(skill, level);
CREATE INDEX idx_exercises_uploaded_by ON exercises(uploaded_by);
```

---

### 3.2. exercise_submissions

**Mô tả**: Bài làm của học viên

```sql
CREATE TABLE exercise_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Submission
  answers JSONB NOT NULL,
    -- User's answers
  content JSONB,
    -- For writing/speaking submissions
  
  -- Timing
  started_at TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP,
  time_spent INTEGER,
    -- Seconds
  
  -- Status
  status VARCHAR(20) DEFAULT 'in_progress',
    -- 'in_progress' | 'submitted' | 'graded'
  
  -- Score
  score DECIMAL(5,2),
  auto_graded BOOLEAN DEFAULT FALSE,
  
  -- Auto-save
  last_saved_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercise_submissions_user_id ON exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise_id ON exercise_submissions(exercise_id);
CREATE INDEX idx_exercise_submissions_status ON exercise_submissions(status);
CREATE INDEX idx_exercise_submissions_user_exercise ON exercise_submissions(user_id, exercise_id);
CREATE INDEX idx_exercise_submissions_submitted_at ON exercise_submissions(submitted_at DESC);
```

---

### 3.3. grading_results

**Mô tả**: Kết quả chấm điểm

```sql
CREATE TABLE grading_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES exercise_submissions(id) ON DELETE CASCADE,
  
  -- Type
  grading_type VARCHAR(20) NOT NULL,
    -- 'auto' | 'ai' | 'manual'
  graded_by VARCHAR(50),
    -- 'system' | 'openai-gpt4' | user_id
  
  -- Scores
  overall_score DECIMAL(5,2) NOT NULL,
  criteria_scores JSONB,
    -- For Writing/Speaking: detailed criteria
  
  -- Feedback
  feedback JSONB,
    -- { strengths, weaknesses, suggestions }
  detailed_feedback JSONB,
    -- Per criterion feedback
  grading_details JSONB,
    -- Question-by-question results
  
  -- AI-specific
  ai_model VARCHAR(50),
  ai_tokens_used INTEGER,
  ai_cost DECIMAL(10, 6),
  ai_prompt TEXT,
  ai_response TEXT,
  
  -- Timing
  graded_at TIMESTAMP DEFAULT NOW(),
  grading_duration INTEGER,
    -- Seconds
  
  -- Status
  status VARCHAR(20) DEFAULT 'completed',
    -- 'pending' | 'processing' | 'completed' | 'failed'
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_grading_results_submission ON grading_results(submission_id);
CREATE INDEX idx_grading_results_status ON grading_results(status);
CREATE INDEX idx_grading_results_grading_type ON grading_results(grading_type);
```

---

### 3.4. bookmarks

**Mô tả**: Đánh dấu câu hỏi

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, exercise_id, question_number)
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_exercise_id ON bookmarks(exercise_id);
```

---

## 4. Class & Assignment Tables

### 4.1. classes

**Mô tả**: Lớp học

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(10),
    -- 'A2' | 'B1' | 'B2' | 'C1'
  
  -- Teacher
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Join Methods
  class_code VARCHAR(10) UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Settings
  max_students INTEGER,
  allow_student_materials BOOLEAN DEFAULT FALSE,
  
  -- Schedule
  start_date DATE,
  end_date DATE,
  meeting_link VARCHAR(500),
  meeting_schedule TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
    -- 'draft' | 'active' | 'archived' | 'completed'
  
  -- Stats
  student_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_code ON classes(class_code);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_level ON classes(level);
```

---

### 4.2. class_students

**Mô tả**: Học viên trong lớp

```sql
CREATE TABLE class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Join Info
  joined_at TIMESTAMP DEFAULT NOW(),
  joined_via VARCHAR(20),
    -- 'code' | 'email' | 'link'
  invited_by UUID REFERENCES users(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
    -- 'active' | 'removed' | 'left'
  removed_at TIMESTAMP,
  removed_by UUID REFERENCES users(id),
  removal_reason TEXT,
  
  UNIQUE(class_id, user_id)
);

CREATE INDEX idx_class_students_class_id ON class_students(class_id);
CREATE INDEX idx_class_students_user_id ON class_students(user_id);
CREATE INDEX idx_class_students_status ON class_students(status);
```

---

### 4.3. class_invitations

**Mô tả**: Lời mời vào lớp

```sql
CREATE TABLE class_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Invitee
  email VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Invitation
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending' | 'accepted' | 'declined' | 'expired'
  
  -- Timing
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_class_invitations_class_id ON class_invitations(class_id);
CREATE INDEX idx_class_invitations_email ON class_invitations(email);
CREATE INDEX idx_class_invitations_token ON class_invitations(token);
CREATE INDEX idx_class_invitations_status ON class_invitations(status);
```

---

### 4.4. assignments

**Mô tả**: Bài tập được giao

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Exercise Link
  exercise_id UUID REFERENCES exercises(id),
    -- NULL if custom assignment
  
  -- Custom Exercise Data (if not using exercise_id)
  custom_content JSONB,
  custom_answer_key JSONB,
  
  -- Settings
  due_date TIMESTAMP,
  available_from TIMESTAMP,
  max_attempts INTEGER,
  time_limit_minutes INTEGER,
  
  -- Grading
  grading_method VARCHAR(20) DEFAULT 'auto',
    -- 'auto' | 'manual' | 'ai'
  passing_score DECIMAL(5,2),
  
  -- Options
  allow_late_submission BOOLEAN DEFAULT FALSE,
  show_answers_after_due BOOLEAN DEFAULT TRUE,
  randomize_questions BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
    -- 'draft' | 'published' | 'closed'
  
  -- Stats
  submission_count INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_assignments_exercise_id ON assignments(exercise_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

---

### 4.5. assignment_submissions

**Mô tả**: Bài làm assignment

```sql
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Links to exercise submission
  exercise_submission_id UUID REFERENCES exercise_submissions(id),
  
  -- Submission Info
  attempt_number INTEGER DEFAULT 1,
  submitted_at TIMESTAMP,
  is_late BOOLEAN DEFAULT FALSE,
  
  -- Score
  score DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Status
  status VARCHAR(20) DEFAULT 'not_started',
    -- 'not_started' | 'in_progress' | 'submitted' | 'graded'
  
  -- Teacher Feedback
  teacher_feedback TEXT,
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(assignment_id, user_id, attempt_number)
);

CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_user_id ON assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);
CREATE INDEX idx_assignment_submissions_submitted_at ON assignment_submissions(submitted_at DESC);
```

---

### 4.6. materials

**Mô tả**: Tài liệu học tập

```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  class_id UUID REFERENCES classes(id),
  
  -- File Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
    -- 'pdf' | 'docx' | 'pptx' | 'image' | 'video' | 'audio'
  file_size BIGINT,
  
  -- Classification
  category VARCHAR(50),
    -- 'vocabulary' | 'grammar' | 'practice' | 'resources'
  
  -- Visibility
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Stats
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_materials_class_id ON materials(class_id);
CREATE INDEX idx_materials_uploaded_by ON materials(uploaded_by);
CREATE INDEX idx_materials_is_public ON materials(is_public);
```

---

## 5. Exam & Certificate Tables

### 5.1. mock_exams

**Mô tả**: Đề thi thử

```sql
CREATE TABLE mock_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Exam Structure
  reading_exercise_id UUID REFERENCES exercises(id),
  listening_exercise_id UUID REFERENCES exercises(id),
  writing_exercise_id UUID REFERENCES exercises(id),
  speaking_exercise_id UUID REFERENCES exercises(id),
  
  -- Timing
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  total_time_seconds INTEGER,
    -- Total time spent (max 172 * 60)
  
  -- Scores
  reading_score DECIMAL(5,2),
  listening_score DECIMAL(5,2),
  writing_score DECIMAL(5,2),
  speaking_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  band_score DECIMAL(3,1),
  
  -- Status
  status VARCHAR(20) DEFAULT 'in_progress',
    -- 'in_progress' | 'completed' | 'abandoned'
  
  -- Certificate
  certificate_id UUID REFERENCES certificates(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mock_exams_user_id ON mock_exams(user_id);
CREATE INDEX idx_mock_exams_status ON mock_exams(status);
CREATE INDEX idx_mock_exams_completed_at ON mock_exams(completed_at DESC);
```

---

### 5.2. certificates

**Mô tả**: Chứng chỉ

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mock_exam_id UUID REFERENCES mock_exams(id),
  
  -- Certificate Info
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  verification_code VARCHAR(20) UNIQUE NOT NULL,
  
  -- Scores
  overall_score DECIMAL(5,2) NOT NULL,
  band_score DECIMAL(3,1) NOT NULL,
  skill_scores JSONB NOT NULL,
    -- { reading, listening, writing, speaking }
  
  -- Details
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  -- File
  certificate_url VARCHAR(500),
  
  -- Status
  is_verified BOOLEAN DEFAULT TRUE,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  revoked_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_mock_exam_id ON certificates(mock_exam_id);
```

---

## 6. Gamification Tables

### 6.1. badges

**Mô tả**: Huy hiệu

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  category VARCHAR(50),
    -- 'practice' | 'skill' | 'streak' | 'time' | 'achievement'
  criteria JSONB NOT NULL,
  rarity VARCHAR(20) DEFAULT 'common',
    -- 'common' | 'rare' | 'epic' | 'legendary'
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);
```

---

### 6.2. user_badges

**Mô tả**: Huy hiệu của user

```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress JSONB,
  
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
```

---

### 6.3. goals

**Mô tả**: Mục tiêu cá nhân

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
    -- 'exercise_count' | 'avg_score' | 'streak' | 'mock_exam' | 'custom'
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
    -- 'active' | 'completed' | 'failed' | 'abandoned'
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
```

---

### 6.4. user_points

**Mô tả**: Điểm số gamification

```sql
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  current_multiplier DECIMAL(3,2) DEFAULT 1.0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_total_points ON user_points(total_points DESC);
```

---

### 6.5. point_transactions

**Mô tả**: Lịch sử điểm

```sql
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id, created_at DESC);
```

---

## 7. Communication Tables

### 7.1. notifications

**Mô tả**: Thông báo

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(50),
  
  action_url VARCHAR(500),
  action_type VARCHAR(50),
  
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  sent_in_app BOOLEAN DEFAULT TRUE,
  sent_email BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) 
  WHERE is_read = FALSE AND is_deleted = FALSE;
```

---

### 7.2. conversations

**Mô tả**: Cuộc trò chuyện

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL,
    -- 'direct' | 'group' | 'class'
  class_id UUID REFERENCES classes(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_class_id ON conversations(class_id);
CREATE INDEX idx_conversations_type ON conversations(type);
```

---

### 7.3. messages

**Mô tả**: Tin nhắn

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  type VARCHAR(20) DEFAULT 'text',
    -- 'text' | 'file' | 'system'
  content TEXT NOT NULL,
  metadata JSONB,
  
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

---

## 8. Admin & System Tables

### 8.1. attendance_sessions

**Mô tả**: Buổi điểm danh

```sql
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME,
  notes TEXT,
  marked_by UUID NOT NULL REFERENCES users(id),
  marked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(class_id, session_date)
);

CREATE INDEX idx_attendance_sessions_class_id ON attendance_sessions(class_id);
CREATE INDEX idx_attendance_sessions_session_date ON attendance_sessions(session_date DESC);
```

---

### 8.2. attendance_records

**Mô tả**: Bản ghi điểm danh

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  status VARCHAR(20) NOT NULL,
    -- 'present' | 'late' | 'absent'
  note TEXT,
  
  marked_by UUID NOT NULL REFERENCES users(id),
  marked_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);
```

---

### 8.3. class_schedule

**Mô tả**: Lịch học

```sql
CREATE TABLE class_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  title VARCHAR(255),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  location VARCHAR(255),
  zoom_link VARCHAR(500),
  meeting_id VARCHAR(100),
  meeting_password VARCHAR(100),
  
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  
  status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled' | 'completed' | 'cancelled'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_class_schedule_class_id ON class_schedule(class_id);
CREATE INDEX idx_class_schedule_date ON class_schedule(date);
CREATE INDEX idx_class_schedule_status ON class_schedule(status);
```

---

### 8.4. exam_submissions

**Mô tả**: Đề thi chờ duyệt

```sql
CREATE TABLE exam_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id UUID NOT NULL REFERENCES users(id),
  
  skill VARCHAR(20) NOT NULL,
  level VARCHAR(10) NOT NULL,
  title VARCHAR(255),
  
  content_file_url VARCHAR(500),
  answer_key_file_url VARCHAR(500),
  uploader_notes TEXT,
  
  status VARCHAR(20) DEFAULT 'draft',
    -- 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published'
  
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  reviewer_notes TEXT,
  rejection_reason VARCHAR(100),
  
  exercise_id UUID REFERENCES exercises(id),
  
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  published_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exam_submissions_status ON exam_submissions(status);
CREATE INDEX idx_exam_submissions_uploader ON exam_submissions(uploader_id);
CREATE INDEX idx_exam_submissions_reviewer ON exam_submissions(reviewed_by);
```

---

### 8.5. system_config

**Mô tả**: Cấu hình hệ thống

```sql
CREATE TABLE system_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_config_category ON system_config(category);
```

---

### 8.6. admin_logs

**Mô tả**: Log hành động admin

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  target_user_id UUID REFERENCES users(id),
  details JSONB,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_target_user ON admin_logs(target_user_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
```

---

## 9. Entity Relationship Diagram

### 9.1. Core Relationships

```
users (1) ---- (M) user_profiles
users (1) ---- (M) sessions
users (1) ---- (M) exercise_submissions
users (1) ---- (M) classes [as teacher]
users (M) ---- (M) classes [as student via class_students]
users (1) ---- (M) assignments [as teacher]
users (1) ---- (M) assignment_submissions [as student]
users (1) ---- (M) mock_exams
users (1) ---- (M) certificates

exercises (1) ---- (M) exercise_submissions
exercises (1) ---- (M) assignments [optional]

classes (1) ---- (M) class_students
classes (1) ---- (M) assignments
classes (1) ---- (M) materials
classes (1) ---- (M) attendance_sessions
classes (1) ---- (M) class_schedule

assignments (1) ---- (M) assignment_submissions

mock_exams (1) ---- (1) certificates

badges (M) ---- (M) users [via user_badges]
goals (M) ---- (1) users
```

---

## 10. Indexes & Optimization

### 10.1. Performance Indexes

**Most Critical**:
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status) WHERE deleted_at IS NULL;

-- Exercise queries
CREATE INDEX idx_exercises_skill_level_public ON exercises(skill, level, is_public) 
  WHERE deleted_at IS NULL;

-- Submission queries
CREATE INDEX idx_exercise_submissions_user_status ON exercise_submissions(user_id, status);
CREATE INDEX idx_assignment_submissions_user_assignment ON assignment_submissions(user_id, assignment_id);

-- Class queries
CREATE INDEX idx_class_students_user_status ON class_students(user_id, status);
CREATE INDEX idx_classes_teacher_status ON classes(teacher_id, status);

-- Notification queries
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) 
  WHERE is_read = FALSE AND is_deleted = FALSE;
```

---

### 10.2. Query Optimization Tips

**Use EXPLAIN ANALYZE**:
```sql
EXPLAIN ANALYZE SELECT * FROM exercises 
WHERE skill = 'reading' AND level = 'B2' AND is_public = TRUE;
```

**Pagination**:
```sql
-- Good (uses index)
SELECT * FROM exercises 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- Better (cursor-based)
SELECT * FROM exercises 
WHERE created_at < $cursor 
ORDER BY created_at DESC 
LIMIT 20;
```

**Aggregations**:
```sql
-- Avoid SELECT COUNT(*) on large tables
-- Use approximate counts or cache the result
SELECT reltuples::bigint AS estimate 
FROM pg_class 
WHERE relname = 'exercises';
```

---

## Kết thúc Database Design

Tài liệu này tổng hợp 45+ tables với đầy đủ indexes và relationships cho hệ thống VSTEPRO.
