# 📝 EXAM & ASSIGNMENT MANAGEMENT - QUẢN LÝ ĐỀ THI VÀ BÀI TẬP

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Chức năng chi tiết](#chức-năng-chi-tiết)
3. [Database Design](#database-design)
4. [API Endpoints](#api-endpoints)

---

## Tổng quan

### Mục đích
Module Exam & Assignment Management quản lý toàn bộ đề thi, bài tập, câu hỏi, chấm điểm tự động và AI grading cho hệ thống VSTEPRO.

### Phạm vi
- Quản lý ngân hàng câu hỏi (Question Bank)
- Tạo và quản lý đề thi
- Tạo và giao bài tập
- Chấm điểm tự động (Reading, Listening)
- AI Grading (Writing, Speaking)
- Quản lý bài nộp (Submissions)
- Feedback và review

### Vai trò truy cập
- **Admin**: Full CRUD tất cả exams và questions
- **Teacher**: Create và manage exams/assignments của mình
- **Student**: Làm bài và xem kết quả

---

## Chức năng chi tiết

### 1. Question Bank (Ngân hàng câu hỏi)

#### 1.1. Question Types

**Reading Questions**:
```typescript
interface ReadingQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'matching' | 'gap_fill';
  
  // Passage
  passage_id: string;
  passage_title: string;
  passage_text: string;
  passage_length: number; // words
  
  // Question
  question_number: number;
  question_text: string;
  
  // Answers
  options: string[]; // For multiple choice
  correct_answer: string | string[];
  
  // Explanation
  explanation: string;
  
  // Metadata
  skill_focus: string; // "main_idea", "detail", "inference", "vocabulary"
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  
  // Usage Stats
  times_used: number;
  average_correct_rate: number; // %
}
```

**Listening Questions**:
```typescript
interface ListeningQuestion {
  id: string;
  type: 'multiple_choice' | 'gap_fill' | 'matching' | 'short_answer';
  
  // Audio
  audio_url: string;
  audio_duration: number; // seconds
  audio_script: string; // Transcript
  
  // Question
  part: 1 | 2 | 3;
  question_number: number;
  question_text: string;
  
  // Listening Settings
  play_count: number; // How many times can play (1, 2, unlimited)
  start_time: number; // Start at this second
  end_time: number; // End at this second
  
  // Answers
  options: string[];
  correct_answer: string | string[];
  
  // Metadata
  skill_focus: string;
  accent: 'american' | 'british' | 'australian';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}
```

**Writing Tasks**:
```typescript
interface WritingTask {
  id: string;
  type: 'task1' | 'task2';
  
  // Task 1: Graph/Chart/Letter
  task_type: 'graph' | 'chart' | 'table' | 'process' | 'letter' | 'email';
  image_url: string; // For graphs/charts
  
  // Task 2: Essay
  essay_type: 'argument' | 'discussion' | 'problem_solution' | 'opinion';
  
  // Prompt
  prompt: string;
  instructions: string;
  
  // Requirements
  min_words: number; // 150 for Task 1, 250 for Task 2
  max_words: number;
  time_limit: number; // minutes
  
  // Assessment Criteria
  criteria: {
    task_achievement: string;
    coherence_cohesion: string;
    lexical_resource: string;
    grammatical_accuracy: string;
  };
  
  // Sample Answer
  sample_answer: string;
  sample_score: number;
  
  // Band Descriptors
  band_descriptors: any;
}
```

**Speaking Prompts**:
```typescript
interface SpeakingPrompt {
  id: string;
  part: 1 | 2 | 3;
  
  // Part 1: Interview Questions
  questions: string[]; // 4-5 questions
  
  // Part 2: Cue Card
  topic: string;
  points_to_cover: string[];
  preparation_time: number; // 60 seconds
  speaking_time: number; // 120 seconds
  
  // Part 3: Discussion Questions
  follow_up_questions: string[];
  
  // Assessment Criteria
  criteria: {
    fluency_coherence: string;
    lexical_resource: string;
    grammatical_accuracy: string;
    pronunciation: string;
  };
  
  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard';
  topic_category: string; // "education", "technology", "health"
}
```

#### 1.2. Question Management

**Create Question**:
- Rich text editor for question text
- Upload images/audio
- Add options và correct answers
- Set difficulty và points
- Add explanation
- Tag với skills và topics
- Preview question

**Edit Question**:
- Update any field
- Version control
- See usage statistics
- View in exams

**Question Search & Filter**:
- Search by text
- Filter by:
  - Skill (Reading, Listening, Writing, Speaking)
  - Type (Multiple choice, Gap fill, etc.)
  - Difficulty
  - Topic/Tag
  - Author
  - Usage count
- Sort by creation date, difficulty, usage

**Bulk Operations**:
- Import from CSV/Excel
- Export questions
- Duplicate questions
- Bulk edit (tags, difficulty)
- Bulk delete

---

### 2. Exam Management

#### 2.1. Exam Structure

```typescript
interface Exam {
  id: string;
  
  // Basic Info
  title: string;
  code: string; // VSTEP-R-B2-001
  description: string;
  instructions: string;
  
  // Type & Level
  exam_type: 'practice' | 'mock_exam' | 'official';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  skills: ('reading' | 'listening' | 'writing' | 'speaking')[];
  
  // Structure
  sections: ExamSection[];
  total_questions: number;
  total_points: number;
  passing_score: number;
  
  // Timing
  total_duration: number; // minutes
  time_per_section: {
    reading?: number;
    listening?: number;
    writing?: number;
    speaking?: number;
  };
  
  // Settings
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results: 'immediately' | 'after_submission' | 'manual';
  allow_review: boolean;
  allow_retake: boolean;
  max_attempts: number;
  
  // Access Control
  is_public: boolean;
  password_protected: boolean;
  password: string;
  available_from: Date;
  available_to: Date;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  
  // Stats
  attempts: number;
  completions: number;
  average_score: number;
  
  // Author
  created_by: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  published_at: Date;
}
```

#### 2.2. Exam Section

```typescript
interface ExamSection {
  id: string;
  exam_id: string;
  
  // Info
  title: string; // "Part 1: Short Texts"
  description: string;
  order: number;
  
  // Content
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  questions: Question[];
  total_questions: number;
  total_points: number;
  
  // Timing
  time_limit: number; // minutes
  
  // Instructions
  instructions: string;
  sample_question: Question;
  
  // Settings
  can_skip: boolean;
  can_go_back: boolean;
}
```

#### 2.3. Create Exam Workflow

```
Step 1: Basic Information
  - Title, Description
  - Exam type, Level
  - Skills to include
  
Step 2: Add Content
  For each skill:
    - Select from Question Bank
    - Or create new questions
    - Organize into sections
    - Set points per question
    
Step 3: Configure Settings
  - Time limits
  - Passing score
  - Shuffle settings
  - Result display
  - Access control
  
Step 4: Review & Preview
  - Preview as student
  - Check total time
  - Verify point distribution
  - Test all questions
  
Step 5: Publish
  - Set availability dates
  - Publish exam
  - Generate exam code
  - Share with students
```

#### 2.4. Upload Exam (Admin Feature)

Modal with tabs for uploading complete exam:

**Tab 1: Basic Info**
- Title, Level, Skills
- Upload thumbnail

**Tab 2: Reading Section** (if selected)
- Upload passage text
- Add questions (multiple choice, gap fill)
- Set correct answers

**Tab 3: Listening Section** (if selected)
- Upload audio file
- Add questions
- Set play count
- Upload transcript

**Tab 4: Writing Section** (if selected)
- Task 1: Upload graph/chart or provide letter prompt
- Task 2: Provide essay prompt
- Upload sample answers
- Upload band descriptors

**Tab 5: Speaking Section** (if selected)
- Part 1: Interview questions
- Part 2: Cue card topic
- Part 3: Discussion questions
- Upload assessment criteria

**Tab 6: Answer Key**
- Upload answer key file (Excel/PDF)
- Or manually enter answers
- Verify all answers

**Tab 7: Settings & Publish**
- Time limits
- Passing score
- Availability
- Toggle publish

---

### 3. Assignment Management

#### 3.1. Assignment Structure

```typescript
interface Assignment {
  id: string;
  
  // Info
  title: string;
  description: string;
  instructions: string;
  
  // Type
  assignment_type: 'homework' | 'quiz' | 'project' | 'practice';
  
  // Content
  exam_id: string; // Can link to existing exam
  questions: Question[]; // Or custom questions
  
  // Class Assignment
  class_id: string;
  assigned_to: 'all' | string[]; // All students or specific IDs
  
  // Timing
  assigned_date: Date;
  due_date: Date;
  allow_late_submission: boolean;
  late_penalty: number; // % per day
  
  // Grading
  total_points: number;
  passing_score: number;
  grading_method: 'auto' | 'manual' | 'ai';
  
  // Settings
  time_limit: number; // minutes, null = no limit
  max_attempts: number;
  show_correct_answers: boolean;
  show_score_immediately: boolean;
  
  // Submissions
  total_submissions: number;
  graded_submissions: number;
  average_score: number;
  
  // Status
  status: 'draft' | 'assigned' | 'closed' | 'graded';
  
  // Author
  created_by: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}
```

#### 3.2. Create Assignment

```
1. Teacher selects class
2. Click "Create Assignment"
3. Fill form:
   - Title, Description
   - Select existing exam OR create new
   - Set due date
   - Configure grading
   - Select students (all or specific)
4. Preview assignment
5. Assign to class
6. Students receive notification
```

#### 3.3. Assign to Class

Process:
```
Teacher creates assignment
  ↓
Select class(es)
  ↓
Set due date and rules
  ↓
Assign
  ↓
For each student in class:
  - Create assignment_submission record
  - Send notification
  - Add to student calendar
  ↓
Students can view in "Assignments" page
```

---

### 4. Submissions & Grading

#### 4.1. Submission Structure

```typescript
interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  exam_id: string;
  
  // Attempt
  attempt_number: number;
  
  // Answers
  answers: {
    question_id: string;
    answer: any; // Text, selected option, file upload
    is_correct?: boolean; // For auto-graded
    points_earned?: number;
  }[];
  
  // Files (for Writing/Speaking)
  files: {
    type: 'essay' | 'audio' | 'video';
    url: string;
    size: number;
  }[];
  
  // Timing
  started_at: Date;
  submitted_at: Date;
  time_spent: number; // seconds
  is_late: boolean;
  
  // Grading
  status: 'in_progress' | 'submitted' | 'grading' | 'graded';
  
  // Auto Grading
  auto_score: number;
  auto_graded_at: Date;
  
  // Manual/AI Grading
  graded_score: number;
  graded_by: string; // Teacher ID or 'ai'
  graded_at: Date;
  
  // Feedback
  overall_feedback: string;
  question_feedback: {
    question_id: string;
    feedback: string;
    score: number;
  }[];
  
  // AI Grading (Writing/Speaking)
  ai_scores: {
    task_achievement?: number;
    coherence_cohesion?: number;
    lexical_resource?: number;
    grammatical_accuracy?: number;
    fluency_coherence?: number;
    pronunciation?: number;
  };
  ai_feedback: string;
  
  // Final Score
  final_score: number;
  percentage: number;
  passed: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}
```

#### 4.2. Auto Grading (Reading/Listening)

Process:
```
Student submits exam
  ↓
For each question:
  - Compare student answer with correct answer
  - Mark as correct/incorrect
  - Calculate points earned
  ↓
Sum total score
  ↓
Calculate percentage
  ↓
Determine pass/fail
  ↓
Generate auto feedback:
  - Correct answers count
  - Score breakdown by section
  - Strengths/weaknesses
  ↓
Save results
  ↓
Show results to student (if immediate)
  ↓
Send notification
```

#### 4.3. AI Grading (Writing/Speaking)

**Writing AI Grading**:
```
Student submits essay
  ↓
Extract text from submission
  ↓
API call to AI service (OpenAI/Custom):
  - Prompt: "Grade this VSTEP essay based on 4 criteria..."
  - Include: Essay text, task prompt, band descriptors
  ↓
AI analyzes and returns:
  - Task Achievement: 7.0/9.0
  - Coherence & Cohesion: 7.5/9.0
  - Lexical Resource: 7.0/9.0
  - Grammatical Range: 6.5/9.0
  - Overall Band: 7.0
  - Detailed feedback (200 words)
  - Suggestions for improvement
  ↓
Save AI scores and feedback
  ↓
Calculate final score
  ↓
Teacher can review and adjust
  ↓
Release to student
```

**Speaking AI Grading**:
```
Student records audio
  ↓
Upload audio file
  ↓
Speech-to-text transcription
  ↓
API call to AI for analysis:
  - Transcribed text
  - Audio features (pronunciation, fluency)
  ↓
AI returns:
  - Fluency & Coherence: 7.0/9.0
  - Lexical Resource: 6.5/9.0
  - Grammatical Range: 7.0/9.0
  - Pronunciation: 7.5/9.0
  - Overall Band: 7.0
  - Transcription with corrections
  - Pronunciation issues highlighted
  - Suggestions
  ↓
Save results
  ↓
Teacher reviews (can adjust scores)
  ↓
Release to student
```

#### 4.4. Manual Grading by Teacher

Interface:
```
Teacher opens "Grade Assignments"
  ↓
See list of submissions:
  - Student name
  - Submitted time
  - Status (Needs grading)
  ↓
Click on submission
  ↓
Grading interface:
  Left: Student work
    - Essay text or audio player
    - Can play speaking recording
  Right: Grading form
    - Criteria scores (sliders 0-9)
    - Overall feedback (textarea)
    - Strengths (textarea)
    - Areas to improve (textarea)
  ↓
Teacher fills scores and feedback
  ↓
Preview grade
  ↓
Submit grade
  ↓
Student receives notification
  ↓
Grade appears in student's results
```

---

### 5. Results & Analytics

#### 5.1. Student Results View

Individual result shows:
- Overall score and percentage
- Pass/Fail status
- Time taken
- Section breakdown:
  - Reading: 32/40 (80%)
  - Listening: 28/35 (80%)
  - Writing: 7.0/9.0
  - Speaking: 7.5/9.0
- Detailed feedback
- Correct/Incorrect answers (if allowed)
- AI feedback (for Writing/Speaking)
- Teacher comments
- Suggestions for improvement

#### 5.2. Class Results Analytics

Teacher view for assignment:
- **Overview Stats**:
  - Total submissions: 25/30
  - Average score: 7.2
  - Pass rate: 88%
  - Completion rate: 83%

- **Score Distribution** (Histogram):
  - 0-4: 1 student
  - 4-5.5: 2 students
  - 5.5-7: 8 students
  - 7-8.5: 10 students
  - 8.5-10: 4 students

- **Question Analysis**:
  For each question:
    - Correct rate: 85%
    - Most common wrong answer
    - Difficulty index

- **Student Performance Table**:
  - Name, Score, Time, Status
  - Sort by any column
  - Filter by pass/fail

- **Insights**:
  - Difficult questions
  - Common mistakes
  - Top performers
  - Students needing help

---

## Database Design

### Table: questions

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type
  skill VARCHAR(20) NOT NULL, -- reading, listening, writing, speaking
  question_type VARCHAR(50) NOT NULL,
    -- reading: multiple_choice, true_false, matching, gap_fill
    -- listening: multiple_choice, gap_fill, short_answer
    -- writing: task1, task2
    -- speaking: part1, part2, part3
  
  -- Content
  question_text TEXT,
  question_number INTEGER,
  
  -- Reading
  passage_id UUID REFERENCES passages(id),
  
  -- Listening
  audio_url VARCHAR(500),
  audio_duration INTEGER,
  audio_script TEXT,
  play_count INTEGER DEFAULT 2,
  
  -- Writing
  prompt TEXT,
  task_type VARCHAR(50),
  image_url VARCHAR(500), -- For graphs/charts
  min_words INTEGER,
  max_words INTEGER,
  sample_answer TEXT,
  
  -- Speaking
  part INTEGER, -- 1, 2, 3
  topic VARCHAR(200),
  points_to_cover JSONB,
  preparation_time INTEGER,
  speaking_time INTEGER,
  
  -- Answers
  options JSONB, -- For multiple choice
  correct_answer TEXT,
  correct_answers JSONB, -- For multiple correct answers
  
  -- Assessment
  points DECIMAL(4,1) DEFAULT 1,
  difficulty VARCHAR(20) DEFAULT 'medium',
  
  -- Criteria (Writing/Speaking)
  assessment_criteria JSONB,
  band_descriptors JSONB,
  
  -- Explanation
  explanation TEXT,
  
  -- Metadata
  tags JSONB,
  skill_focus VARCHAR(100),
  topic VARCHAR(100),
  
  -- Usage Stats
  times_used INTEGER DEFAULT 0,
  average_correct_rate DECIMAL(5,2),
  difficulty_index DECIMAL(3,2), -- Calculated from attempts
  
  -- Author
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_questions_skill (skill),
  INDEX idx_questions_type (question_type),
  INDEX idx_questions_difficulty (difficulty),
  INDEX idx_questions_created_by (created_by),
  INDEX idx_questions_tags USING GIN (tags)
);
```

### Table: passages

```sql
CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(200),
  text TEXT NOT NULL,
  word_count INTEGER,
  
  -- Metadata
  level VARCHAR(5),
  topic VARCHAR(100),
  source VARCHAR(200),
  
  -- Image
  image_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Table: exams

```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title VARCHAR(200) NOT NULL,
  code VARCHAR(50) UNIQUE,
  description TEXT,
  instructions TEXT,
  
  -- Type
  exam_type VARCHAR(20) NOT NULL DEFAULT 'practice',
  level VARCHAR(5) NOT NULL,
  skills JSONB, -- ["reading", "writing"]
  
  -- Structure
  total_questions INTEGER DEFAULT 0,
  total_points DECIMAL(6,1) DEFAULT 0,
  passing_score DECIMAL(6,1),
  
  -- Timing
  total_duration INTEGER, -- minutes
  time_per_section JSONB, -- {"reading": 60, "writing": 60}
  
  -- Settings
  shuffle_questions BOOLEAN DEFAULT FALSE,
  shuffle_options BOOLEAN DEFAULT FALSE,
  show_results VARCHAR(20) DEFAULT 'immediately',
  allow_review BOOLEAN DEFAULT TRUE,
  allow_retake BOOLEAN DEFAULT TRUE,
  max_attempts INTEGER DEFAULT -1,
  
  -- Access Control
  is_public BOOLEAN DEFAULT TRUE,
  password_protected BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  available_from TIMESTAMP,
  available_to TIMESTAMP,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  
  -- Stats
  attempts INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  
  -- Author
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  
  INDEX idx_exams_code (code),
  INDEX idx_exams_type (exam_type),
  INDEX idx_exams_level (level),
  INDEX idx_exams_status (status),
  INDEX idx_exams_created_by (created_by)
);
```

### Table: exam_sections

```sql
CREATE TABLE exam_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  instructions TEXT,
  order_number INTEGER NOT NULL,
  
  -- Content
  skill VARCHAR(20) NOT NULL,
  total_questions INTEGER DEFAULT 0,
  total_points DECIMAL(6,1) DEFAULT 0,
  
  -- Timing
  time_limit INTEGER, -- minutes
  
  -- Settings
  can_skip BOOLEAN DEFAULT TRUE,
  can_go_back BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_sections_exam (exam_id),
  INDEX idx_sections_order (order_number),
  UNIQUE (exam_id, order_number)
);
```

### Table: exam_questions

```sql
CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  section_id UUID REFERENCES exam_sections(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  
  -- Order
  order_number INTEGER NOT NULL,
  
  -- Points (can override question default)
  points DECIMAL(4,1),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_exam_questions_exam (exam_id),
  INDEX idx_exam_questions_section (section_id),
  INDEX idx_exam_questions_question (question_id),
  UNIQUE (exam_id, order_number)
);
```

### Table: assignments

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Type
  assignment_type VARCHAR(20) DEFAULT 'homework',
  
  -- Content
  exam_id UUID REFERENCES exams(id),
  
  -- Class Assignment
  class_id UUID REFERENCES classes(id),
  assigned_to JSONB, -- null = all students, or array of student IDs
  
  -- Timing
  assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  allow_late_submission BOOLEAN DEFAULT TRUE,
  late_penalty DECIMAL(4,1) DEFAULT 0, -- % per day
  
  -- Grading
  total_points DECIMAL(6,1),
  passing_score DECIMAL(6,1),
  grading_method VARCHAR(20) DEFAULT 'auto', -- auto, manual, ai
  
  -- Settings
  time_limit INTEGER,
  max_attempts INTEGER DEFAULT 1,
  show_correct_answers BOOLEAN DEFAULT TRUE,
  show_score_immediately BOOLEAN DEFAULT TRUE,
  
  -- Stats
  total_submissions INTEGER DEFAULT 0,
  graded_submissions INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'assigned',
  
  -- Author
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP,
  
  INDEX idx_assignments_class (class_id),
  INDEX idx_assignments_exam (exam_id),
  INDEX idx_assignments_status (status),
  INDEX idx_assignments_due_date (due_date)
);
```

### Table: submissions

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Attempt
  attempt_number INTEGER DEFAULT 1,
  
  -- Answers
  answers JSONB NOT NULL, -- Array of {question_id, answer, is_correct, points}
  
  -- Files (Writing/Speaking)
  files JSONB, -- [{type, url, size}]
  
  -- Timing
  started_at TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP,
  time_spent INTEGER, -- seconds
  is_late BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'in_progress',
  
  -- Auto Grading
  auto_score DECIMAL(6,2),
  auto_graded_at TIMESTAMP,
  
  -- Manual/AI Grading
  graded_score DECIMAL(6,2),
  graded_by UUID REFERENCES users(id),
  grading_type VARCHAR(10), -- 'teacher', 'ai'
  graded_at TIMESTAMP,
  
  -- Feedback
  overall_feedback TEXT,
  question_feedback JSONB, -- [{question_id, feedback, score}]
  
  -- AI Scores (Writing/Speaking)
  ai_scores JSONB,
  ai_feedback TEXT,
  ai_processing_time INTEGER, -- ms
  
  -- Final Result
  final_score DECIMAL(6,2),
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_submissions_assignment (assignment_id),
  INDEX idx_submissions_exam (exam_id),
  INDEX idx_submissions_student (student_id),
  INDEX idx_submissions_status (status),
  INDEX idx_submissions_submitted (submitted_at),
  
  UNIQUE (assignment_id, student_id, attempt_number)
);
```

### Table: ai_grading_logs

```sql
CREATE TABLE ai_grading_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  
  -- Request
  skill VARCHAR(20) NOT NULL, -- writing, speaking
  input_text TEXT, -- Essay or transcript
  input_file_url VARCHAR(500), -- Audio file for speaking
  prompt_used TEXT,
  
  -- AI Service
  ai_service VARCHAR(50), -- 'openai', 'custom'
  model VARCHAR(50), -- 'gpt-4', 'gpt-3.5-turbo'
  
  -- Response
  ai_response JSONB, -- Full AI response
  scores JSONB,
  feedback TEXT,
  processing_time INTEGER, -- ms
  
  -- Cost
  tokens_used INTEGER,
  cost DECIMAL(10,6), -- USD
  
  -- Status
  status VARCHAR(20), -- success, error, timeout
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_ai_logs_submission (submission_id),
  INDEX idx_ai_logs_skill (skill),
  INDEX idx_ai_logs_status (status),
  INDEX idx_ai_logs_created (created_at)
);
```

---

## API Endpoints

### 1. Questions

**GET /api/questions** - Get question list with filters  
**GET /api/questions/:id** - Get question detail  
**POST /api/questions** - Create question  
**PATCH /api/questions/:id** - Update question  
**DELETE /api/questions/:id** - Delete question  
**POST /api/questions/import** - Bulk import from CSV/Excel  
**GET /api/questions/export** - Export questions  

### 2. Exams

**GET /api/exams** - Get exam list  
**GET /api/exams/:id** - Get exam detail  
**POST /api/exams** - Create exam  
**PATCH /api/exams/:id** - Update exam  
**DELETE /api/exams/:id** - Delete exam  
**POST /api/exams/:id/publish** - Publish exam  
**POST /api/exams/:id/duplicate** - Duplicate exam  
**GET /api/exams/:id/preview** - Preview as student  
**POST /api/exams/upload** - Upload complete exam with content  

### 3. Assignments

**GET /api/assignments** - Get assignments (filtered by class/student)  
**GET /api/assignments/:id** - Get assignment detail  
**POST /api/assignments** - Create assignment  
**PATCH /api/assignments/:id** - Update assignment  
**DELETE /api/assignments/:id** - Delete assignment  
**POST /api/assignments/:id/assign** - Assign to class  

### 4. Submissions

**POST /api/exams/:id/start** - Start exam (create submission)  
**PATCH /api/submissions/:id/answer** - Save answer (auto-save)  
**POST /api/submissions/:id/submit** - Submit exam  
**GET /api/submissions/:id** - Get submission detail  
**GET /api/submissions/:id/result** - Get result  

### 5. Grading

**POST /api/submissions/:id/auto-grade** - Trigger auto grading  
**POST /api/submissions/:id/ai-grade** - Trigger AI grading  
**POST /api/submissions/:id/manual-grade** - Teacher grades  
**PATCH /api/submissions/:id/feedback** - Add feedback  

### 6. Analytics

**GET /api/assignments/:id/analytics** - Get assignment analytics  
**GET /api/exams/:id/analytics** - Get exam analytics  
**GET /api/questions/:id/stats** - Get question statistics  

---

## Summary

Module Exam & Assignment Management cung cấp:
- **Complete question bank** cho 4 kỹ năng VSTEP
- **Flexible exam builder** với nhiều options
- **Assignment system** với class integration
- **Auto grading** cho Reading/Listening
- **AI grading** cho Writing/Speaking với detailed feedback
- **Comprehensive analytics** cho teachers
- **8 core database tables** với complex relationships
- **25+ API endpoints** đầy đủ chức năng

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
