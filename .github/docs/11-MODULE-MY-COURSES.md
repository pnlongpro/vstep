# 📚 Module 11: My Courses

> **Module khóa học trực tuyến có cấu trúc**
> 
> File: `11-MODULE-MY-COURSES.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

My Courses module cung cấp khóa học có cấu trúc với lessons, quizzes, và progress tracking.

**Khác với Practice Mode**:
- Practice: Làm bài tự do
- Courses: Học theo lộ trình có cấu trúc

---

## Course Structure

### 1. Course Hierarchy

```
Course
├── Module 1
│   ├── Lesson 1.1
│   │   ├── Video
│   │   ├── Reading Material
│   │   └── Quiz
│   ├── Lesson 1.2
│   └── Module Quiz
├── Module 2
└── Final Exam
```

---

### 2. Course Card

```tsx
<CourseCard>
  <Thumbnail src={course.image} />
  <Badge>{course.level}</Badge>
  
  <Title>{course.title}</Title>
  <Description>{course.description}</Description>
  
  <Stats>
    <Stat>
      <Icon>📚</Icon>
      <Label>{course.lessonCount} lessons</Label>
    </Stat>
    <Stat>
      <Icon>⏱️</Icon>
      <Label>{course.duration} hours</Label>
    </Stat>
  </Stats>
  
  <Progress value={course.progress} />
  <Button>
    {course.progress > 0 ? 'Continue' : 'Start Course'}
  </Button>
</CourseCard>
```

---

### 3. Course Detail Page

```tsx
<CourseDetail>
  <Header>
    <Title>{course.title}</Title>
    <Instructor>By {instructor.name}</Instructor>
    <Rating value={4.5} reviews={234} />
  </Header>
  
  <Tabs>
    <Tab>Overview</Tab>
    <Tab>Curriculum</Tab>
    <Tab>Reviews</Tab>
  </Tabs>
  
  <TabContent tab="curriculum">
    <ModuleList>
      {modules.map(module => (
        <Module>
          <ModuleHeader>
            <Title>{module.title}</Title>
            <Duration>{module.duration}</Duration>
          </ModuleHeader>
          
          <LessonList>
            {module.lessons.map(lesson => (
              <Lesson>
                <Icon type={lesson.type} />
                <Title>{lesson.title}</Title>
                <Duration>{lesson.duration}</Duration>
                <Status>
                  {lesson.completed ? '✓' : '🔒'}
                </Status>
              </Lesson>
            ))}
          </LessonList>
        </Module>
      ))}
    </ModuleList>
  </TabContent>
</CourseDetail>
```

---

### 4. Lesson Player

```tsx
<LessonPlayer>
  <VideoPlayer src={lesson.videoUrl} />
  
  <LessonNav>
    <Button onClick={prevLesson}>← Previous</Button>
    <Button onClick={nextLesson}>Next →</Button>
  </LessonNav>
  
  <Tabs>
    <Tab>Notes</Tab>
    <Tab>Resources</Tab>
    <Tab>Discussion</Tab>
  </Tabs>
  
  <MarkCompleteButton onClick={markComplete}>
    Mark as Complete
  </MarkCompleteButton>
</LessonPlayer>
```

---

## Database Design

### Table: courses

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  level VARCHAR(10),
  instructor_id UUID REFERENCES users(id),
  
  duration_hours DECIMAL(5,1),
  lesson_count INTEGER DEFAULT 0,
  
  is_published BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: course_modules

```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id),
  title VARCHAR(255),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: course_lessons

```sql
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id),
  title VARCHAR(255),
  type VARCHAR(50), -- 'video' | 'reading' | 'quiz'
  content JSONB,
  duration_minutes INTEGER,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: course_enrollments

```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  
  progress DECIMAL(5,2) DEFAULT 0,
  current_lesson_id UUID REFERENCES course_lessons(id),
  
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  UNIQUE(user_id, course_id)
);
```

### Table: lesson_progress

```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id),
  
  status VARCHAR(20) DEFAULT 'not_started',
  -- 'not_started' | 'in_progress' | 'completed'
  
  completed_at TIMESTAMP,
  
  UNIQUE(enrollment_id, lesson_id)
);
```

---

## API Endpoints

### GET /api/courses

Get all courses

### POST /api/courses/:id/enroll

Enroll in course

### GET /api/courses/:id/progress

Get course progress

### PUT /api/lessons/:id/complete

Mark lesson complete

---

## Kết thúc Module My Courses

Tích hợp với Module 02 (exercises embedded in lessons), Module 19 (course progress tracking).
