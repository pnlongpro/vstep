# 🆕 Sprint: Uploader Role

> **Role mới cho Content Contributors**
>
> Updated: 19/12/2024

---

## 📋 Tổng quan

Uploader là role mới dành cho người đóng góp nội dung (không phải giáo viên).
Có thể upload đề thi, viết blog, quản lý nội dung được duyệt.

---

## 🎯 Tasks

### Backend Tasks

| Task ID | Title | Priority | Hours |
|---------|-------|----------|-------|
| BE-UPL-001 | Uploader Role Entity | P1 | 2h |
| BE-UPL-002 | Uploader Permissions | P1 | 3h |
| BE-UPL-003 | Blog Contribution Service | P1 | 4h |
| BE-UPL-004 | Exam Upload Service | P1 | 4h |

### Frontend Tasks

| Task ID | Title | Priority | Hours |
|---------|-------|----------|-------|
| FE-UPL-001 | UploaderDashboard | P1 | 6h |
| FE-UPL-002 | UploaderBlogContribution | P1 | 5h |
| FE-UPL-003 | UploaderExamUploadModal | P1 | 4h |
| FE-UPL-004 | Uploader Sidebar/Layout | P1 | 3h |
| FE-UPL-005 | Uploader Routes | P1 | 2h |

---

## 📝 Task Details

### FE-UPL-001: UploaderDashboard

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 6h
- **Dependencies**: BE-UPL-001, BE-UPL-002

## 🎯 Objective
Dashboard chính cho Uploader role

## 📝 Requirements
1. Overview stats:
   - Tổng nội dung đã đóng góp
   - Nội dung đã được duyệt
   - Đang chờ duyệt
   - Bị từ chối
2. Quick actions:
   - Upload đề thi mới
   - Viết blog mới
3. Recent activity

## 💻 Implementation
Source: `UI-Template/components/uploader/UploaderDashboard.tsx`
Target: `FE/src/components/uploader/UploaderDashboard.tsx`

## ✅ Acceptance Criteria
- [ ] Stats overview cards
- [ ] Quick action buttons
- [ ] Recent contributions list
- [ ] Pending items highlight
```

---

### FE-UPL-002: UploaderBlogContribution

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 5h
- **Dependencies**: FE-UPL-001

## 🎯 Objective
Uploader viết và quản lý blog posts

## 📝 Requirements
1. CRUD blog posts
2. Rich text editor
3. Category selection
4. Submit for review workflow
5. View admin feedback

## 💻 Implementation
Source: `UI-Template/components/uploader/UploaderBlogContribution.tsx`
Target: `FE/src/components/uploader/UploaderBlogContribution.tsx`

## ✅ Acceptance Criteria
- [ ] Blog list với status filters
- [ ] Create/Edit blog modal
- [ ] Rich text editor
- [ ] Category tags
- [ ] Status workflow display
- [ ] Admin feedback section
```

---

### FE-UPL-003: UploaderExamUploadModal

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: FE-UPL-001

## 🎯 Objective
Modal để upload đề thi mới

## 📝 Requirements
1. Upload file đề thi (PDF, DOCX)
2. Nhập metadata:
   - Level (A2/B1/B2/C1)
   - Skill
   - Duration
   - Description
3. Preview trước submit
4. Track upload progress

## 💻 Implementation
Source: `UI-Template/components/uploader/UploaderExamUploadModal.tsx`
Target: `FE/src/components/uploader/UploaderExamUploadModal.tsx`

## ✅ Acceptance Criteria
- [ ] File upload with drag-drop
- [ ] Metadata form
- [ ] File preview
- [ ] Upload progress bar
- [ ] Success/error handling
```

---

### FE-UPL-004: Uploader Sidebar/Layout

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 3h

## 🎯 Objective
Layout và navigation cho Uploader role

## 📝 Requirements
1. Sidebar với menu items:
   - Dashboard
   - Đề thi của tôi
   - Blog của tôi
   - Cài đặt
2. Responsive design
3. Active state indicators

## 💻 Implementation
Target: `FE/src/components/uploader/UploaderSidebar.tsx`
Target: `FE/src/app/(uploader)/layout.tsx`

## ✅ Acceptance Criteria
- [ ] Sidebar component
- [ ] Navigation items
- [ ] Active route highlighting
- [ ] Responsive collapse
```

---

### FE-UPL-005: Uploader Routes

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 2h

## 🎯 Objective
Setup routes cho Uploader role

## 📝 Requirements
1. Create route group: `(uploader)/`
2. Routes:
   - `/uploader` - Dashboard
   - `/uploader/exams` - My exams
   - `/uploader/blog` - My blogs
   - `/uploader/settings` - Settings
3. RBAC middleware check

## 💻 Implementation
Target: `FE/src/app/(uploader)/`

Structure:
```
app/(uploader)/
├── layout.tsx
├── page.tsx              # Dashboard
├── exams/
│   └── page.tsx
├── blog/
│   └── page.tsx
└── settings/
    └── page.tsx
```

## ✅ Acceptance Criteria
- [ ] Route group created
- [ ] All pages accessible
- [ ] RBAC protection
- [ ] Redirect non-uploaders
```

---

## 📊 Summary

| Category | Tasks | Hours |
|----------|-------|-------|
| Backend | 4 tasks | 13h |
| Frontend | 5 tasks | 20h |
| **Total** | **9 tasks** | **33h** |

---

## 🔗 Related Files

- `UI-Template/components/uploader/` - Source components
- `UI-Template/utils/authService.ts` - Auth utilities
