# 🔄 SYSTEM FLOWS - LUỒNG XỬ LÝ HỆ THỐNG

## Mục lục
1. [User Flows](#user-flows)
2. [Sequence Diagrams](#sequence-diagrams)
3. [Business Process Flows](#business-process-flows)
4. [Integration Flows](#integration-flows)

---

## User Flows

### FLOW 1: Đăng ký và Onboarding

```
User visits website
  ↓
Landing Page
  ↓
Click "Đăng ký"
  ↓
Registration Form:
  - Email
  - Password
  - Confirm Password
  - Name
  ↓
Submit Form
  ↓
Frontend Validation
  ├─→ Invalid: Show errors
  └─→ Valid: Continue
  ↓
API: POST /api/auth/register
  ↓
Backend:
  ├─→ Validate data
  ├─→ Check email uniqueness
  ├─→ Hash password
  ├─→ Create user record
  ├─→ Send verification email
  └─→ Return success + temp token
  ↓
Redirect to Email Verification page
  ↓
User checks email
  ↓
Click verification link
  ↓
API: GET /api/auth/verify-email?token=xxx
  ↓
Backend: Mark email as verified
  ↓
Redirect to Login
  ↓
User logs in
  ↓
First login → Trigger Onboarding Modal
  ↓
Onboarding Steps:
  Step 1: Welcome
  Step 2: Choose target level (B2, C1)
  Step 3: Select interests (Reading, Writing...)
  Step 4: Set first goal
  ↓
Complete Onboarding
  ↓
Save preferences
  ↓
Redirect to Dashboard
  ↓
Show "Getting Started" tour
```

---

### FLOW 2: Làm bài tập Reading

```
Student on Dashboard
  ↓
Navigate to "Luyện tập"
  ↓
Click "Reading"
  ↓
Mode Selection Modal:
  ⦿ Làm theo phần
  ○ Làm bộ đề đầy đủ
  ↓
Select "Làm theo phần"
  ↓
Part Selection Modal:
  Part 1 ⦿ | Part 2 ○ | Part 3 ○
  ↓
Select Part 1
  ↓
Navigate to Practice List
  ↓
API: GET /api/exercises?skill=reading&part=1
  ↓
Display list of exercises:
  - Reading Part 1 - Exercise 1 (A2)
  - Reading Part 1 - Exercise 2 (B1)
  - Reading Part 1 - Exercise 3 (B2)
  ↓
Student clicks "Bắt đầu" on Exercise 3
  ↓
Navigate to Reading Practice page
  ↓
Load exercise data
  ↓
Display:
  - Instructions
  - Passage text
  - 10 questions
  - Timer
  ↓
Student reads passage
  ↓
Student answers questions (select A/B/C/D)
  ↓
Auto-save every 10 seconds:
  API: PATCH /api/submissions/:id/answer
  ↓
Student finishes all questions
  ↓
Click "Nộp bài"
  ↓
Confirmation: "Bạn đã hoàn thành 10/10 câu. Nộp bài?"
  ↓
Confirm
  ↓
API: POST /api/submissions/:id/submit
  ↓
Backend:
  ├─→ Calculate score
  ├─→ Compare answers with answer key
  ├─→ Generate feedback
  ├─→ Save to history
  ├─→ Update user stats
  ├─→ Check badge unlocks
  ├─→ Check goal progress
  └─→ Return results
  ↓
Show Results Page:
  - Score: 8/10 (80%)
  - Time: 15:30
  - Correct answers highlighted
  - Explanations for wrong answers
  - Skill analysis
  ↓
[Badge Unlocked Modal]
  "Chúc mừng! Bạn đã unlock badge 'Early Bird'"
  ↓
[Goal Progress Notification]
  "Mục tiêu 'Hoàn thành 10 bài test': 7/10"
  ↓
Options:
  - Làm lại bài này
  - Làm bài khác
  - Về trang chủ
```

---

### FLOW 3: Làm bài thi đầy đủ (Full Test)

```
Student clicks "Thi thử"
  ↓
Navigate to Exam Room
  ↓
Pre-Exam Instructions:
  "Bài thi gồm 4 kỹ năng: Reading, Listening, Writing, Speaking
   Tổng thời gian: 3 giờ
   Không được quay lại phần đã làm
   
   [Bắt đầu thi]"
  ↓
Click "Bắt đầu thi"
  ↓
API: POST /api/exams/:id/start
  ↓
Create submission record
  ↓
=== PART 1: READING (60 minutes) ===
  ↓
Show Reading section:
  - Part 1: 10 questions
  - Part 2: 10 questions
  - Part 3: 20 questions
  ↓
Student answers questions
  ↓
Auto-save progress
  ↓
Timer counts down: 60:00 → 59:59 → ...
  ↓
When time = 00:00 OR student clicks "Next":
  ↓
API: POST /api/submissions/:id/complete-section
  Body: { section: 'reading', answers: [...] }
  ↓
Skill Transition Modal:
  "✅ Reading completed!
   ⏱ Time taken: 55:30
   
   Next: Listening
   Preparation time: 30 seconds
   
   [Continue]"
  ↓
30 seconds countdown
  ↓
=== PART 2: LISTENING (40 minutes) ===
  ↓
Similar flow...
  ↓
=== PART 3: WRITING (60 minutes) ===
  ↓
Task 1: Describe graph (20 mins)
  - Upload image of graph
  - Text editor (150 words minimum)
  - Word counter
  ↓
Task 2: Essay (40 mins)
  - Essay prompt
  - Text editor (250 words minimum)
  - Word counter
  ↓
=== PART 4: SPEAKING (15 minutes) ===
  ↓
Part 1: Interview (4-5 minutes)
  - 5 questions displayed one by one
  - Record audio for each
  - Max 30 seconds per question
  ↓
Part 2: Cue Card (3-4 minutes)
  - Display topic
  - Preparation time: 60 seconds
  - Speaking time: 2 minutes
  - Start recording
  ↓
Part 3: Discussion (4-5 minutes)
  - 5 follow-up questions
  - Record audio
  ↓
=== ALL PARTS COMPLETED ===
  ↓
API: POST /api/submissions/:id/submit
  ↓
Backend Processing:
  ├─→ Auto-grade Reading & Listening
  ├─→ Queue Writing for AI grading
  ├─→ Queue Speaking for AI grading
  ├─→ Calculate preliminary score
  └─→ Send notification when grading complete
  ↓
Show Preliminary Results:
  "Bài thi của bạn đã được nộp!
   
   ✅ Reading: 32/40 (80%)
   ✅ Listening: 28/35 (80%)
   ⏳ Writing: Đang chấm AI...
   ⏳ Speaking: Đang chấm AI...
   
   Kết quả đầy đủ sẽ có sau 5-10 phút"
  ↓
--- After AI grading ---
  ↓
Notification: "Kết quả thi đã sẵn sàng!"
  ↓
Student views full results:
  Reading: 8.0/10
  Listening: 8.0/10
  Writing: 7.0/10
  Speaking: 7.5/10
  Overall: 7.6/10 → Band B2
```

---

### FLOW 4: Teacher giao bài tập cho lớp

```
Teacher logs in
  ↓
Navigate to "Lớp học của tôi"
  ↓
Select "VSTEP B2 - Batch 2024"
  ↓
Click "Giao bài tập"
  ↓
Create Assignment Modal:
  Step 1: Choose Content
    ⦿ Chọn đề có sẵn
    ○ Tạo đề mới
    
    [Search existing exams]
    → Select "Reading Part 1 - Test 5"
    
  Step 2: Settings
    - Due date: [DatePicker] 20/12/2024 23:59
    - Time limit: 30 minutes
    - Max attempts: 1
    - Show answers: After due date
    ☑ Send notification to students
    
  Step 3: Preview
    [Preview exam content]
    
  Step 4: Confirm
    "Giao bài tập cho 25 học viên"
    [Giao bài tập]
  ↓
Click "Giao bài tập"
  ↓
API: POST /api/assignments
  Body: {
    classId: "uuid",
    examId: "uuid",
    dueDate: "2024-12-20T23:59:00Z",
    timeLimit: 30,
    maxAttempts: 1
  }
  ↓
Backend:
  ├─→ Create assignment record
  ├─→ For each student in class:
  │     - Create submission record (status: not_started)
  │     - Send notification
  │     - Add to calendar
  ├─→ Log activity
  └─→ Return success
  ↓
Show success:
  "✅ Đã giao bài tập cho 25 học viên"
  ↓
--- Student side ---
  ↓
25 students receive notification:
  "📝 Bài tập mới: Reading Part 1 - Test 5
   Hạn nộp: 20/12/2024 23:59
   Thời gian: 30 phút
   
   [Làm bài]"
  ↓
Students see assignment in dashboard
  ↓
Students complete assignment
  ↓
Auto-grading happens
  ↓
Teacher sees progress:
  "Reading Part 1 - Test 5
   Submitted: 20/25 (80%)
   Graded: 20/20 (100%)
   Average score: 7.5/10
   Pass rate: 85%
   
   [View Details] [Export]"
```

---

### FLOW 5: Admin quản lý hệ thống

```
Admin logs in
  ↓
Navigate to Admin Dashboard
  ↓
Overview:
  - Total Users: 15,234 (+12.5%)
  - Tests Taken: 45,678 (+18.3%)
  - Revenue: $12,345 (+25.2%)
  - AI Requests: 8,456 (+15.7%)
  ↓
Click "Quản lý người dùng"
  ↓
User Management Page:
  - List of all users
  - Filters: Role, Status, Activity
  - Search
  ↓
Search "Nguyễn Văn A"
  ↓
Results: 15 users
  ↓
Click on user
  ↓
User Detail Sidebar:
  - Profile info
  - Learning stats
  - Skills radar chart
  - Login history
  - Recent activities
  ↓
Admin can:
  - Edit user info
  - Change role
  - Change status
  - Reset password
  - View full history
  - Generate report
  - Send message
  ↓
Admin changes role Student → Teacher
  ↓
Confirmation: "Change role to Teacher?"
  ↓
Confirm
  ↓
API: PATCH /api/users/:id
  Body: { role: "Teacher" }
  ↓
Backend:
  ├─→ Update user role
  ├─→ Create teacher_profile record
  ├─→ Log activity
  ├─→ Send notification to user
  └─→ Return success
  ↓
User receives:
  "🎉 Vai trò của bạn đã được cập nhật thành Giáo viên!"
  ↓
User now has access to teacher features
```

---

## Sequence Diagrams

### DIAGRAM 1: Student completes test and receives AI feedback

```
Actor: Student
UI: ExamInterface
API: Backend API
DB: Database
AI: AI Service
Queue: Job Queue
Notif: Notification Service

Student -> UI: Click "Start Test"
UI -> API: POST /api/exams/:id/start
API -> DB: INSERT INTO submissions
DB -> API: Return submission_id
API -> UI: Return { submissionId, exam }
UI -> Student: Show exam interface

Student -> UI: Answer questions
UI -> UI: Auto-save every 10s
UI -> API: PATCH /api/submissions/:id/answer
API -> DB: UPDATE submissions.answers
DB -> API: Success

Student -> UI: Click "Submit"
UI -> API: POST /api/submissions/:id/submit

=== AUTO GRADING (Reading/Listening) ===
API -> DB: Get correct answers
DB -> API: Return answer key
API -> API: Compare student answers
API -> API: Calculate score
API -> DB: UPDATE submissions SET auto_score=...
DB -> API: Success

=== AI GRADING (Writing/Speaking) ===
API -> Queue: Enqueue AI grading job
  {
    submissionId: "uuid",
    skill: "writing",
    essayText: "...",
    prompt: "..."
  }
Queue -> API: Job queued

API -> UI: Return preliminary results
  {
    reading: 8.0,
    listening: 8.0,
    writing: "pending",
    speaking: "pending"
  }
UI -> Student: Show preliminary results
  "✅ Reading & Listening graded
   ⏳ AI đang chấm Writing & Speaking..."

--- Background Job Worker ---
Queue -> Worker: Process AI grading job
Worker -> AI: POST /v1/chat/completions
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are VSTEP writing examiner..."
      },
      {
        role: "user",
        content: "Grade this essay: ..."
      }
    ]
  }

AI -> AI: Process essay
AI -> Worker: Return AI response
  {
    scores: {
      taskAchievement: 7.0,
      coherenceCohesion: 7.5,
      ...
    },
    feedback: "...",
    overallBand: 7.0
  }

Worker -> DB: UPDATE submissions
  SET ai_scores=..., ai_feedback=..., graded_at=NOW()
DB -> Worker: Success

Worker -> DB: INSERT INTO ai_grading_logs
DB -> Worker: Success

Worker -> DB: Calculate final score
  final_score = (reading + listening + writing + speaking) / 4
DB -> Worker: Success

Worker -> Notif: Send notification
  "Kết quả thi đã sẵn sàng!"
Notif -> Student: Push notification

Student -> UI: Click notification
UI -> API: GET /api/submissions/:id/result
API -> DB: SELECT * FROM submissions
DB -> API: Return complete results
API -> UI: Return full results
UI -> Student: Display results
  Reading: 8.0
  Listening: 8.0
  Writing: 7.0 (AI graded)
  Speaking: 7.5 (AI graded)
  Overall: 7.6 → Band B2
  
  [Detailed AI Feedback]
```

---

### DIAGRAM 2: Class enrollment with email notification

```
Actor: Admin
UI: ClassManagementPage
Sidebar: ClassDetailSidebar
Modal: AddStudentsModal
API: Backend API
DB: Database
Email: Email Service

Admin -> UI: Open class detail
UI -> Sidebar: Show class sidebar
Sidebar -> Admin: Display class info

Admin -> Sidebar: Click "Add Students"
Sidebar -> Modal: Open add students modal

Modal -> API: GET /api/users?role=Student&notInClass=:classId
API -> DB: SELECT students not in class
DB -> API: Return available students
API -> Modal: Return student list
Modal -> Admin: Display searchable list

Admin -> Modal: Search "Nguyen"
Modal -> Modal: Filter locally
Modal -> Admin: Show 5 results

Admin -> Modal: Select 2 students
Admin -> Modal: Click "Add to class"
Modal -> Modal: Show confirmation

Admin -> Modal: Confirm
Modal -> API: POST /api/classes/:classId/students
  {
    studentIds: ["uuid1", "uuid2"],
    sendEmail: true
  }

API -> DB: BEGIN TRANSACTION

API -> DB: Check class capacity
  SELECT enrolled, max_students FROM classes WHERE id=:classId
DB -> API: 25/30 available

API -> DB: INSERT INTO class_students (2 records)
DB -> API: Success

API -> DB: UPDATE classes SET enrolled = enrolled + 2
DB -> API: Success

API -> DB: COMMIT TRANSACTION

--- Email notifications ---
API -> Email: Queue welcome emails
  FOR each student:
    Template: "class_enrollment"
    Data: {
      studentName: "...",
      className: "...",
      teacher: "...",
      schedule: "..."
    }

Email -> Email: Generate HTML from template
Email -> Email: Send via SMTP
Email -> API: Email sent

--- Logging ---
API -> DB: INSERT INTO activity_logs
  "Admin added 2 students to class"
DB -> API: Success

API -> Modal: Return success
Modal -> Modal: Close modal
Modal -> Sidebar: Refresh student list
Sidebar -> API: GET /api/classes/:id/students
API -> DB: SELECT updated list
DB -> API: Return students
API -> Sidebar: Return data
Sidebar -> Admin: Display updated list (27 students)

--- Student side ---
Email -> Student1: Deliver email
Email -> Student2: Deliver email

Students check email
Students click "View Class"
Students navigate to class page
Students see class schedule and materials
```

---

## Business Process Flows

### PROCESS 1: Student Learning Journey

```
[Registration] 
  → [Email Verification] 
  → [Onboarding] 
  → [Set Goals]
  ↓
[Choose Learning Path]
  ├─→ Self-Study
  │   ├─→ Practice Exercises
  │   ├─→ Take Mock Tests
  │   └─→ Track Progress
  │
  └─→ Enroll in Class
      ├─→ Attend Classes
      ├─→ Complete Assignments
      ├─→ Receive Feedback
      └─→ Teacher Support
  ↓
[Skill Improvement]
  ↓
[Achievement Unlocks]
  ├─→ Badges
  ├─→ Certificates
  └─→ Level Up
  ↓
[Take Final Exam]
  ↓
[Receive Results]
  ↓
[Success] or [Continue Learning]
```

---

### PROCESS 2: Content Creation & Publishing

```
[Teacher Creates Content]
  ↓
[Draft Course/Exam]
  ↓
[Add Content]
  ├─→ Upload Materials
  ├─→ Create Questions
  ├─→ Add Exercises
  └─→ Record Videos
  ↓
[Preview & Test]
  ↓
[Submit for Review] (if required)
  ↓
[Admin Reviews]
  ├─→ Approve → [Publish]
  └─→ Reject → [Request Changes] → back to Draft
  ↓
[Published]
  ↓
[Students Enroll/Access]
  ↓
[Collect Feedback]
  ↓
[Update Content] (based on feedback)
  ↓
[Version Management]
```

---

### PROCESS 3: Assignment Lifecycle

```
[Teacher Creates Assignment]
  ↓
[Set Parameters]
  - Due date
  - Time limit
  - Grading method
  ↓
[Assign to Class]
  ↓
[Students Notified]
  ↓
[Students Complete]
  ├─→ Before deadline → Normal submission
  └─→ After deadline → Late submission (penalty)
  ↓
[Auto Grading] (if applicable)
  ↓
[Manual/AI Grading] (if needed)
  ├─→ Teacher grades manually
  └─→ AI grades (Writing/Speaking)
  ↓
[Feedback Provided]
  ↓
[Results Released]
  ↓
[Students View Results]
  ↓
[Analytics Generated]
  ├─→ Class performance
  ├─→ Question difficulty
  └─→ Common mistakes
  ↓
[Teacher Reviews Analytics]
  ↓
[Adjust Teaching] (based on insights)
```

---

## Integration Flows

### INTEGRATION 1: AI Grading Service

```
VSTEPRO Backend
  ↓
[Submission received]
  ↓
[Extract content]
  - Essay text
  - Audio transcript
  - Task prompt
  ↓
[Prepare AI request]
  {
    model: "gpt-4",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "VSTEP examiner prompt..."
      },
      {
        role: "user",
        content: "Essay: ..."
      }
    ]
  }
  ↓
[Send to OpenAI API]
  POST https://api.openai.com/v1/chat/completions
  Headers:
    Authorization: Bearer sk-...
    Content-Type: application/json
  ↓
[OpenAI processes]
  ↓
[Receive response]
  {
    choices: [{
      message: {
        content: "Detailed grading..."
      }
    }],
    usage: {
      prompt_tokens: 500,
      completion_tokens: 300,
      total_tokens: 800
    }
  }
  ↓
[Parse response]
  - Extract scores
  - Extract feedback
  - Extract suggestions
  ↓
[Save to database]
  - ai_scores
  - ai_feedback
  - tokens_used
  - cost (tokens * price)
  ↓
[Log for monitoring]
  - Success/failure
  - Response time
  - Cost tracking
  ↓
[Return to student]
```

---

### INTEGRATION 2: Payment Gateway (VNPay)

```
Student clicks "Mua khóa học"
  ↓
Select payment method: VNPay
  ↓
Backend creates transaction:
  ↓
  INSERT INTO transactions
  {
    amount: 500000,
    currency: "VND",
    course_id: "uuid",
    student_id: "uuid",
    status: "pending"
  }
  ↓
Generate VNPay payment URL:
  ↓
  vnp_TmnCode: merchant_code
  vnp_Amount: 50000000 (500,000 VND * 100)
  vnp_OrderInfo: "Thanh toán khóa học VSTEP B2"
  vnp_ReturnUrl: https://vstepro.com/payment/return
  vnp_TxnRef: transaction_id
  ↓
  Hash with secret key
  ↓
Redirect to VNPay:
  https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...
  ↓
Student enters payment info at VNPay
  ↓
VNPay processes payment
  ↓
VNPay redirects back:
  https://vstepro.com/payment/return?vnp_ResponseCode=00&...
  ↓
Backend validates response:
  - Check signature
  - Verify transaction exists
  - Check amount matches
  ↓
If valid and successful (vnp_ResponseCode = "00"):
  ↓
  UPDATE transactions SET status = "completed"
  UPDATE enrollments SET payment_status = "paid"
  Grant course access
  Send confirmation email
  Send receipt
  ↓
Redirect to success page:
  "Thanh toán thành công!
   Bạn đã được ghi danh vào khóa học."
```

---

## Summary

Document này bao gồm:
- **5 User Flows chính**: Onboarding, Practice, Full Test, Assignment, Admin
- **2 Sequence Diagrams**: AI Grading, Class Enrollment
- **3 Business Process Flows**: Learning Journey, Content Creation, Assignment Lifecycle
- **2 Integration Flows**: AI Service, Payment Gateway

Tất cả flows được mô tả chi tiết từng bước với điều kiện và xử lý lỗi.

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
