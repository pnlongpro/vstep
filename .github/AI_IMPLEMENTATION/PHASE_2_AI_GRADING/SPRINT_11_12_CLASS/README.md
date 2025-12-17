# Sprint 11-12: Class Management

> **Duration**: 2 tuần
> **Focus**: Teacher Portal, Class CRUD, Student Management, Materials

---

## 🎯 Sprint Goals

1. ✅ Build Teacher Dashboard với purple theme
2. ✅ Implement Class CRUD operations
3. ✅ Student management (add/remove from class)
4. ✅ Materials upload and management
5. ✅ Class analytics and progress tracking
6. ✅ Class invitation system

---

## 📂 Task Structure

### Backend Tasks (NestJS)
| Task ID | Name | Priority | Hours |
|---------|------|----------|-------|
| BE-044 | Class Entity & Migration | P0 | 4h |
| BE-045 | Class CRUD Service | P0 | 5h |
| BE-046 | Class Students Management | P0 | 4h |
| BE-047 | Materials Entity | P1 | 3h |
| BE-048 | Materials Upload Service | P1 | 5h |
| BE-049 | Class Analytics Service | P1 | 5h |
| BE-050 | Student Progress API | P1 | 4h |
| BE-051 | Class Invitation System | P2 | 4h |

### Frontend Tasks (Next.js)
| Task ID | Name | Priority | Hours |
|---------|------|----------|-------|
| FE-044 | Teacher Dashboard Layout | P0 | 6h |
| FE-045 | Class List Page | P0 | 5h |
| FE-046 | Create Class Modal | P0 | 4h |
| FE-047 | Class Detail Page | P0 | 6h |
| FE-048 | Student Management UI | P1 | 5h |
| FE-049 | Materials Management UI | P1 | 5h |
| FE-050 | Class Analytics Dashboard | P1 | 6h |
| FE-051 | Invite Students Modal | P2 | 4h |

---

## 📊 Sprint Summary

| Category | Tasks | Hours |
|----------|-------|-------|
| Backend | 8 | 34h |
| Frontend | 8 | 41h |
| **Total** | **16** | **75h** |

---

## 🔗 Dependencies

```
Sprint 09-10 AI Complete
         │
         ▼
    BE-044 (Class Entity)
         │
    ┌────┴────┐
    ▼         ▼
BE-045     BE-046
(CRUD)   (Students)
    │         │
    └────┬────┘
         ▼
    FE-044 (Teacher Dashboard)
         │
    ┌────┼────┐
    ▼    ▼    ▼
FE-045 FE-046 FE-047
```

---

## ⚠️ Technical Notes

### Teacher Role
- Sidebar màu **purple** (thay vì blue của student)
- Access routes: `/teacher/*`
- Dashboard riêng với metrics về class

### Database Schema

```sql
-- classes
CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('A2', 'B1', 'B2', 'C1'),
  start_date DATE,
  end_date DATE,
  max_students INT DEFAULT 30,
  invite_code VARCHAR(10) UNIQUE,
  status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- class_students
CREATE TABLE class_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
  UNIQUE KEY unique_enrollment (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- class_materials
CREATE TABLE class_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  file_type VARCHAR(50),
  file_size INT,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

### FE Component Mapping

> **Xem file:** `FE_COMPONENT_MAPPING.md`

Một số components cần tạo mới cho Teacher:
- `components/teacher/TeacherSidebar.tsx` - Sidebar purple theme
- `components/teacher/ClassCard.tsx` - Class display card
- `components/teacher/StudentTable.tsx` - Student management table

---

## 🚀 Execution Order

### Week 11: Teacher Portal + Class CRUD
1. BE-044 → BE-045 → BE-046 (Backend foundation)
2. FE-044 → FE-045 → FE-046 (Teacher dashboard)
3. FE-047 → FE-048 (Class detail + students)

### Week 12: Materials + Analytics
1. BE-047 → BE-048 (Materials backend)
2. FE-049 (Materials UI)
3. BE-049 → BE-050 (Analytics backend)
4. FE-050 (Analytics dashboard)
5. BE-051 → FE-051 (Invitation system)
