# 🆕 Sprint 15-16: Admin Panel - UI-Template Updates

> **Các task bổ sung từ UI-Template mới (December 2024)**
>
> Updated: 19/12/2024

---

## 📋 Tổng quan

Sprint 15-16 Admin đã có các task cơ bản. File này bổ sung các components mới từ UI-Template.

---

## 🆕 New Admin Tasks

### Existing Tasks (Đã có trong README.md)
- BE-054 → BE-058: Admin Entity, User Management, Exam Management, Analytics, Settings
- FE-057 → FE-061: Admin Layout, User Management UI, Exam Management UI, Analytics, Settings

### 🆕 Additional Tasks

| Task ID | Component | UI-Template Source | Priority |
|---------|-----------|-------------------|----------|
| FE-062 | BlogManagement | `admin/BlogManagement.tsx` | P1 |
| FE-063 | FooterManager | `admin/FooterManager.tsx` | P2 |
| FE-064 | NotificationManagementPage | `admin/NotificationManagementPage.tsx` | P1 |
| FE-065 | AdminAssignmentLibraryPage | `admin/AdminAssignmentLibraryPage.tsx` | P2 |
| FE-066 | AdminAttendancePage | `admin/AdminAttendancePage.tsx` | P2 |
| FE-067 | AdminRoadmapManagementPage | `admin/AdminRoadmapManagementPage.tsx` | P3 |
| FE-068 | AdminMaterialsManagementPage | `admin/AdminMaterialsManagementPage.tsx` | P2 |
| FE-069 | FreeAccountManagementPage | `admin/FreeAccountManagementPage.tsx` | P2 |
| FE-070 | DocumentsManagementPage | `admin/DocumentsManagementPage.tsx` | P3 |

---

## 📝 Task Details

### FE-062: BlogManagement

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P1
- **Estimated Hours**: 6h
- **Dependencies**: FE-057 (Admin Layout)

## 🎯 Objective
Quản lý blog posts từ giáo viên và uploaders

## 📝 Requirements
1. List tất cả blog posts
2. Filter by status (draft/pending/published/rejected)
3. Duyệt/Từ chối posts
4. Thêm feedback khi từ chối
5. Feature/Unfeature posts
6. View analytics per post

## 💻 Implementation
Source: `UI-Template/components/admin/BlogManagement.tsx`
Target: `FE/src/components/admin/BlogManagement.tsx`

## ✅ Acceptance Criteria
- [ ] Blog list với pagination
- [ ] Status filters
- [ ] Approve/Reject actions
- [ ] Feedback modal for rejection
- [ ] Featured toggle
- [ ] View/Edit post detail
```

---

### FE-063: FooterManager

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P2
- **Estimated Hours**: 5h
- **Dependencies**: FE-057

## 🎯 Objective
CMS để quản lý nội dung Footer website

## 📝 Requirements
1. Edit footer sections:
   - Brand info (name, tagline, description)
   - Contact info (email, phone, address)
   - Quick links sections
   - Social media links
2. Enable/disable links
3. Reorder items
4. Preview changes

## 💻 Implementation
Source: `UI-Template/components/admin/FooterManager.tsx`
Config: `UI-Template/config/footerConfig.ts`
Target: `FE/src/components/admin/FooterManager.tsx`

## ✅ Acceptance Criteria
- [ ] Edit all footer sections
- [ ] Toggle link visibility
- [ ] Drag-drop reorder
- [ ] Live preview
- [ ] Save/publish changes
```

---

### FE-064: NotificationManagementPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P1
- **Estimated Hours**: 5h
- **Dependencies**: FE-057

## 🎯 Objective
Quản lý và gửi thông báo hệ thống

## 📝 Requirements
1. Gửi thông báo cho:
   - Tất cả users
   - Theo role (student/teacher/admin)
   - Theo danh sách email
2. Schedule notifications
3. View sent history
4. Analytics: open rate, click rate

## 💻 Implementation
Source: `UI-Template/components/admin/NotificationManagementPage.tsx`
Target: `FE/src/components/admin/NotificationManagementPage.tsx`

## ✅ Acceptance Criteria
- [ ] Create notification form
- [ ] Target selection (all/role/custom)
- [ ] Schedule picker
- [ ] Sent history list
- [ ] Analytics display
```

---

### FE-065: AdminAssignmentLibraryPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P2
- **Estimated Hours**: 6h

## 🎯 Objective
Quản lý thư viện bài tập toàn hệ thống

## 📝 Requirements
1. View all assignments from all courses
2. Edit/Delete assignments
3. Approve teacher-contributed assignments
4. Organize by course/session
5. Bulk actions

## 💻 Implementation
Source: `UI-Template/components/admin/AdminAssignmentLibraryPage.tsx`
Target: `FE/src/components/admin/AdminAssignmentLibraryPage.tsx`

## ✅ Acceptance Criteria
- [ ] Full assignment list with filters
- [ ] CRUD operations
- [ ] Approval workflow
- [ ] Course/session organization
- [ ] Bulk approve/delete
```

---

### FE-066: AdminAttendancePage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P2
- **Estimated Hours**: 4h

## 🎯 Objective
Xem và quản lý điểm danh tất cả các lớp

## 📝 Requirements
1. Xem attendance của tất cả lớp
2. Filter by class, teacher, date
3. Export attendance reports
4. View attendance trends

## 💻 Implementation
Source: `UI-Template/components/admin/AdminAttendancePage.tsx`
Target: `FE/src/components/admin/AdminAttendancePage.tsx`

## ✅ Acceptance Criteria
- [ ] Attendance overview
- [ ] Multi-filter support
- [ ] Export to Excel/PDF
- [ ] Trend charts
```

---

### FE-067: AdminRoadmapManagementPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P3
- **Estimated Hours**: 8h

## 🎯 Objective
Quản lý và tạo lộ trình học tập template

## 📝 Requirements
1. CRUD roadmap templates
2. Visual roadmap builder
3. Assign to courses
4. Clone/share templates
5. Version control

## 💻 Implementation
Source: `UI-Template/components/admin/AdminRoadmapManagementPage.tsx`
Target: `FE/src/components/admin/AdminRoadmapManagementPage.tsx`

## ✅ Acceptance Criteria
- [ ] Roadmap template list
- [ ] Visual builder interface
- [ ] Course assignment
- [ ] Clone functionality
- [ ] Version history
```

---

### FE-068: AdminMaterialsManagementPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P2
- **Estimated Hours**: 5h

## 🎯 Objective
Quản lý tài liệu học tập toàn hệ thống

## 📝 Requirements
1. View all materials (textbooks, lectures, exercises, media)
2. Approve/reject teacher uploads
3. Organize by category/course
4. Track views/downloads
5. Storage analytics

## 💻 Implementation
Source: `UI-Template/components/admin/AdminMaterialsManagementPage.tsx`
Target: `FE/src/components/admin/AdminMaterialsManagementPage.tsx`

## ✅ Acceptance Criteria
- [ ] Materials list with categories
- [ ] Approval workflow
- [ ] Category/course organization
- [ ] Analytics display
- [ ] Storage usage stats
```

---

### FE-069: FreeAccountManagementPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P2
- **Estimated Hours**: 4h

## 🎯 Objective
Quản lý tài khoản miễn phí và giới hạn

## 📝 Requirements
1. List free accounts
2. Set free tier limits (exercises/day, features)
3. View usage stats
4. Upgrade prompts config
5. Trial extensions

## 💻 Implementation
Source: `UI-Template/components/admin/FreeAccountManagementPage.tsx`
Target: `FE/src/components/admin/FreeAccountManagementPage.tsx`

## ✅ Acceptance Criteria
- [ ] Free account list
- [ ] Limit configuration
- [ ] Usage analytics
- [ ] Extension management
```

---

### FE-070: DocumentsManagementPage

```markdown
## 📋 Task Info
- **Sprint**: 15-16
- **Priority**: P3
- **Estimated Hours**: 4h

## 🎯 Objective
Quản lý các tài liệu hệ thống (Terms, Privacy, etc.)

## 📝 Requirements
1. CRUD system documents
2. Rich text editor
3. Version control
4. Publish/unpublish
5. Last updated tracking

## 💻 Implementation
Source: `UI-Template/components/admin/DocumentsManagementPage.tsx`
Target: `FE/src/components/admin/DocumentsManagementPage.tsx`

## ✅ Acceptance Criteria
- [ ] Document list
- [ ] Rich text editor
- [ ] Version history
- [ ] Publish control
```

---

## 📊 Summary

| Priority | Tasks | Estimated Hours |
|----------|-------|-----------------|
| P1 | FE-062, FE-064 | 11h |
| P2 | FE-063, FE-065, FE-066, FE-068, FE-069 | 24h |
| P3 | FE-067, FE-070 | 12h |
| **Total** | **9 tasks** | **47h** |

### Combined with Original Sprint 15-16:
| Original | Additional | Total |
|----------|------------|-------|
| 10 tasks (52h) | 9 tasks (47h) | **19 tasks (99h)** |

---

## 🔗 Related Files

- `UI-Template/components/admin/` - Source components
- `UI-Template/config/footerConfig.ts` - Footer CMS config
- `UI-Template/constants/layout.ts` - Design system
