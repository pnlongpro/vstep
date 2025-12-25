# BE-066: Course RBAC & QA Checklist

## dY"< Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-066 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P2 |
| **Estimated Hours** | 3h |
| **Dependencies** | BE-063, BE-064, BE-065, BE-054 (RBAC base) |

---

## dYZ_ Objective

Áp dụng RBAC cho module Course và soạn checklist QA để validate flows (Course/Document/Roadmap/Class/Device/Progress) theo `COURSE_SYSTEM_ANALYSIS.md`.

---

## dY"? Requirements

1. **RBAC matrix (Admin/Teacher/Student/Uploader)**
   - View all courses: Admin/Teacher; Student (enrolled); Uploader limited docs.
   - Create/Edit/Delete course: Admin; Teacher (nếu được cấp); Student/Uploader no.
   - Upload/Delete documents: Admin, Teacher, Uploader; Student view/download nếu enrolled.
   - Manage roadmap: Admin, Teacher; Student read.
   - Manage classes: Admin, Teacher; Student read; Uploader no.
   - Device limit actions: Admin force; User self remove.
   - Progress APIs: Student self; Admin/Teacher view class/course.
2. **Guards**
   - Decorators per route in Course module; reuse AdminGuard/RoleGuard; add checks on ownership/enrollment for students.
3. **QA Checklist**
   - CRUD course positive/negative.
   - Document upload/delete/download permissions.
   - Roadmap reorder validation (cross-course IDs fail).
   - Class CRUD permissions.
   - Device limit flows: reach limit -> block; remove device -> login OK; admin force logout.
   - Progress: start/complete, unlock next week, stats numbers match seed.
4. **Docs**
   - Update README sprint or module note about new RBAC mapping.

---

## dY'¯ Implementation

- Map roles to permissions; add constants (e.g., `PERM.COURSE.CREATE`, etc.).
- Ensure controllers use guards and policy checks (course ownership/enrollment).
- Write QA markdown checklist (can place under `QA_REVIEW/COURSE_QA.md`).

---

## ƒo. Acceptance Criteria

- All Course-related endpoints bảo vệ đúng role; unauthorized cases trả 403.
- QA checklist sẵn sàng cho QA team, bao phủ flows chính và edge cases.

---

## dY¦ Testing

- Role-based integration tests: Admin vs Teacher vs Student vs Uploader.
- Manual QA theo checklist.
