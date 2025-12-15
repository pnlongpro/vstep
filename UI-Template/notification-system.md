# 🔔 NOTIFICATION SYSTEM - HỆ THỐNG THÔNG BÁO

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Notification Types](#notification-types)
3. [Delivery Channels](#delivery-channels)
4. [User Flows](#user-flows)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)

---

## Tổng quan

### Mục đích
Hệ thống thông báo (Notification System) cung cấp khả năng gửi và quản lý thông báo đến người dùng qua nhiều kênh khác nhau (in-app, email, push notifications).

### Phạm vi
- In-app notifications
- Email notifications
- Push notifications (browser/mobile)
- SMS notifications (optional)
- Notification preferences management
- Notification templates
- Scheduled notifications
- Bulk notifications

### Vai trò truy cập
- **All Users**: Receive và manage notifications
- **Teacher**: Send notifications to students
- **Admin**: Send system-wide notifications

---

## Notification Types

### 1. System Notifications

#### 1.1. Account & Authentication
```typescript
interface AccountNotification {
  type: 'account_created' | 'password_reset' | 'email_verified' | 'login_alert';
  
  // Account Created
  accountCreated: {
    username: string;
    temporaryPassword: string;
    loginUrl: string;
  };
  
  // Password Reset
  passwordReset: {
    resetLink: string;
    expiresIn: string; // "1 hour"
  };
  
  // Login Alert
  loginAlert: {
    device: string;
    location: string;
    ipAddress: string;
    time: Date;
  };
}
```

#### 1.2. System Announcements
- New features released
- Scheduled maintenance
- System updates
- Policy changes

### 2. Learning Notifications

#### 2.1. Assignment Notifications
```typescript
interface AssignmentNotification {
  type: 'assignment_assigned' | 'assignment_due_soon' | 'assignment_graded' | 'assignment_overdue';
  
  assignment: {
    id: string;
    title: string;
    dueDate: Date;
    className: string;
    teacherName: string;
  };
  
  // Graded
  result?: {
    score: number;
    passed: boolean;
    feedback: string;
  };
}
```

#### 2.2. Class Notifications
```typescript
interface ClassNotification {
  type: 'class_enrolled' | 'class_starting_soon' | 'class_cancelled' | 'teacher_changed' | 'class_material_uploaded';
  
  class: {
    id: string;
    name: string;
    teacher: string;
    schedule: string;
  };
  
  // Starting Soon
  startsIn?: string; // "30 minutes"
  meetingLink?: string;
  
  // Material Uploaded
  material?: {
    title: string;
    type: string;
    url: string;
  };
}
```

#### 2.3. Course Notifications
- Course enrollment confirmation
- New lesson available
- Course completion
- Certificate ready

#### 2.4. Test & Exam Notifications
```typescript
interface TestNotification {
  type: 'test_available' | 'test_result_ready' | 'test_retake_available';
  
  test: {
    id: string;
    title: string;
    type: string; // "Reading", "Full Test"
  };
  
  result?: {
    score: number;
    percentage: number;
    passed: boolean;
  };
}
```

### 3. Achievement Notifications

#### 3.1. Badge Unlocked
```typescript
interface BadgeNotification {
  type: 'badge_unlocked';
  
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}
```

#### 3.2. Goal Achieved
```typescript
interface GoalNotification {
  type: 'goal_achieved' | 'goal_progress' | 'goal_deadline_approaching';
  
  goal: {
    id: string;
    title: string;
    progress: number;
    target: number;
    deadline?: Date;
  };
}
```

#### 3.3. Milestone Reached
- Study streak milestones (7, 30, 100 days)
- Tests completed milestones (10, 50, 100)
- Level up
- Score achievements

### 4. Social Notifications

#### 4.1. Comments & Mentions
- New comment on your post
- Someone mentioned you
- Reply to your comment

#### 4.2. Teacher Feedback
- Teacher left feedback on assignment
- Teacher answered your question
- Teacher sent you a message

### 5. Reminder Notifications

#### 5.1. Scheduled Reminders
- Class reminder (30 mins before)
- Assignment due reminder (1 day before)
- Goal deadline reminder
- Study reminder (daily)

---

## Delivery Channels

### 1. In-App Notifications

#### 1.1. Notification Bell
- Icon in header with badge count
- Dropdown panel showing recent notifications
- Mark as read/unread
- Clear all

#### 1.2. Notification Center (NotificationsPage)
- Full list of all notifications
- Filters: All, Unread, Read
- Categories: System, Learning, Achievements, Social
- Search notifications
- Pagination
- Bulk actions (mark all as read, delete all)

#### 1.3. Toast Notifications
- Real-time pop-up for important events
- Auto-dismiss after 5 seconds
- Success, Info, Warning, Error styles

```typescript
interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration: number; // ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 2. Email Notifications

#### 2.1. Transactional Emails
Sent immediately for important actions:
- Welcome email
- Password reset
- Assignment graded
- Badge unlocked
- Payment confirmation

#### 2.2. Digest Emails
Batched notifications sent daily/weekly:
- Daily activity summary
- Weekly progress report
- Monthly achievements

#### 2.3. Marketing Emails (Optional)
- New courses available
- Promotions
- Tips and tricks
- Newsletter

#### 2.4. Email Templates

**Template Structure**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{subject}}</title>
</head>
<body>
  <div class="email-container">
    <!-- Header with logo -->
    <header>
      <img src="{{logo_url}}" alt="VSTEPRO" />
    </header>
    
    <!-- Main content -->
    <main>
      <h1>{{title}}</h1>
      <p>Hi {{user_name}},</p>
      
      {{content}}
      
      <div class="cta">
        <a href="{{action_url}}" class="button">{{action_text}}</a>
      </div>
    </main>
    
    <!-- Footer -->
    <footer>
      <p>© 2024 VSTEPRO. All rights reserved.</p>
      <a href="{{unsubscribe_url}}">Unsubscribe</a>
    </footer>
  </div>
</body>
</html>
```

**Example Templates**:

1. **Assignment Graded**
```
Subject: Your assignment has been graded

Hi {{student_name}},

Your assignment "{{assignment_title}}" has been graded by {{teacher_name}}.

Score: {{score}}/{{total_points}} ({{percentage}}%)
Status: {{passed ? 'Passed' : 'Not Passed'}}

Feedback:
{{feedback}}

[View Full Results]

Keep up the good work!
```

2. **Badge Unlocked**
```
Subject: 🏆 You unlocked a new badge!

Hi {{student_name}},

Congratulations! You've unlocked the "{{badge_name}}" badge!

{{badge_description}}

[View Your Badges]

Keep learning and unlock more badges!
```

3. **Class Reminder**
```
Subject: Class starting in 30 minutes

Hi {{student_name}},

Your class "{{class_name}}" with {{teacher_name}} is starting soon!

Time: {{start_time}}
Location: {{location}}

[Join Class Now]

See you there!
```

### 3. Push Notifications

#### 3.1. Browser Push (Web Push API)
- Request permission on first visit
- Send notifications even when browser closed
- Click to open specific page

#### 3.2. Mobile Push (Firebase Cloud Messaging)
- iOS and Android support
- Custom sounds và badges
- Deep linking to specific screens

#### 3.3. Push Notification Payload
```typescript
interface PushNotificationPayload {
  title: string;
  body: string;
  icon: string;
  badge: string;
  image?: string;
  
  // Actions
  actions?: {
    action: string;
    title: string;
    icon?: string;
  }[];
  
  // Data
  data: {
    url: string; // URL to open on click
    notificationId: string;
  };
  
  // Behavior
  requireInteraction: boolean;
  silent: boolean;
  vibrate?: number[]; // Vibration pattern
}
```

### 4. SMS Notifications (Optional)

For critical notifications:
- OTP for login/payment
- Password reset code
- Urgent class cancellation

---

## User Flows

### Flow 1: Send notification to student when assignment graded

```
Teacher finishes grading assignment
  ↓
Teacher clicks "Release Grade"
  ↓
Backend:
  ├─→ Update submission status = 'graded'
  ├─→ Create notification record:
  │    - type: 'assignment_graded'
  │    - user_id: student_id
  │    - data: {assignment, score, feedback}
  │
  ├─→ Send in-app notification:
  │    - Insert into notifications table
  │    - Increment unread count
  │    - Emit WebSocket event (if student online)
  │
  ├─→ Send email notification:
  │    - Load email template
  │    - Replace variables
  │    - Queue email job
  │    - Send via SMTP
  │
  └─→ Send push notification (if enabled):
       - Check user's push subscription
       - Send via FCM/Web Push API
  ↓
Student receives notification:
  ├─→ In-app: Badge count updates, appears in dropdown
  ├─→ Email: Receives email in inbox
  └─→ Push: Phone/Browser shows push notification
  ↓
Student clicks notification
  ↓
Navigate to assignment result page
  ↓
Mark notification as read
  ↓
Badge count decrements
```

### Flow 2: User manages notification preferences

```
User navigates to Profile → Settings → Notifications
  ↓
Display notification preferences form
  ↓
For each notification type:
  - Email: ☑ Enabled
  - Push: ☑ Enabled
  - In-app: ☑ Enabled (always on)
  ↓
User toggles preferences:
  - Assignment notifications:
    - Email: ☑ → ☐ (disabled)
    - Push: ☑ (keep enabled)
  - Class notifications:
    - Email: ☑ (keep)
    - Push: ☑ (keep)
  ↓
User clicks "Save Preferences"
  ↓
API call: PATCH /api/users/me/notification-preferences
  Body: {
    assignments: {
      email: false,
      push: true,
      inApp: true
    },
    classes: {
      email: true,
      push: true,
      inApp: true
    }
  }
  ↓
Backend:
  ├─→ Validate preferences
  ├─→ Update user_notification_preferences table
  └─→ Return success
  ↓
Show success message: "Preferences saved"
  ↓
--- Later, when notification sent ---
System checks preferences before sending:
  - If email disabled for this type → Don't send email
  - If push enabled → Send push
  - In-app always sent
```

### Flow 3: Admin sends system-wide announcement

```
Admin navigates to Admin Dashboard → Notifications
  ↓
Clicks "Send Announcement"
  ↓
Fill form:
  - Title: "System Maintenance Notice"
  - Message: "We will perform maintenance..."
  - Priority: High
  - Recipients:
    ☑ All Users
    ☐ Students Only
    ☐ Teachers Only
  - Channels:
    ☑ Email
    ☑ Push
    ☑ In-app
  - Schedule:
    ⦿ Send Now
    ○ Schedule for later: [Date Time Picker]
  ↓
Admin clicks "Preview"
  ↓
Show preview of notification in all channels
  ↓
Admin clicks "Send"
  ↓
API call: POST /api/admin/notifications/broadcast
  ↓
Backend:
  ├─→ Create notification record
  ├─→ Get recipient list (all users / filtered)
  ├─→ For each user:
  │    ├─→ Check user preferences
  │    ├─→ Create notification entry
  │    └─→ Queue for delivery
  │
  ├─→ Batch process:
  │    ├─→ In-app: Bulk insert to DB, emit WebSocket
  │    ├─→ Email: Queue batch email job (send 100/min)
  │    └─→ Push: Batch push to FCM (1000/batch)
  │
  └─→ Track delivery status
  ↓
Admin sees progress:
  "Sending to 15,234 users...
  In-app: ✅ 15,234/15,234
  Email: ⏳ 8,456/15,234
  Push: ⏳ 12,345/15,234"
  ↓
All users receive notification
  ↓
Admin can view delivery report:
  - Total sent: 15,234
  - Delivered: 15,100
  - Failed: 134 (email bounces, push token invalid)
  - Opened: 8,456 (56%)
  - Clicked: 3,245 (21%)
```

---

## Database Design

### Table: notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Type & Category
  type VARCHAR(50) NOT NULL,
    -- 'assignment_graded', 'badge_unlocked', 'class_reminder', etc.
  category VARCHAR(20) NOT NULL,
    -- 'system', 'learning', 'achievement', 'social'
  priority VARCHAR(10) DEFAULT 'normal',
    -- 'low', 'normal', 'high', 'urgent'
  
  -- Content
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(50), -- Icon name from icon library
  image_url VARCHAR(500),
  
  -- Action
  action_url VARCHAR(500), -- URL to navigate when clicked
  action_text VARCHAR(50), -- "View Assignment", "Open Class"
  
  -- Data (JSON for flexibility)
  data JSONB, -- Type-specific data
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Delivery
  delivered_via JSONB, -- ["in_app", "email", "push"]
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  push_sent BOOLEAN DEFAULT FALSE,
  push_sent_at TIMESTAMP,
  
  -- Engagement
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP, -- Auto-delete after this date
  
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_category (category),
  INDEX idx_notifications_read (is_read),
  INDEX idx_notifications_created (created_at)
);
```

### Table: notification_preferences

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Types
  assignment_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  class_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  course_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  achievement_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  social_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  system_notifications JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  
  -- Digest Emails
  daily_digest BOOLEAN DEFAULT FALSE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  
  -- Marketing
  marketing_emails BOOLEAN DEFAULT FALSE,
  
  -- Do Not Disturb
  dnd_enabled BOOLEAN DEFAULT FALSE,
  dnd_start_time TIME, -- e.g., "22:00"
  dnd_end_time TIME, -- e.g., "08:00"
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id)
);
```

### Table: notification_templates

```sql
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template Info
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL, -- 'assignment_graded', 'badge_unlocked'
  description TEXT,
  
  -- Content
  subject VARCHAR(200), -- For email
  title VARCHAR(200), -- For push/in-app
  body_template TEXT NOT NULL, -- With variables: {{user_name}}
  html_template TEXT, -- For email
  
  -- Variables
  variables JSONB, -- ["user_name", "assignment_title", "score"]
  sample_data JSONB, -- For preview
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_templates_type (type),
  INDEX idx_templates_active (is_active)
);
```

### Table: push_subscriptions

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Subscription
  endpoint VARCHAR(500) NOT NULL,
  keys JSONB NOT NULL, -- {p256dh, auth}
  
  -- Device Info
  device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
  browser VARCHAR(50),
  os VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  failed_attempts INTEGER DEFAULT 0, -- Auto-disable after 3 fails
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMP,
  
  INDEX idx_push_subscriptions_user (user_id),
  INDEX idx_push_subscriptions_active (is_active),
  UNIQUE (endpoint)
);
```

### Table: notification_logs

```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Notification
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  
  -- Delivery
  channel VARCHAR(20) NOT NULL, -- 'email', 'push', 'sms'
  status VARCHAR(20) NOT NULL,
    -- 'queued', 'sent', 'delivered', 'failed', 'bounced'
  
  -- Details
  recipient VARCHAR(255), -- Email address, phone number, device token
  provider VARCHAR(50), -- 'smtp', 'fcm', 'twilio'
  
  -- Response
  response_code VARCHAR(10),
  response_message TEXT,
  error_message TEXT,
  
  -- Timing
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_notification_logs_notification (notification_id),
  INDEX idx_notification_logs_channel (channel),
  INDEX idx_notification_logs_status (status),
  INDEX idx_notification_logs_created (created_at)
);
```

---

## API Endpoints

### 1. Get Notifications

**GET /api/notifications**

Query Parameters:
```typescript
{
  page?: number;
  limit?: number;
  category?: 'all' | 'system' | 'learning' | 'achievement' | 'social';
  status?: 'all' | 'unread' | 'read';
  from?: Date;
  to?: Date;
}
```

Response:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "assignment_graded",
        "category": "learning",
        "title": "Assignment Graded",
        "message": "Your assignment 'VSTEP Reading' has been graded",
        "icon": "check-circle",
        "actionUrl": "/assignments/123/result",
        "isRead": false,
        "createdAt": "2024-12-11T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 2. Mark as Read

**PATCH /api/notifications/:id/read**

Response:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 3. Mark All as Read

**POST /api/notifications/mark-all-read**

Response:
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updated": 12
  }
}
```

---

### 4. Delete Notification

**DELETE /api/notifications/:id**

---

### 5. Get Unread Count

**GET /api/notifications/unread-count**

Response:
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 6. Get Notification Preferences

**GET /api/users/me/notification-preferences**

Response:
```json
{
  "success": true,
  "data": {
    "assignments": {
      "email": true,
      "push": true,
      "inApp": true
    },
    "classes": {
      "email": true,
      "push": false,
      "inApp": true
    },
    "dailyDigest": false,
    "weeklyDigest": true,
    "dndEnabled": true,
    "dndStartTime": "22:00",
    "dndEndTime": "08:00"
  }
}
```

---

### 7. Update Notification Preferences

**PATCH /api/users/me/notification-preferences**

Request Body:
```json
{
  "assignments": {
    "email": false,
    "push": true,
    "inApp": true
  }
}
```

---

### 8. Send Notification (Admin)

**POST /api/admin/notifications/send**

Request Body:
```json
{
  "type": "system_announcement",
  "recipients": "all", // or array of user IDs
  "title": "System Maintenance",
  "message": "We will perform maintenance...",
  "priority": "high",
  "channels": ["email", "push", "inApp"],
  "scheduleFor": null // or Date for scheduled send
}
```

---

### 9. Subscribe to Push

**POST /api/notifications/push/subscribe**

Request Body:
```json
{
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows"
}
```

---

### 10. Unsubscribe from Push

**DELETE /api/notifications/push/unsubscribe/:subscriptionId**

---

## Summary

Module Notification System cung cấp:
- **Multiple delivery channels**: In-app, Email, Push, SMS
- **Rich notification types**: 20+ notification types
- **User preferences**: Granular control per type
- **Email templates**: Customizable với variables
- **Push notifications**: Web Push và Mobile (FCM)
- **Scheduled notifications**: Send now or later
- **Bulk notifications**: System-wide announcements
- **Delivery tracking**: Logs và analytics
- **5 database tables** cho notification data
- **10 API endpoints** đầy đủ chức năng

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
