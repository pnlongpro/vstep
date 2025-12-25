# BE-062: Course System Database

## dY"< Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-062 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-054 (RBAC), BE-001 DB foundation |

---

## dYZ_ Objective

Thiết kế/migration các bảng Course theo `COURSE_SYSTEM_ANALYSIS.md` và đồng bộ với stack TypeORM:
- Bổ sung bảng: `courses`, `documents`, `roadmap_items`, `classes` (phiên bản course-centric), `user_devices`, `user_course_progress`.
- Chuẩn hóa PK (UUID nếu theo chuẩn dự án; nếu dùng INT cần note rõ) và ràng buộc FK tới `users`.
- Index/constraints: status, category, course_id, order_index, unique progress (user, course, roadmap_item), active device flags.

---

## dY"? Requirements

1. **Schema tables**
   - `courses`: title, category, instructor, lessons, duration, price, rating/reviews, status, deviceLimit, description, timestamps, indexes (status, category, createdAt).
   - `documents`: courseId FK, name/type/size/url/downloads/uploadDate/uploadedBy FK users, CASCADE course.
   - `roadmap_items`: courseId FK, week, title, lessons, duration, status enum (locked/in-progress/completed), orderIndex, description, timestamps, index (courseId, orderIndex).
   - `classes` (course version): courseId FK, name, instructor, students, maxStudents, startDate/endDate, status (active/inactive), schedule, timestamps. Nếu giữ class entity cũ, tách bảng mới `course_classes` hoặc align lại entity để không breaking các module khác (nêu rõ phương án migration).
   - `user_devices`: userId FK, deviceType/deviceName/browser/os/ip, lastLogin, isActive, timestamps.
   - `user_course_progress`: userId FK, courseId FK, roadmapItemId FK, status enum (not_started/in_progress/completed), progressPercentage, startedAt/completedAt, unique (userId, courseId, roadmapItemId).
2. **Enums**: lưu trong shared enums hoặc inline; match spec course (status: active/draft/inactive, roadmap status: locked/in-progress/completed).
3. **Migration scripts**: thêm create-table, indexes, FK với onDelete CASCADE nơi phù hợp. Nếu đổi classes hiện có, cần migration rename/merge an toàn và note backward compatibility.
4. **Entities**: tạo entity TypeORM cho mỗi bảng (hoặc cập nhật nếu reuse `classes`) với Decorators, relations, indexes.
5. **Docs**: update `COURSE_SYSTEM_ANALYSIS.md` references nếu có thay đổi PK/field khác spec; note trong task result.

---

## dY'¯ Implementation

- Tạo migrations: `CreateCourses`, `CreateDocuments`, `CreateRoadmapItems`, `CreateCourseClasses` (hoặc alter `classes`), `CreateUserDevices`, `CreateUserCourseProgress`.
- Entities: `course.entity.ts`, `document.entity.ts`, `roadmap-item.entity.ts`, `course-class.entity.ts` (hoặc update `class.entity.ts`), `user-device.entity.ts`, `user-course-progress.entity.ts`.
- Indexing: idx_status, idx_category, idx_course_id, idx_order, unique progress, idx_user_device_active.
- Chọn strategy PK: nếu dự án đang dùng UUID => dùng `@PrimaryGeneratedColumn('uuid')`; nếu cần INT auto-increment, update config + typing.

---

## ƒo. Acceptance Criteria

- Migrations chạy thành công trên dev DB, tạo đủ 6 bảng với FK/index như yêu cầu.
- Entities build OK, không phá vỡ module hiện có; nếu đổi `classes`, có migration/alias rõ ràng.
- Fields khớp spec trong `COURSE_SYSTEM_ANALYSIS.md` (hoặc có note khác biệt có chủ đích).

---

## dY¦ Testing

- Chạy migration up/down trên DB test.
- Verify FK cascades: xóa course -> xóa documents/roadmap/classes/progress; xóa roadmap_item -> xóa progress liên quan.
- Insert sample rows để check enums, indexes hoạt động.
