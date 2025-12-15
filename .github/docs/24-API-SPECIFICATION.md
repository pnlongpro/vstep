# 🔌 API Specification - Consolidated

> **Tổng hợp tất cả API endpoints của hệ thống VSTEPRO**
> 
> File: `24-API-SPECIFICATION.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. API Overview](#1-api-overview)
- [2. Authentication APIs](#2-authentication-apis)
- [3. Practice & Learning APIs](#3-practice--learning-apis)
- [4. Exam APIs](#4-exam-apis)
- [5. Class Management APIs](#5-class-management-apis)
- [6. Assignment APIs](#6-assignment-apis)
- [7. User Management APIs](#7-user-management-apis)
- [8. Admin APIs](#8-admin-apis)
- [9. Notification & Communication APIs](#9-notification--communication-apis)
- [10. Gamification APIs](#10-gamification-apis)

---

## 1. API Overview

### 1.1. Base URL

**Production**: `https://api.vstepro.com/v1`
**Staging**: `https://api-staging.vstepro.com/v1`
**Development**: `http://localhost:3000/api`

### 1.2. Authentication

**Method**: Bearer Token (JWT)

**Header**:
```
Authorization: Bearer {access_token}
```

**Token Types**:
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 30 days expiry

### 1.3. Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### 1.4. HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `202 Accepted`: Request accepted (async processing)
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### 1.5. Pagination

**Request**:
```
GET /api/resource?page=1&limit=20
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 1.6. Rate Limiting

- **Anonymous**: 60 requests/hour
- **Authenticated**: 1000 requests/hour
- **Premium**: 5000 requests/hour

**Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1639564800
```

---

## 2. Authentication APIs

### 2.1. POST /api/auth/register

**Đăng ký tài khoản mới**

**Request**:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "student"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "role": "student",
    "emailVerificationSent": true
  },
  "message": "Registration successful. Please verify your email."
}
```

---

### 2.2. POST /api/auth/login

**Đăng nhập**

**Request**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "student",
      "avatar": "https://..."
    }
  }
}
```

---

### 2.3. POST /api/auth/refresh

**Làm mới access token**

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new_token",
    "expiresIn": 900
  }
}
```

---

### 2.4. POST /api/auth/logout

**Đăng xuất**

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2.5. POST /api/auth/forgot-password

**Quên mật khẩu**

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 3. Practice & Learning APIs

### 3.1. GET /api/exercises

**Lấy danh sách bài tập**

**Query Parameters**:
- `skill`: reading | listening | writing | speaking
- `level`: A2 | B1 | B2 | C1
- `type`: part_practice | full_test
- `part`: 1 | 2 | 3 (for part_practice)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": "uuid",
        "title": "Reading Full Test - B2",
        "skill": "reading",
        "level": "B2",
        "type": "full_test",
        "duration": 60,
        "questionCount": 40,
        "difficulty": "medium",
        "avgScore": 7.5,
        "attemptCount": 1234
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.2. GET /api/exercises/:id

**Lấy chi tiết bài tập**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Reading Full Test - B2",
    "description": "...",
    "skill": "reading",
    "level": "B2",
    "type": "full_test",
    "duration": 60,
    "questionCount": 40,
    "content": {
      "passages": [...],
      "questions": [...]
    }
  }
}
```

---

### 3.3. POST /api/submissions

**Tạo submission mới (bắt đầu làm bài)**

**Request**:
```json
{
  "exerciseId": "uuid"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "exerciseId": "uuid",
    "startedAt": "2024-12-15T10:00:00Z",
    "status": "in_progress"
  }
}
```

---

### 3.4. PUT /api/submissions/:id/save

**Auto-save answers**

**Request**:
```json
{
  "answers": {
    "1": "B",
    "2": "A",
    "3": "C"
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Answers saved",
  "data": {
    "lastSavedAt": "2024-12-15T10:05:00Z"
  }
}
```

---

### 3.5. POST /api/submissions/:id/submit

**Submit bài làm**

**Request**:
```json
{
  "answers": {
    "1": "B",
    "2": "A",
    ...
  },
  "timeSpent": 3600
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "status": "submitted",
    "submittedAt": "2024-12-15T11:00:00Z"
  },
  "message": "Submission received. Grading in progress..."
}
```

---

### 3.6. GET /api/submissions/:id/result

**Lấy kết quả chấm điểm**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "score": 8.5,
    "correctCount": 34,
    "totalQuestions": 40,
    "percentage": 85.0,
    "details": {
      "1": {
        "userAnswer": "B",
        "correctAnswer": "B",
        "isCorrect": true
      },
      ...
    },
    "feedback": {
      "overall": "Good performance!",
      "strengths": [...],
      "weaknesses": [...],
      "suggestions": [...]
    }
  }
}
```

---

## 4. Exam APIs

### 4.1. POST /api/mock-exams/random

**Random 4 đề thi**

**Request**:
```json
{
  "level": "B2"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exams": {
      "reading": {
        "id": "uuid",
        "title": "Reading Test B2",
        "questionCount": 40
      },
      "listening": { ... },
      "writing": { ... },
      "speaking": { ... }
    }
  }
}
```

---

### 4.2. POST /api/mock-exams

**Bắt đầu thi thử**

**Request**:
```json
{
  "readingExerciseId": "uuid",
  "listeningExerciseId": "uuid",
  "writingExerciseId": "uuid",
  "speakingExerciseId": "uuid"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "mockExamId": "uuid",
    "startedAt": "2024-12-15T10:00:00Z",
    "expiresAt": "2024-12-15T12:52:00Z",
    "totalTime": 10320
  }
}
```

---

### 4.3. POST /api/mock-exams/:id/complete

**Hoàn thành thi thử**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mockExamId": "uuid",
    "completedAt": "2024-12-15T12:50:00Z",
    "status": "grading",
    "message": "Exam completed. Results will be available soon."
  }
}
```

---

### 4.4. GET /api/mock-exams/:id/result

**Lấy kết quả thi thử**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mockExamId": "uuid",
    "overallScore": 7.5,
    "bandScore": 7.5,
    "scores": {
      "reading": 8.0,
      "listening": 7.5,
      "writing": 7.0,
      "speaking": 7.5
    },
    "certificateId": "uuid"
  }
}
```

---

### 4.5. GET /api/certificates/:id

**Xem certificate**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "certificateNumber": "VSTEP-2024-001234",
    "verificationCode": "ABC123",
    "userName": "Nguyễn Văn A",
    "overallScore": 7.5,
    "bandScore": 7.5,
    "skillScores": {
      "reading": 8.0,
      "listening": 7.5,
      "writing": 7.0,
      "speaking": 7.5
    },
    "issuedAt": "2024-12-15",
    "certificateUrl": "https://..."
  }
}
```

---

## 5. Class Management APIs

### 5.1. POST /api/classes

**Tạo lớp học mới**

**Request**:
```json
{
  "name": "VSTEP B2 - Evening Class",
  "description": "...",
  "level": "B2",
  "maxStudents": 30,
  "startDate": "2024-12-20",
  "endDate": "2025-03-20"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "name": "VSTEP B2 - Evening Class",
    "classCode": "ABC123",
    "teacherId": "uuid"
  }
}
```

---

### 5.2. GET /api/classes

**Lấy danh sách lớp**

**Query**:
- `role`: teacher | student (filter by user role)
- `status`: active | archived

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "uuid",
        "name": "VSTEP B2 - Evening",
        "classCode": "ABC123",
        "level": "B2",
        "studentCount": 25,
        "status": "active",
        "teacher": {
          "id": "uuid",
          "name": "Teacher John"
        }
      }
    ]
  }
}
```

---

### 5.3. GET /api/classes/:id

**Chi tiết lớp học**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "VSTEP B2 - Evening",
    "description": "...",
    "classCode": "ABC123",
    "level": "B2",
    "studentCount": 25,
    "maxStudents": 30,
    "status": "active",
    "teacher": { ... },
    "schedule": { ... },
    "stats": {
      "avgAttendance": 92,
      "assignmentsCount": 15,
      "materialsCount": 20
    }
  }
}
```

---

### 5.4. POST /api/classes/:id/invite

**Mời học viên**

**Request**:
```json
{
  "emails": [
    "student1@example.com",
    "student2@example.com"
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "invitationsSent": 2,
    "invitations": [
      {
        "email": "student1@example.com",
        "token": "abc123",
        "expiresAt": "2024-12-22"
      }
    ]
  }
}
```

---

### 5.5. POST /api/classes/join

**Tham gia lớp bằng code**

**Request**:
```json
{
  "classCode": "ABC123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "className": "VSTEP B2 - Evening",
    "joinedAt": "2024-12-15T10:00:00Z"
  }
}
```

---

## 6. Assignment APIs

### 6.1. POST /api/assignments

**Tạo assignment**

**Request**:
```json
{
  "classId": "uuid",
  "title": "Reading Week 1",
  "description": "...",
  "exerciseId": "uuid",
  "dueDate": "2024-12-20T23:59:59Z",
  "maxAttempts": 1,
  "gradingMethod": "auto"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "assignmentId": "uuid",
    "title": "Reading Week 1",
    "status": "published"
  }
}
```

---

### 6.2. GET /api/assignments

**Lấy danh sách assignments**

**Query**:
- `classId`: uuid
- `status`: all | pending | completed
- `role`: teacher | student

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "title": "Reading Week 1",
        "className": "VSTEP B2",
        "dueDate": "2024-12-20",
        "status": "pending",
        "submitted": false,
        "score": null
      }
    ]
  }
}
```

---

### 6.3. POST /api/assignments/:id/submit

**Nộp assignment**

**Request**:
```json
{
  "exerciseSubmissionId": "uuid"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignmentSubmissionId": "uuid",
    "status": "submitted",
    "submittedAt": "2024-12-15T10:00:00Z",
    "isLate": false
  }
}
```

---

## 7. User Management APIs

### 7.1. GET /api/admin/users

**Lấy danh sách users (Admin)**

**Query**:
- `role`: student | teacher | admin | uploader
- `status`: active | suspended | expired
- `search`: string
- `page`, `limit`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "fullName": "Nguyễn Văn A",
        "email": "user@example.com",
        "role": "student",
        "status": "active",
        "createdAt": "2024-10-01",
        "lastLoginAt": "2024-12-15"
      }
    ],
    "stats": {
      "total": 1234,
      "active": 980,
      "students": 1100,
      "teachers": 120
    },
    "pagination": { ... }
  }
}
```

---

### 7.2. POST /api/admin/users

**Tạo user mới (Admin)**

**Request**:
```json
{
  "fullName": "Nguyễn Văn B",
  "email": "newuser@example.com",
  "password": "Password123!",
  "role": "student",
  "sendWelcomeEmail": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "newuser@example.com"
  }
}
```

---

### 7.3. PUT /api/admin/users/:id/suspend

**Suspend user (Admin)**

**Request**:
```json
{
  "reason": "Violation of terms",
  "durationDays": 30,
  "notifyUser": true
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User suspended successfully"
}
```

---

## 8. Admin APIs

### 8.1. GET /api/admin/dashboard

**Admin dashboard data**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 12456,
      "totalExercises": 1234,
      "activeClasses": 234
    },
    "userActivity": {
      "dau": 3456,
      "wau": 8234,
      "mau": 11234
    },
    "pendingActions": {
      "examApprovals": 12,
      "userReports": 5
    }
  }
}
```

---

### 8.2. GET /api/admin/exam-submissions

**Pending exam approvals**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "title": "Reading Test B2",
        "skill": "reading",
        "level": "B2",
        "uploader": "User Name",
        "submittedAt": "2024-12-10",
        "status": "pending"
      }
    ]
  }
}
```

---

### 8.3. PUT /api/admin/exam-submissions/:id/approve

**Approve exam**

**Response** (200):
```json
{
  "success": true,
  "message": "Exam approved and published"
}
```

---

## 9. Notification & Communication APIs

### 9.1. GET /api/notifications

**Lấy thông báo**

**Query**:
- `unread`: boolean
- `type`: assignment | class | exam | system
- `page`, `limit`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "assignment_graded",
        "title": "Bài tập đã chấm",
        "message": "...",
        "isRead": false,
        "createdAt": "2024-12-15T10:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### 9.2. PUT /api/notifications/:id/read

**Đánh dấu đã đọc**

**Response** (200):
```json
{
  "success": true,
  "message": "Marked as read"
}
```

---

### 9.3. GET /api/conversations

**Lấy danh sách conversations**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "type": "direct",
        "otherUser": {
          "id": "uuid",
          "name": "Teacher John",
          "avatar": "..."
        },
        "lastMessage": {
          "content": "Hello",
          "sentAt": "2024-12-15"
        },
        "unreadCount": 2
      }
    ]
  }
}
```

---

### 9.4. POST /api/conversations/:id/messages

**Gửi tin nhắn**

**Request**:
```json
{
  "type": "text",
  "content": "Hello!"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "sentAt": "2024-12-15T10:00:00Z"
  }
}
```

---

## 10. Gamification APIs

### 10.1. GET /api/badges

**Lấy badges**

**Response** (200):
```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": "uuid",
        "name": "First Steps",
        "icon": "🎯",
        "unlockedAt": "2024-12-01"
      }
    ],
    "available": [...]
  }
}
```

---

### 10.2. GET /api/leaderboards

**Xem bảng xếp hạng**

**Query**:
- `scope`: global | class | friends
- `period`: daily | weekly | monthly | alltime

**Response** (200):
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "uuid",
        "name": "User 1",
        "points": 5000,
        "avatar": "..."
      }
    ],
    "myRank": {
      "rank": 25,
      "points": 1200
    }
  }
}
```

---

## Kết thúc API Specification

Tổng hợp 80+ API endpoints cho toàn bộ hệ thống VSTEPRO.
