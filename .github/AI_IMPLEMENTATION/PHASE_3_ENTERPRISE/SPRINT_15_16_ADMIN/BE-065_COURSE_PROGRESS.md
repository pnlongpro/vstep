# BE-065: Course Progress & Dashboard Metrics

## dY"< Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-065 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-062 (user_course_progress, roadmap_items), BE-063 (Course APIs) |

---

## dYZ_ Objective

Theo dõi tiến trình học theo course/roadmap và cung cấp thống kê dashboard:
- Ghi nhận trạng thái roadmap item (not_started/in_progress/completed) per user.
- Tính % progress per course, unlock tuần kế tiếp sau khi hoàn thành.
- Expose metrics: totalCourses, activeCourses, totalStudents, averageRating, newCoursesThisMonth, newStudentsThisMonth, completionRate, topCourses.

---

## dY"? Requirements

1. **Progress Logic**
   - Khi user bắt đầu một roadmap item -> set `in_progress`; khi hoàn thành -> set `completed`, progressPercentage cập nhật.
   - Unlock tuần tiếp theo khi tuần hiện tại completed.
   - Unique constraint (user, course, roadmap_item).
2. **APIs**
   - `GET /api/courses/:courseId/progress` (user scope) -> danh sách roadmap item status + overall %.
   - `POST /api/courses/:courseId/progress/:roadmapItemId/complete` -> mark completed, update %.
   - (Optional) `POST /api/courses/:courseId/progress/:roadmapItemId/start`.
3. **Metrics**
   - `GET /api/courses/stats` mở rộng: totalCourses, activeCourses, totalStudents, averageRating, newCoursesThisMonth, newStudentsThisMonth, completionRate, topCourses[5].
   - Có thể cache (Redis/memory) 5-15 phút.
4. **Permissions**
   - Student: chỉ xem/ghi tiến trình của chính mình; Teacher/Admin xem tiến trình toàn lớp/course; Admin xuất thống kê.
5. **Data integrity**
   - Khi xóa course/roadmap: cascade xóa progress.
   - Khi duplicate roadmap order: giữ orderIndex duy nhất.

---

## dY'¯ Implementation

- Service progress: receive userId/courseId/roadmapItemId; upsert progress row; recalc completion % = completedItems / totalItems.
- Unlock logic: allow actions trên item có status locked? -> trả 403 nếu chưa unlock.
- Stats query: aggregate counts, avg rating, topCourses theo students/rating; use indexes từ BE-062.
- Caching layer optional; invalidate khi create/update course/enrollment/progress.

---

## ƒo. Acceptance Criteria

- Hoàn thành roadmap item cập nhật % chính xác; tuần kế tiếp mở khi tuần trước completed.
- APIs trả đúng payload cho user và admin/teacher.
- Stats endpoint trả đủ trường, không N+1 chậm (index sử dụng).

---

## dY¦ Testing

- Unit/integration: start/complete item; progression unlock; duplicate complete idempotent.
- Stats: seed data -> verify totals, topCourses order.
