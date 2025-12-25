# 📚 VSTEPRO - Phân Tích Hệ Thống Quản Lý Tài Liệu

> **Tài liệu phân tích**: Document Management System  
> **Ngày cập nhật**: 23/12/2024  
> **Version**: 1.0

---

## 📋 Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Phân tích theo vai trò](#3-phân-tích-theo-vai-trò)
4. [Data Models](#4-data-models)
5. [Workflow & State Management](#5-workflow--state-management)
6. [Tính năng chi tiết](#6-tính-năng-chi-tiết)
7. [Security & Permissions](#7-security--permissions)
8. [Tổng kết & Đề xuất](#8-tổng-kết--đề-xuất)

---

## 1. Tổng quan hệ thống

### 1.1 Mục đích
Hệ thống quản lý tài liệu của VSTEPRO cho phép:
- **Upload** tài liệu học tập (PDF, DOCX, PPT, Video, Audio)
- **Quản lý** library tài liệu phân theo skill/level/course
- **Phân quyền** truy cập (Public, Student, Teacher)
- **Approval workflow** cho tài liệu từ Teacher/Uploader
- **Download & View** tracking

### 1.2 Phạm vi
```
┌─────────────────────────────────────────────────────────────┐
│                   DOCUMENT MANAGEMENT SYSTEM                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   STUDENT    │  │   TEACHER    │  │    ADMIN     │      │
│  │   (Client)   │  │  (Creator)   │  │  (Manager)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │              │
│         ▼                 ▼                  ▼              │
│  ┌──────────────────────────────────────────────┐          │
│  │         DOCUMENT LIBRARY (2 types)           │          │
│  ├──────────────────────────────────────────────┤          │
│  │  1. Study Materials (Tài liệu học tập)       │          │
│  │  2. Class Materials (Tài liệu lớp học)       │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Kiến trúc hệ thống

### 2.1 Component Structure

```
/components
├── DocumentsPage.tsx                    # Student view (Client)
├── /admin
│   ├── DocumentsManagementPage.tsx      # Admin dashboard
│   ├── AdminMaterialsManagementPage.tsx # Materials manager
│   ├── AdminClassMaterialsTab.tsx       # Class materials admin
│   ├── AdminStudyMaterialsTab.tsx       # Study materials admin
│   └── TeacherClassMaterialContributionsTab.tsx
├── /teacher
│   ├── ContributeMaterialsPage.tsx      # Teacher upload
│   ├── TeacherClassMaterialsView.tsx    # Teacher materials
│   ├── ClassMaterialsTab.tsx
│   └── StudyMaterialsTab.tsx
└── /uploader
    └── UploaderDashboard.tsx            # Uploader role (contrib only)
```

### 2.2 Data Files

```
/data
├── classMaterialsData.ts    # Class materials mock data
└── /teacher
    ├── classMaterialsData.ts
    ├── studyMaterialsData.ts
    └── courseConfigs.ts
```

---

## 3. Phân tích theo vai trò

### 3.1 🎓 STUDENT (Client Side)

#### File: `DocumentsPage.tsx`

**Chức năng:**
- ✅ **Xem tài liệu** theo 3 tabs:
  - `all`: Tất cả tài liệu public
  - `learning`: Tài liệu học tập
  - `class`: Tài liệu lớp học
- ✅ **Search & Filter**:
  - Tìm kiếm theo tên/mô tả
  - Filter theo category (Ngữ pháp, Từ vựng, Reading, Listening, Writing, Speaking, Mẹo thi, Đề thi mẫu)
  - Filter theo level (A2, B1, B2, C1)
  - Sort by: Recent, Popular, Rating
- ✅ **View modes**: Grid / List
- ✅ **Document actions**:
  - View (Eye icon)
  - Download (Download icon)
  - Rating display

**Interface:**
```typescript
interface Document {
  id: number;
  title: string;
  category: string;
  type: 'pdf' | 'doc' | 'video' | 'quiz';
  author: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  downloads: number;
  views: number;
  rating: number;
  description: string;
  pages?: number;
  duration?: string;
  size: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
}
```

**Categories:**
```typescript
const categories = [
  { id: 'all', name: 'Tất cả', icon: BookOpen },
  { id: 'grammar', name: 'Ngữ pháp', icon: BookA },
  { id: 'vocabulary', name: 'Từ vựng', icon: Languages },
  { id: 'reading', name: 'Đọc hiểu', icon: BookMarked },
  { id: 'listening', name: 'Nghe hiểu', icon: Headphones },
  { id: 'writing', name: 'Viết', icon: PenTool },
  { id: 'speaking', name: 'Nói', icon: Mic },
  { id: 'tips', name: 'Mẹo thi', icon: Lightbulb },
  { id: 'exams', name: 'Đề thi mẫu', icon: FileQuestion },
];
```

**Modals:**
- `ClassMaterialsModal`: Hiển thị tài liệu lớp học
- `LearningMaterialsModal`: Hiển thị tài liệu học tập

---

### 3.2 👨‍🏫 TEACHER (Contributor)

#### File: `ContributeMaterialsPage.tsx`

**Chức năng:**
- ✅ **Upload tài liệu** (3 types):
  1. **Study Materials** (Tài liệu học tập)
  2. **Class Materials** - Textbook (Giáo trình)
  3. **Class Materials** - Media (Video/Audio)

- ✅ **Form upload fields**:
  - Material Name
  - Type (PDF, DOCX, PPT, Video, Audio)
  - Skill (Reading, Listening, Writing, Speaking)
  - Course (10 courses available)
  - Description
  - File upload

- ✅ **View contributions**:
  - Pending (Chờ duyệt)
  - Approved (Đã duyệt)
  - Rejected (Bị từ chối + lý do)

- ✅ **Statistics**:
  - Total uploaded
  - Approved count
  - Pending count
  - Rejected count
  - Downloads/Views tracking

**Available Courses:**
```typescript
const availableCourses = [
  'VSTEP Complete',    // 🎓 Purple-Blue
  'VSTEP Foundation',  // 📚 Blue-Cyan
  'VSTEP Starter',     // 🚀 Orange-Red
  'VSTEP Builder',     // 📖 Teal-Green
  'VSTEP Developer',   // ⬛ Gray
  'VSTEP Booster',     // ⚡ Yellow-Orange
  'VSTEP Intensive',   // 🔥 Red-Pink
  'VSTEP Practice',    // 📝 Green-Teal
  'VSTEP Premium',     // 👑 Amber-Yellow
  'VSTEP Master',      // 🏆 Purple-Pink
];
```

**Upload Flow:**
```
Teacher uploads → Status: 'pending' → Admin reviews → 
  ├─ Approve → Status: 'approved' → Public/Student access
  └─ Reject → Status: 'rejected' + feedback → Teacher revises
```

---

### 3.3 📤 UPLOADER (Content Contributor)

#### File: `UploaderDashboard.tsx`

**Chức năng:**
- ✅ **Upload exams** (4 skills):
  - Reading
  - Listening
  - Writing
  - Speaking
- ✅ **Upload blogs** (via `UploaderBlogContribution`)
- ✅ **View upload history** với status:
  - Pending
  - Approved
  - Rejected (+ feedback)

**Interface:**
```typescript
interface Exam {
  id: string;
  title: string;
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}
```

**Stats Display:**
```typescript
const stats = [
  { label: 'Tổng đề đã tải', icon: FileText },
  { label: 'Đã duyệt', icon: CheckCircle },
  { label: 'Chờ duyệt', icon: Clock },
  { label: 'Bị từ chối', icon: XCircle },
];
```

---

### 3.4 🔴 ADMIN (Manager)

#### File: `DocumentsManagementPage.tsx`

**Chức năng toàn diện:**

**1. Document Overview Dashboard**
```typescript
type DocumentStatus = 'published' | 'pending' | 'rejected' | 'draft';
type DocumentVisibility = 'public' | 'student' | 'teacher';
type DocumentCategory = 'reading' | 'listening' | 'writing' | 'speaking' | 
                       'grammar' | 'vocabulary' | 'general';
```

**2. Filters**
- Category filter (7 categories)
- Status filter (4 statuses)
- Visibility filter (3 levels)
- Search by title/description

**3. Document Actions**
- ✅ **View** (Eye icon) - Preview document
- ✅ **Edit** (Edit icon) - Modify metadata
- ✅ **Delete** (Trash icon) - Remove document
- ✅ **Upload** (Upload icon) - Add new document
- ✅ **Approve/Reject** pending documents

**4. Statistics**
```typescript
const stats = [
  { title: 'Tổng tài liệu', value: '...' },
  { title: 'Chờ duyệt', value: '...' },
  { title: 'Đã xuất bản', value: '...' },
  { title: 'Lượt tải', value: '...' },
];
```

**5. Visibility Control**
- 🌐 **Public**: Ai cũng xem được
- 🎓 **Student**: Chỉ học viên
- 👨‍🏫 **Teacher**: Chỉ giáo viên

---

#### File: `AdminMaterialsManagementPage.tsx`

**Quản lý 2 loại tài liệu:**

**Tab 1: Study Materials (Tài liệu học tập)**
- Managed by `AdminStudyMaterialsTab.tsx`
- Categories: Reading, Listening, Writing, Speaking, Grammar, Vocabulary
- Skills-based filtering

**Tab 2: Class Materials (Tài liệu lớp học)**
- Managed by `AdminClassMaterialsTab.tsx`
- Sub-categories:
  - **Textbook** (Giáo trình): PDF, DOCX, PPT
  - **Media** (Video/Audio): MP4, MP3

**Admin Actions:**
```typescript
// Library Management
- Add new material (manual upload)
- Edit existing material
- Delete material
- Approve/Reject contributions

// Contribution Review (from Teachers)
- View pending contributions
- Approve → Move to Library
- Reject → Send feedback
```

---

#### File: `AdminClassMaterialsTab.tsx`

**Features:**

**1. Dual Mode Tabs**
```typescript
type TabMode = 'library' | 'contributions';

// Library Mode: Quản lý tài liệu đã duyệt
// Contributions Mode: Duyệt tài liệu từ GV
```

**2. Course Filtering**
- Filter by 10 courses (VSTEP Complete, Foundation, Starter, etc.)
- Count materials by course
- Course-specific management

**3. Category Toggle**
```typescript
type ClassCategory = 'textbook' | 'media';

// Textbook: PDF, DOCX, PPT, XLSX
// Media: Video, Audio
```

**4. Material Status**
```typescript
type MaterialStatus = 'pending' | 'approved' | 'rejected';

// Badge display:
- Pending: Yellow badge with Clock icon
- Approved: Green badge with CheckCircle
- Rejected: Red badge with XCircle
```

**5. CRUD Operations**
- ✅ Add new material
- ✅ Edit material (name, description, course, type, file)
- ✅ Delete material (with confirmation)
- ✅ Approve pending materials
- ✅ Reject materials (with feedback)

**6. Stats Dashboard**
```typescript
const stats = {
  totalMaterials: number,
  pendingCount: number,
  approvedCount: number,
  countByCourse: Record<string, number>
};
```

---

## 4. Data Models

### 4.1 Document (Student View)
```typescript
interface Document {
  id: number;
  title: string;
  category: string;              // grammar, vocabulary, reading, etc.
  type: 'pdf' | 'doc' | 'video' | 'quiz';
  author: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  downloads: number;
  views: number;
  rating: number;
  description: string;
  pages?: number;                // For PDFs
  duration?: string;             // For videos
  size: string;                  // "5.2 MB"
  updatedAt: string;             // "2 ngày trước"
  tags: string[];
  thumbnail?: string;
}
```

### 4.2 Material (Admin/Teacher)
```typescript
interface Material {
  id: string;                    // "DOC001", "SM001"
  title: string;
  category: DocumentCategory;
  level: string;                 // "B1", "B2", etc.
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'ppt';
  size: string;
  uploadedBy: string;            // "TS. Nguyễn Văn A"
  uploadDate: string;            // "2024-12-10"
  status: DocumentStatus;        // pending | approved | rejected
  visibility: DocumentVisibility; // public | student | teacher
  downloads: number;
  views: number;
  description: string;
  
  // Optional fields
  course?: string;               // "VSTEP Complete"
  skill?: string;                // "Reading", "Listening"
  rejectReason?: string;         // For rejected materials
}
```

### 4.3 Class Material
```typescript
interface TextbookMaterial {
  id: number;
  name: string;
  description: string;
  course: string;                // Course name
  unit: string;                  // "Unit 1", "Unit 2"
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx';
  size: string;
  uploadDate: string;
  status: MaterialStatus;
  uploadedBy: string;
  downloads: number;
  views: number;
  category: 'textbook';
}

interface MediaMaterial {
  id: number;
  name: string;
  description: string;
  course: string;
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  type: 'video' | 'audio';
  duration: string;              // "15:30"
  size: string;
  uploadDate: string;
  status: MaterialStatus;
  uploadedBy: string;
  views: number;
  category: 'media';
}
```

---

## 5. Workflow & State Management

### 5.1 Student Document Flow

```
User visits Documents Page
    │
    ├─ Select Tab (all/learning/class)
    │   │
    │   ├─ all → Show all public documents
    │   ├─ learning → Show study materials
    │   └─ class → Open ClassMaterialsModal
    │
    ├─ Apply Filters
    │   ├─ Category (grammar, vocabulary, etc.)
    │   ├─ Level (A2, B1, B2, C1)
    │   └─ Sort (recent, popular, rating)
    │
    ├─ Search (by title/description)
    │
    └─ View/Download Document
        ├─ Click View → Preview modal
        └─ Click Download → Increment downloads counter
```

### 5.2 Teacher Upload Flow

```
Teacher Dashboard → Contribute Materials
    │
    ├─ Select Tab
    │   ├─ Study Materials
    │   ├─ Class Materials - Textbook
    │   └─ Class Materials - Media
    │
    ├─ Click "Upload" Button
    │
    ├─ Fill Upload Form
    │   ├─ Material Name
    │   ├─ Type (PDF/DOCX/Video/Audio)
    │   ├─ Skill (if applicable)
    │   ├─ Course (select from 10 courses)
    │   ├─ Description
    │   └─ Upload File
    │
    ├─ Submit Form
    │   └─ Status: 'pending'
    │
    └─ Wait for Admin Review
        ├─ Approved → Status: 'approved' → Visible to students
        └─ Rejected → Status: 'rejected' + feedback → Revise & resubmit
```

### 5.3 Admin Approval Workflow

```
Admin Dashboard → Materials Management
    │
    ├─ View Pending Materials
    │   ├─ Filter by status: 'pending'
    │   └─ Review submissions
    │
    ├─ For Each Material
    │   ├─ Preview content
    │   ├─ Check metadata
    │   └─ Verify quality
    │
    └─ Take Action
        ├─ APPROVE
        │   ├─ Status: 'pending' → 'approved'
        │   ├─ Move to Library
        │   └─ Notify teacher
        │
        └─ REJECT
            ├─ Status: 'pending' → 'rejected'
            ├─ Add feedback/reason
            └─ Notify teacher
```

### 5.4 State Management

**Student Side:**
```typescript
// DocumentsPage.tsx
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('all');
const [selectedLevel, setSelectedLevel] = useState<string>('all');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
const [showClassMaterials, setShowClassMaterials] = useState(false);
const [showLearningMaterials, setShowLearningMaterials] = useState(false);
```

**Teacher Side:**
```typescript
// ContributeMaterialsPage.tsx
const [activeTab, setActiveTab] = useState<'study' | 'class' | 'history'>('study');
const [classCategory, setClassCategory] = useState<'textbook' | 'media'>('textbook');
const [searchTerm, setSearchTerm] = useState('');
const [filterSkill, setFilterSkill] = useState<string>('all');
const [filterCourse, setFilterCourse] = useState<string>('all');
const [filterStatus, setFilterStatus] = useState<string>('all');
const [showUploadModal, setShowUploadModal] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);
```

**Admin Side:**
```typescript
// DocumentsManagementPage.tsx
const [searchQuery, setSearchQuery] = useState('');
const [filterCategory, setFilterCategory] = useState<string>('all');
const [filterStatus, setFilterStatus] = useState<string>('all');
const [filterVisibility, setFilterVisibility] = useState<string>('all');
const [showUploadModal, setShowUploadModal] = useState(false);
const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
const [showEditModal, setShowEditModal] = useState(false);
const [editingDoc, setEditingDoc] = useState<Document | null>(null);
const [currentPage, setCurrentPage] = useState(1);

// AdminClassMaterialsTab.tsx
const [tabMode, setTabMode] = useState<'library' | 'contributions'>('library');
const [classCategory, setClassCategory] = useState<'textbook' | 'media'>('textbook');
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
```

---

## 6. Tính năng chi tiết

### 6.1 Search & Filter

**Student Side:**
```typescript
// Search by title/description
const filteredDocuments = documents.filter(doc => 
  doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  doc.description.toLowerCase().includes(searchQuery.toLowerCase())
);

// Filter by category
const categoryFiltered = filteredDocuments.filter(doc =>
  selectedCategory === 'all' || doc.category === selectedCategory
);

// Filter by level
const levelFiltered = categoryFiltered.filter(doc =>
  selectedLevel === 'all' || doc.level === selectedLevel
);

// Sort
const sorted = levelFiltered.sort((a, b) => {
  if (sortBy === 'recent') return new Date(b.updatedAt) - new Date(a.updatedAt);
  if (sortBy === 'popular') return b.downloads - a.downloads;
  if (sortBy === 'rating') return b.rating - a.rating;
  return 0;
});
```

**Admin Side:**
```typescript
// Multi-filter combination
const filteredDocuments = documents.filter(doc => {
  const matchesSearch = 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = 
    filterCategory === 'all' || doc.category === filterCategory;
  const matchesStatus = 
    filterStatus === 'all' || doc.status === filterStatus;
  const matchesVisibility = 
    filterVisibility === 'all' || doc.visibility === filterVisibility;
  
  return matchesSearch && matchesCategory && matchesStatus && matchesVisibility;
});
```

### 6.2 Upload Progress

**Teacher Upload:**
```typescript
const handleUploadSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsUploading(true);
  
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    setUploadProgress(progress);
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setUploadProgress(0);
        // Add to materials list
        console.log('Upload complete!');
      }, 500);
    }
  }, 200);
};
```

**Progress Bar UI:**
```tsx
{isUploading && (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">Đang tải lên...</span>
      <span className="text-sm font-semibold text-blue-600">
        {uploadProgress}%
      </span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  </div>
)}
```

### 6.3 Status Badges

```typescript
const getStatusBadge = (status: DocumentStatus) => {
  const badges = {
    published: { 
      label: 'Đã xuất bản', 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle
    },
    pending: { 
      label: 'Chờ duyệt', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Clock
    },
    rejected: { 
      label: 'Bị từ chối', 
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircle
    },
    draft: { 
      label: 'Bản nháp', 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Edit
    }
  };
  
  const badge = badges[status];
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${badge.color}`}>
      <badge.icon className="size-3" />
      {badge.label}
    </span>
  );
};
```

### 6.4 Visibility Icons

```typescript
const getVisibilityIcon = (visibility: DocumentVisibility) => {
  const icons = {
    public: { icon: Globe, color: 'text-blue-600', label: 'Công khai' },
    student: { icon: Users, color: 'text-green-600', label: 'Học viên' },
    teacher: { icon: UserIcon, color: 'text-purple-600', label: 'Giáo viên' }
  };
  
  return icons[visibility];
};
```

### 6.5 File Type Icons & Colors

```typescript
const getFileIcon = (type: string) => {
  const icons: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    pptx: '📊',
    xlsx: '📗',
    video: '🎥',
    audio: '🎵',
  };
  return icons[type] || '📁';
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700 border-red-200',
    docx: 'bg-blue-100 text-blue-700 border-blue-200',
    pptx: 'bg-orange-100 text-orange-700 border-orange-200',
    xlsx: 'bg-green-100 text-green-700 border-green-200',
    video: 'bg-purple-100 text-purple-700 border-purple-200',
    audio: 'bg-pink-100 text-pink-700 border-pink-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
};
```

### 6.6 Course Badge Colors

```typescript
const getCourseColor = (course: string) => {
  const colors: Record<string, string> = {
    'VSTEP Complete': 'from-purple-500 to-blue-500',
    'VSTEP Foundation': 'from-blue-500 to-cyan-500',
    'VSTEP Starter': 'from-orange-500 to-red-500',
    'VSTEP Builder': 'from-teal-500 to-green-500',
    'VSTEP Developer': 'from-gray-600 to-gray-800',
    'VSTEP Booster': 'from-yellow-500 to-orange-500',
    'VSTEP Intensive': 'from-red-500 to-pink-500',
    'VSTEP Practice': 'from-green-500 to-teal-500',
    'VSTEP Premium': 'from-amber-500 to-yellow-500',
    'VSTEP Master': 'from-purple-600 to-pink-600',
  };
  return colors[course] || 'from-gray-400 to-gray-500';
};
```

---

## 7. Security & Permissions

### 7.1 Role-Based Access Control (RBAC)

```typescript
type UserRole = 'student' | 'teacher' | 'admin' | 'uploader';

const permissions = {
  student: {
    canView: ['public', 'student'],
    canDownload: true,
    canUpload: false,
    canEdit: false,
    canDelete: false,
    canApprove: false
  },
  
  teacher: {
    canView: ['public', 'student', 'teacher'],
    canDownload: true,
    canUpload: true,              // Can contribute materials
    canEdit: false,               // Can only edit own uploads
    canDelete: false,             // Can only delete own uploads
    canApprove: false
  },
  
  uploader: {
    canView: ['public'],
    canDownload: false,
    canUpload: true,              // Can upload exams only
    canEdit: false,
    canDelete: false,
    canApprove: false
  },
  
  admin: {
    canView: ['public', 'student', 'teacher'],
    canDownload: true,
    canUpload: true,              // Direct upload to library
    canEdit: true,                // Edit all documents
    canDelete: true,              // Delete all documents
    canApprove: true              // Approve/reject contributions
  }
};
```

### 7.2 Document Visibility Rules

```typescript
const canAccessDocument = (
  userRole: UserRole, 
  docVisibility: DocumentVisibility
): boolean => {
  // Public documents: Everyone can access
  if (docVisibility === 'public') return true;
  
  // Student-only documents
  if (docVisibility === 'student') {
    return ['student', 'teacher', 'admin'].includes(userRole);
  }
  
  // Teacher-only documents
  if (docVisibility === 'teacher') {
    return ['teacher', 'admin'].includes(userRole);
  }
  
  return false;
};
```

### 7.3 Upload Validation

```typescript
const validateUpload = (file: File, maxSize: number = 50 * 1024 * 1024) => {
  // Max file size: 50MB
  if (file.size > maxSize) {
    throw new Error('File quá lớn! Giới hạn 50MB.');
  }
  
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'audio/mpeg',
    'audio/mp3'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Định dạng file không được hỗ trợ!');
  }
  
  return true;
};
```

### 7.4 Status Transition Rules

```typescript
const canTransitionStatus = (
  currentStatus: DocumentStatus,
  newStatus: DocumentStatus,
  userRole: UserRole
): boolean => {
  // Only admin can approve/reject
  if (['approved', 'rejected'].includes(newStatus) && userRole !== 'admin') {
    return false;
  }
  
  // Valid transitions
  const validTransitions: Record<DocumentStatus, DocumentStatus[]> = {
    draft: ['pending', 'draft'],
    pending: ['approved', 'rejected'],
    approved: ['published'],
    rejected: ['pending'],  // Can resubmit after revision
    published: ['draft']    // Can unpublish
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
```

---

## 8. Tổng kết & Đề xuất

### 8.1 Điểm mạnh hiện tại

✅ **Architecture tốt:**
- Phân tách rõ ràng theo role (Student/Teacher/Admin/Uploader)
- Component structure hợp lý
- Type safety với TypeScript

✅ **UI/UX chuyên nghiệp:**
- Grid/List view modes
- Advanced filters (category, level, status)
- Search functionality
- Progress tracking for uploads
- Status badges clear & intuitive

✅ **Workflow rõ ràng:**
- Teacher upload → Admin review → Student access
- Approval/rejection system with feedback
- Version tracking

✅ **Permission system:**
- Role-based access control
- Visibility levels (public/student/teacher)

### 8.2 Hạn chế hiện tại

❌ **Mock data only:**
- Chưa có backend API integration
- LocalStorage không scale
- Không có real file upload/download

❌ **Missing features:**
- Không có file preview (PDF viewer, video player)
- Chưa có version control
- Không có comment/review system
- Chưa có bookmark/favorite
- Không có share functionality

❌ **No analytics:**
- Tracking downloads/views nhưng chưa có dashboard
- Không có usage statistics
- Không có popular documents ranking

❌ **Security concerns:**
- Chưa có file scanning (virus check)
- Không có content moderation
- Không có plagiarism detection

### 8.3 Đề xuất cải tiến

#### **Phase 1: Backend Integration** (Priority: HIGH)

1. **API Implementation:**
```typescript
// Document APIs
POST   /api/documents/upload          // Upload new document
GET    /api/documents                 // List documents (with filters)
GET    /api/documents/:id             // Get document details
PUT    /api/documents/:id             // Update document
DELETE /api/documents/:id             // Delete document
POST   /api/documents/:id/approve     // Approve document
POST   /api/documents/:id/reject      // Reject document
GET    /api/documents/:id/download    // Download file

// Material APIs
POST   /api/materials/upload          // Teacher upload
GET    /api/materials/contributions   // Get teacher contributions
GET    /api/materials/pending         // Admin get pending materials
```

2. **File Storage:**
```typescript
// Use cloud storage (AWS S3, Google Cloud Storage)
interface FileUploadConfig {
  maxSize: number;              // 50MB
  allowedTypes: string[];
  bucket: string;
  region: string;
  cdn?: string;                 // CDN for faster delivery
}

// Generate signed URLs for secure download
const getSignedUrl = async (fileId: string): Promise<string> => {
  // Generate temporary URL (expires in 1 hour)
  return await s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: fileId,
    Expires: 3600
  });
};
```

3. **Database Schema:**
```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  level VARCHAR(10),
  type VARCHAR(20),
  file_path VARCHAR(500),
  file_size BIGINT,
  uploaded_by UUID REFERENCES users(id),
  visibility VARCHAR(20) DEFAULT 'public',
  status VARCHAR(20) DEFAULT 'pending',
  downloads INT DEFAULT 0,
  views INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document tags
CREATE TABLE document_tags (
  document_id UUID REFERENCES documents(id),
  tag VARCHAR(50),
  PRIMARY KEY (document_id, tag)
);

-- Download/View tracking
CREATE TABLE document_analytics (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(20),              -- 'view' or 'download'
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### **Phase 2: Enhanced Features** (Priority: MEDIUM)

1. **File Preview:**
```typescript
// PDF Viewer component
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <Controls 
        currentPage={pageNumber} 
        totalPages={numPages}
        onPageChange={setPageNumber}
      />
    </div>
  );
};

// Video Player
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <ReactPlayer
      url={url}
      controls
      width="100%"
      height="100%"
      config={{
        file: {
          attributes: {
            controlsList: 'nodownload'  // Prevent download
          }
        }
      }}
    />
  );
};
```

2. **Version Control:**
```typescript
interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  filePath: string;
  uploadedBy: string;
  uploadDate: string;
  changes: string;              // Change log
}

// API endpoints
GET  /api/documents/:id/versions        // Get version history
POST /api/documents/:id/versions        // Upload new version
GET  /api/documents/:id/versions/:v     // Download specific version
```

3. **Bookmark & Favorites:**
```typescript
interface Bookmark {
  userId: string;
  documentId: string;
  createdAt: string;
  tags?: string[];
}

// User can bookmark documents
POST   /api/users/me/bookmarks
GET    /api/users/me/bookmarks
DELETE /api/users/me/bookmarks/:docId
```

4. **Rating & Reviews:**
```typescript
interface Review {
  id: string;
  documentId: string;
  userId: string;
  rating: number;              // 1-5 stars
  comment?: string;
  createdAt: string;
}

// Review system
POST   /api/documents/:id/reviews
GET    /api/documents/:id/reviews
PUT    /api/documents/:id/reviews/:reviewId
DELETE /api/documents/:id/reviews/:reviewId
```

#### **Phase 3: Analytics & Insights** (Priority: LOW)

1. **Admin Analytics Dashboard:**
```typescript
interface DocumentAnalytics {
  totalDocuments: number;
  totalDownloads: number;
  totalViews: number;
  avgRating: number;
  
  // Trends
  downloadsThisWeek: number;
  downloadsTrend: 'up' | 'down';
  
  // Top documents
  topDownloaded: Document[];
  topRated: Document[];
  mostViewed: Document[];
  
  // By category
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
  
  // User engagement
  activeUsers: number;
  newContributions: number;
}
```

2. **Teacher Contribution Stats:**
```typescript
interface ContributorStats {
  totalUploads: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  totalDownloads: number;        // Sum of all approved materials
  avgRating: number;
  badges: Badge[];               // Achievement badges
}
```

#### **Phase 4: Security Enhancements** (Priority: HIGH)

1. **File Scanning:**
```typescript
// Integrate with antivirus API
import { scanFile } from 'antivirus-api';

const uploadDocument = async (file: File) => {
  // 1. Validate file
  validateUpload(file);
  
  // 2. Scan for viruses
  const scanResult = await scanFile(file);
  if (scanResult.infected) {
    throw new Error('File bị nhiễm virus!');
  }
  
  // 3. Upload to storage
  const fileUrl = await uploadToS3(file);
  
  // 4. Create database record
  await createDocument({ fileUrl, ...metadata });
};
```

2. **Content Moderation:**
```typescript
// Use AI to detect inappropriate content
import { moderateContent } from 'content-moderation-api';

const reviewDocument = async (documentId: string) => {
  const doc = await getDocument(documentId);
  
  // Check text content
  const textResult = await moderateContent(doc.description);
  
  if (textResult.flagged) {
    await rejectDocument(documentId, 'Nội dung không phù hợp');
  }
};
```

3. **Access Logging:**
```typescript
// Log all document access for audit
const logAccess = async (action: string, documentId: string, userId: string) => {
  await db.insert('access_logs', {
    action,           // 'view', 'download', 'edit', 'delete'
    documentId,
    userId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  });
};
```

### 8.4 Roadmap Timeline

```
Q1 2025 (Jan-Mar)
├─ ✅ Backend API implementation
├─ ✅ Cloud storage integration (S3/GCS)
├─ ✅ Database setup & migration
└─ ✅ File scanning & security

Q2 2025 (Apr-Jun)
├─ ✅ File preview (PDF, Video, Audio)
├─ ✅ Version control system
├─ ✅ Bookmark & favorites
└─ ✅ Rating & reviews

Q3 2025 (Jul-Sep)
├─ ✅ Analytics dashboard
├─ ✅ Advanced search (full-text)
├─ ✅ Content recommendations
└─ ✅ Mobile app support

Q4 2025 (Oct-Dec)
├─ ✅ AI-powered content moderation
├─ ✅ Plagiarism detection
├─ ✅ Multi-language support
└─ ✅ Performance optimization
```

---

## 📊 Summary Statistics

### Current System Metrics

| Metric | Count | Notes |
|--------|-------|-------|
| **Total Components** | 15+ | Across student/teacher/admin/uploader |
| **Document Categories** | 9 | Grammar, Vocab, Reading, Listening, Writing, Speaking, Tips, Exams, General |
| **File Types Supported** | 6 | PDF, DOCX, PPT, XLSX, Video, Audio |
| **User Roles** | 4 | Student, Teacher, Admin, Uploader |
| **Visibility Levels** | 3 | Public, Student, Teacher |
| **Status Types** | 4 | Published, Pending, Rejected, Draft |
| **Available Courses** | 10 | VSTEP Complete, Foundation, Starter, etc. |
| **Levels** | 4 | A2, B1, B2, C1 |

### Component Breakdown

```
Document Management System
├── Student Components (2)
│   ├── DocumentsPage.tsx
│   └── ClassMaterialsModal.tsx
│
├── Teacher Components (5)
│   ├── ContributeMaterialsPage.tsx
│   ├── TeacherClassMaterialsView.tsx
│   ├── ClassMaterialsTab.tsx
│   ├── StudyMaterialsTab.tsx
│   └── TeacherExamUploadModal.tsx
│
├── Admin Components (7)
│   ├── DocumentsManagementPage.tsx
│   ├── AdminMaterialsManagementPage.tsx
│   ├── AdminClassMaterialsTab.tsx
│   ├── AdminStudyMaterialsTab.tsx
│   ├── TeacherClassMaterialContributionsTab.tsx
│   ├── MaterialDetailModal.tsx
│   └── CategoryManagementModal.tsx
│
└── Uploader Components (2)
    ├── UploaderDashboard.tsx
    └── UploaderExamUploadModal.tsx
```

---

## 🎯 Kết luận

Hệ thống Document Management của VSTEPRO hiện tại đã có **nền tảng vững chắc** với:

✅ **Architecture tốt**: Phân tách rõ ràng theo role  
✅ **UI/UX chuyên nghiệp**: Filters, search, progress tracking  
✅ **Workflow hoàn chỉnh**: Upload → Review → Publish  
✅ **Type safety**: Full TypeScript support  

**Cần cải thiện:**

⚠️ **Backend integration**: API, database, cloud storage  
⚠️ **Advanced features**: Preview, versioning, bookmarks  
⚠️ **Security**: File scanning, content moderation  
⚠️ **Analytics**: Usage tracking, insights dashboard  

**Ưu tiên phát triển:**
1. Backend API & Cloud Storage (Q1 2025)
2. File Preview & Version Control (Q2 2025)
3. Analytics & Insights (Q3 2025)
4. AI & Security Enhancement (Q4 2025)

---

**Generated by**: VSTEPRO Development Team  
**Last updated**: December 23, 2024  
**Version**: 1.0  
**Contact**: dev@vstepro.com
