# 📚 LOGIC GIAO BÀI TẬP - VSTEPRO

## 🎯 Tổng quan

Hệ thống giao bài tập VSTEPRO hỗ trợ **2 phương thức** chính:
1. **Chọn từ kho bài tập** - Bài tập có sẵn với câu hỏi và đáp án
2. **Upload file tự tạo** - File PDF/DOCX/images do giáo viên tự thiết kế

---

## 🔄 Flow tổng quát (3 bước)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BƯỚC 1: CHỌN NỘI DUNG                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐       ┌──────────────────────┐       │
│  │  📚 Chọn từ kho      │  OR   │  📤 Upload file      │       │
│  │  bài tập             │       │  tự tạo              │       │
│  └──────────────────────┘       └──────────────────────┘       │
│           │                               │                     │
│           ├──> Tìm kiếm/Filter            ├──> Drag & Drop      │
│           ├──> Xem preview                ├──> PDF/DOCX/Images  │
│           └──> Chọn 1 bài                 ├──> Nhập tiêu đề     │
│                                           └──> Mô tả (optional) │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BƯỚC 2: CHỌN ĐỐI TƯỢNG                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐       ┌──────────────────────┐       │
│  │  👥 Giao theo lớp    │  OR   │  👤 Giao theo        │       │
│  │                      │       │  học sinh            │       │
│  └──────────────────────┘       └──────────────────────┘       │
│           │                               │                     │
│           ├──> Select classes             ├──> Select students  │
│           ├──> Multi-select               ├──> Multi-select     │
│           └──> Show total students        └──> Show count       │
│                                                                  │
│  Summary: X học sinh (từ Y lớp / riêng lẻ)                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                BƯỚC 3: CẤU HÌNH & GIAO BÀI                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Tiêu đề hiển thị *                                          │
│  • Hướng dẫn cho học sinh                                       │
│  • Hạn nộp (ngày + giờ) *                                      │
│  • ☑ Cho phép nộp muộn                                         │
│                                                                  │
│  [← Quay lại]                          [🚀 Giao bài tập]      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   ✅ Success Modal
```

---

## 📋 CHI TIẾT TỪNG BƯỚC

### **BƯỚC 1: Chọn nội dung**

#### **Option A: Chọn từ kho bài tập** 📚

**Giao diện:**
- Grid/List view của exercises
- Search bar + Filter by skill
- Mỗi card hiển thị:
  - 🎨 Icon kỹ năng (với gradient màu)
  - 📝 Tiêu đề + Mô tả
  - 🏷️ Badge: Skill + Level
  - ⏱️ Duration + Question count
  - ✅ Checkbox select (single select)

**Dữ liệu exercise:**
```typescript
interface Exercise {
  id: number;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  duration: number; // minutes
  parts: number;
  questionCount: number;
}
```

**Ví dụ:**
```
┌──────────────────────────────────────────────────┐
│ [📘] Academic Reading - Technology in Education  │
│                                                   │
│ Bài đọc hiểu về công nghệ trong giáo dục...     │
│                                                   │
│ [Đọc] [B2] ⏱️ 60 phút | 📄 40 câu hỏi          │
│                                        [✓ Chọn]  │
└──────────────────────────────────────────────────┘
```

---

#### **Option B: Upload file tự tạo** 📤

**Giao diện:**
- 📦 Drag & drop zone
- Hỗ trợ: PDF, DOCX, PNG, JPG (max 10MB)
- Multi-file upload
- File list với preview + remove button

**Sau khi upload:**
- Form nhập thông tin:
  - **Tiêu đề bài tập** * (required)
  - **Mô tả** (optional)

**File structure:**
```typescript
interface UploadedFile {
  name: string;
  size: number; // bytes
  type: string; // MIME type
  url: string; // blob URL hoặc CDN URL
}
```

**Ví dụ UI:**
```
┌─────────────────────────────────────────┐
│  📤 Kéo thả file hoặc click để chọn     │
│                                          │
│  Hỗ trợ: PDF, DOCX, PNG, JPG           │
│  (Tối đa 10MB mỗi file)                 │
│                                          │
│         [📁 Chọn file]                  │
└─────────────────────────────────────────┘

File đã tải lên (2):
┌─────────────────────────────────────────┐
│ [📄] Reading_Practice_Unit5.pdf         │
│      2.4 MB                        [✕]  │
├─────────────────────────────────────────┤
│ [🖼️] Answer_Key.png                    │
│      850 KB                        [✕]  │
└─────────────────────────────────────────┘

Thông tin bài tập:
┌─────────────────────────────────────────┐
│ Tiêu đề: [Reading Practice - Unit 5  ] │
│ Mô tả:   [Bài đọc hiểu về...         ] │
└─────────────────────────────────────────┘
```

---

### **BƯỚC 2: Chọn đối tượng**

#### **Mode Selection:**
```
┌──────────────────┐   ┌──────────────────┐
│ 👥 Giao theo lớp │   │ 👤 Giao theo HS  │
│                  │   │                  │
│ Chọn cả lớp học  │   │ Chọn từng HS     │
└──────────────────┘   └──────────────────┘
```

#### **Option A: Giao theo lớp** 👥

**Giao diện:**
- Grid cards của classes
- Multi-select (có thể chọn nhiều lớp)
- Mỗi card hiển thị:
  - 🏫 Tên lớp + Code
  - 👨‍🎓 Số học sinh
  - 🏷️ Level badge
  - ✅ Checkbox

**Class structure:**
```typescript
interface Class {
  id: number;
  name: string;
  code: string;
  students: number;
  level: string;
}
```

**Ví dụ:**
```
┌──────────────────────────────────┐
│ VSTEP B2 - Lớp chiều        [✓] │
│ VSTEP-B2-A01                     │
│                                   │
│ 👥 30 học sinh | [B2]           │
└──────────────────────────────────┘
```

---

#### **Option B: Giao theo học sinh** 👤

**Giao diện:**
- Table/List view
- Checkbox mỗi dòng
- Actions: "Chọn tất cả" / "Bỏ chọn tất cả"
- Hiển thị: Tên, Email, Level, Lớp

**Student structure:**
```typescript
interface Student {
  id: number;
  name: string;
  email: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  classId: number;
  className: string;
}
```

**Ví dụ:**
```
┌─────────────────────────────────────────────────┐
│ [Chọn tất cả] [Bỏ chọn tất cả]          (3/6)  │
├─────────────────────────────────────────────────┤
│ [✓] Nguyễn Văn A | nguyenvana@...  [B2] Lớp B2│
│ [ ] Trần Thị B   | tranthib@...    [B2] Lớp B2│
│ [✓] Lê Văn C     | levanc@...      [B1] Lớp B1│
└─────────────────────────────────────────────────┘
```

---

#### **Summary Box:**
```
┌─────────────────────────────────────┐
│ ✅ Đã chọn 55 học sinh              │
│    Từ 2 lớp học                     │
└─────────────────────────────────────┘
```

---

### **BƯỚC 3: Cấu hình & Giao bài**

#### **Tóm tắt bài tập:**
```
┌─────────────────────────────────────┐
│ 📚 Nội dung                         │
│    Academic Reading - Technology... │
│                                      │
│ 👥 Đối tượng                        │
│    55 học sinh (2 lớp)              │
└─────────────────────────────────────┘
```

#### **Form cấu hình:**
```typescript
interface AssignmentConfig {
  title: string;           // * Required - Tiêu đề hiển thị
  instructions: string;    // Optional - Hướng dẫn
  dueDate: string;         // * Required - YYYY-MM-DD
  dueTime: string;         // Default: "23:59"
  allowLateSubmission: boolean; // Default: false
}
```

**Giao diện:**
```
┌─────────────────────────────────────────────┐
│ Tiêu đề hiển thị *                         │
│ [Reading Practice - Technology          ]  │
│                                             │
│ Hướng dẫn cho học sinh                     │
│ [Hoàn thành trước 15/12...              ]  │
│                                             │
│ Hạn nộp *          Giờ hạn nộp            │
│ [2025-12-15]       [23:59]                 │
│                                             │
│ ☑ Cho phép nộp muộn                        │
│                                             │
│ [← Quay lại]          [🚀 Giao bài tập]   │
└─────────────────────────────────────────────┘
```

---

## 💾 DỮ LIỆU GỬI ĐI

### **Khi giao bài tập, payload sẽ bao gồm:**

```typescript
interface AssignmentPayload {
  // Nguồn bài tập
  source: 'library' | 'upload';
  
  // Nếu source = 'library'
  exerciseId?: number;
  
  // Nếu source = 'upload'
  uploadedFiles?: UploadedFile[];
  customTitle?: string;
  customDescription?: string;
  
  // Thông tin bài tập
  title: string;
  instructions: string;
  dueDate: string;
  dueTime: string;
  allowLateSubmission: boolean;
  
  // Đối tượng nhận
  recipientMode: 'classes' | 'students';
  classIds?: number[];      // Nếu mode = 'classes'
  studentIds?: number[];    // Nếu mode = 'students'
  
  // Metadata
  totalRecipients: number;
  createdAt: string;
  teacherId: number;
}
```

### **Ví dụ payload - Chọn từ kho:**
```json
{
  "source": "library",
  "exerciseId": 1,
  "title": "Reading Practice - Technology in Education",
  "instructions": "Hoàn thành trước 15/12. Lưu ý đọc kỹ hướng dẫn.",
  "dueDate": "2025-12-15",
  "dueTime": "23:59",
  "allowLateSubmission": false,
  "recipientMode": "classes",
  "classIds": [1, 2],
  "totalRecipients": 55,
  "createdAt": "2025-12-12T10:30:00Z",
  "teacherId": 123
}
```

### **Ví dụ payload - Upload file:**
```json
{
  "source": "upload",
  "uploadedFiles": [
    {
      "name": "Reading_Unit5.pdf",
      "size": 2516582,
      "type": "application/pdf",
      "url": "https://cdn.example.com/files/abc123.pdf"
    }
  ],
  "customTitle": "Reading Practice - Unit 5",
  "customDescription": "Bài đọc tự biên soạn",
  "title": "Reading Practice - Unit 5 (Custom)",
  "instructions": "Làm bài và nộp file PDF kết quả",
  "dueDate": "2025-12-20",
  "dueTime": "23:59",
  "allowLateSubmission": true,
  "recipientMode": "students",
  "studentIds": [1, 3, 5, 7],
  "totalRecipients": 4,
  "createdAt": "2025-12-12T10:30:00Z",
  "teacherId": 123
}
```

---

## 🎨 UI/UX Features

### **1. Visual Feedback:**
- ✅ Checkmarks khi select
- 🎨 Color-coded skills (Reading=Blue, Listening=Purple, Writing=Green, Speaking=Orange)
- 📊 Progress indicators (Step 1/3)
- 🔔 Success modal sau khi giao

### **2. Validation:**
- Step 1: Phải chọn exercise HOẶC upload file + nhập title
- Step 2: Phải chọn ít nhất 1 recipient
- Step 3: Phải nhập title và due date

### **3. Navigation:**
- "← Quay lại" ở mỗi step
- "Hủy" để back về list
- "Tiếp theo →" khi đủ điều kiện
- Disable button khi chưa đủ thông tin

### **4. Mobile Responsive:**
- Grid → Stack trên mobile
- Touch-friendly buttons
- Scrollable lists

---

## 🔐 Backend Integration Points

### **API Endpoints cần có:**

```
POST /api/assignments
  - Tạo assignment mới
  - Upload files nếu có
  - Gửi notifications cho students

GET /api/exercises
  - Lấy danh sách bài tập từ kho
  - Filter by skill/level
  - Search

GET /api/classes
  - Lấy danh sách lớp của teacher

GET /api/students
  - Lấy danh sách học sinh của teacher
  - Filter by class

POST /api/upload
  - Upload file lên CDN/storage
  - Return URL
```

---

## 📊 Database Schema

```sql
-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  source VARCHAR(10) NOT NULL, -- 'library' | 'upload'
  exercise_id INT,              -- NULL nếu upload
  title VARCHAR(255) NOT NULL,
  instructions TEXT,
  due_date TIMESTAMP NOT NULL,
  allow_late_submission BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assignment files (cho upload)
CREATE TABLE assignment_files (
  id SERIAL PRIMARY KEY,
  assignment_id INT NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  file_type VARCHAR(100),
  file_url TEXT,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

-- Assignment recipients
CREATE TABLE assignment_recipients (
  id SERIAL PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started',
  submitted_at TIMESTAMP,
  grade DECIMAL(5,2),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);
```

---

## ✨ Future Enhancements

1. **Auto-grading** cho file upload (OCR → compare với answer key)
2. **Template library** cho custom assignments
3. **Recurring assignments** (repeat weekly/monthly)
4. **Peer review** mode
5. **Group assignments**
6. **Export/Import** assignments
7. **Assignment analytics** dashboard

---

## 🎯 Kết luận

Logic này cho phép giáo viên:
- ✅ Linh hoạt chọn nguồn bài tập (kho hoặc tự tạo)
- ✅ Dễ dàng quản lý đối tượng (lớp hoặc cá nhân)
- ✅ Cấu hình chi tiết (deadline, instructions, late submission)
- ✅ Workflow rõ ràng, trực quan
- ✅ Hỗ trợ đa định dạng file

**Flow hoàn chỉnh:** Chọn nội dung → Chọn đối tượng → Cấu hình → Giao bài → Success! 🎉
