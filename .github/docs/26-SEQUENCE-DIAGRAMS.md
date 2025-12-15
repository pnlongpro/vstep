# 📊 Sequence Diagrams - Consolidated

> **Tổng hợp sequence diagrams của hệ thống VSTEPRO**
> 
> File: `26-SEQUENCE-DIAGRAMS.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Authentication Sequences](#1-authentication-sequences)
- [2. Practice & Learning Sequences](#2-practice--learning-sequences)
- [3. Exam Sequences](#3-exam-sequences)
- [4. Class Management Sequences](#4-class-management-sequences)
- [5. Assignment Sequences](#5-assignment-sequences)
- [6. AI Grading Sequences](#6-ai-grading-sequences)

---

## 1. Authentication Sequences

### 1.1. Login Sequence

```
Actor: User
Frontend: React App
Backend: API Server
Database: PostgreSQL
Cache: Redis

User -> Frontend: Enter email & password
Frontend -> Frontend: Validate input format
Frontend -> Backend: POST /api/auth/login
                     { email, password }

Backend -> Database: SELECT * FROM users WHERE email = ?
Database -> Backend: Return user record

Backend -> Backend: Check user exists
alt User not found
  Backend -> Frontend: 401 Unauthorized
                       { error: "Invalid credentials" }
  Frontend -> User: Show error message
  [END]
end

Backend -> Backend: Verify password hash
                    bcrypt.compare(password, user.password_hash)

alt Password incorrect
  Backend -> Database: UPDATE users 
                       SET failed_login_attempts += 1
                       WHERE id = user_id
  
  Backend -> Backend: Check failed_login_attempts >= 5
  alt Account should be locked
    Backend -> Database: UPDATE users 
                         SET locked_until = NOW() + INTERVAL '15 minutes'
    Backend -> Frontend: 401 Locked
                         { error: "Account locked" }
  else
    Backend -> Frontend: 401 Unauthorized
                         { error: "Invalid credentials" }
  end
  Frontend -> User: Show error message
  [END]
end

Backend -> Backend: Generate tokens
                    - accessToken (JWT, 15min)
                    - refreshToken (JWT, 30days)

Backend -> Database: INSERT INTO sessions
                     (user_id, refresh_token, device_info, ip_address)

Backend -> Database: UPDATE users 
                     SET last_login_at = NOW(),
                         failed_login_attempts = 0

Backend -> Cache: SET user_session:{userId} = session_data
                  EXPIRE 900 (15 minutes)

Backend -> Frontend: 200 OK
                     {
                       accessToken,
                       refreshToken,
                       user: { id, name, email, role }
                     }

Frontend -> Frontend: Store tokens in localStorage
                      - access_token
                      - refresh_token

Frontend -> Frontend: Set auth state
                      - isAuthenticated = true
                      - user = user_data

Frontend -> Frontend: Redirect to dashboard
                      - Student: /dashboard
                      - Teacher: /teacher/dashboard
                      - Admin: /admin/dashboard

Frontend -> User: Display dashboard
```

---

### 1.2. Token Refresh Sequence

```
Actor: User
Frontend: React App
Backend: API Server
Database: PostgreSQL
Cache: Redis

User -> Frontend: Make API request (e.g., GET /api/exercises)
Frontend -> Backend: GET /api/exercises
                     Authorization: Bearer {expired_access_token}

Backend -> Backend: Verify access token
Backend -> Backend: Token expired!

Backend -> Frontend: 401 Unauthorized
                     { error: "Token expired" }

Frontend -> Frontend: Detect 401 + token expired
Frontend -> Frontend: Get refresh token from localStorage

Frontend -> Backend: POST /api/auth/refresh
                     { refreshToken }

Backend -> Database: SELECT * FROM sessions 
                     WHERE refresh_token = ? 
                     AND is_active = true
                     AND expires_at > NOW()

alt Refresh token invalid/expired
  Backend -> Frontend: 401 Unauthorized
                       { error: "Please login again" }
  Frontend -> Frontend: Clear tokens
  Frontend -> User: Redirect to /login
  [END]
end

Backend -> Backend: Generate new access token
                    - accessToken (JWT, 15min)

Backend -> Database: UPDATE sessions 
                     SET last_activity_at = NOW()
                     WHERE id = session_id

Backend -> Cache: SET user_session:{userId} = session_data
                  EXPIRE 900

Backend -> Frontend: 200 OK
                     {
                       accessToken,
                       expiresIn: 900
                     }

Frontend -> Frontend: Update stored access token

Frontend -> Backend: Retry original request
                     GET /api/exercises
                     Authorization: Bearer {new_access_token}

Backend -> Frontend: 200 OK
                     { exercises: [...] }

Frontend -> User: Display exercises
```

---

## 2. Practice & Learning Sequences

### 2.1. Exercise Submission & Auto-Grading

```
Actor: Student
Frontend: React App
Backend: API Server
Database: PostgreSQL

Student -> Frontend: Complete exercise, click "Submit"
Frontend -> Frontend: Confirm submission modal
Student -> Frontend: Click "Confirm"

Frontend -> Backend: POST /api/submissions/{id}/submit
                     {
                       answers: { "1": "B", "2": "A", ... },
                       timeSpent: 3600
                     }

Backend -> Database: BEGIN TRANSACTION

Backend -> Database: UPDATE exercise_submissions
                     SET status = 'submitted',
                         answers = ?,
                         submitted_at = NOW(),
                         time_spent = ?
                     WHERE id = ?

Backend -> Database: SELECT * FROM exercises 
                     WHERE id = submission.exercise_id

Backend -> Backend: Load answer key
                    answer_key = exercise.answer_key

Backend -> Backend: Auto-grade submission
                    FOR each question:
                      is_correct = (user_answer == correct_answer)
                      correct_count += is_correct ? 1 : 0
                    END FOR
                    
                    percentage = (correct_count / total) * 100
                    score = (correct_count / total) * 10
                    band_score = calculateBandScore(score)

Backend -> Database: INSERT INTO grading_results
                     (
                       submission_id,
                       grading_type: 'auto',
                       graded_by: 'system',
                       overall_score,
                       grading_details: { ... }
                     )

Backend -> Database: UPDATE exercise_submissions
                     SET score = ?,
                         status = 'graded'
                     WHERE id = ?

Backend -> Database: UPDATE exercises
                     SET attempt_count += 1,
                         avg_score = (avg_score * attempt_count + score) / (attempt_count + 1)
                     WHERE id = ?

Backend -> Database: COMMIT TRANSACTION

Backend -> Backend: Generate feedback
                    - Overall comment
                    - Identify weak areas
                    - Provide suggestions

Backend -> Backend: Check badge unlock
                    IF score == 10:
                      Unlock "Perfect Score" badge
                    END IF

Backend -> Frontend: 200 OK
                     {
                       submissionId,
                       score: 8.5,
                       correctCount: 34,
                       totalQuestions: 40,
                       percentage: 85.0,
                       details: { ... },
                       feedback: { ... }
                     }

Frontend -> Frontend: Navigate to result page
                      /practice/result/{submissionId}

Frontend -> Student: Display results
                     - Score visualization
                     - Question breakdown
                     - Explanations
                     - Feedback
```

---

### 2.2. AI Grading Sequence (Writing/Speaking)

```
Actor: Student
Frontend: React App
Backend: API Server
Queue: Redis Queue
AI Worker: Background Worker
OpenAI: OpenAI API
Database: PostgreSQL

Student -> Frontend: Submit Writing exercise
Frontend -> Backend: POST /api/submissions/{id}/submit
                     { content: "Essay text..." }

Backend -> Database: UPDATE exercise_submissions
                     SET status = 'submitted',
                         content = ?,
                         submitted_at = NOW()

Backend -> Queue: PUSH ai_grading_queue
                  {
                    submissionId,
                    skill: 'writing',
                    content: essay_text,
                    taskPrompt: task_prompt
                  }

Backend -> Database: INSERT INTO grading_results
                     (submission_id, status: 'pending')

Backend -> Frontend: 202 Accepted
                     {
                       message: "Grading in progress",
                       estimatedTime: "30-60 seconds"
                     }

Frontend -> Student: Show "Grading..." with loading animation
Frontend -> Frontend: Start polling
                      GET /api/grading/result/{id}
                      Every 5 seconds

=== Background Processing ===

AI Worker -> Queue: POP job from ai_grading_queue
AI Worker -> AI Worker: Build AI prompt
                        - Task instructions
                        - Student's essay
                        - Grading criteria
                        - Response format (JSON)

AI Worker -> OpenAI: POST /v1/chat/completions
                     {
                       model: "gpt-4",
                       messages: [
                         { role: "system", content: "You are VSTEP examiner..." },
                         { role: "user", content: prompt }
                       ],
                       temperature: 0.3,
                       response_format: { type: "json_object" }
                     }

OpenAI -> OpenAI: Process request (15-30 seconds)

OpenAI -> AI Worker: 200 OK
                     {
                       "scores": {
                         "taskAchievement": 7.5,
                         "coherenceCohesion": 8.0,
                         "lexicalResource": 7.0,
                         "grammaticalAccuracy": 7.5
                       },
                       "overallScore": 7.5,
                       "feedback": { ... }
                     }

AI Worker -> AI Worker: Validate AI response
                        - Check score ranges (0-10)
                        - Check required fields
                        - Validate feedback quality

alt Validation fails
  AI Worker -> AI Worker: Retry with adjusted prompt
                          (max 3 retries)
  alt Max retries reached
    AI Worker -> Database: UPDATE grading_results
                           SET status = 'failed',
                               error_message = 'AI validation failed'
    AI Worker -> Backend: Notify admin
    [END]
  end
end

AI Worker -> Database: BEGIN TRANSACTION

AI Worker -> Database: UPDATE grading_results
                       SET status = 'completed',
                           grading_type = 'ai',
                           graded_by = 'openai-gpt4',
                           overall_score = 7.5,
                           criteria_scores = ?,
                           feedback = ?,
                           ai_model = 'gpt-4',
                           ai_tokens_used = ?,
                           ai_cost = ?,
                           graded_at = NOW()

AI Worker -> Database: UPDATE exercise_submissions
                       SET status = 'graded',
                           score = 7.5

AI Worker -> Database: INSERT INTO notifications
                       (
                         user_id,
                         type: 'exercise_graded',
                         title: "Bài tập đã chấm",
                         message: "...",
                         action_url: "/practice/result/{id}"
                       )

AI Worker -> Database: COMMIT TRANSACTION

=== Frontend Polling ===

Frontend -> Backend: GET /api/grading/result/{id}
                     (5th polling request, ~25 seconds later)

Backend -> Database: SELECT * FROM grading_results
                     WHERE submission_id = ?

Backend -> Frontend: 200 OK
                     {
                       status: 'completed',
                       overallScore: 7.5,
                       criteriaScores: { ... },
                       feedback: { ... }
                     }

Frontend -> Frontend: Stop polling
Frontend -> Frontend: Update result display

Frontend -> Student: Display AI grading results
                     - Overall score
                     - Criteria breakdown
                     - Detailed feedback
                     - Suggestions with examples
```

---

## 3. Exam Sequences

### 3.1. Mock Exam Complete Flow

```
Actor: Student
Frontend: React App
Backend: API Server
Database: PostgreSQL
Queue: AI Queue
Certificate Service: Background Service

=== Start Mock Exam ===

Student -> Frontend: Click "Xác nhận và bắt đầu thi"
Frontend -> Backend: POST /api/mock-exams
                     {
                       readingExerciseId,
                       listeningExerciseId,
                       writingExerciseId,
                       speakingExerciseId
                     }

Backend -> Database: INSERT INTO mock_exams
                     (
                       user_id,
                       reading_exercise_id,
                       listening_exercise_id,
                       writing_exercise_id,
                       speaking_exercise_id,
                       started_at: NOW(),
                       status: 'in_progress'
                     )

Backend -> Frontend: 201 Created
                     {
                       mockExamId,
                       startedAt,
                       expiresAt: startedAt + 172 minutes
                     }

Frontend -> Student: Start exam interface
                     - Start 172-minute timer
                     - Lock page navigation

=== During Exam (auto-save) ===

loop Every 30 seconds
  Frontend -> Backend: PUT /api/submissions/{id}/save
                       { answers: current_answers }
  Backend -> Database: UPDATE exercise_submissions
                       SET answers = ?,
                           last_saved_at = NOW()
end

=== Complete Exam ===

Student -> Frontend: Complete all 4 skills, click "Finish Exam"
Frontend -> Frontend: Final confirmation modal
Student -> Frontend: Click "Confirm Submit"

Frontend -> Backend: POST /api/mock-exams/{id}/complete

Backend -> Database: BEGIN TRANSACTION

Backend -> Database: UPDATE mock_exams
                     SET status = 'completed',
                         completed_at = NOW(),
                         total_time_seconds = ?

Backend -> Database: SELECT * FROM exercise_submissions
                     WHERE id IN (
                       reading_submission_id,
                       listening_submission_id,
                       writing_submission_id,
                       speaking_submission_id
                     )

=== Auto-grade Reading & Listening ===

Backend -> Backend: Auto-grade Reading
                    (same process as regular exercise)
                    - Compare answers
                    - Calculate score
                    - Create grading_result

Backend -> Backend: Auto-grade Listening
                    (same process)

Backend -> Database: UPDATE mock_exams
                     SET reading_score = ?,
                         listening_score = ?

=== Queue AI Grading for Writing & Speaking ===

Backend -> Queue: PUSH ai_grading_queue
                  {
                    submissionId: writing_submission_id,
                    skill: 'writing',
                    priority: 10
                  }

Backend -> Queue: PUSH ai_grading_queue
                  {
                    submissionId: speaking_submission_id,
                    skill: 'speaking',
                    priority: 10
                  }

Backend -> Database: COMMIT TRANSACTION

Backend -> Frontend: 200 OK
                     {
                       mockExamId,
                       status: 'grading',
                       scores: {
                         reading: 8.0,
                         listening: 7.5,
                         writing: 'pending',
                         speaking: 'pending'
                       }
                     }

Frontend -> Student: Navigate to result page
                     Show:
                     - Reading: ✅ 8.0
                     - Listening: ✅ 7.5
                     - Writing: ⏳ Grading...
                     - Speaking: ⏳ Grading...

Frontend -> Frontend: Poll for full results
                      GET /api/mock-exams/{id}/result
                      Every 10 seconds

=== AI Workers Process Writing & Speaking ===

AI Worker 1 -> Queue: Process Writing
               (30-60 seconds)
               -> OpenAI API
               -> Save grading_result
               -> Update mock_exams.writing_score

AI Worker 2 -> Queue: Process Speaking
               (60-120 seconds)
               -> OpenAI API
               -> Save grading_result
               -> Update mock_exams.speaking_score

=== After All Grading Complete ===

Backend -> Database: SELECT * FROM mock_exams WHERE id = ?
Backend -> Backend: Check if all 4 scores available

Backend -> Backend: Calculate overall score
                    overall = (R + L + W + S) / 4 = 7.5
                    band_score = 7.5

Backend -> Database: UPDATE mock_exams
                     SET overall_score = 7.5,
                         band_score = 7.5

=== Generate Certificate ===

Certificate Service -> Database: INSERT INTO certificates
                                 (
                                   user_id,
                                   mock_exam_id,
                                   certificate_number: "VSTEP-2024-001234",
                                   verification_code: generateRandomCode(),
                                   overall_score: 7.5,
                                   band_score: 7.5,
                                   skill_scores: { R: 8.0, L: 7.5, W: 7.0, S: 7.5 },
                                   issued_at: NOW()
                                 )

Certificate Service -> Certificate Service: Generate PDF certificate
                                            - Use template
                                            - Add QR code
                                            - Add verification code

Certificate Service -> Storage: Upload PDF to S3
                                certificate_{id}.pdf

Certificate Service -> Database: UPDATE certificates
                                 SET certificate_url = s3_url

Certificate Service -> Database: UPDATE mock_exams
                                 SET certificate_id = ?

Certificate Service -> Database: INSERT INTO notifications
                                 (
                                   type: 'certificate_ready',
                                   message: "Your certificate is ready!"
                                 )

=== Frontend Gets Final Results ===

Frontend -> Backend: GET /api/mock-exams/{id}/result
                     (10th poll, ~100 seconds after completion)

Backend -> Frontend: 200 OK
                     {
                       status: 'completed',
                       overallScore: 7.5,
                       bandScore: 7.5,
                       scores: {
                         reading: 8.0,
                         listening: 7.5,
                         writing: 7.0,
                         speaking: 7.5
                       },
                       certificate: {
                         id,
                         certificateNumber: "VSTEP-2024-001234",
                         verificationCode: "ABC123",
                         certificateUrl: "https://..."
                       }
                     }

Frontend -> Frontend: Stop polling
Frontend -> Frontend: Update display

Frontend -> Student: Show complete results
                     - Overall: 7.5/10
                     - Band: 7.5 (B2)
                     - Skill breakdown
                     - Certificate with download button
                     - Detailed feedback (expandable)
```

---

## 4. Class Management Sequences

### 4.1. Invite Student via Email

```
Actor: Teacher
Frontend: React App
Backend: API Server
Email Service: SendGrid
Database: PostgreSQL

Teacher -> Frontend: Open class detail page
                     Click "Mời học viên"
Frontend -> Frontend: Open invite modal
Teacher -> Frontend: Enter emails:
                     - student1@example.com
                     - student2@example.com
                     Click "Gửi lời mời"

Frontend -> Backend: POST /api/classes/{id}/invite
                     {
                       emails: [
                         "student1@example.com",
                         "student2@example.com"
                       ]
                     }

Backend -> Database: BEGIN TRANSACTION

loop For each email
  Backend -> Database: SELECT * FROM users WHERE email = ?
  
  alt User exists
    Backend -> Database: Check if already in class
                         SELECT * FROM class_students
                         WHERE class_id = ? AND user_id = ?
    
    alt Already in class
      Backend -> Backend: Skip this email
      continue
    end
    
    Backend -> Backend: user_id = existing_user.id
  else
    Backend -> Backend: user_id = NULL
  end
  
  Backend -> Backend: Generate invitation token
                      token = generateSecureToken()
                      expires_at = NOW() + 7 days
  
  Backend -> Database: INSERT INTO class_invitations
                       (
                         class_id,
                         email,
                         user_id,
                         token,
                         invited_by: teacher_id,
                         expires_at,
                         status: 'pending'
                       )
  
  Backend -> Email Service: Send invitation email
                            {
                              to: email,
                              template: 'class-invitation',
                              data: {
                                teacherName,
                                className,
                                inviteLink: "https://vstepro.com/classes/join?token={token}"
                              }
                            }
  
  Email Service -> Email Service: Queue email
  Email Service -> Backend: Email queued
end loop

Backend -> Database: COMMIT TRANSACTION

Backend -> Frontend: 200 OK
                     {
                       invitationsSent: 2,
                       invitations: [...]
                     }

Frontend -> Teacher: Show success message
                     "Đã gửi 2 lời mời"

=== Student Receives Email ===

Email Service -> Student: Deliver invitation email

Student -> Student: Open email
                    Click invitation link

Student -> Frontend: Navigate to /classes/join?token={token}

Frontend -> Backend: GET /api/class-invitations/verify?token={token}

Backend -> Database: SELECT * FROM class_invitations
                     WHERE token = ?
                     AND status = 'pending'
                     AND expires_at > NOW()

alt Token invalid/expired
  Backend -> Frontend: 404 Not Found
                       { error: "Invalid or expired invitation" }
  Frontend -> Student: Show error page
  [END]
end

Backend -> Frontend: 200 OK
                     {
                       classId,
                       className,
                       teacherName,
                       level
                     }

Frontend -> Student: Show invitation details
                     - Class info
                     - Teacher info
                     - [Join Class] button

Student -> Frontend: Click "Join Class"

Frontend -> Backend: POST /api/class-invitations/accept
                     { token }

Backend -> Database: BEGIN TRANSACTION

Backend -> Database: UPDATE class_invitations
                     SET status = 'accepted',
                         accepted_at = NOW()
                     WHERE token = ?

Backend -> Database: INSERT INTO class_students
                     (
                       class_id,
                       user_id,
                       joined_via: 'email',
                       invited_by: teacher_id
                     )

Backend -> Database: UPDATE classes
                     SET student_count += 1
                     WHERE id = class_id

Backend -> Database: INSERT INTO notifications
                     (
                       user_id: teacher_id,
                       type: 'student_joined',
                       message: "{studentName} joined {className}"
                     )

Backend -> Database: COMMIT TRANSACTION

Backend -> Frontend: 200 OK
                     {
                       classId,
                       message: "Joined successfully!"
                     }

Frontend -> Student: Navigate to /classes/{classId}
                     Show class detail page
```

---

## 5. Assignment Sequences

### 5.1. Create & Publish Assignment

```
Actor: Teacher
Frontend: React App
Backend: API Server
Notification Service: Background Service
Database: PostgreSQL

Teacher -> Frontend: Navigate to /teacher/assignments/create
Frontend -> Frontend: Display Step 1: Choose Exercise

Teacher -> Frontend: Browse exercises
                     Select "Reading Full Test B2"
                     Click "Tiếp tục"

Frontend -> Frontend: Navigate to Step 2: Configure

Teacher -> Frontend: Fill configuration:
                     - Title: "Reading Week 1"
                     - Description: "..."
                     - Due date: 2024-12-20 23:59
                     - Max attempts: 1
                     - Grading: Auto
                     Click "Tiếp tục"

Frontend -> Frontend: Navigate to Step 3: Review

Teacher -> Frontend: Review settings
                     Click "Publish Now"

Frontend -> Backend: POST /api/assignments
                     {
                       classId,
                       title: "Reading Week 1",
                       description: "...",
                       exerciseId,
                       dueDate: "2024-12-20T23:59:59Z",
                       maxAttempts: 1,
                       gradingMethod: "auto",
                       status: "published"
                     }

Backend -> Database: BEGIN TRANSACTION

Backend -> Database: INSERT INTO assignments
                     (
                       class_id,
                       teacher_id,
                       title,
                       description,
                       exercise_id,
                       due_date,
                       max_attempts,
                       grading_method,
                       status: 'published'
                     )
                     RETURNING id

Backend -> Database: SELECT user_id FROM class_students
                     WHERE class_id = ?
                     AND status = 'active'

Backend -> Backend: Get list of student IDs
                    student_ids = [id1, id2, id3, ...]

loop For each student_id
  Backend -> Database: INSERT INTO assignment_submissions
                       (
                         assignment_id,
                         user_id,
                         status: 'not_started',
                         attempt_number: 1
                       )
end loop

Backend -> Database: COMMIT TRANSACTION

Backend -> Notification Service: Queue notifications
                                  {
                                    type: 'assignment_new',
                                    userIds: student_ids,
                                    assignmentId
                                  }

Backend -> Frontend: 201 Created
                     {
                       assignmentId,
                       title: "Reading Week 1",
                       studentsCount: 25
                     }

Frontend -> Teacher: Show success message
                     "Đã giao bài tập cho 25 học viên"
                     Navigate to assignment detail

=== Background: Send Notifications ===

Notification Service -> Database: BEGIN TRANSACTION

loop For each student_id
  Notification Service -> Database: INSERT INTO notifications
                                    (
                                      user_id,
                                      type: 'assignment_new',
                                      title: "Bài tập mới: Reading Week 1",
                                      message: "...",
                                      action_url: "/assignments/{id}"
                                    )
  
  Notification Service -> Database: SELECT email, notification_preferences
                                    FROM users WHERE id = student_id
  
  alt Email notifications enabled
    Notification Service -> Email Service: Send email notification
  end
end loop

Notification Service -> Database: COMMIT TRANSACTION

=== Real-time: WebSocket Notification ===

Notification Service -> WebSocket: Broadcast to online students
                                   socket.to(student_id).emit('notification', {
                                     type: 'assignment_new',
                                     title: "Bài tập mới",
                                     message: "..."
                                   })

Frontend (Student) -> Frontend: Receive WebSocket event
                                 Show notification toast
                                 Update notification badge count
```

---

## Kết thúc Sequence Diagrams

Tổng hợp sequence diagrams chi tiết cho các flows quan trọng của hệ thống VSTEPRO.
