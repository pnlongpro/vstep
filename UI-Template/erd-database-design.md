# 🗄️ ERD & DATABASE DESIGN - THIẾT KẾ CƠ SỞ DỮ LIỆU

## Mục lục
1. [Tổng quan Database](#tổng-quan-database)
2. [Danh sách tất cả bảng](#danh-sách-tất-cả-bảng)
3. [ERD Diagram (Text-based)](#erd-diagram-text-based)
4. [Chi tiết từng bảng](#chi-tiết-từng-bảng)
5. [Indexes và Constraints](#indexes-và-constraints)
6. [Database Schema (DBML)](#database-schema-dbml)

---

## Tổng quan Database

### Thông tin chung
- **Database Engine**: Mysql 8.0+
- **Character Set**: UTF-8
- **Collation**: Vietnamese (vi_VN)
- **Timezone**: Asia/Ho_Chi_Minh
- **Tổng số bảng**: 40+ tables
- **Storage Engine**: Default (Mysql)

### Nguyên tắc thiết kế
1. **Normalization**: Chuẩn hóa đến 3NF
2. **UUID Primary Keys**: Sử dụng UUID thay vì auto-increment
3. **Soft Delete**: Sử dụng deletedAt thay vì xóa thật
4. **Timestamps**: Mọi bảng có createdAt, updatedAt
5. **JSONB**: Sử dụng cho flexible data
6. **Indexes**: Index cho foreign keys và search fields
7. **Constraints**: NOT NULL, CHECK, UNIQUE, FOREIGN KEY

---

## Danh sách tất cả bảng

### 1. Core Tables (Người dùng & Phân quyền)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| users | Tất cả người dùng trong hệ thống | 15,000 |
| userProfiles | Thông tin chi tiết người dùng | 15,000 |
| roles | Vai trò trong hệ thống | 3 |
| permissions | Quyền hạn | 50 |
| userStats | Thống kê hoạt động người dùng | 15,000 |
| loginHistory | Lịch sử đăng nhập | 500,000 |
| sessions | Phiên đăng nhập active | 2,000 |
| passwordResetTokens | Token reset mật khẩu | 100 |
| activityLogs | Nhật ký hoạt động | 1,000,000 |

### 2. Student Tables (Học viên)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| studentProfiles | Profile học viên | 12,000 |
| enrollments | Ghi danh khóa học/lớp | 20,000 |
| studentTestResults | Kết quả thi của học viên | 200,000 |
| studentAttendance | Điểm danh học viên | 100,000 |
| studentAchievements | Thành tích học viên | 50,000 |
| studentNotes | Ghi chú của học viên | 30,000 |
| studentProgress | Tiến độ học viên | 20,000 |
| lessonProgress | Tiến độ từng bài học | 100,000 |

### 3. Teacher Tables (Giáo viên)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| teacherProfiles | Profile giáo viên | 250 |
| teacherStats | Thống kê giảng dạy | 250 |
| teacherReviews | Đánh giá giáo viên | 5,000 |
| teacherAvailability | Lịch khả dụng | 1,000 |
| teacherTimeOff | Nghỉ phép | 500 |
| teacherEvaluations | Đánh giá định kỳ | 1,000 |

### 4. Class Tables (Lớp học)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| classes | Lớp học | 50 |
| classTeachers | Giáo viên phụ trách lớp | 60 |
| classStudents | Học viên trong lớp | 1,500 |
| classSchedules | Lịch học | 150 |
| classSessions | Các buổi học | 2,000 |
| sessionAttendance | Điểm danh từng buổi | 50,000 |
| classInvitations | Link mời vào lớp | 100 |
| classAssignments | Bài tập của lớp | 500 |
| classStats | Thống kê lớp học | 50 |

### 5. Content Tables (Nội dung)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| courses | Khóa học | 100 |
| courseModules | Module trong khóa học | 500 |
| lessons | Bài học | 2,000 |
| materials | Tài liệu | 5,000 |
| materialFolders | Thư mục tài liệu | 200 |
| contentVersions | Phiên bản nội dung | 10,000 |

### 6. Exam & Question Tables (Đề thi & Câu hỏi)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| questions | Ngân hàng câu hỏi | 10,000 |
| passages | Đoạn văn Reading | 500 |
| exams | Đề thi | 300 |
| examSections | Phần của đề thi | 1,200 |
| examQuestions | Câu hỏi trong đề | 30,000 |
| assignments | Bài tập | 500 |
| submissions | Bài nộp | 20,000 |
| aiGradingLogs | Log chấm AI | 10,000 |

### 7. Notification Tables (Thông báo)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| notifications | Thông báo | 500,000 |
| notificationPreferences | Tùy chọn thông báo | 15,000 |
| notificationTemplates | Mẫu thông báo | 50 |
| pushSubscriptions | Đăng ký push notification | 5,000 |
| notificationLogs | Log gửi thông báo | 1,000,000 |

### 8. Analytics & Reporting Tables
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| analyticsEvents | Sự kiện analytics | 5,000,000 |
| dailyStats | Thống kê theo ngày | 1,000 |
| reports | Báo cáo đã tạo | 5,000 |

### 9. Gamification Tables
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| badges | Định nghĩa huy hiệu | 50 |
| userBadges | Huy hiệu của user | 50,000 |
| goals | Mục tiêu | 30,000 |
| goalProgress | Tiến độ mục tiêu | 30,000 |

### 10. Payment Tables (Optional)
| Bảng | Mô tả | Rows (estimated) |
|------|-------|------------------|
| transactions | Giao dịch thanh toán | 10,000 |
| subscriptions | Đăng ký gói | 5,000 |
| invoices | Hóa đơn | 10,000 |

---

## ERD Diagram (Text-based)

### Mermaid ERD

```mermaid
erDiagram
    %% Core Entities
    users ||--o{ userProfiles : has
    users ||--o{ sessions : has
    users ||--o{ loginHistory : has
    users ||--o{ userStats : has
    users ||--o{ activityLogs : creates
    users ||--o{ notifications : receives
    
    %% Student Entities
    users ||--o| studentProfiles : is
    users ||--o{ enrollments : enrolls
    users ||--o{ studentTestResults : takes
    users ||--o{ studentAttendance : attends
    users ||--o{ studentProgress : tracks
    
    %% Teacher Entities
    users ||--o| teacherProfiles : is
    users ||--o{ teacherStats : has
    users ||--o{ teacherReviews : receives
    users ||--o{ teacherEvaluations : receives
    
    %% Class Relationships
    classes ||--o{ classTeachers : has
    classes ||--o{ classStudents : has
    classes ||--o{ classSchedules : has
    classes ||--o{ classSessions : has
    classes ||--o{ classAssignments : has
    
    users ||--o{ classTeachers : teaches
    users ||--o{ classStudents : studies
    
    classSessions ||--o{ sessionAttendance : has
    users ||--o{ sessionAttendance : records
    
    %% Content Relationships
    courses ||--o{ courseModules : contains
    courseModules ||--o{ lessons : contains
    users ||--o{ courses : creates
    
    users ||--o{ materials : uploads
    
    courses ||--o{ enrollments : enrolls_in
    courses ||--o{ studentProgress : tracks
    lessons ||--o{ lessonProgress : tracks
    
    %% Exam Relationships
    users ||--o{ questions : authors
    exams ||--o{ examSections : contains
    examSections ||--o{ examQuestions : contains
    questions ||--o{ examQuestions : used_in
    
    classes ||--o{ assignments : assigns
    exams ||--o{ assignments : uses
    
    assignments ||--o{ submissions : receives
    users ||--o{ submissions : submits
    submissions ||--o{ aiGradingLogs : logs
    
    %% Notification Relationships
    users ||--o{ notifications : receives
    users ||--o| notificationPreferences : has
    users ||--o{ pushSubscriptions : subscribes
    
    %% Gamification
    users ||--o{ userBadges : earns
    badges ||--o{ userBadges : awarded
    users ||--o{ goals : sets
```

---

## Chi tiết từng bảng

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  bio TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'Student',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  emailVerified BOOLEAN DEFAULT FALSE,
  emailVerifiedAt TIMESTAMP,
  lastLoginAt TIMESTAMP,
  lastLoginIp VARCHAR(45),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  deletedAt TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

#### userProfiles
```sql
CREATE TABLE userProfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  dateOfBirth DATE,
  gender VARCHAR(10),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Vietnam',
  language VARCHAR(10) DEFAULT 'vi',
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  notificationEmail BOOLEAN DEFAULT TRUE,
  notificationPush BOOLEAN DEFAULT TRUE,
  facebookUrl VARCHAR(255),
  linkedinUrl VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### [Continue với tất cả các bảng khác...]

---

## Database Schema (DBML)

```dbml
// VSTEPRO Database Schema

// ===== CORE TABLES =====

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [not null]
  email varchar(255) [not null, unique]
  phone varchar(20)
  password varchar(255) [not null]
  avatar varchar(500)
  bio text
  role varchar(20) [not null, default: 'Student', note: 'Student, Teacher, Admin']
  status varchar(20) [not null, default: 'active', note: 'active, inactive, banned, deleted']
  emailVerified boolean [default: false]
  emailVerifiedAt timestamp
  lastLoginAt timestamp
  lastLoginIp varchar(45)
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  deletedAt timestamp
  
  indexes {
    email
    role
    status
    createdAt
  }
}

Table userProfiles {
  id uuid [pk]
  userId uuid [ref: - users.id, unique, not null]
  dateOfBirth date
  gender varchar(10)
  address text
  city varchar(100)
  country varchar(100) [default: 'Vietnam']
  language varchar(10) [default: 'vi']
  timezone varchar(50) [default: 'Asia/Ho_Chi_Minh']
  notificationEmail boolean [default: true]
  notificationPush boolean [default: true]
  facebookUrl varchar(255)
  linkedinUrl varchar(255)
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

Table roles {
  id uuid [pk]
  name varchar(50) [not null, unique, note: 'Student, Teacher, Admin']
  displayName varchar(100) [not null]
  description text
  permissions jsonb
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

Table permissions {
  id uuid [pk]
  name varchar(100) [not null, unique, note: 'practice.access, user.create']
  displayName varchar(100) [not null]
  description text
  module varchar(50) [note: 'practice, user, exam']
  createdAt timestamp [not null, default: `now()`]
}

// ===== STUDENT TABLES =====

Table studentProfiles {
  id uuid [pk]
  userId uuid [ref: - users.id, unique, not null]
  studentCode varchar(50) [unique, note: 'SV-2024-00123']
  enrollmentDate date [not null, default: `current_date`]
  graduationDate date
  currentLevel varchar(5) [default: 'A2']
  targetLevel varchar(5) [default: 'B2']
  education varchar(200)
  major varchar(100)
  occupation varchar(100)
  purpose text
  emergencyContactName varchar(100)
  emergencyContactPhone varchar(20)
  preferredLearningTime varchar(50)
  learningStyle varchar(50)
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

Table studentTestResults {
  id uuid [pk]
  studentId uuid [ref: > users.id, not null]
  testId uuid
  testType varchar(20) [not null, note: 'reading, listening, writing, speaking']
  testMode varchar(20) [not null, note: 'practice, exam, mock_exam']
  level varchar(5)
  score decimal(3,1) [not null]
  totalQuestions integer
  correctAnswers integer
  percentage decimal(5,2)
  timeTaken integer [note: 'in seconds']
  startedAt timestamp [not null]
  submittedAt timestamp [not null]
  classId uuid [ref: > classes.id]
  assignmentId uuid
  status varchar(20) [default: 'completed']
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    studentId
    testType
    level
    submittedAt
  }
}

// ===== TEACHER TABLES =====

Table teacherProfiles {
  id uuid [pk]
  userId uuid [ref: - users.id, unique, not null]
  teacherCode varchar(50) [unique, note: 'GV-2023-00045']
  title varchar(10) [note: 'TS., ThS., GV.']
  joinedDate date [not null, default: `current_date`]
  employmentType varchar(20) [not null, default: 'full_time']
  status varchar(20) [default: 'active']
  education jsonb
  certifications jsonb
  experience integer [default: 0]
  specialties jsonb
  levelsTaught jsonb
  bio text
  achievements jsonb
  publications jsonb
  linkedinUrl varchar(255)
  websiteUrl varchar(255)
  maxHoursPerWeek integer [default: 40]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

Table teacherStats {
  id uuid [pk]
  teacherId uuid [ref: - users.id, unique, not null]
  currentClasses integer [default: 0]
  totalClasses integer [default: 0]
  currentStudents integer [default: 0]
  totalStudentsTaught integer [default: 0]
  coursesCreated integer [default: 0]
  averageRating decimal(2,1) [default: 0]
  totalReviews integer [default: 0]
  studentPassRate decimal(5,2) [default: 0]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

// ===== CLASS TABLES =====

Table classes {
  id uuid [pk]
  code varchar(50) [unique, not null, note: 'VST-B2-2024-15']
  name varchar(200) [not null]
  description text
  level varchar(5) [not null, note: 'A2, B1, B2, C1']
  maxStudents integer [not null, default: 30]
  minStudents integer [default: 5]
  enrolled integer [default: 0]
  startDate date [not null]
  endDate date [not null]
  durationWeeks integer
  status varchar(20) [not null, default: 'upcoming']
  isPublic boolean [default: true]
  requireApproval boolean [default: false]
  thumbnail varchar(500)
  syllabusUrl varchar(500)
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  archivedAt timestamp
  
  indexes {
    code
    level
    status
    startDate
  }
}

Table classTeachers {
  id uuid [pk]
  classId uuid [ref: > classes.id, not null]
  teacherId uuid [ref: > users.id, not null]
  role varchar(20) [not null, default: 'primary', note: 'primary, assistant, substitute']
  assignedAt timestamp [not null, default: `now()`]
  removedAt timestamp
  isActive boolean [default: true]
  createdAt timestamp [not null, default: `now()`]
  
  indexes {
    classId
    teacherId
    (classId, teacherId, role) [unique]
  }
}

Table classStudents {
  id uuid [pk]
  classId uuid [ref: > classes.id, not null]
  studentId uuid [ref: > users.id, not null]
  joinedAt timestamp [not null, default: `now()`]
  enrollmentMethod varchar(50)
  status varchar(20) [not null, default: 'active']
  progress decimal(5,2) [default: 0]
  attendedSessions integer [default: 0]
  totalSessions integer [default: 0]
  attendanceRate decimal(5,2) [default: 0]
  averageScore decimal(3,1) [default: 0]
  removedAt timestamp
  completedAt timestamp
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    classId
    studentId
    status
  }
}

// ===== CONTENT TABLES =====

Table courses {
  id uuid [pk]
  title varchar(200) [not null]
  slug varchar(250) [unique]
  description text
  level varchar(5) [not null]
  skills jsonb
  thumbnail varchar(500)
  totalModules integer [default: 0]
  totalLessons integer [default: 0]
  totalDuration integer [default: 0]
  createdBy uuid [ref: > users.id, not null]
  status varchar(20) [default: 'draft']
  publishedAt timestamp
  price decimal(10,2) [default: 0]
  isFree boolean [default: true]
  enrolledCount integer [default: 0]
  averageRating decimal(2,1) [default: 0]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    slug
    level
    status
    createdBy
  }
}

Table courseModules {
  id uuid [pk]
  courseId uuid [ref: > courses.id, not null]
  title varchar(200) [not null]
  description text
  orderNumber integer [not null]
  totalLessons integer [default: 0]
  duration integer [default: 0]
  isLocked boolean [default: false]
  unlockAfterModule uuid [ref: > courseModules.id]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    courseId
    (courseId, orderNumber) [unique]
  }
}

Table lessons {
  id uuid [pk]
  moduleId uuid [ref: > courseModules.id, not null]
  title varchar(200) [not null]
  description text
  orderNumber integer [not null]
  contentType varchar(20) [not null, note: 'video, text, quiz, exercise']
  videoUrl varchar(500)
  videoDuration integer
  textContent text
  questions jsonb
  attachments jsonb
  isPreview boolean [default: false]
  isRequired boolean [default: true]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    moduleId
    contentType
    (moduleId, orderNumber) [unique]
  }
}

// ===== EXAM TABLES =====

Table questions {
  id uuid [pk]
  skill varchar(20) [not null, note: 'reading, listening, writing, speaking']
  questionType varchar(50) [not null]
  questionText text
  passageId uuid [ref: > passages.id]
  audioUrl varchar(500)
  options jsonb
  correctAnswer text
  correctAnswers jsonb
  points decimal(4,1) [default: 1]
  difficulty varchar(20) [default: 'medium']
  explanation text
  tags jsonb
  timesUsed integer [default: 0]
  createdBy uuid [ref: > users.id, not null]
  status varchar(20) [default: 'active']
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    skill
    questionType
    difficulty
    createdBy
  }
}

Table exams {
  id uuid [pk]
  title varchar(200) [not null]
  code varchar(50) [unique]
  description text
  examType varchar(20) [not null, default: 'practice']
  level varchar(5) [not null]
  skills jsonb
  totalQuestions integer [default: 0]
  totalPoints decimal(6,1) [default: 0]
  passingScore decimal(6,1)
  totalDuration integer
  status varchar(20) [default: 'draft']
  createdBy uuid [ref: > users.id, not null]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  publishedAt timestamp
  
  indexes {
    code
    examType
    level
    status
  }
}

Table assignments {
  id uuid [pk]
  title varchar(200) [not null]
  description text
  assignmentType varchar(20) [default: 'homework']
  examId uuid [ref: > exams.id]
  classId uuid [ref: > classes.id]
  assignedDate timestamp [not null, default: `now()`]
  dueDate timestamp [not null]
  totalPoints decimal(6,1)
  passingScore decimal(6,1)
  gradingMethod varchar(20) [default: 'auto']
  status varchar(20) [default: 'assigned']
  createdBy uuid [ref: > users.id, not null]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    classId
    examId
    status
    dueDate
  }
}

Table submissions {
  id uuid [pk]
  assignmentId uuid [ref: > assignments.id]
  examId uuid [ref: > exams.id, not null]
  studentId uuid [ref: > users.id, not null]
  attemptNumber integer [default: 1]
  answers jsonb [not null]
  startedAt timestamp [not null]
  submittedAt timestamp
  timeSpent integer
  status varchar(20) [default: 'in_progress']
  autoScore decimal(6,2)
  gradedScore decimal(6,2)
  finalScore decimal(6,2)
  percentage decimal(5,2)
  passed boolean
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
  
  indexes {
    assignmentId
    examId
    studentId
    status
    (assignmentId, studentId, attemptNumber) [unique]
  }
}

// ===== NOTIFICATION TABLES =====

Table notifications {
  id uuid [pk]
  userId uuid [ref: > users.id, not null]
  type varchar(50) [not null]
  category varchar(20) [not null]
  title varchar(200) [not null]
  message text [not null]
  actionUrl varchar(500)
  data jsonb
  isRead boolean [default: false]
  readAt timestamp
  createdAt timestamp [not null, default: `now()`]
  
  indexes {
    userId
    type
    category
    isRead
    createdAt
  }
}

// ===== ANALYTICS TABLES =====

Table analyticsEvents {
  id uuid [pk]
  userId uuid [ref: > users.id]
  sessionId uuid
  eventType varchar(50) [not null]
  eventName varchar(100)
  properties jsonb
  ipAddress varchar(45)
  deviceType varchar(20)
  createdAt timestamp [not null, default: `now()`]
  
  indexes {
    userId
    eventType
    createdAt
  }
}

Table dailyStats {
  id uuid [pk]
  date date [not null, unique]
  totalUsers integer [default: 0]
  newUsers integer [default: 0]
  activeUsers integer [default: 0]
  testsTaken integer [default: 0]
  averageScore decimal(3,1)
  revenue decimal(10,2) [default: 0]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null, default: `now()`]
}

// ===== RELATIONSHIPS SUMMARY =====

// One-to-One
Ref: users.id - userProfiles.userId
Ref: users.id - studentProfiles.userId
Ref: users.id - teacherProfiles.userId
Ref: users.id - teacherStats.teacherId

// One-to-Many
Ref: users.id < studentTestResults.studentId
Ref: users.id < notifications.userId
Ref: users.id < courses.createdBy
Ref: courses.id < courseModules.courseId
Ref: courseModules.id < lessons.moduleId
Ref: classes.id < classStudents.classId
Ref: classes.id < classTeachers.classId
Ref: users.id < classStudents.studentId
Ref: users.id < classTeachers.teacherId
Ref: exams.id < assignments.examId
Ref: assignments.id < submissions.assignmentId

// Many-to-Many (through junction tables)
// users <-> classes through classStudents
// users <-> classes through classTeachers
// questions <-> exams through examQuestions
```

---

## Indexes và Constraints

### Primary Keys
Tất cả bảng sử dụng UUID làm primary key:
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

### Foreign Keys
Sử dụng ON DELETE CASCADE hoặc SET NULL tùy business logic:
```sql
-- CASCADE: Xóa child khi xóa parent
userId UUID REFERENCES users(id) ON DELETE CASCADE

-- SET NULL: Set NULL khi xóa parent
createdBy UUID REFERENCES users(id) ON DELETE SET NULL
```

### Unique Constraints
```sql
-- Single column
email VARCHAR(255) UNIQUE

-- Multiple columns (composite unique)
UNIQUE (classId, studentId, removedAt)
```

### Check Constraints
```sql
-- Validate values
CHECK (endDate > startDate)
CHECK (enrolled <= maxStudents)
CHECK (score >= 0 AND score <= 10)
```

### Indexes for Performance
```sql
-- Single column indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Composite indexes
CREATE INDEX idx_submissions_assignment_student 
  ON submissions(assignmentId, studentId);

-- JSONB indexes (GIN)
CREATE INDEX idx_questions_tags ON questions USING GIN (tags);

-- Partial indexes
CREATE INDEX idx_active_users 
  ON users(createdAt) WHERE deletedAt IS NULL;
```

---

## Summary

Database VSTEPRO bao gồm:
- **40+ tables** được tổ chức logic
- **UUID primary keys** cho scalability
- **Comprehensive relationships**: 1-1, 1-n, n-n
- **JSONB fields** cho flexibility
- **Soft deletes** cho data retention
- **Indexes** optimize cho queries
- **Constraints** đảm bảo data integrity
- **Normalized** đến 3NF
- **Estimated 10M+ rows** khi production

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
