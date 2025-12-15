# 🔄 User Flows - Consolidated

> **Tổng hợp tất cả user flows của hệ thống VSTEPRO**
> 
> File: `25-USER-FLOWS.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Authentication Flows](#1-authentication-flows)
- [2. Practice Flows](#2-practice-flows)
- [3. Exam Flows](#3-exam-flows)
- [4. Class Management Flows](#4-class-management-flows)
- [5. Assignment Flows](#5-assignment-flows)
- [6. Admin Flows](#6-admin-flows)

---

## 1. Authentication Flows

### 1.1. Đăng ký Flow

```
Start: User visits homepage
  ↓
Click "Đăng ký"
  ↓
Navigate to /register
  ↓
Fill registration form:
  ├─ Full Name
  ├─ Email
  ├─ Password
  ├─ Confirm Password
  └─ Accept Terms
  ↓
Submit form
  ↓
Frontend validation:
  ├─ All fields filled?
  ├─ Email format valid?
  ├─ Password >= 8 chars?
  ├─ Passwords match?
  └─ Terms accepted?
  ↓
  ├─ NO → Show error messages
  │         Stay on form
  │
  └─ YES → Continue
          ↓
POST /api/auth/register
  ↓
Backend validation:
  ├─ Email unique?
  ├─ Password strong enough?
  └─ Data sanitized?
  ↓
  ├─ FAIL → Return 422 error
  │          Show error message
  │
  └─ SUCCESS → Continue
              ↓
Create user record:
  ├─ Hash password
  ├─ Generate verification token
  ├─ Set role = 'student'
  ├─ Set status = 'pending'
  └─ Save to database
  ↓
Send verification email:
  ├─ Subject: "Verify your email"
  ├─ Link: /verify-email?token=xxx
  └─ Send via email service
  ↓
Return 201 response:
  ├─ userId
  ├─ email
  └─ message: "Please verify email"
  ↓
Frontend:
  ├─ Show success message
  ├─ Display "Check your email" notice
  └─ Redirect to /verify-email-sent
  ↓
End: User checks email
```

---

### 1.2. Đăng nhập Flow

```
Start: User visits /login
  ↓
Fill login form:
  ├─ Email
  └─ Password
  ↓
Submit form
  ↓
POST /api/auth/login
  ↓
Backend check:
  ├─ User exists?
  ├─ Password correct?
  ├─ Email verified?
  ├─ Account active?
  └─ Not locked?
  ↓
  ├─ FAIL → Increment failed attempts
  │          ├─ Attempts >= 5? → Lock account
  │          └─ Return 401 error
  │
  └─ SUCCESS → Continue
              ↓
Generate tokens:
  ├─ Access token (15 min)
  └─ Refresh token (30 days)
  ↓
Create session:
  ├─ Save refresh token
  ├─ Record device info
  ├─ Record IP address
  └─ Set last_login_at
  ↓
Return 200 response:
  ├─ accessToken
  ├─ refreshToken
  ├─ user info
  └─ expiresIn
  ↓
Frontend:
  ├─ Save tokens to localStorage
  ├─ Set auth state
  ├─ Redirect based on role:
  │   ├─ Student → /dashboard
  │   ├─ Teacher → /teacher/dashboard
  │   ├─ Admin → /admin/dashboard
  │   └─ Uploader → /uploader/dashboard
  └─ Show welcome message
  ↓
End: User on dashboard
```

---

## 2. Practice Flows

### 2.1. Practice Exercise Flow

```
Start: Student on /practice
  ↓
View Practice Home:
  ├─ 4 skill cards (Reading, Listening, Writing, Speaking)
  ├─ Recent exercises
  └─ Continue saved exercises
  ↓
Click skill card (e.g., "Reading")
  ↓
Navigate to /practice/reading
  ↓
Choose practice mode:
  ├─ Part Practice → Select part (1, 2, 3)
  └─ Full Test → All parts
  ↓
Select mode → Show exercises list
  ↓
GET /api/exercises?skill=reading&type=part_practice&part=1
  ↓
Display exercises:
  ├─ Filter by level (A2/B1/B2/C1)
  ├─ Sort by date/difficulty
  └─ Show: title, level, questions count, duration
  ↓
Click exercise card
  ↓
Navigate to /practice/reading/exercise/:id
  ↓
Load exercise:
  ├─ GET /api/exercises/:id
  ├─ Show instructions
  ├─ Show pre-start screen:
  │   ├─ Exercise info
  │   ├─ Time limit
  │   ├─ Question count
  │   └─ [Start Exercise] button
  └─ Wait for user to start
  ↓
Click "Start Exercise"
  ↓
POST /api/submissions (create submission)
  ↓
Backend:
  ├─ Create submission record
  ├─ Set status = 'in_progress'
  ├─ Set started_at = NOW()
  └─ Return submissionId
  ↓
Frontend:
  ├─ Start timer
  ├─ Load exercise content
  ├─ Display reading interface:
  │   ├─ Passage (left side)
  │   ├─ Questions (right side)
  │   ├─ Answer inputs/options
  │   └─ Navigation: Previous/Next
  └─ Enable auto-save
  ↓
User answers questions:
  ├─ Click answer option
  ├─ Answer saved to local state
  ├─ Every 30 seconds → Auto-save
  │   └─ PUT /api/submissions/:id/save
  └─ Continue answering
  ↓
Time up OR User clicks "Submit"
  ↓
Confirm submission:
  ├─ Show modal: "Submit exam?"
  ├─ Warning: "You cannot change answers"
  └─ Buttons: [Cancel] [Confirm Submit]
  ↓
Click "Confirm Submit"
  ↓
POST /api/submissions/:id/submit
  ↓
Backend:
  ├─ Save final answers
  ├─ Set status = 'submitted'
  ├─ Set submitted_at = NOW()
  ├─ Calculate time_spent
  ├─ Auto-grade (for Reading):
  │   ├─ Compare answers with answer_key
  │   ├─ Calculate score
  │   ├─ Generate feedback
  │   └─ Create grading_result
  └─ Return result
  ↓
Frontend:
  ├─ Navigate to /practice/result/:submissionId
  ├─ Display results:
  │   ├─ Overall score (8.5/10)
  │   ├─ Correct/Total (34/40)
  │   ├─ Percentage (85%)
  │   ├─ Time spent
  │   ├─ Question-by-question breakdown
  │   ├─ Explanations
  │   └─ Strengths/Weaknesses
  ├─ Actions:
  │   ├─ [Review Answers]
  │   ├─ [Practice Again]
  │   └─ [Back to Practice Home]
  └─ Update user stats:
      ├─ Add to history
      ├─ Update avg score
      └─ Check badge unlock
  ↓
End: User reviews result
```

---

### 2.2. Writing/Speaking (AI Grading) Flow

```
Start: User submits Writing/Speaking exercise
  ↓
POST /api/submissions/:id/submit
  ↓
Backend:
  ├─ Save submission
  ├─ Set status = 'submitted'
  ├─ Queue for AI grading:
  │   └─ POST /api/grading/ai-grade
  └─ Return 202 Accepted
  ↓
Frontend:
  ├─ Navigate to /practice/result/:id
  ├─ Show "Grading in progress..."
  ├─ Display loading animation
  ├─ Estimated time: "30-60 seconds"
  └─ Poll for result:
      └─ GET /api/grading/result/:id (every 5s)
  ↓
Backend AI Grading Process:
  ├─ Get submission from queue
  ├─ Build AI prompt:
  │   ├─ Task instructions
  │   ├─ Student's writing/transcript
  │   └─ Grading criteria
  ├─ Call OpenAI API:
  │   ├─ Model: gpt-4
  │   ├─ Temperature: 0.3
  │   └─ Response format: JSON
  ├─ Receive AI response:
  │   ├─ Criteria scores
  │   ├─ Overall score
  │   ├─ Feedback
  │   └─ Suggestions
  ├─ Validate response:
  │   ├─ Scores in range?
  │   ├─ All fields present?
  │   └─ Quality check
  ├─ Save grading_result:
  │   ├─ overall_score
  │   ├─ criteria_scores (JSONB)
  │   ├─ feedback (JSONB)
  │   ├─ ai_model
  │   └─ ai_cost
  ├─ Update submission:
  │   └─ status = 'graded'
  ├─ Send notification:
  │   └─ "Your writing has been graded"
  └─ Return result
  ↓
Frontend (after polling succeeds):
  ├─ Stop polling
  ├─ Display results:
  │   ├─ Overall Score: 7.5/10
  │   ├─ Criteria Scores:
  │   │   ├─ Task Achievement: 7.5
  │   │   ├─ Coherence: 8.0
  │   │   ├─ Vocabulary: 7.0
  │   │   └─ Grammar: 7.5
  │   ├─ Detailed Feedback:
  │   │   ├─ Overall comment
  │   │   ├─ Strengths (list)
  │   │   ├─ Weaknesses (list)
  │   │   └─ Suggestions (list)
  │   └─ Grammar Corrections:
  │       └─ Show errors with suggestions
  └─ Actions:
      ├─ [Practice Again]
      ├─ [View Similar Exercises]
      └─ [Back to Practice Home]
  ↓
End: User reviews AI feedback
```

---

## 3. Exam Flows

### 3.1. Mock Exam Full Flow

```
Start: Student on /dashboard
  ↓
Click "Thi thử Random" card
  ↓
Navigate to /mock-exam
  ↓
Display Mock Exam page:
  ├─ Title: "Thi thử VSTEP"
  ├─ Description
  ├─ Select level: [A2] [B1] [B2] [C1]
  └─ [Random 4 đề] button
  ↓
Select level (e.g., B2)
  ↓
Click "Random 4 đề"
  ↓
POST /api/mock-exams/random { level: "B2" }
  ↓
Backend:
  ├─ Query 1 Reading exercise (B2, full_test)
  ├─ Query 1 Listening exercise (B2, full_test)
  ├─ Query 1 Writing exercise (B2, full_test)
  ├─ Query 1 Speaking exercise (B2, full_test)
  └─ Return 4 exercises (randomized)
  ↓
Frontend:
  ├─ Display 4 randomized exams
  ├─ Show exam info:
  │   ├─ Reading: 40 questions, 60 min
  │   ├─ Listening: 35 questions, 40 min
  │   ├─ Writing: 2 tasks, 60 min
  │   └─ Speaking: 3 parts, 12 min
  ├─ Total time: 172 minutes
  ├─ Warning: "Không thể tạm dừng"
  └─ [Xác nhận và bắt đầu thi] button
  ↓
Click "Xác nhận và bắt đầu thi"
  ↓
Confirmation modal:
  ├─ "Bạn có chắc chắn?"
  ├─ "Bài thi sẽ kéo dài 172 phút"
  ├─ "Không thể tạm dừng hoặc quay lại"
  └─ [Hủy] [Bắt đầu ngay]
  ↓
Click "Bắt đầu ngay"
  ↓
POST /api/mock-exams
  ↓
Backend:
  ├─ Create mock_exam record
  ├─ Set started_at = NOW()
  ├─ Link 4 exercises
  ├─ Set status = 'in_progress'
  └─ Return mockExamId
  ↓
Frontend:
  ├─ Navigate to /mock-exam/:id/reading
  ├─ Start global timer: 172:00
  ├─ Lock navigation (can't leave page)
  ├─ Display full-screen exam interface
  └─ Start Reading section
  ↓
Reading Section (60 minutes):
  ├─ Display reading passages & questions
  ├─ User answers questions
  ├─ Auto-save every 30s
  ├─ Show section timer: 60:00 countdown
  └─ When time up OR user clicks "Next Section"
      ↓
Skill Transition Modal:
  ├─ "Reading section completed"
  ├─ "Next: Listening"
  ├─ Instructions for Listening
  ├─ "Click Start when ready"
  └─ [Start Listening] button
  ↓
Click "Start Listening"
  ↓
Listening Section (40 minutes):
  ├─ Display audio player & questions
  ├─ User listens & answers
  ├─ Audio can be played multiple times
  ├─ Auto-save every 30s
  └─ When time up OR user clicks "Next Section"
      ↓
Transition Modal: "Next: Writing"
  ↓
Writing Section (60 minutes):
  ├─ Task 1: Email/Letter (20 min)
  ├─ Task 2: Essay (40 min)
  ├─ Text editor with word count
  ├─ Auto-save every 30s
  └─ When time up OR user clicks "Next Section"
      ↓
Transition Modal: "Next: Speaking"
  ↓
Speaking Section (12 minutes):
  ├─ Part 1: Self-introduction (warm-up)
  ├─ Part 2: Solution discussion (long turn)
  ├─ Part 3: Topic discussion (follow-up)
  ├─ Voice recorder for each part
  ├─ Auto-save recordings
  └─ When time up OR user clicks "Finish Exam"
      ↓
Final Confirmation:
  ├─ "Submit exam?"
  ├─ "You cannot change answers"
  └─ [Cancel] [Submit]
  ↓
Click "Submit"
  ↓
POST /api/mock-exams/:id/complete
  ↓
Backend:
  ├─ Set completed_at = NOW()
  ├─ Set status = 'completed'
  ├─ Create 4 submissions (one per skill)
  ├─ Auto-grade Reading & Listening immediately
  ├─ Queue Writing & Speaking for AI grading
  └─ Return 200 OK
  ↓
Frontend:
  ├─ Navigate to /mock-exam/:id/result
  ├─ Show "Processing results..."
  ├─ Display:
  │   ├─ Reading: ✅ 8.0/10 (graded)
  │   ├─ Listening: ✅ 7.5/10 (graded)
  │   ├─ Writing: ⏳ Grading... (pending)
  │   └─ Speaking: ⏳ Grading... (pending)
  └─ Poll for full results every 10s
  ↓
After AI grading completes (30-120s):
  ├─ All 4 scores available
  ├─ Calculate overall score: (R+L+W+S)/4 = 7.5
  ├─ Determine band score: 7.5
  ├─ Generate certificate:
  │   └─ POST /api/certificates
  └─ Display full results
  ↓
Final Result Page:
  ├─ Overall Score: 7.5/10
  ├─ Band Score: 7.5 (VSTEP B2)
  ├─ Skill Breakdown:
  │   ├─ Reading: 8.0
  │   ├─ Listening: 7.5
  │   ├─ Writing: 7.0
  │   └─ Speaking: 7.5
  ├─ Certificate:
  │   ├─ Certificate Number: VSTEP-2024-001234
  │   ├─ Verification Code: ABC123
  │   └─ [Download Certificate] button
  ├─ Detailed Feedback (expandable)
  └─ Actions:
      ├─ [View Detailed Results]
      ├─ [Take Another Exam]
      └─ [Back to Dashboard]
  ↓
End: User views certificate
```

---

## 4. Class Management Flows

### 4.1. Create Class Flow (Teacher)

```
Start: Teacher on /teacher/classes
  ↓
Click "Tạo lớp mới"
  ↓
Open Create Class modal
  ↓
Fill form:
  ├─ Class name *
  ├─ Description
  ├─ Level (A2/B1/B2/C1)
  ├─ Max students
  ├─ Start date
  ├─ End date
  └─ Meeting link
  ↓
Click "Tạo lớp"
  ↓
POST /api/classes
  ↓
Backend:
  ├─ Validate input
  ├─ Generate unique class_code (6 chars)
  ├─ Create class record:
  │   ├─ teacher_id = current user
  │   ├─ status = 'active'
  │   └─ student_count = 0
  └─ Return classId + classCode
  ↓
Frontend:
  ├─ Close modal
  ├─ Show success: "Lớp đã được tạo! Code: ABC123"
  ├─ Navigate to /teacher/classes/:id
  └─ Display class detail page:
      ├─ Class info
      ├─ Class code (for students to join)
      ├─ Empty student list
      └─ Actions:
          ├─ [Mời học viên]
          ├─ [Giao bài tập]
          └─ [Upload tài liệu]
  ↓
End: Teacher can invite students
```

---

### 4.2. Join Class Flow (Student)

```
Start: Student receives invitation
  │
  ├─ Method 1: Email invitation
  │   ↓
  │   Student clicks link in email
  │   ↓
  │   Navigate to /classes/join?token=xxx
  │   ↓
  │   Verify token:
  │   ├─ Valid? → Auto-join class
  │   └─ Invalid/Expired? → Show error
  │
  ├─ Method 2: Class code
  │   ↓
  │   Student on /classes/join
  │   ↓
  │   Enter class code: "ABC123"
  │   ↓
  │   POST /api/classes/join { classCode: "ABC123" }
  │   ↓
  │   Backend:
  │   ├─ Find class by code
  │   ├─ Check if class active
  │   ├─ Check if not full
  │   ├─ Check if student not already in class
  │   ├─ Add student to class_students
  │   └─ Increment student_count
  │
  └─ Method 3: Join link
      ↓
      Student clicks shared link
      ↓
      Navigate to /classes/join/:classCode
      ↓
      Same as Method 2
  ↓
Success:
  ├─ Show "Joined successfully!"
  ├─ Navigate to /classes/:id
  ├─ Display class info:
  │   ├─ Class name, description
  │   ├─ Teacher info
  │   ├─ Schedule
  │   ├─ Materials
  │   └─ Assignments
  └─ Send notification to teacher
  ↓
End: Student in class
```

---

## 5. Assignment Flows

### 5.1. Create Assignment Flow (Teacher)

```
Start: Teacher on /teacher/classes/:classId
  ↓
Click tab "Bài tập"
  ↓
Click "Giao bài tập mới"
  ↓
Navigate to /teacher/assignments/create
  ↓
Step 1: Choose Source
  ├─ Option A: "Từ ngân hàng bài tập"
  │   ↓
  │   Browse exercises:
  │   ├─ Filter by skill, level
  │   ├─ Preview exercise
  │   └─ Select exercise
  │
  └─ Option B: "Tạo bài tập tùy chỉnh"
      ↓
      Create custom exercise
      (Not implemented yet)
  ↓
Selected exercise
  ↓
Click "Tiếp tục"
  ↓
Step 2: Configure Assignment
  ├─ Title (pre-filled from exercise)
  ├─ Description/Instructions
  ├─ Due date & time *
  ├─ Available from (optional)
  ├─ Max attempts (1-3)
  ├─ Time limit (optional)
  ├─ Grading method:
  │   ├─ Auto (Reading/Listening)
  │   ├─ AI (Writing/Speaking)
  │   └─ Manual
  ├─ Passing score (optional)
  └─ Options:
      ├─ [ ] Allow late submission
      ├─ [✓] Show answers after due date
      └─ [ ] Randomize questions
  ↓
Click "Tiếp tục"
  ↓
Step 3: Review & Publish
  ├─ Review all settings
  ├─ Preview: "This is how students will see it"
  └─ Options:
      ├─ [Save as Draft]
      └─ [Publish Now]
  ↓
Click "Publish Now"
  ↓
POST /api/assignments
  ↓
Backend:
  ├─ Create assignment record
  ├─ Link to class and exercise
  ├─ Set status = 'published'
  ├─ Create assignment_submission records for all students:
  │   └─ status = 'not_started'
  └─ Send notifications to all students
  ↓
Frontend:
  ├─ Show success: "Bài tập đã được giao!"
  ├─ Navigate to /teacher/classes/:classId/assignments
  └─ Display assignment in list
  ↓
Students receive notification:
  └─ "Bài tập mới: Reading Week 1"
  ↓
End: Assignment published
```

---

### 5.2. Submit Assignment Flow (Student)

```
Start: Student on /assignments
  ↓
View assignments list:
  ├─ Pending (not started/in progress)
  ├─ Completed
  └─ Overdue
  ↓
Click assignment card: "Reading Week 1"
  ↓
Navigate to /assignments/:id
  ↓
Display assignment detail:
  ├─ Title, description
  ├─ Due date (with countdown)
  ├─ Max attempts: 1/1 remaining
  ├─ Time limit: 60 minutes
  ├─ Status: "Not started"
  └─ [Bắt đầu làm bài] button
  ↓
Click "Bắt đầu làm bài"
  ↓
Confirmation:
  ├─ "You have 1 attempt"
  ├─ "Time limit: 60 minutes"
  └─ [Cancel] [Start]
  ↓
Click "Start"
  ↓
Navigate to /practice/reading/exercise/:exerciseId?assignmentId=xxx
  ↓
(Same flow as regular exercise practice)
  ├─ Start timer
  ├─ Answer questions
  ├─ Auto-save
  └─ Submit
  ↓
POST /api/submissions/:submissionId/submit
  ↓
Backend:
  ├─ Auto-grade (if Reading/Listening)
  ├─ OR queue AI grading (if Writing/Speaking)
  └─ Create assignment_submission:
      ├─ Link to exercise_submission
      ├─ Set status = 'submitted'
      ├─ Check if late:
      │   └─ is_late = (NOW() > due_date)
      └─ If auto-graded:
          ├─ Set score
          └─ Set status = 'graded'
  ↓
Frontend:
  ├─ Navigate to /assignments/:id/result
  ├─ Display result:
  │   ├─ Score: 8.5/10
  │   ├─ Status: "Passed" (if >= passing_score)
  │   ├─ Submitted: Date & time
  │   ├─ Late: Yes/No
  │   └─ Detailed feedback
  └─ Notify teacher (new submission)
  ↓
End: Assignment submitted
```

---

## 6. Admin Flows

### 6.1. Approve Exam Flow (Admin)

```
Start: Admin on /admin/exam-approval
  ↓
View pending approvals list:
  ├─ Filter by skill, level
  ├─ Sort by date submitted
  └─ Show: title, uploader, date
  ↓
Click exam card
  ↓
Navigate to /admin/exam-approval/:id
  ↓
Review Interface:
  ├─ Left: Exam preview
  │   ├─ All questions
  │   ├─ Correct answers highlighted
  │   └─ Read-only mode
  └─ Right: Review panel
      ├─ Quality checklist:
      │   ├─ [ ] Grammar correct
      │   ├─ [ ] Questions clear
      │   ├─ [ ] Answer key verified
      │   ├─ [ ] Appropriate level
      │   └─ [ ] No copyright issues
      ├─ Reviewer notes (textarea)
      └─ Actions:
          ├─ [Reject]
          └─ [Approve & Publish]
  ↓
Admin reviews exam carefully
  ↓
Decision branch:
  │
  ├─ REJECT:
  │   ↓
  │   Click "Reject"
  │   ↓
  │   Rejection modal:
  │   ├─ Select reason:
  │   │   ├─ Quality issues
  │   │   ├─ Incorrect answers
  │   │   ├─ Inappropriate content
  │   │   └─ Other
  │   ├─ Detailed feedback (required)
  │   └─ [Cancel] [Confirm Rejection]
  │   ↓
  │   Click "Confirm Rejection"
  │   ↓
  │   PUT /api/admin/exam-submissions/:id/reject
  │   ↓
  │   Backend:
  │   ├─ Set status = 'rejected'
  │   ├─ Set reviewed_by = admin_id
  │   ├─ Set reviewed_at = NOW()
  │   ├─ Save rejection_reason
  │   ├─ Save reviewer_notes
  │   └─ Send notification to uploader:
  │       └─ "Your exam was rejected. Please revise."
  │   ↓
  │   Frontend:
  │   ├─ Show success: "Exam rejected"
  │   ├─ Remove from pending list
  │   └─ Return to approval queue
  │
  └─ APPROVE:
      ↓
      Click "Approve & Publish"
      ↓
      Confirmation modal:
      ├─ "Publish this exam?"
      ├─ "It will be available for all users"
      └─ [Cancel] [Confirm]
      ↓
      Click "Confirm"
      ↓
      PUT /api/admin/exam-submissions/:id/approve
      ↓
      Backend:
      ├─ Set status = 'approved'
      ├─ Set approved_by = admin_id
      ├─ Set approved_at = NOW()
      ├─ Create exercise record:
      │   ├─ Copy content from submission
      │   ├─ Set is_public = true
      │   ├─ Set uploaded_by = uploader_id
      │   └─ Set approved_by = admin_id
      ├─ Link submission to exercise
      ├─ Award points to uploader:
      │   └─ +200 points
      ├─ Check badge unlock:
      │   └─ "Content Contributor" badge
      └─ Send notification to uploader:
          └─ "Your exam was approved! +200 pts"
      ↓
      Frontend:
      ├─ Show success: "Exam approved and published!"
      ├─ Remove from pending list
      └─ Return to approval queue
  ↓
End: Exam approved or rejected
```

---

## Kết thúc User Flows

Tổng hợp 30+ user flows quan trọng của hệ thống VSTEPRO với chi tiết từng bước.
