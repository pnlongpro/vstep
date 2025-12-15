# 🔌 API SPECIFICATION - ĐẶC TẢ API TOÀN BỘ HỆ THỐNG

## Mục lục
1. [Tổng quan API](#tổng-quan-api)
2. [Authentication](#authentication)
3. [API Endpoints theo Module](#api-endpoints-theo-module)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)

---

## Tổng quan API

### Base URL
```
Production: https://api.vstepro.com/v1
Staging: https://api-staging.vstepro.com/v1
Development: http://localhost:3000/api/v1
```

### Protocols
- **HTTPS**: Required cho production
- **HTTP/2**: Supported
- **WebSocket**: `/ws` endpoint cho real-time

### Response Format
Tất cả responses theo format:
```json
{
  "success": true | false,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-12-11T10:00:00Z",
    "version": "1.0",
    "requestId": "uuid"
  }
}
```

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Rate Limiting
- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour

Headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1639234567
```

---

## Authentication

### 1. Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "Student"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresIn": 3600
  }
}
```

### 2. Refresh Token
**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

### 3. Logout
**POST** `/api/auth/logout`

---

## API Endpoints theo Module

### MODULE 1: User Management

#### 1.1. Get User List
**GET** `/api/users`

Query Parameters:
```
?page=1
&limit=20
&search=nguyen
&role=Student
&status=active
&sortBy=created_at
&sortOrder=desc
```

Response: (Xem user-management.md)

#### 1.2. Get User Detail
**GET** `/api/users/:id`

#### 1.3. Create User
**POST** `/api/users`

Request:
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0901234567",
  "password": "Password123",
  "role": "Student",
  "status": "active"
}
```

#### 1.4. Update User
**PATCH** `/api/users/:id`

#### 1.5. Delete User
**DELETE** `/api/users/:id`

#### 1.6. Get User Stats
**GET** `/api/users/:id/stats`

---

### MODULE 2: Class Management

#### 2.1. Get Class List
**GET** `/api/classes`

Query: `?status=active&level=B2&teacherId=uuid`

#### 2.2. Get Class Detail
**GET** `/api/classes/:id`

Response:
```json
{
  "success": true,
  "data": {
    "class": {
      "id": "uuid",
      "code": "VST-B2-2024-15",
      "name": "VSTEP B2 - Batch 2024",
      "level": "B2",
      "enrolled": 25,
      "maxStudents": 30,
      "teacher": {
        "id": "uuid",
        "name": "Nguyễn Văn A"
      },
      "schedule": [
        {
          "dayOfWeek": 1,
          "startTime": "19:00",
          "endTime": "21:00"
        }
      ]
    }
  }
}
```

#### 2.3. Create Class
**POST** `/api/classes`

Request:
```json
{
  "name": "VSTEP B2 - Batch 2024",
  "level": "B2",
  "teacherId": "uuid",
  "maxStudents": 30,
  "startDate": "2025-01-01",
  "endDate": "2025-03-31",
  "schedules": [
    {
      "dayOfWeek": 1,
      "startTime": "19:00",
      "endTime": "21:00",
      "isOnline": true
    }
  ]
}
```

#### 2.4. Update Class
**PATCH** `/api/classes/:id`

#### 2.5. Delete Class
**DELETE** `/api/classes/:id`

#### 2.6. Get Class Students
**GET** `/api/classes/:id/students`

#### 2.7. Add Students to Class
**POST** `/api/classes/:id/students`

Request:
```json
{
  "studentIds": ["uuid1", "uuid2"],
  "sendEmail": true
}
```

#### 2.8. Remove Student from Class
**DELETE** `/api/classes/:classId/students/:studentId`

#### 2.9. Get Class Progress
**GET** `/api/classes/:id/progress`

#### 2.10. Create Class Invitation
**POST** `/api/classes/:id/invitations`

---

### MODULE 3: Student Management

#### 3.1. Get Student List
**GET** `/api/students`

#### 3.2. Get Student Detail
**GET** `/api/students/:id/detail`

#### 3.3. Enroll Student
**POST** `/api/students/:studentId/enroll`

Request:
```json
{
  "classId": "uuid",
  "sendEmail": true,
  "addToCalendar": true
}
```

#### 3.4. Bulk Enroll
**POST** `/api/students/bulk-enroll`

#### 3.5. Generate Student Report
**POST** `/api/students/:id/reports/generate`

Request:
```json
{
  "type": "progress",
  "period": "3months",
  "format": "pdf",
  "sections": ["overview", "skills", "tests"]
}
```

#### 3.6. Get Student Test Results
**GET** `/api/students/:id/test-results`

#### 3.7. Get Student Attendance
**GET** `/api/students/:id/attendance`

---

### MODULE 4: Teacher Management

#### 4.1. Get Teacher List
**GET** `/api/teachers`

Query: `?specialty=Writing&status=active`

#### 4.2. Get Teacher Detail
**GET** `/api/teachers/:id/detail`

#### 4.3. Create Teacher
**POST** `/api/teachers`

#### 4.4. Update Teacher
**PATCH** `/api/teachers/:id`

#### 4.5. Assign Teacher to Class
**PATCH** `/api/classes/:classId/teacher`

Request:
```json
{
  "teacherId": "uuid",
  "role": "primary",
  "notifyTeacher": true
}
```

#### 4.6. Get Teacher Reviews
**GET** `/api/teachers/:id/reviews`

#### 4.7. Create Teacher Review
**POST** `/api/teachers/:id/reviews`

#### 4.8. Get Teacher Schedule
**GET** `/api/teachers/:id/schedule`

Query: `?startDate=2024-12-11&endDate=2024-12-17`

#### 4.9. Request Time Off
**POST** `/api/teachers/:id/time-off`

---

### MODULE 5: Content Management

#### 5.1. Courses

**GET** `/api/courses`  
**GET** `/api/courses/:id`  
**POST** `/api/courses`  
**PATCH** `/api/courses/:id`  
**DELETE** `/api/courses/:id`  
**POST** `/api/courses/:id/publish`  
**POST** `/api/courses/:id/enroll`  

#### 5.2. Modules

**GET** `/api/courses/:courseId/modules`  
**POST** `/api/courses/:courseId/modules`  
**PATCH** `/api/modules/:id`  
**DELETE** `/api/modules/:id`  

#### 5.3. Lessons

**GET** `/api/modules/:moduleId/lessons`  
**GET** `/api/lessons/:id`  
**POST** `/api/modules/:moduleId/lessons`  
**PATCH** `/api/lessons/:id`  
**DELETE** `/api/lessons/:id`  
**POST** `/api/lessons/:id/complete`  

#### 5.4. Materials

**GET** `/api/materials`  
**GET** `/api/materials/:id`  
**POST** `/api/materials` (multipart/form-data)  
**PATCH** `/api/materials/:id`  
**DELETE** `/api/materials/:id`  
**GET** `/api/materials/:id/download`  

#### 5.5. Progress

**GET** `/api/courses/:id/progress`  
**POST** `/api/lessons/:id/progress`  

---

### MODULE 6: Exam & Assignment

#### 6.1. Questions

**GET** `/api/questions`  
**GET** `/api/questions/:id`  
**POST** `/api/questions`  
**PATCH** `/api/questions/:id`  
**DELETE** `/api/questions/:id`  
**POST** `/api/questions/import` (CSV/Excel)  
**GET** `/api/questions/export`  

#### 6.2. Exams

**GET** `/api/exams`  
**GET** `/api/exams/:id`  
**POST** `/api/exams`  
**PATCH** `/api/exams/:id`  
**DELETE** `/api/exams/:id`  
**POST** `/api/exams/:id/publish`  
**GET** `/api/exams/:id/preview`  
**POST** `/api/exams/upload` (Full exam upload)  

#### 6.3. Assignments

**GET** `/api/assignments`  
**GET** `/api/assignments/:id`  
**POST** `/api/assignments`  
**PATCH** `/api/assignments/:id`  
**DELETE** `/api/assignments/:id`  

#### 6.4. Submissions

**POST** `/api/exams/:id/start`  
**PATCH** `/api/submissions/:id/answer` (Auto-save)  
**POST** `/api/submissions/:id/submit`  
**GET** `/api/submissions/:id`  
**GET** `/api/submissions/:id/result`  

#### 6.5. Grading

**POST** `/api/submissions/:id/auto-grade`  
**POST** `/api/submissions/:id/ai-grade`  

Request:
```json
{
  "skill": "writing",
  "essayText": "...",
  "taskPrompt": "..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "scores": {
      "taskAchievement": 7.0,
      "coherenceCohesion": 7.5,
      "lexicalResource": 7.0,
      "grammaticalAccuracy": 6.5
    },
    "overallBand": 7.0,
    "feedback": "Your essay demonstrates...",
    "suggestions": [
      "Use more complex sentence structures",
      "Expand vocabulary range"
    ],
    "processingTime": 2345
  }
}
```

**POST** `/api/submissions/:id/manual-grade`  

#### 6.6. Analytics

**GET** `/api/assignments/:id/analytics`  
**GET** `/api/exams/:id/analytics`  

---

### MODULE 7: Dashboard & Analytics

#### 7.1. Student Dashboard

**GET** `/api/dashboard/student`  
**GET** `/api/dashboard/student/stats`  
**GET** `/api/dashboard/student/activities`  

#### 7.2. Teacher Dashboard

**GET** `/api/dashboard/teacher`  
**GET** `/api/dashboard/teacher/classes`  
**GET** `/api/dashboard/teacher/schedule`  

#### 7.3. Admin Dashboard

**GET** `/api/dashboard/admin`  
**GET** `/api/dashboard/admin/stats`  

Response:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15234,
      "growth": "+12.5%"
    },
    "tests": {
      "totalTaken": 45678,
      "thisMonth": 8456
    },
    "revenue": {
      "thisMonth": 12345.00,
      "growth": "+25.2%"
    }
  }
}
```

**GET** `/api/dashboard/admin/users`  
**GET** `/api/dashboard/admin/revenue`  

#### 7.4. Analytics

**POST** `/api/analytics/event`  

Request:
```json
{
  "eventType": "page_view",
  "eventName": "View Dashboard",
  "properties": {
    "page": "/dashboard",
    "referrer": "/login"
  }
}
```

**GET** `/api/analytics/users`  
**GET** `/api/analytics/content`  

#### 7.5. Reports

**POST** `/api/reports/generate`  
**GET** `/api/reports/:id`  
**GET** `/api/reports/:id/download`  

---

### MODULE 8: Notifications

#### 8.1. Get Notifications

**GET** `/api/notifications`

Query: `?category=learning&status=unread&page=1&limit=20`

Response:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "assignment_graded",
        "title": "Assignment Graded",
        "message": "Your assignment has been graded",
        "isRead": false,
        "createdAt": "2024-12-11T10:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

#### 8.2. Mark as Read

**PATCH** `/api/notifications/:id/read`  
**POST** `/api/notifications/mark-all-read`  

#### 8.3. Delete Notification

**DELETE** `/api/notifications/:id`  

#### 8.4. Get Unread Count

**GET** `/api/notifications/unread-count`  

#### 8.5. Preferences

**GET** `/api/users/me/notification-preferences`  
**PATCH** `/api/users/me/notification-preferences`  

#### 8.6. Push Notifications

**POST** `/api/notifications/push/subscribe`  
**DELETE** `/api/notifications/push/unsubscribe/:id`  

#### 8.7. Admin Send Notification

**POST** `/api/admin/notifications/send`  

Request:
```json
{
  "type": "system_announcement",
  "recipients": "all",
  "title": "System Maintenance",
  "message": "We will perform maintenance...",
  "priority": "high",
  "channels": ["email", "push", "inApp"]
}
```

---

### MODULE 9: File Upload

#### 9.1. Upload File

**POST** `/api/upload`

Content-Type: `multipart/form-data`

Request:
```
file: (binary)
type: "document" | "image" | "video" | "audio"
folder: "materials" | "avatars" | "submissions"
```

Response:
```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "fileName": "document.pdf",
    "fileUrl": "https://cdn.vstepro.com/files/123.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf"
  }
}
```

#### 9.2. Upload Video

**POST** `/api/upload/video`

With processing options

#### 9.3. Get Signed URL

**GET** `/api/upload/signed-url`

Query: `?fileName=document.pdf&fileType=application/pdf`

Response:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "fileUrl": "https://cdn.vstepro.com/...",
    "expiresIn": 3600
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email already exists",
      "password": "Password must be at least 8 characters"
    }
  },
  "meta": {
    "timestamp": "2024-12-11T10:00:00Z",
    "requestId": "uuid"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Maintenance mode |

### Error Codes

```typescript
enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Authorization
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED = 'ACCESS_DENIED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Business Logic
  CLASS_FULL = 'CLASS_FULL',
  ASSIGNMENT_OVERDUE = 'ASSIGNMENT_OVERDUE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}
```

---

## Best Practices

### 1. Request Headers

Required headers:
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Client-Version: 1.0.0
X-Device-Id: uuid
```

Optional headers:
```
X-Request-Id: uuid (for tracking)
Accept-Language: vi-VN,en-US
```

### 2. Versioning

URL versioning:
```
/api/v1/users
/api/v2/users
```

Header versioning (alternative):
```
Accept: application/vnd.vstepro.v1+json
```

### 3. Filtering & Sorting

Standard query parameters:
```
?search=keyword
&filter[status]=active
&filter[level]=B2
&sort=created_at
&order=desc
&page=1
&limit=20
```

### 4. Partial Response

Select specific fields:
```
?fields=id,name,email
```

### 5. Batch Requests

**POST** `/api/batch`

Request:
```json
{
  "requests": [
    {
      "method": "GET",
      "path": "/users/1"
    },
    {
      "method": "GET",
      "path": "/users/2"
    }
  ]
}
```

### 6. Caching

Response headers:
```
Cache-Control: max-age=3600, public
ETag: "abc123"
Last-Modified: Wed, 11 Dec 2024 10:00:00 GMT
```

Request headers:
```
If-None-Match: "abc123"
If-Modified-Since: Wed, 11 Dec 2024 10:00:00 GMT
```

### 7. CORS

Allowed origins:
```
Access-Control-Allow-Origin: https://vstepro.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

### 8. Security

- Always use HTTPS
- Validate all inputs
- Sanitize outputs
- Rate limiting
- SQL injection prevention
- XSS prevention
- CSRF protection (for web)

### 9. Documentation

- Use OpenAPI/Swagger
- Provide examples for all endpoints
- Document error responses
- Include curl examples
- Postman collection

---

## API Summary

### Tổng số API Endpoints: 100+

**Authentication**: 4 endpoints  
**User Management**: 10 endpoints  
**Class Management**: 15 endpoints  
**Student Management**: 7 endpoints  
**Teacher Management**: 10 endpoints  
**Content Management**: 20 endpoints  
**Exam & Assignment**: 25 endpoints  
**Dashboard & Analytics**: 12 endpoints  
**Notifications**: 10 endpoints  
**File Upload**: 3 endpoints  

### Performance Targets

- Response time: < 200ms (p95)
- Availability: 99.9%
- Error rate: < 0.1%
- Throughput: 1000 req/s

---

**Ngày tạo**: 2024-12-11  
**Phiên bản**: API v1.0  
**Tác giả**: VSTEPRO Development Team
