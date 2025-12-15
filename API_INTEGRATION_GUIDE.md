# API Integration & E2E Testing Guide

## Overview

This document provides a comprehensive guide for the API integration and end-to-end testing implemented for the VSTEPRO platform.

## 🚀 API Integration

### Frontend Services Layer

All backend APIs are now fully integrated with type-safe service classes located in `FE/src/services/`:

#### 1. **Exams Service** (`exams.service.ts`)
Handles mock exam operations:
- `randomMockExam()` - Get 4 random exams (1 per skill)
- `startMockExam()` - Begin a mock exam session
- `getMockExamDetails()` - Get exam details and content
- `saveExamProgress()` - Auto-save answers every 10 seconds
- `submitMockExam()` - Submit completed exam
- `getMockExamResult()` - Retrieve exam results
- `getExercises()` - List exercises with filters
- `getExerciseDetails()` - Get single exercise

#### 2. **Classes Service** (`classes.service.ts`)
Manages class operations:
- `createClass()` - Create new class (Teacher)
- `getClasses()` - List user's classes
- `getClassDetails()` - Get class info
- `updateClass()` - Update class details
- `deleteClass()` - Delete class
- `inviteStudents()` - Send email invitations
- `joinClass()` - Join with code (Student)
- `getClassStudents()` - List enrolled students
- `removeStudent()` - Remove student from class
- `createSchedule()` - Add class schedule
- `getClassSchedule()` - View schedule
- `markAttendance()` - Mark attendance
- `getAttendance()` - Get attendance records

#### 3. **Gamification Service** (`gamification.service.ts`)
Handles engagement features:
- `getBadges()` - Get all badges (earned + available)
- `getEarnedBadges()` - Get unlocked badges
- `checkBadgeUnlock()` - Check for new badge unlocks
- `getGoals()` - List user goals
- `createGoal()` - Create new goal
- `updateGoal()` - Update goal
- `deleteGoal()` - Delete goal
- `abandonGoal()` - Abandon goal
- `getLeaderboard()` - View leaderboard rankings
- `getPoints()` - Get user points

#### 4. **Notifications Service** (`notifications.service.ts`)
Manages notifications:
- `getNotifications()` - List notifications
- `getUnreadCount()` - Get unread count
- `markAsRead()` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete single notification
- `deleteAll()` - Delete all notifications
- `getPreferences()` - Get notification preferences

### React Query Hooks

React Query hooks are available in `FE/src/hooks/` for data fetching, caching, and mutations:

#### Exams Hooks (`useExams.ts`)
```typescript
// Mutations
const { mutate: randomExams } = useRandomMockExam();
const { mutate: startExam } = useStartMockExam();
const { mutate: saveProgress } = useSaveExamProgress();
const { mutate: submitExam } = useSubmitMockExam();

// Queries
const { data: examDetails } = useMockExamDetails(examId);
const { data: result } = useMockExamResult(examId);
const { data: exercises } = useExercises({ skill: 'reading', level: 'B2' });
const { data: exercise } = useExerciseDetails(exerciseId);
```

#### Classes Hooks (`useClasses.ts`)
```typescript
// Mutations
const { mutate: createClass } = useCreateClass();
const { mutate: joinClass } = useJoinClass();
const { mutate: markAttendance } = useMarkAttendance();

// Queries
const { data: classes } = useClasses();
const { data: classDetails } = useClassDetails(classId);
const { data: students } = useClassStudents(classId);
const { data: schedule } = useClassSchedule(classId);
```

#### Gamification Hooks (`useGamification.ts`)
```typescript
// Mutations
const { mutate: createGoal } = useCreateGoal();
const { mutate: abandonGoal } = useAbandonGoal();

// Queries
const { data: badges } = useBadges();
const { data: goals } = useGoals('active');
const { data: leaderboard } = useLeaderboard({ period: 'weekly' });
const { data: points } = usePoints();
```

#### Notifications Hooks (`useNotifications.ts`)
```typescript
// Mutations
const { mutate: markAsRead } = useMarkAsRead();
const { mutate: markAllRead } = useMarkAllAsRead();

// Queries
const { data: notifications } = useNotifications({ unread: true });
const { data: unreadCount } = useUnreadCount(); // Auto-refetches every 30s
```

### Usage Example

```typescript
// In a React component
import { useRandomMockExam, useStartMockExam } from '@/hooks/useExams';

function MockExamPage() {
  const { mutate: getRandomExams, data: randomExams } = useRandomMockExam();
  const { mutate: startExam } = useStartMockExam();

  const handleStartExam = () => {
    // Step 1: Get random 4 exams
    getRandomExams(
      { level: 'B2' },
      {
        onSuccess: (response) => {
          const exams = response.data.exams;
          
          // Step 2: Start the exam
          startExam({
            readingExerciseId: exams.reading.id,
            listeningExerciseId: exams.listening.id,
            writingExerciseId: exams.writing.id,
            speakingExerciseId: exams.speaking.id,
          }, {
            onSuccess: (examResponse) => {
              const examId = examResponse.data.mockExamId;
              router.push(`/exam/${examId}`);
            }
          });
        }
      }
    );
  };

  return <button onClick={handleStartExam}>Start Mock Exam</button>;
}
```

## 🧪 End-to-End Testing

### Test Structure

E2E tests are located in `BE/test/e2e/` using Jest and Supertest:

1. **exams.e2e-spec.ts** - Tests exam module endpoints
2. **classes.e2e-spec.ts** - Tests class management endpoints  
3. **gamification.e2e-spec.ts** - Tests gamification endpoints

### Running Tests

```bash
# Run all e2e tests
cd BE
npm run test:e2e

# Run specific test file
npm run test:e2e -- exams.e2e-spec.ts

# Run with coverage
npm run test:cov
```

### Test Coverage

#### Exams Module Tests
✅ Random mock exam selection
✅ Start mock exam session
✅ Auto-save exam progress
✅ List exercises with filters
✅ Unauthorized access protection

#### Classes Module Tests
✅ Create class (Teacher only)
✅ Get class list and details
✅ Join class with code (Student)
✅ Invite students via email
✅ Create class schedule
✅ Mark attendance
✅ RBAC protection (403 errors)

#### Gamification Module Tests
✅ Get badges (earned + available)
✅ Get earned badges only
✅ Get goals with filters
✅ Create new goal
✅ Update goal
✅ Abandon goal
✅ Get leaderboard
✅ Get user points
✅ Input validation

### Key Test Scenarios

1. **Authentication Flow**
   - Login as different roles (student, teacher, admin)
   - Token-based access control
   - Unauthorized access returns 401

2. **RBAC Enforcement**
   - Students cannot create classes (403)
   - Teachers can create classes and manage them
   - Role-specific endpoints are protected

3. **Data Validation**
   - Missing required fields return 400
   - Invalid IDs return 404
   - Invalid class codes return 404

4. **Business Logic**
   - Auto-save works correctly
   - Class code generation is unique
   - Goal progress calculation
   - Attendance marking

5. **Integration Points**
   - Random exam selection pulls from database
   - Class creation generates 6-char codes
   - Student enrollment updates counts
   - Badge/Goal system interacts correctly

### Test Data Requirements

For E2E tests to pass, seed data needs:
- Test users (student@example.com, teacher@example.com)
- Sample exercises for each skill and level
- Badge definitions
- Initial system configuration

## 🔧 Configuration

### Environment Variables

Frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Backend `.env`:
```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vstep
JWT_SECRET=your-secret-key
```

### Axios Configuration

Located in `FE/src/lib/axios.ts`:
- Base URL from environment variable
- 30-second timeout
- Authorization header injection
- Token refresh on 401 errors
- Error interceptors

## 📊 API Response Format

All APIs follow a consistent response structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ...actual data... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ...error details... }
  }
}
```

## 🚦 Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (wrong role)
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## 🎯 Next Steps

1. **Run Database Migrations**
   ```bash
   cd BE
   npm run migration:run
   ```

2. **Seed Initial Data**
   ```bash
   npm run seed
   ```

3. **Start Backend Server**
   ```bash
   npm run start:dev
   ```

4. **Start Frontend**
   ```bash
   cd ../FE
   npm run dev
   ```

5. **Run E2E Tests**
   ```bash
   cd ../BE
   npm run test:e2e
   ```

## 📝 Notes

- All services use TypeScript for type safety
- React Query provides automatic caching and refetching
- E2E tests ensure all modules work end-to-end
- RBAC is enforced at both frontend and backend levels
- Auto-save interval is configurable (default: 10 seconds)

## 🐛 Troubleshooting

**401 Errors:**
- Check if token is expired
- Verify Authorization header format
- Ensure user is logged in

**403 Errors:**
- Check user role permissions
- Verify endpoint requires correct role

**Network Errors:**
- Check backend server is running
- Verify CORS configuration
- Check API base URL in environment

**Test Failures:**
- Ensure database is seeded
- Check test users exist
- Verify sample data is present
