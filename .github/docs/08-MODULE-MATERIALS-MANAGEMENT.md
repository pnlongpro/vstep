# 📁 Module 08: Materials Management

> **Module quản lý tài liệu học tập**
> 
> File: `08-MODULE-MATERIALS-MANAGEMENT.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

Module Materials Management cho phép:
- **Teacher**: Upload và chia sẻ tài liệu với lớp
- **Student**: Tải và xem tài liệu
- **Admin**: Quản lý tài liệu toàn hệ thống

---

## Chức năng chính

### 1. Upload Materials (Teacher)

**Supported File Types**:
- Documents: PDF, DOCX, PPTX
- Images: JPG, PNG
- Audio: MP3, WAV
- Video: MP4 (external links)
- Archives: ZIP

**Upload Flow**:
```
Select Class → Click "Upload Material" → Choose files → 
Add title & description → Select visibility → Upload
```

**Form Fields**:
- Title (required)
- Description (optional)
- File (required, max 50MB)
- Category: Vocabulary/Grammar/Practice/Resources
- Visibility: Class only / Public

---

### 2. Materials Library (Student)

**View Options**:
- Grid view (thumbnails)
- List view (detailed)

**Filters**:
- By class
- By category
- By file type
- By date

**Actions**:
- Preview (PDF, images)
- Download
- Bookmark
- Share

---

### 3. Admin Management

**Features**:
- View all materials
- Approve/Reject uploads
- Delete inappropriate content
- Monitor storage usage

---

## Database Design

### Table: materials

```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  class_id UUID REFERENCES classes(id),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  
  category VARCHAR(50),
  is_public BOOLEAN DEFAULT FALSE,
  
  download_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_materials_class ON materials(class_id);
CREATE INDEX idx_materials_uploader ON materials(uploaded_by);
```

---

## API Endpoints

### POST /api/materials

Upload new material

**Request**:
```typescript
POST /api/materials
Content-Type: multipart/form-data

{
  file: File,
  title: string,
  description: string,
  classId: UUID,
  category: string,
  isPublic: boolean
}
```

### GET /api/materials

Get materials list

**Query**: `?classId=uuid&category=vocabulary`

### GET /api/materials/:id/download

Download material file

---

## Kết thúc Module Materials Management
