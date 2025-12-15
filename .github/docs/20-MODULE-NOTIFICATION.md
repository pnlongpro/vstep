# 🔔 Module 20: Notification System

> **Module thông báo real-time cho người dùng**
> 
> File: `20-MODULE-NOTIFICATION.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Loại thông báo](#2-loại-thông-báo)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. Database Design](#4-database-design)
- [5. API Endpoints](#5-api-endpoints)
- [6. Real-time Implementation](#6-real-time-implementation)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Notification System cung cấp:
- **In-app notifications**: Thông báo trong ứng dụng
- **Email notifications**: Gửi email tự động
- **Push notifications**: Thông báo đẩy (future)
- **Real-time updates**: Cập nhật tức thì
- **Notification center**: Trung tâm thông báo
- **Preferences**: Cài đặt nhận thông báo

### 1.2. Channels

**In-App** (Primary):
- Bell icon với badge count
- Dropdown notification panel
- Notification page
- Real-time với WebSocket

**Email** (Secondary):
- Important notifications
- Daily/Weekly digests
- Marketing emails (opt-in)

**Push** (Future):
- Mobile push notifications
- Desktop notifications

---

## 2. Loại thông báo

### 2.1. Assignment Notifications

**For Students**:
- New assignment: "Bài tập mới: {title}"
- Due soon: "Sắp hết hạn: {title} (còn {hours}h)"
- Overdue: "Quá hạn: {title}"
- Graded: "Bài tập đã chấm: {title} - Điểm: {score}"

**For Teachers**:
- Student submitted: "{studentName} đã nộp {title}"
- Pending grading: "{count} bài tập cần chấm"

### 2.2. Class Notifications

**For Students**:
- Added to class: "Bạn đã được thêm vào lớp {className}"
- New material: "Tài liệu mới: {fileName} trong {className}"
- Class canceled: "Buổi học {date} đã bị hủy"
- Attendance marked: "Điểm danh: {status}"

**For Teachers**:
- Student joined: "{studentName} đã tham gia {className}"
- Student left: "{studentName} đã rời {className}"

### 2.3. Exam Notifications

- Mock exam ready: "Kết quả thi thử đã sẵn sàng"
- Certificate available: "Chứng nhận đã được tạo"

### 2.4. System Notifications

- Welcome: "Chào mừng đến VSTEPRO!"
- Email verified: "Email đã được xác thực"
- Password changed: "Mật khẩu đã được thay đổi"
- Account suspended: "Tài khoản bị tạm khóa"
- Premium expires: "Premium sắp hết hạn (còn {days} ngày)"

### 2.5. Achievement Notifications

- Badge unlocked: "🎉 Bạn đã mở khóa huy hiệu: {badgeName}!"
- Goal achieved: "✅ Hoàn thành mục tiêu: {goalName}"
- Streak milestone: "🔥 Chuỗi {days} ngày!"

---

## 3. Phân tích màn hình UI

### 3.1. Notification Bell Icon

**Location**: Top bar (right side)

**Display**:
- Bell icon (Lucide Bell)
- Badge with unread count (red circle)
- Hover: Show "Thông báo"
- Click: Toggle notification panel

**Badge**:
- Only show if unread > 0
- Max display: 99+ (if > 99)
- Color: Red (#ef4444)
- Position: Top-right of bell icon

---

### 3.2. Notification Panel (Dropdown)

**Toggle from**: Bell icon click

**Panel Structure**:

**Header**:
- Title: "Thông báo"
- Mark all as read button
- Settings icon (→ preferences)

**Tabs**:
- Tất cả (All) - badge: unread count
- Chưa đọc (Unread)

**Notification List** (max 10 recent):
- Each notification card:
  - Icon (based on type)
  - Title (bold if unread)
  - Message
  - Time ago ("2 hours ago")
  - Unread indicator (blue dot)
  - Click: Mark as read + navigate

**Footer**:
- Link: "Xem tất cả thông báo" (→ Notifications Page)

**Empty State**:
- Icon: Bell (gray)
- Text: "Không có thông báo mới"

---

### 3.3. Notifications Page

**File**: `/components/NotificationsPage.tsx`

**Header**:
- Title: "Thông báo"
- Actions:
  - Mark all as read
  - Delete all read
  - Settings

**Filters**:
- All / Unread
- Type filter: Dropdown
  - All Types
  - Assignments
  - Classes
  - Exams
  - System
  - Achievements

**Notification List** (paginated):
- Full list of notifications
- Each card (same as panel but larger)
- Click: Mark as read + action
- Swipe to delete (mobile)

**Actions per notification**:
- Mark as read/unread
- Delete
- Navigate to related item

---

### 3.4. Notification Preferences

**Settings Page Section**:

**Email Notifications**:
- [ ] Assignment notifications
- [ ] Class updates
- [ ] Exam results
- [ ] System announcements
- [ ] Marketing emails

**In-App Notifications**:
- [ ] Enable desktop notifications
- [ ] Play sound
- [ ] Show badge count

**Frequency**:
- ⚪ Instant
- ⚪ Daily digest
- ⚪ Weekly digest

---

## 4. Database Design

### 4.1. Table: notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  type VARCHAR(50) NOT NULL,
    -- 'assignment_new' | 'assignment_graded' | 'class_joined' | 
    -- 'exam_ready' | 'badge_unlocked' | 'system_announcement'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(50),
    -- Icon name from Lucide
  
  -- Link/Action
  action_url VARCHAR(500),
    -- Where to navigate when clicked
  action_type VARCHAR(50),
    -- 'navigate' | 'modal' | 'external'
  
  -- Related entities
  related_entity_type VARCHAR(50),
    -- 'assignment' | 'class' | 'exam' | 'badge'
  related_entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Channels
  sent_in_app BOOLEAN DEFAULT TRUE,
  sent_email BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) 
  WHERE is_read = FALSE AND is_deleted = FALSE;
```

### 4.2. Table: notification_preferences

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email preferences
  email_assignments BOOLEAN DEFAULT TRUE,
  email_classes BOOLEAN DEFAULT TRUE,
  email_exams BOOLEAN DEFAULT TRUE,
  email_system BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  email_frequency VARCHAR(20) DEFAULT 'instant',
    -- 'instant' | 'daily' | 'weekly' | 'never'
  
  -- In-app preferences
  inapp_enabled BOOLEAN DEFAULT TRUE,
  inapp_sound BOOLEAN DEFAULT TRUE,
  desktop_notifications BOOLEAN DEFAULT FALSE,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

---

## 5. API Endpoints

### 5.1. GET /api/notifications

**Request**:
```typescript
GET /api/notifications?unread=true&type=assignment&page=1&limit=20
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "assignment_graded",
        "title": "Bài tập đã chấm",
        "message": "Bài tập Reading Week 1 đã được chấm. Điểm: 8.5/10",
        "icon": "CheckCircle",
        "actionUrl": "/assignments/uuid",
        "actionType": "navigate",
        "isRead": false,
        "createdAt": "2024-12-15T10:30:00Z",
        "timeAgo": "2 hours ago"
      }
    ],
    "unreadCount": 5,
    "total": 45,
    "pagination": {
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

---

### 5.2. POST /api/notifications

**Request** (Internal/Admin):
```typescript
POST /api/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid",  // or userIds: ["uuid1", "uuid2"]
  "type": "assignment_new",
  "title": "Bài tập mới",
  "message": "Giáo viên đã giao bài tập mới: Reading Week 1",
  "icon": "ClipboardList",
  "actionUrl": "/assignments/uuid",
  "relatedEntityType": "assignment",
  "relatedEntityId": "uuid",
  "sendEmail": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "notificationId": "uuid",
    "sent": true
  }
}
```

---

### 5.3. PUT /api/notifications/:id/read

**Request**:
```typescript
PUT /api/notifications/uuid/read
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 5.4. PUT /api/notifications/mark-all-read

**Request**:
```typescript
PUT /api/notifications/mark-all-read
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 12
}
```

---

### 5.5. DELETE /api/notifications/:id

**Request**:
```typescript
DELETE /api/notifications/uuid
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## 6. Real-time Implementation

### 6.1. WebSocket Setup

```typescript
// Server-side (Socket.io)
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  try {
    const user = await verifyToken(token);
    socket.data.userId = user.id;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Connection
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  
  // Join user's personal room
  socket.join(`user:${userId}`);
  
  console.log(`User ${userId} connected`);
  
  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Send notification
export function sendNotification(userId: string, notification: Notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}
```

### 6.2. Client-side

```typescript
// useNotifications.ts
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useNotifications() {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token }
    });
    
    newSocket.on('notification', (notification) => {
      // Add to list
      setNotifications(prev => [notification, ...prev]);
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Show toast
      toast.info(notification.title);
      
      // Play sound
      playNotificationSound();
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
```

### 6.3. Notification Helper

```typescript
// notificationService.ts
export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
  relatedEntityType,
  relatedEntityId,
  sendEmail = false
}: NotificationInput) {
  // 1. Check user preferences
  const prefs = await getUserPreferences(userId);
  
  if (!prefs.inapp_enabled && !prefs.email_enabled) {
    return; // User disabled all notifications
  }
  
  // 2. Create notification record
  const notification = await db.notifications.create({
    user_id: userId,
    type,
    title,
    message,
    icon: getIconForType(type),
    action_url: actionUrl,
    related_entity_type: relatedEntityType,
    related_entity_id: relatedEntityId,
    sent_in_app: prefs.inapp_enabled,
    sent_email: sendEmail && prefs.email_enabled
  });
  
  // 3. Send in-app (real-time)
  if (prefs.inapp_enabled) {
    sendNotification(userId, notification);
  }
  
  // 4. Send email (async)
  if (sendEmail && prefs.email_enabled) {
    await queueEmail({
      to: await getUserEmail(userId),
      subject: title,
      template: 'notification',
      data: { notification }
    });
  }
  
  return notification;
}
```

---

## Kết thúc Module Notification System

Module này tích hợp với tất cả modules khác để gửi thông báo real-time cho người dùng.
