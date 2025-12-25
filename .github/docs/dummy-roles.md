# Dummy Data - Roles Table

## Bảng: roles

Dựa trên hệ thống VSTEPRO với 4 vai trò chính: Student (Blue), Teacher (Purple), Admin (Red), Uploader (Yellow)

---

### 1. Student Role

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "student",
  "displayName": "Học viên",
  "description": "Vai trò học viên - có thể làm bài tập, thi thử, xem lịch sử và thống kê học tập",
  "permissions": [
    "practice.reading",
    "practice.listening",
    "practice.writing",
    "practice.speaking",
    "exam.take",
    "exam.mock",
    "exam.virtual",
    "history.view",
    "statistics.view",
    "documents.view",
    "documents.download",
    "assignments.view",
    "assignments.submit",
    "ai-assistant.chat",
    "ai-grading.submit",
    "profile.view",
    "profile.edit",
    "notifications.view",
    "goals.view",
    "goals.create",
    "blog.read",
    "messages.send",
    "messages.receive"
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Teacher Role

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "teacher",
  "displayName": "Giáo viên",
  "description": "Vai trò giáo viên - có thể giao bài tập, chấm bài, quản lý lớp học và theo dõi tiến độ học sinh",
  "permissions": [
    "practice.reading",
    "practice.listening",
    "practice.writing",
    "practice.speaking",
    "exam.take",
    "exam.mock",
    "exam.virtual",
    "history.view",
    "statistics.view",
    "documents.view",
    "documents.download",
    "documents.upload",
    "assignments.view",
    "assignments.create",
    "assignments.assign",
    "assignments.grade",
    "assignments.feedback",
    "class.view",
    "class.create",
    "class.manage",
    "class.attendance",
    "students.view",
    "students.progress",
    "goals.view",
    "goals.create",
    "goals.assign",
    "ai-assistant.chat",
    "ai-grading.review",
    "profile.view",
    "profile.edit",
    "notifications.view",
    "notifications.send",
    "blog.read",
    "blog.write",
    "messages.send",
    "messages.receive",
    "reports.generate",
    "reports.export"
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Admin Role

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "admin",
  "displayName": "Quản trị viên",
  "description": "Vai trò quản trị viên - có toàn quyền quản lý hệ thống, người dùng và nội dung",
  "permissions": [
    "practice.reading",
    "practice.listening",
    "practice.writing",
    "practice.speaking",
    "exam.take",
    "exam.mock",
    "exam.virtual",
    "history.view",
    "statistics.view",
    "statistics.all",
    "documents.view",
    "documents.download",
    "documents.upload",
    "documents.manage",
    "documents.delete",
    "assignments.view",
    "assignments.create",
    "assignments.assign",
    "assignments.grade",
    "assignments.manage",
    "assignments.delete",
    "class.view",
    "class.create",
    "class.manage",
    "class.delete",
    "class.attendance",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "users.ban",
    "roles.view",
    "roles.assign",
    "students.view",
    "students.progress",
    "teachers.view",
    "teachers.manage",
    "goals.view",
    "goals.create",
    "goals.assign",
    "goals.delete",
    "ai-assistant.chat",
    "ai-assistant.configure",
    "ai-grading.review",
    "ai-grading.configure",
    "profile.view",
    "profile.edit",
    "notifications.view",
    "notifications.send",
    "notifications.broadcast",
    "blog.read",
    "blog.write",
    "blog.edit",
    "blog.delete",
    "blog.publish",
    "messages.send",
    "messages.receive",
    "messages.moderate",
    "reports.generate",
    "reports.export",
    "reports.all",
    "system.settings",
    "system.backup",
    "system.logs",
    "analytics.view"
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Uploader Role

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "name": "uploader",
  "displayName": "Uploader",
  "description": "Vai trò người tải lên - chuyên trách upload và quản lý đề thi, tài liệu học tập",
  "permissions": [
    "practice.reading",
    "practice.listening",
    "practice.writing",
    "practice.speaking",
    "exam.take",
    "exam.mock",
    "exam.virtual",
    "history.view",
    "statistics.view",
    "documents.view",
    "documents.download",
    "documents.upload",
    "documents.manage",
    "documents.categorize",
    "exercises.upload",
    "exercises.edit",
    "exercises.manage",
    "exams.upload",
    "exams.edit",
    "exams.manage",
    "materials.upload",
    "materials.edit",
    "materials.manage",
    "audio.upload",
    "audio.manage",
    "images.upload",
    "images.manage",
    "ai-assistant.chat",
    "profile.view",
    "profile.edit",
    "notifications.view",
    "blog.read",
    "messages.send",
    "messages.receive",
    "reports.content"
  ],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## SQL Insert Statements

```sql
-- Student Role
INSERT INTO roles (id, name, displayName, description, permissions, isActive, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'student',
  'Học viên',
  'Vai trò học viên - có thể làm bài tập, thi thử, xem lịch sử và thống kê học tập',
  '["practice.reading","practice.listening","practice.writing","practice.speaking","exam.take","exam.mock","exam.virtual","history.view","statistics.view","documents.view","documents.download","assignments.view","assignments.submit","ai-assistant.chat","ai-grading.submit","profile.view","profile.edit","notifications.view","goals.view","goals.create","blog.read","messages.send","messages.receive"]',
  true,
  '2024-01-01 00:00:00',
  '2024-01-01 00:00:00'
);

-- Teacher Role
INSERT INTO roles (id, name, displayName, description, permissions, isActive, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'teacher',
  'Giáo viên',
  'Vai trò giáo viên - có thể giao bài tập, chấm bài, quản lý lớp học và theo dõi tiến độ học sinh',
  '["practice.reading","practice.listening","practice.writing","practice.speaking","exam.take","exam.mock","exam.virtual","history.view","statistics.view","documents.view","documents.download","documents.upload","assignments.view","assignments.create","assignments.assign","assignments.grade","assignments.feedback","class.view","class.create","class.manage","class.attendance","students.view","students.progress","goals.view","goals.create","goals.assign","ai-assistant.chat","ai-grading.review","profile.view","profile.edit","notifications.view","notifications.send","blog.read","blog.write","messages.send","messages.receive","reports.generate","reports.export"]',
  true,
  '2024-01-01 00:00:00',
  '2024-01-01 00:00:00'
);

-- Admin Role
INSERT INTO roles (id, name, displayName, description, permissions, isActive, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'admin',
  'Quản trị viên',
  'Vai trò quản trị viên - có toàn quyền quản lý hệ thống, người dùng và nội dung',
  '["practice.reading","practice.listening","practice.writing","practice.speaking","exam.take","exam.mock","exam.virtual","history.view","statistics.view","statistics.all","documents.view","documents.download","documents.upload","documents.manage","documents.delete","assignments.view","assignments.create","assignments.assign","assignments.grade","assignments.manage","assignments.delete","class.view","class.create","class.manage","class.delete","class.attendance","users.view","users.create","users.edit","users.delete","users.ban","roles.view","roles.assign","students.view","students.progress","teachers.view","teachers.manage","goals.view","goals.create","goals.assign","goals.delete","ai-assistant.chat","ai-assistant.configure","ai-grading.review","ai-grading.configure","profile.view","profile.edit","notifications.view","notifications.send","notifications.broadcast","blog.read","blog.write","blog.edit","blog.delete","blog.publish","messages.send","messages.receive","messages.moderate","reports.generate","reports.export","reports.all","system.settings","system.backup","system.logs","analytics.view"]',
  true,
  '2024-01-01 00:00:00',
  '2024-01-01 00:00:00'
);

-- Uploader Role
INSERT INTO roles (id, name, displayName, description, permissions, isActive, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'uploader',
  'Người tải lên',
  'Vai trò người tải lên - chuyên trách upload và quản lý đề thi, tài liệu học tập',
  '["practice.reading","practice.listening","practice.writing","practice.speaking","exam.take","exam.mock","exam.virtual","history.view","statistics.view","documents.view","documents.download","documents.upload","documents.manage","documents.categorize","exercises.upload","exercises.edit","exercises.manage","exams.upload","exams.edit","exams.manage","materials.upload","materials.edit","materials.manage","audio.upload","audio.manage","images.upload","images.manage","ai-assistant.chat","profile.view","profile.edit","notifications.view","blog.read","messages.send","messages.receive","reports.content"]',
  true,
  '2024-01-01 00:00:00',
  '2024-01-01 00:00:00'
);
```

---

## Permissions Hierarchy

### Student (Cơ bản)
- Làm bài tập 4 kỹ năng
- Thi thử và thi mock
- Xem lịch sử & thống kê cá nhân
- Xem & download tài liệu
- Làm bài tập được giao
- Sử dụng AI assistant

### Teacher (Mở rộng từ Student)
Student permissions +
- Upload tài liệu
- Tạo & giao bài tập
- Chấm bài & feedback
- Quản lý lớp học
- Điểm danh
- Xem tiến độ học sinh
- Viết blog
- Tạo báo cáo

### Admin (Toàn quyền)
Teacher permissions +
- Quản lý người dùng (CRUD)
- Quản lý roles
- Xóa tài liệu/bài tập
- Cấu hình AI
- Broadcast thông báo
- Quản lý blog toàn bộ
- Cài đặt hệ thống
- Xem logs & analytics

### Uploader (Chuyên môn)
Student permissions +
- Upload & quản lý tất cả loại nội dung
- Quản lý đề thi
- Phân loại tài liệu
- Upload audio/images
- Báo cáo về nội dung

---

## Notes

1. **UUID Format**: Sử dụng UUID v4 cho id
2. **Permissions**: Lưu dạng JSON array với format `category.action`
3. **isActive**: Cho phép disable role tạm thời mà không xóa
4. **Timestamps**: Tự động cập nhật bởi TypeORM decorators
5. **Unique Constraint**: `name` phải unique để tránh trùng lặp

## Color Mapping (Frontend)

- **Student**: Blue (#3B82F6)
- **Teacher**: Purple/Emerald (#10B981)
- **Admin**: Red/Orange (#F97316)
- **Uploader**: Yellow (#EAB308)
