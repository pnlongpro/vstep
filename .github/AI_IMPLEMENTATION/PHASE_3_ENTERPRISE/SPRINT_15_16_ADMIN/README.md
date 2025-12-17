# Sprint 15-16: Admin Panel

## 📋 Overview

| Attribute | Value |
|-----------|-------|
| **Sprint** | 15-16 |
| **Phase** | 3 - Enterprise |
| **Duration** | 2 weeks |
| **Focus** | Admin Panel, User/Exam Management, Analytics |
| **Total Tasks** | 10 (5 BE + 5 FE) |
| **Estimated Hours** | 52h |

---

## 🎯 Sprint Goals

1. **Admin Authorization**: Super admin và admin roles với permissions
2. **User Management**: CRUD users, ban/unban, change roles
3. **Exam Management**: CRUD exam sets, questions, publish/unpublish
4. **System Analytics**: Overview dashboard, user stats, revenue
5. **System Settings**: Configurable system settings

---

## 📋 Task List

### Backend Tasks

| Task ID | Title | Est. | Priority | Dependencies |
|---------|-------|------|----------|--------------|
| BE-054 | Admin Entity & RBAC | 4h | P0 | Phase 2 complete |
| BE-055 | User Management Service | 6h | P0 | BE-054 |
| BE-056 | Exam Management Service | 6h | P0 | BE-054 |
| BE-057 | System Analytics | 6h | P1 | BE-054 |
| BE-058 | System Settings | 4h | P1 | BE-054 |

### Frontend Tasks

| Task ID | Title | Est. | Priority | Dependencies |
|---------|-------|------|----------|--------------|
| FE-057 | Admin Layout & Navigation | 4h | P0 | BE-054 |
| FE-058 | User Management UI | 6h | P0 | BE-055 |
| FE-059 | Exam Management UI | 6h | P0 | BE-056 |
| FE-060 | Analytics Dashboard | 6h | P1 | BE-057 |
| FE-061 | System Settings UI | 4h | P1 | BE-058 |

---

## 📊 Database Schema

### Admin Logs

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,           -- 'user.update', 'exam.delete', etc.
  entity_type VARCHAR(50),                -- 'user', 'exam_set', 'question'
  entity_id UUID,
  old_data JSONB,                         -- Previous state
  new_data JSONB,                         -- New state
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at DESC);
```

### System Settings

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,       -- 'maintenance_mode', 'max_mock_tests_per_day'
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),                   -- 'general', 'limits', 'features'
  data_type VARCHAR(20),                  -- 'boolean', 'number', 'string', 'json'
  is_public BOOLEAN DEFAULT FALSE,        -- Visible to non-admin?
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 API Endpoints

### User Management

```
GET    /api/admin/users                    # List users (paginated, filterable)
GET    /api/admin/users/:id                # Get user details
PATCH  /api/admin/users/:id                # Update user
POST   /api/admin/users/:id/ban            # Ban user
POST   /api/admin/users/:id/unban          # Unban user
POST   /api/admin/users/:id/roles          # Update user roles
DELETE /api/admin/users/:id                # Soft delete user
GET    /api/admin/users/:id/activity       # User activity log
```

### Exam Management

```
GET    /api/admin/exam-sets                # List exam sets
POST   /api/admin/exam-sets                # Create exam set
GET    /api/admin/exam-sets/:id            # Get exam set details
PUT    /api/admin/exam-sets/:id            # Update exam set
DELETE /api/admin/exam-sets/:id            # Delete exam set
POST   /api/admin/exam-sets/:id/publish    # Publish exam set
POST   /api/admin/exam-sets/:id/unpublish  # Unpublish exam set

GET    /api/admin/questions                # List questions
POST   /api/admin/questions                # Create question
PUT    /api/admin/questions/:id            # Update question
DELETE /api/admin/questions/:id            # Delete question
POST   /api/admin/questions/import         # Bulk import (CSV/Excel)
```

### Analytics

```
GET    /api/admin/analytics/overview       # Dashboard overview
GET    /api/admin/analytics/users          # User analytics
GET    /api/admin/analytics/exams          # Exam analytics
GET    /api/admin/analytics/revenue        # Revenue analytics
GET    /api/admin/analytics/export         # Export data (CSV)
```

### Settings

```
GET    /api/admin/settings                 # Get all settings
GET    /api/admin/settings/:key            # Get single setting
PUT    /api/admin/settings/:key            # Update setting
GET    /api/admin/settings/public          # Public settings (for FE)
```

### Logs

```
GET    /api/admin/logs                     # Admin action logs
GET    /api/admin/logs/export              # Export logs
```

---

## 🛡️ RBAC Permissions

### Role Hierarchy

```
super_admin
  └── admin
       └── teacher
            └── student
```

### Permissions Matrix

| Action | super_admin | admin | teacher | student |
|--------|-------------|-------|---------|---------|
| View admin panel | ✅ | ✅ | ❌ | ❌ |
| Manage users | ✅ | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ | ❌ |
| Manage exams | ✅ | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ |
| View logs | ✅ | ✅ | ❌ | ❌ |

---

## 🏗️ Admin UI Structure

```
/admin
├── /dashboard                    # Overview analytics
├── /users
│   ├── /                         # User list
│   └── /[id]                     # User detail
├── /exams
│   ├── /                         # Exam set list
│   ├── /create                   # Create exam set
│   ├── /[id]                     # Exam set detail
│   └── /questions                # Question bank
├── /analytics
│   ├── /                         # Overview
│   ├── /users                    # User analytics
│   ├── /exams                    # Exam analytics
│   └── /revenue                  # Revenue analytics
├── /settings                     # System settings
└── /logs                         # Admin action logs
```

---

## 📁 File Structure

```
BE/src/modules/admin/
├── admin.module.ts
├── controllers/
│   ├── admin-users.controller.ts
│   ├── admin-exams.controller.ts
│   ├── admin-analytics.controller.ts
│   ├── admin-settings.controller.ts
│   └── admin-logs.controller.ts
├── services/
│   ├── admin-users.service.ts
│   ├── admin-exams.service.ts
│   ├── admin-analytics.service.ts
│   ├── admin-settings.service.ts
│   └── admin-logs.service.ts
├── entities/
│   ├── admin-log.entity.ts
│   └── system-setting.entity.ts
├── dto/
│   ├── user-query.dto.ts
│   ├── update-user.dto.ts
│   ├── exam-query.dto.ts
│   ├── update-setting.dto.ts
│   └── analytics-query.dto.ts
└── guards/
    └── admin.guard.ts

FE/src/
├── app/(admin)/admin/
│   ├── layout.tsx
│   ├── page.tsx                  # Dashboard redirect
│   ├── dashboard/page.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── exams/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   ├── [id]/page.tsx
│   │   └── questions/page.tsx
│   ├── analytics/page.tsx
│   ├── settings/page.tsx
│   └── logs/page.tsx
└── features/admin/
    ├── components/
    │   ├── AdminLayout.tsx
    │   ├── AdminSidebar.tsx
    │   ├── UserTable.tsx
    │   ├── UserDetailCard.tsx
    │   ├── ExamSetTable.tsx
    │   ├── QuestionEditor.tsx
    │   ├── AnalyticsChart.tsx
    │   ├── SettingsForm.tsx
    │   └── LogsTable.tsx
    ├── hooks/
    │   ├── useAdminUsers.ts
    │   ├── useAdminExams.ts
    │   ├── useAdminAnalytics.ts
    │   └── useAdminSettings.ts
    └── types.ts
```

---

## ⚠️ Lưu ý quan trọng

1. **Security First**: Tất cả admin routes phải qua `AdminGuard`
2. **Audit Trail**: Mọi thao tác PHẢI được log vào `admin_logs`
3. **Soft Delete**: Users chỉ được soft delete, không hard delete
4. **Rate Limiting**: Áp dụng stricter rate limits cho admin APIs
5. **2FA Recommended**: Super admin nên bật 2FA
6. **IP Whitelist**: Cân nhắc whitelist IP cho admin panel
