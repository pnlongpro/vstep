# 📚 CONTENT MANAGEMENT - QUẢN LÝ NỘI DUNG HỌC TẬP

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Chức năng chi tiết](#chức-năng-chi-tiết)
3. [Database Design](#database-design)
4. [API Endpoints](#api-endpoints)

---

## Tổng quan

### Mục đích
Module Content Management quản lý toàn bộ nội dung học tập trong hệ thống VSTEPRO, bao gồm courses, lessons, materials, videos, và tài liệu học tập.

### Phạm vi
- Quản lý khóa học (Courses)
- Quản lý bài học (Lessons)
- Quản lý tài liệu (Materials)
- Upload và quản lý file (Documents, Videos, Audio)
- Tổ chức nội dung theo cấu trúc (Course → Modules → Lessons)
- Theo dõi tiến độ học tập
- Content versioning

### Vai trò truy cập
- **Admin**: Full CRUD tất cả content
- **Teacher**: Create và manage content của mình
- **Student**: Read-only, track progress

---

## Chức năng chi tiết

### 1. Courses (Khóa học)

#### 1.1. Course Structure
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  skills: ('reading' | 'listening' | 'writing' | 'speaking')[];
  
  // Content
  thumbnail: string;
  trailer_video: string;
  syllabus_url: string;
  
  // Organization
  modules: Module[]; // Course divided into modules
  total_lessons: number;
  total_duration: number; // minutes
  
  // Metadata
  created_by: string; // Teacher ID
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[]; // Course IDs
  
  // Publishing
  status: 'draft' | 'published' | 'archived';
  published_at: Date;
  
  // Enrollment
  price: number;
  is_free: boolean;
  max_students: number;
  enrolled_count: number;
  
  // Stats
  average_rating: number;
  total_reviews: number;
  completion_rate: number; // %
  
  // Settings
  allow_comments: boolean;
  allow_downloads: boolean;
  certificate_enabled: boolean;
}
```

#### 1.2. Course Management Features
- **Create Course**: Wizard with steps (Basic Info → Content → Settings → Publish)
- **Edit Course**: Update any section
- **Duplicate Course**: Clone for new term
- **Archive Course**: Soft delete
- **Publish/Unpublish**: Control visibility
- **Preview Course**: See as student

### 2. Modules & Lessons

#### 2.1. Module Structure
```typescript
interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number; // Display order
  
  lessons: Lesson[];
  duration: number; // total minutes
  
  // Requirements
  is_locked: boolean;
  unlock_after: string; // Module ID to complete first
}
```

#### 2.2. Lesson Structure
```typescript
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  order: number;
  
  // Content Types
  content_type: 'video' | 'text' | 'quiz' | 'exercise' | 'live_session';
  content: any; // JSON based on type
  
  // Video Lesson
  video_url: string;
  video_duration: number;
  transcript: string;
  
  // Text Lesson
  text_content: string; // HTML or Markdown
  
  // Resources
  attachments: File[];
  external_links: Link[];
  
  // Settings
  is_preview: boolean; // Can view without enrollment
  is_required: boolean;
  passing_score: number; // for quizzes
  
  // Tracking
  views: number;
  average_watch_time: number;
  completion_rate: number;
}
```

#### 2.3. Lesson Types

**Video Lesson**:
- Upload video file
- YouTube/Vimeo embed
- Video player với controls
- Playback speed
- Subtitles/Captions
- Auto-bookmark last position
- Prevent skipping (optional)

**Text Lesson**:
- Rich text editor
- Markdown support
- Images và media embeds
- Code blocks
- LaTeX math formulas

**Quiz Lesson**:
- Multiple choice
- True/False
- Fill in the blank
- Matching
- Essay questions
- Auto-grading
- Feedback for each answer

**Exercise Lesson**:
- Reading/Listening/Writing/Speaking exercises
- Linked to question bank
- Auto or manual grading
- Detailed feedback

**Live Session**:
- Scheduled time
- Zoom/Meet integration
- Attendance tracking
- Recording (auto-save)

### 3. Materials (Tài liệu)

#### 3.1. Material Types
```typescript
interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'doc' | 'ppt' | 'excel' | 'image' | 'audio' | 'video' | 'link';
  
  // File
  file_url: string;
  file_size: number; // bytes
  file_type: string; // MIME type
  
  // Organization
  category: string; // "Grammar", "Vocabulary", "Practice Tests"
  tags: string[];
  level: string;
  skill: string;
  
  // Access Control
  is_public: boolean;
  access_level: 'free' | 'enrolled' | 'premium';
  
  // Usage
  downloads: number;
  views: number;
  
  // Owner
  uploaded_by: string;
  created_at: Date;
}
```

#### 3.2. Material Management
- **Upload Files**: Drag & drop multiple files
- **Organize**: Folders và categories
- **Search**: Full-text search trong PDF
- **Preview**: In-browser preview for PDF, images
- **Download**: Single hoặc bulk download
- **Share**: Generate shareable link
- **Embed**: Embed trong lessons

### 4. File Upload System

#### 4.1. Upload Process
```
User selects file
  ↓
Frontend validation:
  - File type allowed
  - File size < max (100MB for video, 10MB for docs)
  - Filename valid
  ↓
Upload to temporary storage
  ↓
Backend processing:
  - Virus scan
  - Extract metadata
  - Generate thumbnail (for video/image)
  - Convert formats (optional)
  ↓
Move to permanent storage (S3/CDN)
  ↓
Update database record
  ↓
Return file URL
```

#### 4.2. Supported File Types
- **Documents**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
- **Images**: JPG, PNG, GIF, WEBP, SVG
- **Audio**: MP3, WAV, OGG
- **Video**: MP4, WEBM, MOV
- **Archives**: ZIP, RAR
- **Text**: TXT, MD

#### 4.3. Storage Organization
```
/uploads/
  /courses/
    /{course_id}/
      /thumbnail.jpg
      /trailer.mp4
      /syllabus.pdf
  /lessons/
    /{lesson_id}/
      /video.mp4
      /transcript.vtt
      /attachments/
  /materials/
    /{year}/
      /{month}/
        /{file_id}.{ext}
  /user_uploads/
    /{user_id}/
      /avatar.jpg
      /submissions/
```

### 5. Progress Tracking

#### 5.1. Student Progress
```typescript
interface StudentProgress {
  student_id: string;
  course_id: string;
  
  // Overall Progress
  progress_percentage: number; // 0-100
  lessons_completed: number;
  total_lessons: number;
  
  // Time
  total_time_spent: number; // minutes
  last_accessed: Date;
  started_at: Date;
  completed_at: Date;
  
  // Performance
  quiz_scores: number[]; // array of scores
  average_score: number;
  exercises_completed: number;
  
  // Modules
  current_module_id: string;
  modules_completed: string[]; // Module IDs
  
  // Lessons
  lesson_progress: {
    lesson_id: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number; // % for videos
    score: number; // for quizzes
    attempts: number;
    last_position: number; // seconds for video
    completed_at: Date;
  }[];
  
  // Certificate
  certificate_issued: boolean;
  certificate_id: string;
  certificate_issued_at: Date;
}
```

#### 5.2. Auto-tracking
- Video watch time
- Lesson completion
- Quiz attempts và scores
- Time spent per lesson
- Last position in video
- Downloads
- Comments

### 6. Content Versioning

```typescript
interface ContentVersion {
  id: string;
  content_id: string;
  content_type: 'course' | 'lesson' | 'material';
  version: number;
  
  // Changes
  changes: any; // Full content snapshot
  change_description: string;
  changed_fields: string[];
  
  // Author
  changed_by: string;
  changed_at: Date;
  
  // Status
  is_current: boolean;
  
  // Rollback
  can_rollback: boolean;
}
```

Features:
- Auto-save versions on edit
- View version history
- Compare versions (diff)
- Rollback to previous version
- Version notes

---

## Database Design

### Table: courses

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  
  -- Level & Skills
  level VARCHAR(5) NOT NULL,
  skills JSONB, -- ["reading", "writing"]
  difficulty VARCHAR(20) DEFAULT 'intermediate',
  
  -- Content
  thumbnail VARCHAR(500),
  trailer_video VARCHAR(500),
  syllabus_url VARCHAR(500),
  
  -- Organization
  total_modules INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- minutes
  
  -- Author
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Prerequisites
  prerequisites JSONB, -- Array of course IDs
  learning_outcomes JSONB, -- ["Outcome 1", "Outcome 2"]
  
  -- Publishing
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  discount_price DECIMAL(10,2),
  
  -- Enrollment
  max_students INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  
  -- Stats
  average_rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  -- Settings
  allow_comments BOOLEAN DEFAULT TRUE,
  allow_downloads BOOLEAN DEFAULT TRUE,
  certificate_enabled BOOLEAN DEFAULT TRUE,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  meta_keywords JSONB,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMP,
  
  INDEX idx_courses_slug (slug),
  INDEX idx_courses_level (level),
  INDEX idx_courses_status (status),
  INDEX idx_courses_created_by (created_by),
  INDEX idx_courses_published (published_at)
);
```

### Table: course_modules

```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  
  -- Content
  total_lessons INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0, -- minutes
  
  -- Access Control
  is_locked BOOLEAN DEFAULT FALSE,
  unlock_after_module UUID REFERENCES course_modules(id),
  unlock_after_days INTEGER, -- Days after enrollment
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_modules_course (course_id),
  INDEX idx_modules_order (order_number),
  UNIQUE (course_id, order_number)
);
```

### Table: lessons

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  
  -- Content Type
  content_type VARCHAR(20) NOT NULL,
    -- ENUM: 'video', 'text', 'quiz', 'exercise', 'live_session', 'assignment'
  
  -- Video Lesson
  video_url VARCHAR(500),
  video_duration INTEGER, -- seconds
  video_provider VARCHAR(20), -- 'upload', 'youtube', 'vimeo'
  transcript TEXT,
  subtitles_url VARCHAR(500),
  
  -- Text Lesson
  text_content TEXT,
  content_format VARCHAR(20) DEFAULT 'html', -- 'html', 'markdown'
  
  -- Quiz/Exercise
  questions JSONB,
  passing_score INTEGER,
  time_limit INTEGER, -- minutes
  max_attempts INTEGER DEFAULT -1, -- -1 = unlimited
  
  -- Attachments
  attachments JSONB, -- [{"name": "file.pdf", "url": "...", "size": 12345}]
  external_links JSONB,
  
  -- Settings
  is_preview BOOLEAN DEFAULT FALSE,
  is_required BOOLEAN DEFAULT TRUE,
  is_downloadable BOOLEAN DEFAULT TRUE,
  prevent_skip BOOLEAN DEFAULT FALSE, -- For videos
  
  -- Stats
  views INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  average_watch_time INTEGER DEFAULT 0, -- seconds
  average_score DECIMAL(3,1) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_lessons_module (module_id),
  INDEX idx_lessons_type (content_type),
  INDEX idx_lessons_order (order_number),
  UNIQUE (module_id, order_number)
);
```

### Table: materials

```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- File
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL, -- bytes
  file_type VARCHAR(100), -- MIME type
  file_extension VARCHAR(10),
  
  -- Organization
  category VARCHAR(100),
  tags JSONB,
  level VARCHAR(5),
  skill VARCHAR(20),
  
  -- Thumbnail (for images/videos)
  thumbnail_url VARCHAR(500),
  
  -- Access Control
  is_public BOOLEAN DEFAULT FALSE,
  access_level VARCHAR(20) DEFAULT 'enrolled',
    -- ENUM: 'free', 'enrolled', 'premium', 'admin'
  
  -- Usage
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  -- Owner
  uploaded_by UUID NOT NULL REFERENCES users(id),
  folder_id UUID REFERENCES material_folders(id),
  
  -- Metadata
  metadata JSONB, -- Duration for video/audio, pages for PDF, etc.
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  INDEX idx_materials_category (category),
  INDEX idx_materials_level (level),
  INDEX idx_materials_skill (skill),
  INDEX idx_materials_uploaded_by (uploaded_by),
  INDEX idx_materials_folder (folder_id)
);
```

### Table: student_progress

```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Progress
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  
  -- Time
  total_time_spent INTEGER DEFAULT 0, -- minutes
  last_accessed_at TIMESTAMP,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Performance
  average_score DECIMAL(3,1) DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  quizzes_passed INTEGER DEFAULT 0,
  quizzes_failed INTEGER DEFAULT 0,
  
  -- Current Position
  current_module_id UUID REFERENCES course_modules(id),
  current_lesson_id UUID REFERENCES lessons(id),
  
  -- Certificate
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_id UUID,
  certificate_issued_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_progress_student (student_id),
  INDEX idx_progress_course (course_id),
  INDEX idx_progress_percentage (progress_percentage),
  UNIQUE (student_id, course_id)
);
```

### Table: lesson_progress

```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'not_started',
    -- ENUM: 'not_started', 'in_progress', 'completed'
  
  -- Progress
  progress DECIMAL(5,2) DEFAULT 0, -- For videos: % watched
  last_position INTEGER DEFAULT 0, -- For videos: seconds
  
  -- Quiz/Exercise
  score DECIMAL(3,1),
  attempts INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  
  -- Time
  time_spent INTEGER DEFAULT 0, -- seconds
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP,
  
  -- Bookmarks (for videos)
  bookmarks JSONB, -- [{"time": 120, "note": "Important point"}]
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_lesson_progress_student (student_id),
  INDEX idx_lesson_progress_lesson (lesson_id),
  INDEX idx_lesson_progress_status (status),
  UNIQUE (student_id, lesson_id)
);
```

### Table: content_versions

```sql
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content Reference
  content_id UUID NOT NULL,
  content_type VARCHAR(20) NOT NULL, -- 'course', 'lesson', 'material'
  
  -- Version
  version INTEGER NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Changes
  content_snapshot JSONB NOT NULL, -- Full content at this version
  change_description TEXT,
  changed_fields JSONB, -- ["title", "description"]
  
  -- Author
  changed_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_versions_content (content_id, content_type),
  INDEX idx_versions_current (is_current),
  UNIQUE (content_id, content_type, version)
);
```

---

## API Endpoints

### 1. Courses

**GET /api/courses** - Get course list  
**GET /api/courses/:id** - Get course detail  
**POST /api/courses** - Create course  
**PATCH /api/courses/:id** - Update course  
**DELETE /api/courses/:id** - Delete course  
**POST /api/courses/:id/publish** - Publish course  
**POST /api/courses/:id/enroll** - Enroll student  

### 2. Modules

**GET /api/courses/:courseId/modules** - Get modules  
**POST /api/courses/:courseId/modules** - Create module  
**PATCH /api/modules/:id** - Update module  
**DELETE /api/modules/:id** - Delete module  
**POST /api/modules/:id/reorder** - Reorder modules  

### 3. Lessons

**GET /api/modules/:moduleId/lessons** - Get lessons  
**GET /api/lessons/:id** - Get lesson detail  
**POST /api/modules/:moduleId/lessons** - Create lesson  
**PATCH /api/lessons/:id** - Update lesson  
**DELETE /api/lessons/:id** - Delete lesson  
**POST /api/lessons/:id/complete** - Mark lesson complete  

### 4. Materials

**GET /api/materials** - Get materials  
**GET /api/materials/:id** - Get material detail  
**POST /api/materials** - Upload material  
**PATCH /api/materials/:id** - Update material  
**DELETE /api/materials/:id** - Delete material  
**GET /api/materials/:id/download** - Download material  

### 5. Progress

**GET /api/courses/:id/progress** - Get student progress  
**POST /api/lessons/:id/progress** - Update lesson progress  
**GET /api/students/:id/courses** - Get enrolled courses  

### 6. File Upload

**POST /api/upload** - Upload file  
**POST /api/upload/video** - Upload video với processing  
**GET /api/upload/signed-url** - Get S3 signed URL  

---

## Summary

Module Content Management cung cấp:
- **Hierarchical content structure**: Course → Module → Lesson
- **Multiple content types**: Video, Text, Quiz, Exercise, Live Session
- **File management system**: Upload, organize, share
- **Progress tracking**: Detailed student progress
- **Content versioning**: History và rollback
- **6 core database tables** với relationships
- **20+ API endpoints** cho đầy đủ operations

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
