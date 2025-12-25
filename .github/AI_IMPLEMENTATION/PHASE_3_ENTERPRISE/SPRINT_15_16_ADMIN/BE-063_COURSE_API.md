# BE-063: Course API & Document/Roadmap/Class CRUD

## dY"< Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-063 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-062 (Course DB), BE-054 RBAC |

---

## dYZ_ Objective

Expose API cho Course system theo `COURSE_SYSTEM_ANALYSIS.md`:
- CRUD courses, filter/search/pagination, stats.
- CRUD documents (upload/list/delete/download URL).
- CRUD roadmap items (list/add/update/delete/reorder).
- CRUD classes (course scope).

---

## dY"? Requirements

1. **Routes (REST)**
   - `GET /api/courses` (page, limit, search, category, status), trả `courses[], total, page, totalPages`.
   - `GET /api/courses/:id`
   - `POST /api/courses` (body theo spec: title/category/instructor/lessons/duration/price/status/deviceLimit/description).
   - `PUT /api/courses/:id` (partial update).
   - `DELETE /api/courses/:id` (soft delete nếu áp dụng; cập nhật status=inactive/deleted).
   - `GET /api/courses/stats` (totalCourses, activeCourses, totalStudents, averageRating).
2. **Documents**
   - `GET /api/courses/:courseId/documents`
   - `POST /api/courses/:courseId/documents` (multipart upload -> lưu URL/path, size/type/name).
   - `DELETE /api/documents/:id`
   - `GET /api/documents/:id/download` (stream/redirect)
3. **Roadmap**
   - `GET /api/courses/:courseId/roadmap`
   - `POST /api/courses/:courseId/roadmap`
   - `PUT /api/roadmap/:id`
   - `DELETE /api/roadmap/:id`
   - `PUT /api/courses/:courseId/roadmap/reorder` (body itemIds[]).
4. **Classes**
   - `GET /api/courses/:courseId/classes`
   - `POST /api/courses/:courseId/classes`
   - `PUT /api/classes/:id`
   - `DELETE /api/classes/:id`
5. **Validation/guards**
   - DTOs với class-validator; guard RBAC (Admin full, Teacher limited, Student read enrolled, Uploader upload docs nếu cho phép).
6. **Service logic**
   - Stats: derive from DB (count, avg rating), optional cached.
   - Delete course: ensure cascade or soft-delete flags align với BE-062.
   - Reorder roadmap: transactional reorder by orderIndex.
7. **Error handling**
   - 404 for missing course/doc/roadmap/class.
   - 400 for invalid status/deviceLimit.

---

## dY'¯ Implementation

- Module Course: controller/service + repositories for course/document/roadmap/class.
- Upload: use existing file storage adapter; store URL + size/type; no raw file in DB.
- Reorder roadmap: update orderIndex by itemIds sequence.
- DTO coverage + swagger (nếu dùng).

---

## ƒo. Acceptance Criteria

- API endpoints hoạt động, trả đúng payload như spec.
- RBAC áp dụng đúng (Admin CRUD, Teacher limited, Student read enrolled).
- Roadmap reorder giữ orderIndex nhất quán.
- Document upload lưu metadata, download endpoint trả file/redirect.

---

## dY¦ Testing

- E2E/Integration tests cho course CRUD, document upload/list/delete, roadmap reorder, class CRUD.
- Negative: create with missing required fields, reorder với ID không thuộc course, delete course -> roadmap/doc/class cascade OK.
