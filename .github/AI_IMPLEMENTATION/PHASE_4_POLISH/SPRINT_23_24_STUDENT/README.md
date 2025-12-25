# Sprint 23-24: Student Features Enhancement

> **Hoàn thiện các tính năng cho Student**
>
> Updated: 19/12/2024

---

## 📋 Overview

| Attribute | Value |
|-----------|-------|
| **Sprint** | 23-24 |
| **Phase** | 4 - Polish |
| **Duration** | 2 weeks |
| **Focus** | Student Settings, Schedule, Notifications, Materials |
| **Total Tasks** | 10 (5 BE + 5 FE) |
| **Estimated Hours** | ~40h |

---

## 🎯 Sprint Goals

1. **Settings Page**: Cài đặt tài khoản, thông báo, học tập
2. **Schedule Page**: Lịch học và hoạt động
3. **Notifications Page**: Quản lý thông báo
4. **Materials Page**: Tài liệu học tập
5. **Achievements Page**: Huy hiệu và thành tích

---

## 📋 Task List

### Backend Tasks

| Task ID | Title | Est. | Priority | Description |
|---------|-------|------|----------|-------------|
| BE-STU-001 | User Settings API | 4h | P1 | CRUD user settings |
| BE-STU-002 | Schedule API | 4h | P1 | Calendar events |
| BE-STU-003 | Notifications API | 4h | P1 | User notifications |
| BE-STU-004 | Materials Access API | 3h | P1 | Student materials |
| BE-STU-005 | Achievements API | 3h | P1 | User achievements |

### Frontend Tasks

| Task ID | Title | Est. | Priority | Source |
|---------|-------|------|----------|--------|
| FE-STU-001 | StudentSettingsPage | 5h | P1 | `student/StudentSettingsPage.tsx` |
| FE-STU-002 | SchedulePage | 4h | P1 | `student/SchedulePage.tsx` |
| FE-STU-003 | StudentNotificationsPage | 4h | P1 | `student/StudentNotificationsPage.tsx` |
| FE-STU-004 | MaterialsPage | 4h | P1 | `student/MaterialsPage.tsx` |
| FE-STU-005 | AchievementsPage | 5h | P1 | `student/AchievementsPage.tsx` |

---

## 📝 Task Details

### FE-STU-001: StudentSettingsPage

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 5h
- **Dependencies**: BE-STU-001

## 🎯 Objective
Trang cài đặt cho học viên

## 📝 Requirements
1. Account settings:
   - Profile info (name, avatar, phone)
   - Password change
   - Email notifications toggle
2. Learning settings:
   - Daily goal
   - Auto-play audio
   - Playback speed default
3. Privacy settings:
   - Show on leaderboard
   - Profile visibility
4. Connected accounts (Google, Facebook)

## 💻 Implementation
Source: `UI-Template/components/student/StudentSettingsPage.tsx`
Target: `FE/src/components/student/StudentSettingsPage.tsx`

## ✅ Acceptance Criteria
- [ ] Profile edit form
- [ ] Password change modal
- [ ] Notification toggles
- [ ] Learning preferences
- [ ] Privacy controls
- [ ] Save/cancel buttons
```

---

### FE-STU-002: SchedulePage

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STU-002

## 🎯 Objective
Lịch học và hoạt động của học viên

## 📝 Requirements
1. Calendar view (month/week/day)
2. Event types:
   - Scheduled classes (if enrolled)
   - Mock test schedules
   - Assignment deadlines
   - Practice reminders
3. Add personal reminders
4. Sync with external calendar

## 💻 Implementation
Source: `UI-Template/components/student/SchedulePage.tsx`
Target: `FE/src/components/student/SchedulePage.tsx`

## ✅ Acceptance Criteria
- [ ] Calendar component
- [ ] View switching
- [ ] Event display with colors
- [ ] Add reminder modal
- [ ] Today highlight
```

---

### FE-STU-003: StudentNotificationsPage

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STU-003

## 🎯 Objective
Quản lý thông báo của học viên

## 📝 Requirements
1. Notification list với categories:
   - System notifications
   - Class notifications
   - Achievement unlocks
   - Reminders
2. Mark as read/unread
3. Mark all as read
4. Delete notifications
5. Filter by type

## 💻 Implementation
Source: `UI-Template/components/student/StudentNotificationsPage.tsx`
Target: `FE/src/components/student/StudentNotificationsPage.tsx`

## ✅ Acceptance Criteria
- [ ] Notification list
- [ ] Category filters
- [ ] Read/unread toggle
- [ ] Bulk actions
- [ ] Time ago display
```

---

### FE-STU-004: MaterialsPage

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STU-004

## 🎯 Objective
Truy cập tài liệu học tập

## 📝 Requirements
1. Browse materials by:
   - Category (textbook/lecture/exercise/media)
   - Skill
   - Level
2. Search functionality
3. Download/view materials
4. Bookmark favorites
5. Recently accessed

## 💻 Implementation
Source: `UI-Template/components/student/MaterialsPage.tsx`
Target: `FE/src/components/student/MaterialsPage.tsx`

## ✅ Acceptance Criteria
- [ ] Category tabs
- [ ] Filter sidebar
- [ ] Search box
- [ ] Material cards
- [ ] Download/view buttons
- [ ] Bookmark toggle
```

---

### FE-STU-005: AchievementsPage

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 5h
- **Dependencies**: BE-STU-005

## 🎯 Objective
Xem huy hiệu và thành tích

## 📝 Requirements
1. Badge collection:
   - Unlocked badges (với date)
   - Locked badges (với requirements)
2. Achievement categories:
   - Streak achievements
   - Skill achievements
   - Milestone achievements
3. Progress towards next badges
4. Share achievements

## 💻 Implementation
Source: `UI-Template/components/student/AchievementsPage.tsx`
Target: `FE/src/components/student/AchievementsPage.tsx`

## ✅ Acceptance Criteria
- [ ] Badge grid
- [ ] Unlocked/locked states
- [ ] Category tabs
- [ ] Progress indicators
- [ ] Badge detail modal
- [ ] Share functionality
```

---

## 📁 Target File Structure

```
FE/src/
├── components/
│   └── student/
│       ├── index.ts
│       ├── StudentSettingsPage.tsx
│       ├── SchedulePage.tsx
│       ├── StudentNotificationsPage.tsx
│       ├── MaterialsPage.tsx
│       └── AchievementsPage.tsx
│
├── services/
│   └── student.service.ts (extend)
│
├── hooks/
│   └── useStudent.ts
│
└── app/(dashboard)/
    ├── settings/
    │   └── page.tsx
    ├── schedule/
    │   └── page.tsx
    ├── notifications/
    │   └── page.tsx
    ├── materials/
    │   └── page.tsx
    └── achievements/
        └── page.tsx
```

---

## 📊 Summary

| Priority | Tasks | Hours |
|----------|-------|-------|
| P1 | 10 tasks | 40h |
| **Total** | **10 tasks** | **~40h** |
