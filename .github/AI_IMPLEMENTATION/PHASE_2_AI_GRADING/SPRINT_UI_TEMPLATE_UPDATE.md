# 🆕 Sprint: UI-Template Updates - Phase 2

> **Các task bổ sung từ UI-Template mới (December 2024)**
>
> Updated: 19/12/2024

---

## 📋 Tổng quan

UI-Template đã được update với nhiều components mới cho Teacher và Admin. 
Sprint này bổ sung các task cần thiết để migrate các components mới vào FE.

---

## 🎯 Sprint 11-12: Teacher Features (Bổ sung)

### Existing Tasks (Đã có)
- FE-044 → FE-050: Teacher Dashboard, Class Management

### 🆕 New Tasks

| Task ID | Component | UI-Template Source | Priority |
|---------|-----------|-------------------|----------|
| FE-051 | TeacherNotificationsPage | `teacher/TeacherNotificationsPage.tsx` | P1 |
| FE-052 | TeacherBlogContribution | `teacher/TeacherBlogContribution.tsx` | P2 |
| FE-053 | AssignmentLibraryPage | `teacher/AssignmentLibraryPage.tsx` | P1 |
| FE-054 | SessionAssignmentModal | `teacher/SessionAssignmentModal.tsx` | P1 |
| FE-055 | ContributeAssignmentsPage | `teacher/ContributeAssignmentsPage.tsx` | P2 |
| FE-056 | ContributeMaterialsPage | `teacher/ContributeMaterialsPage.tsx` | P2 |
| FE-057 | CustomRoadmapDesigner | `teacher/CustomRoadmapDesigner.tsx` | P3 |

### Data Files cần migrate:
```
UI-Template/components/teacher/
├── classMaterialsData.ts    → FE/src/data/
├── studyMaterialsData.ts    → FE/src/data/
├── courseConfigs.ts         → FE/src/data/
```

---

## 📝 Task Details

### FE-051: TeacherNotificationsPage

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: FE-044 (Teacher Dashboard)

## 🎯 Objective
Gửi thông báo cho học viên trong các lớp học

## 📝 Requirements
1. Hiển thị danh sách thông báo đã gửi
2. Tạo thông báo mới với:
   - Tiêu đề, nội dung
   - Chọn mức độ ưu tiên (low/medium/high)
   - Chọn nhiều lớp để gửi
3. Xóa thông báo
4. Stats: Tổng thông báo, đã gửi, số lớp

## 💻 Implementation
Source: `UI-Template/components/teacher/TeacherNotificationsPage.tsx`
Target: `FE/src/components/teacher/TeacherNotificationsPage.tsx`

## ✅ Acceptance Criteria
- [ ] List notifications với filter
- [ ] Create notification modal với class selection
- [ ] Priority badges (low/medium/high)
- [ ] Delete confirmation
- [ ] Stats cards
```

---

### FE-052: TeacherBlogContribution

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P2
- **Estimated Hours**: 6h
- **Dependencies**: None

## 🎯 Objective
Giáo viên có thể đóng góp bài viết blog về VSTEP

## 📝 Requirements
1. Danh sách bài viết với status (draft/pending/published/rejected)
2. Tạo/chỉnh sửa bài viết
3. Gửi bài để duyệt
4. Xem feedback từ admin nếu bị từ chối
5. Stats: Tổng, đã xuất bản, chờ duyệt, bản nháp

## 💻 Implementation
Source: `UI-Template/components/teacher/TeacherBlogContribution.tsx`
Target: `FE/src/components/teacher/TeacherBlogContribution.tsx`

## ✅ Acceptance Criteria
- [ ] CRUD bài viết blog
- [ ] Status workflow (draft → pending → published/rejected)
- [ ] Admin feedback display
- [ ] Category/status filters
- [ ] Views count
```

---

### FE-053: AssignmentLibraryPage

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P1
- **Estimated Hours**: 8h
- **Dependencies**: Data files migration

## 🎯 Objective
Thư viện bài tập có thể giao cho học viên

## 📝 Requirements
1. Browse bài tập theo:
   - Course (VSTEP Complete, Foundation, etc.)
   - Skill (Reading, Listening, Writing, Speaking)
   - Difficulty
   - Session
2. Tìm kiếm, filter
3. View chi tiết assignment
4. Rating, usage count

## 💻 Implementation
Data: `UI-Template/data/assignmentLibraryData.ts`
Source: `UI-Template/components/teacher/AssignmentLibraryPage.tsx`
Target: `FE/src/components/teacher/AssignmentLibraryPage.tsx`

## ✅ Acceptance Criteria
- [ ] Browse by course/session structure
- [ ] Filter by skill, difficulty
- [ ] Search functionality
- [ ] Assignment detail view
- [ ] Rating display
```

---

### FE-054: SessionAssignmentModal

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: FE-053

## 🎯 Objective
Modal để giao bài tập từ thư viện cho lớp học

## 📝 Requirements
1. Chọn session từ course
2. Chọn assignments từ thư viện
3. Set deadline, instructions
4. Preview before assign

## 💻 Implementation
Source: `UI-Template/components/teacher/SessionAssignmentModal.tsx`
Target: `FE/src/components/teacher/SessionAssignmentModal.tsx`

## ✅ Acceptance Criteria
- [ ] Session selection
- [ ] Multi-assignment selection
- [ ] Deadline picker
- [ ] Preview panel
- [ ] Confirm assignment
```

---

### FE-055: ContributeAssignmentsPage

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P2
- **Estimated Hours**: 6h

## 🎯 Objective
Giáo viên tự tạo/đóng góp bài tập mới

## 📝 Requirements
1. Tạo assignment mới với:
   - Skill type selection
   - Question builder
   - Answer options
   - Difficulty setting
2. Submit để admin duyệt
3. Track status

## 💻 Implementation
Source: `UI-Template/components/teacher/ContributeAssignmentsPage.tsx`
Target: `FE/src/components/teacher/ContributeAssignmentsPage.tsx`

## ✅ Acceptance Criteria
- [ ] Question builder per skill
- [ ] Preview mode
- [ ] Submit for review
- [ ] Status tracking
```

---

### FE-056: ContributeMaterialsPage

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P2
- **Estimated Hours**: 5h

## 🎯 Objective
Giáo viên upload tài liệu học tập

## 📝 Requirements
1. Upload materials (PDF, DOCX, PPTX, Video, Audio)
2. Categorize by type (textbook/lecture/exercise/media)
3. Tag by skill, level
4. Track views/downloads

## 💻 Implementation
Source: `UI-Template/components/teacher/ContributeMaterialsPage.tsx`
Target: `FE/src/components/teacher/ContributeMaterialsPage.tsx`

## ✅ Acceptance Criteria
- [ ] File upload with drag-drop
- [ ] Category/skill tagging
- [ ] Upload progress
- [ ] Material list management
```

---

### FE-057: CustomRoadmapDesigner

```markdown
## 📋 Task Info
- **Sprint**: 11-12
- **Priority**: P3
- **Estimated Hours**: 10h

## 🎯 Objective
Thiết kế lộ trình học tập tùy chỉnh cho lớp

## 📝 Requirements
1. Visual roadmap builder
2. Drag-drop milestones
3. Link assignments to milestones
4. Set dates/duration
5. Export roadmap

## 💻 Implementation
Source: `UI-Template/components/teacher/CustomRoadmapDesigner.tsx`
Target: `FE/src/components/teacher/CustomRoadmapDesigner.tsx`

## ✅ Acceptance Criteria
- [ ] Visual timeline builder
- [ ] Milestone CRUD
- [ ] Assignment linking
- [ ] Date management
- [ ] Save/load roadmap templates
```

---

## 📊 Summary

| Priority | Tasks | Estimated Hours |
|----------|-------|-----------------|
| P1 | FE-051, FE-053, FE-054 | 16h |
| P2 | FE-052, FE-055, FE-056 | 17h |
| P3 | FE-057 | 10h |
| **Total** | **7 tasks** | **43h** |

---

## 🔗 Related Files

- `UI-Template/components/teacher/` - Source components
- `UI-Template/data/teacherClassData.ts` - Class data
- `UI-Template/data/assignmentLibraryData.ts` - Assignment data
