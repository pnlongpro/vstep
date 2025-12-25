# Tài liệu phân tích: Gói học & Tài khoản Free - VSTEPRO

## 📋 Mục lục
1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Cấu trúc Gói học (Subscription Plans)](#2-cấu-trúc-gói-học-subscription-plans)
3. [Quản lý Tài khoản Free](#3-quản-lý-tài-khoản-free)
4. [Các Component chính](#4-các-component-chính)
5. [Database Schema & Tables](#5-database-schema--tables)
6. [Logic nghiệp vụ](#6-logic-nghiệp-vụ)
7. [API & Data Flow](#7-api--data-flow)

---

## 1. Tổng quan hệ thống

### 1.1. Phân loại học viên
Hệ thống VSTEPRO có **2 loại học viên riêng biệt**:

| Loại | Mô tả | Vai trò | Màu badge |
|------|-------|---------|-----------|
| **HV Gói học** (Plan Student) | Mua subscription plan (Free/Premium/Pro) | `Plan Student` | Xanh dương |
| **HV Khóa học** (Course Student) | Mua khóa học riêng lẻ (2.5tr-5.5tr) | `Course Student` | Xanh lá |

### 1.2. Các gói subscription
Hệ thống có **3 gói subscription** cho Plan Student:

```typescript
Free Plan:     0đ       - Giới hạn nội dung, có thời hạn
Premium Plan:  299k/tháng - Không giới hạn nội dung
Pro Plan:      499k/tháng - Premium + Coaching 1-on-1
```

---

## 2. Cấu trúc Gói học (Subscription Plans)

### 2.1. Interface Plan
**File:** `/UI-Template/components/admin/PricingPlansManagement.tsx`

```typescript
interface Plan {
  id: string;                    // 'free', 'premium', 'pro'
  name: string;                  // Tên gói
  icon: any;                     // Icon component (Package, Crown, Award)
  color: string;                 // Màu chủ đạo
  gradient: string;              // CSS gradient
  description: string;           // Mô tả ngắn
  features: PlanFeature[];       // Danh sách tính năng
  pricing: PricingOption[];      // Các lựa chọn giá (1 tháng, 3 tháng...)
  statistics: {                  // Thống kê
    totalUsers: number;          // Tổng user
    activeUsers: number;         // User đang active
    revenue: number;             // Doanh thu
    growth: number;              // Tỷ lệ tăng trưởng (%)
  };
  isDefault?: boolean;           // Gói mặc định (không thể xóa)
}
```

### 2.2. Interface PlanFeature
```typescript
interface PlanFeature {
  id: string;
  title: string;              // Tên tính năng (VD: "Reading", "AI Speaking")
  description: string;        // Mô tả chi tiết (VD: "10 bài", "Không giới hạn")
  enabled: boolean;           // Bật/tắt tính năng
}
```

### 2.3. Interface PricingOption
```typescript
interface PricingOption {
  duration: '1month' | '3months' | '6months' | '1year';
  price: number;              // Giá (VNĐ)
  discount: number;           // % giảm giá
}
```

### 2.4. Chi tiết các gói

#### 🆓 FREE PLAN
```typescript
{
  id: 'free',
  name: 'Free',
  icon: Package,
  color: 'gray',
  gradient: 'from-gray-500 to-gray-600',
  description: 'Dùng thử miễn phí với giới hạn',
  features: [
    { title: 'Reading', description: '10 bài', enabled: true },
    { title: 'Listening', description: '10 bài', enabled: true },
    { title: 'Writing', description: '5 bài', enabled: true },
    { title: 'Speaking', description: '5 bài', enabled: true },
    { title: 'Mock Test', description: '3 bài', enabled: true },
    { title: 'AI Writing', description: '1/ngày', enabled: true },
    { title: 'AI Speaking', description: '1/ngày', enabled: true },
    { title: 'Thời hạn', description: '30 ngày', enabled: true }
  ],
  pricing: [],  // Miễn phí
  isDefault: true
}
```

#### 👑 PREMIUM PLAN
```typescript
{
  id: 'premium',
  name: 'Premium',
  icon: Crown,
  color: 'orange',
  gradient: 'from-orange-500 to-red-500',
  description: 'Học không giới hạn với tất cả tính năng',
  features: [
    { title: 'Không giới hạn', description: 'AI Speaking & Writing', enabled: true },
    { title: '1000+ đề thi', description: 'Mock Test đầy đủ', enabled: true },
    { title: 'AI Feedback', description: 'Chi tiết từng câu', enabled: true },
    { title: 'Hỗ trợ 24/7', description: 'Tư vấn miễn phí', enabled: true }
  ],
  pricing: [
    { duration: '1month', price: 299000, discount: 0 },
    { duration: '3months', price: 799000, discount: 10 },    // Tiết kiệm 10%
    { duration: '6months', price: 1499000, discount: 16 },   // Tiết kiệm 16%
    { duration: '1year', price: 2699000, discount: 25 }      // Tiết kiệm 25%
  ],
  isDefault: true
}
```

#### 🏆 PRO PLAN
```typescript
{
  id: 'pro',
  name: 'Pro',
  icon: Award,
  color: 'purple',
  gradient: 'from-purple-600 to-indigo-600',
  description: 'Dành cho người học nghiêm túc',
  features: [
    { title: 'Không giới hạn', description: 'AI Speaking & Writing', enabled: true },
    { title: '1000+ đề thi', description: 'Mock Test đầy đủ', enabled: true },
    { title: 'AI Feedback', description: 'Chi tiết từng câu', enabled: true },
    { title: '1-on-1 Coaching', description: 'Với giáo viên', enabled: true },
    { title: 'Lộ trình AI', description: 'Cá nhân hóa', enabled: true },
    { title: 'Chứng nhận', description: 'Hoàn thành khóa học', enabled: true }
  ],
  pricing: [
    { duration: '1month', price: 399000, discount: 0 },
    { duration: '3months', price: 1099000, discount: 8 },
    { duration: '6months', price: 1999000, discount: 16 },
    { duration: '1year', price: 3599000, discount: 25 }
  ],
  isDefault: true
}
```

---

## 3. Quản lý Tài khoản Free

### 3.1. Interface FreeUser
**File:** `/UI-Template/components/admin/FreeAccountManagementPage.tsx`

```typescript
interface FreeUser {
  // Thông tin cơ bản
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  lastActive: string;
  status: 'active' | 'inactive';
  registrationSource: 'web' | 'landing' | 'ads';
  hasEverUpgraded: boolean;
  tags: string[];
  notes: string;
  
  // Sử dụng hiện tại
  usage: {
    mockTests: number;          // Số bài Mock Test đã làm
    aiSpeaking: number;         // Số bài AI Speaking đã dùng
    aiWriting: number;          // Số bài AI Writing đã dùng
    reading: number;            // Số bài Reading đã làm
    listening: number;          // Số bài Listening đã làm
  };
  
  // Giới hạn (từ Preset)
  limits: {
    mockTests: number;          // Giới hạn Mock Test
    aiSpeaking: number;         // Giới hạn AI Speaking
    aiWriting: number;          // Giới hạn AI Writing
    reading: number;            // Giới hạn Reading
    listening: number;          // Giới hạn Listening
  };
  
  // Hành vi học tập
  behavior: {
    mostUsedSkill: 'reading' | 'listening' | 'writing' | 'speaking';
    avgStudyTime: number;       // Thời gian học trung bình (phút/ngày)
    completionRate: number;     // Tỷ lệ hoàn thành (%)
    dropOffPoint: string;       // Điểm bỏ cuộc thường xuyên
  };
  
  // Chuyển đổi (Conversion)
  conversion: {
    hasClickedUpgrade: boolean; // Đã click nút Upgrade?
    clickSource: string;        // Nguồn click (dashboard, limit-popup, etc)
    daysToConversion: number | null; // Số ngày để chuyển đổi
  };
}
```

### 3.2. Preset Packages (Gói cấu hình sẵn)
Admin có thể cấu hình **3 preset** cho Free Plan:

```typescript
interface PresetConfig {
  reading: number;        // Số bài Reading
  listening: number;      // Số bài Listening
  writing: number;        // Số bài Writing
  speaking: number;       // Số bài Speaking
  mockTest: number;       // Số bài Mock Test
  aiWriting: string;      // Giới hạn AI Writing (VD: "1/ngày", "2/ngày")
  aiSpeaking: string;     // Giới hạn AI Speaking
  duration: number;       // Thời hạn (ngày)
}
```

#### Preset mặc định:

**BASIC PRESET** (7 ngày)
```typescript
{
  reading: 5,
  listening: 5,
  writing: 2,
  speaking: 2,
  mockTest: 1,
  aiWriting: '1/2 ngày',    // 1 lượt mỗi 2 ngày
  aiSpeaking: '1/2 ngày',
  duration: 7
}
```

**STANDARD PRESET** (30 ngày) ⭐ Mặc định
```typescript
{
  reading: 10,
  listening: 10,
  writing: 5,
  speaking: 5,
  mockTest: 3,
  aiWriting: '1/ngày',
  aiSpeaking: '1/ngày',
  duration: 30
}
```

**EXTENDED PRESET** (60 ngày)
```typescript
{
  reading: 15,
  listening: 15,
  writing: 8,
  speaking: 8,
  mockTest: 5,
  aiWriting: '2/ngày',
  aiSpeaking: '2/ngày',
  duration: 60
}
```

### 3.3. Quản lý Preset trong Admin
**File:** `/UI-Template/components/admin/FreeAccountManagementPage.tsx`

Admin có thể:
- ✅ Chọn preset đang active (basic/standard/extended)
- ✅ Chỉnh sửa từng preset
- ✅ Tạo preset mới (custom)
- ✅ Preset tự động đồng bộ với PricingPlansManagement

**LocalStorage Keys:**
```typescript
'vstep_admin_active_free_preset'    // 'basic' | 'standard' | 'extended'
'vstep_admin_preset_configs'        // JSON stringify của tất cả preset configs
```

---

## 4. Các Component chính

### 4.1. PricingPlansManagement Component
**Path:** `/UI-Template/components/admin/PricingPlansManagement.tsx`

**Chức năng:**
- ✅ Hiển thị danh sách tất cả gói (Free, Premium, Pro)
- ✅ Chỉnh sửa giá, tính năng của từng gói
- ✅ Thêm/xóa gói mới (custom plans)
- ✅ Xem thống kê: Total Users, Active Users, Revenue, Growth
- ✅ Tự động sync với Free Plan preset từ FreeAccountManagementPage

**Props:** Không có (standalone component)

**State:**
```typescript
const [editingPlan, setEditingPlan] = useState<string | null>(null);
const [showAddModal, setShowAddModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [planToDelete, setPlanToDelete] = useState<string | null>(null);
const [plans, setPlans] = useState<Plan[]>([...]);
```

**Auto-refresh mechanism:**
```typescript
useEffect(() => {
  // Listen to localStorage changes
  const interval = setInterval(() => {
    const updatedFreePlan = getFreePlanFromPreset();
    setPlans(currentPlans => 
      currentPlans.map(plan => 
        plan.id === 'free' ? updatedFreePlan : plan
      )
    );
  }, 500); // Check every 500ms
  
  return () => clearInterval(interval);
}, []);
```

### 4.2. FreeAccountManagementPage Component
**Path:** `/UI-Template/components/admin/FreeAccountManagementPage.tsx`

**Chức năng:**
- ✅ Quản lý danh sách Free Users
- ✅ Xem chi tiết usage/limits của từng user
- ✅ Cấu hình Rules (giới hạn, thời hạn)
- ✅ Phân tích Behavior (hành vi học tập)
- ✅ Theo dõi Conversion (chuyển đổi)
- ✅ Automation (tự động hóa email, notification)
- ✅ Content Management (quản lý nội dung cho Free)
- ✅ Reports (báo cáo chi tiết)
- ✅ Tagging (gắn tag cho user)
- ✅ Vouchers (phát voucher ưu đãi)

**Tabs:**
```typescript
type TabType = 
  | 'users'        // Danh sách user
  | 'rules'        // Cấu hình rules
  | 'behavior'     // Phân tích hành vi
  | 'conversion'   // Theo dõi conversion
  | 'automation'   // Tự động hóa
  | 'content'      // Quản lý nội dung
  | 'reports'      // Báo cáo
  | 'tagging'      // Gắn tag
  | 'vouchers';    // Quản lý voucher
```

**State:**
```typescript
const [activeTab, setActiveTab] = useState<TabType>('users');
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
const [sourceFilter, setSourceFilter] = useState<'all' | 'web' | 'landing' | 'ads'>('all');
const [selectedUser, setSelectedUser] = useState<FreeUser | null>(null);
const [activeFreePreset, setActiveFreePreset] = useState<'basic' | 'standard' | 'extended'>('standard');
const [presetConfigs, setPresetConfigs] = useState({...});
```

### 4.3. FreePlanDashboard Component (Student View)
**Path:** `/UI-Template/components/FreePlanDashboard.tsx`

**Chức năng:** Dashboard cho học viên Free Plan
- ✅ Hiển thị usage/limits theo preset
- ✅ Nút Upgrade khi hết quota
- ✅ Hiển thị các bài thi có sẵn
- ✅ Lịch sử làm bài
- ✅ Voucher đã nhận
- ✅ Daily quota tracking

**Props:**
```typescript
interface FreePlanDashboardProps {
  onBack: () => void;
  userEmail: string;
  onStartMockExam?: (testId: number) => void;
  onStartReading?: () => void;
  onStartListening?: () => void;
  onStartSpeaking?: () => void;
  onStartWriting?: () => void;
}
```

**State:**
```typescript
const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
const [freePlanLimits] = useState(() => loadFromPreset());
const [mockTests] = useState(() => filterByLimit());
const [dailyQuota, setDailyQuota] = useState({
  aiWriting: { used: 0, limit: 1 },
  aiSpeaking: { used: 0, limit: 1 }
});
const [showPremiumModal, setShowPremiumModal] = useState(false);
```

### 4.4. UserManagementPage Component (Phân biệt 2 loại học viên)
**Path:** `/UI-Template/components/admin/UserManagementPage.tsx`

**Chức năng:**
- ✅ Quản lý tất cả user (Plan Student + Course Student)
- ✅ Filter riêng cho 2 loại học viên
- ✅ Hiển thị thông tin subscription hoặc courses
- ✅ Badge màu phân biệt rõ ràng

**Interface:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Plan Student' | 'Course Student' | 'Teacher' | 'Admin' | 'Uploader';
  status: 'active' | 'inactive' | 'banned';
  created: string;
  lastLogin: string;
  avatar: string;
  
  // Riêng cho Plan Student
  subscriptionPlan?: 'Free' | 'Premium' | 'Pro';
  planExpiry?: string | null;
  
  // Riêng cho Course Student
  courses?: string[];
  totalCoursesValue?: string;
  
  // Student data
  testsTaken?: number;
  skillsData?: Array<{ skill: string; score: number }>;
}
```

---

## 5. Database Schema & Tables

### 5.1. Table: `users`
Bảng chính lưu thông tin user

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'Plan Student', 'Course Student', 'Teacher', 'Admin', 'Uploader'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'banned'
  registration_source VARCHAR(20), -- 'web', 'landing', 'ads'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  avatar_url VARCHAR(500),
  CONSTRAINT chk_role CHECK (role IN ('Plan Student', 'Course Student', 'Teacher', 'Admin', 'Uploader')),
  CONSTRAINT chk_status CHECK (status IN ('active', 'inactive', 'banned'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

### 5.2. Table: `plan_subscriptions`
Lưu subscription của Plan Student

```sql
CREATE TABLE plan_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL, -- 'free', 'premium', 'pro'
  plan_duration VARCHAR(20), -- '1month', '3months', '6months', '1year', null (for free)
  price_paid DECIMAL(10, 2), -- Số tiền đã trả (0 cho free)
  discount_applied DECIMAL(5, 2) DEFAULT 0, -- % giảm giá
  start_date TIMESTAMP NOT NULL,
  expiry_date TIMESTAMP, -- NULL cho free plan không thời hạn
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  auto_renew BOOLEAN DEFAULT false,
  payment_method VARCHAR(50), -- 'bank_transfer', 'credit_card', 'momo', etc
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_plan_id CHECK (plan_id IN ('free', 'premium', 'pro')),
  CONSTRAINT chk_status CHECK (status IN ('active', 'expired', 'cancelled'))
);

CREATE INDEX idx_subscriptions_user_id ON plan_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON plan_subscriptions(status);
CREATE INDEX idx_subscriptions_expiry ON plan_subscriptions(expiry_date);
```

### 5.3. Table: `course_enrollments`
Lưu khóa học đã mua của Course Student

```sql
CREATE TABLE course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  price_paid DECIMAL(10, 2) NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_rate DECIMAL(5, 2) DEFAULT 0, -- % hoàn thành
  status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'completed', 'dropped'
  certificate_issued BOOLEAN DEFAULT false,
  CONSTRAINT chk_status CHECK (status IN ('enrolled', 'completed', 'dropped'))
);

CREATE INDEX idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);
```

### 5.4. Table: `courses`
Danh sách khóa học (cho Course Student)

```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(10), -- 'A2', 'B1', 'B2', 'C1'
  price DECIMAL(10, 2) NOT NULL,
  duration_weeks INTEGER, -- Thời lượng khóa học (tuần)
  instructor_id INTEGER REFERENCES users(id),
  thumbnail_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_is_active ON courses(is_active);
```

### 5.5. Table: `free_user_usage`
Theo dõi usage của Free Plan users

```sql
CREATE TABLE free_user_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_type VARCHAR(20) NOT NULL, -- 'reading', 'listening', 'writing', 'speaking', 'mocktest'
  usage_count INTEGER DEFAULT 0,
  limit_count INTEGER NOT NULL, -- Giới hạn (từ preset)
  last_used TIMESTAMP,
  reset_date DATE, -- Ngày reset (cho daily quota)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_skill_type CHECK (skill_type IN ('reading', 'listening', 'writing', 'speaking', 'mocktest')),
  UNIQUE(user_id, skill_type)
);

CREATE INDEX idx_free_usage_user_id ON free_user_usage(user_id);
CREATE INDEX idx_free_usage_reset_date ON free_user_usage(reset_date);
```

### 5.6. Table: `free_plan_presets`
Lưu cấu hình preset cho Admin

```sql
CREATE TABLE free_plan_presets (
  id SERIAL PRIMARY KEY,
  preset_name VARCHAR(50) NOT NULL UNIQUE, -- 'basic', 'standard', 'extended', custom names
  reading_limit INTEGER NOT NULL,
  listening_limit INTEGER NOT NULL,
  writing_limit INTEGER NOT NULL,
  speaking_limit INTEGER NOT NULL,
  mocktest_limit INTEGER NOT NULL,
  ai_writing_quota VARCHAR(50), -- '1/ngày', '2/ngày', '1/2 ngày'
  ai_speaking_quota VARCHAR(50),
  duration_days INTEGER, -- Thời hạn (ngày)
  is_active BOOLEAN DEFAULT false, -- Preset đang được sử dụng
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_presets_is_active ON free_plan_presets(is_active);
```

### 5.7. Table: `user_behavior_analytics`
Phân tích hành vi học tập của Free Users

```sql
CREATE TABLE user_behavior_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  most_used_skill VARCHAR(20), -- 'reading', 'listening', 'writing', 'speaking'
  avg_study_time_minutes DECIMAL(10, 2), -- Thời gian học TB (phút/ngày)
  completion_rate DECIMAL(5, 2), -- Tỷ lệ hoàn thành (%)
  drop_off_point VARCHAR(100), -- Điểm bỏ cuộc (VD: "Part 2 Reading")
  total_sessions INTEGER DEFAULT 0,
  last_calculated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_behavior_user_id ON user_behavior_analytics(user_id);
```

### 5.8. Table: `conversion_tracking`
Theo dõi conversion từ Free → Premium/Pro

```sql
CREATE TABLE conversion_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  has_clicked_upgrade BOOLEAN DEFAULT false,
  click_source VARCHAR(100), -- 'dashboard', 'limit-popup', 'notification', etc
  click_count INTEGER DEFAULT 0,
  last_click_date TIMESTAMP,
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP,
  days_to_conversion INTEGER, -- Số ngày từ đăng ký đến conversion
  converted_to_plan VARCHAR(50), -- 'premium', 'pro'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_conversion_user_id ON conversion_tracking(user_id);
CREATE INDEX idx_conversion_converted ON conversion_tracking(converted);
```

### 5.9. Table: `user_tags`
Gắn tag cho user (để phân loại, targeting)

```sql
CREATE TABLE user_tags (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_name VARCHAR(50) NOT NULL,
  created_by INTEGER REFERENCES users(id), -- Admin tạo tag
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_user_id ON user_tags(user_id);
CREATE INDEX idx_tags_tag_name ON user_tags(tag_name);
```

### 5.10. Table: `vouchers`
Voucher ưu đãi cho user

```sql
CREATE TABLE vouchers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10, 2) NOT NULL, -- % hoặc số tiền
  description TEXT,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  max_uses INTEGER, -- Số lần sử dụng tối đa
  current_uses INTEGER DEFAULT 0,
  applicable_plans VARCHAR(100), -- 'premium', 'pro', 'all'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_valid_until ON vouchers(valid_until);
```

### 5.11. Table: `user_vouchers`
Voucher của từng user

```sql
CREATE TABLE user_vouchers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voucher_id INTEGER NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'unused', -- 'unused', 'used', 'expired'
  CONSTRAINT chk_status CHECK (status IN ('unused', 'used', 'expired'))
);

CREATE INDEX idx_user_vouchers_user_id ON user_vouchers(user_id);
CREATE INDEX idx_user_vouchers_status ON user_vouchers(status);
```

---

## 6. Logic nghiệp vụ

### 6.1. Flow đăng ký Free Plan

```
1. User đăng ký tài khoản
   ↓
2. Tạo record trong `users` table với role='Plan Student'
   ↓
3. Tạo record trong `plan_subscriptions` với plan_id='free'
   ↓
4. Load active preset config từ `free_plan_presets`
   ↓
5. Tạo records trong `free_user_usage` cho từng skill với limits từ preset
   ↓
6. Tạo record trong `conversion_tracking` để theo dõi
   ↓
7. Gửi welcome email
```

### 6.2. Flow kiểm tra giới hạn

```typescript
// Khi user muốn làm bài
function checkLimit(userId: number, skillType: string): boolean {
  // 1. Query từ free_user_usage
  const usage = await db.query(`
    SELECT usage_count, limit_count 
    FROM free_user_usage 
    WHERE user_id = $1 AND skill_type = $2
  `, [userId, skillType]);
  
  // 2. Kiểm tra
  if (usage.usage_count >= usage.limit_count) {
    // Hết quota
    showUpgradeModal();
    trackConversionClick(userId, 'limit-popup');
    return false;
  }
  
  // 3. Còn quota
  return true;
}

// Sau khi hoàn thành bài
function incrementUsage(userId: number, skillType: string): void {
  await db.query(`
    UPDATE free_user_usage 
    SET usage_count = usage_count + 1,
        last_used = NOW(),
        updated_at = NOW()
    WHERE user_id = $1 AND skill_type = $2
  `, [userId, skillType]);
}
```

### 6.3. Flow Upgrade từ Free → Premium/Pro

```
1. User click "Upgrade" button
   ↓
2. Track click trong `conversion_tracking`
   ↓
3. Hiển thị modal chọn gói (Premium/Pro) và duration
   ↓
4. User chọn và thanh toán
   ↓
5. Tạo record mới trong `plan_subscriptions` với plan_id mới
   ↓
6. Update status của subscription cũ thành 'cancelled'
   ↓
7. Xóa/Reset records trong `free_user_usage` (không còn giới hạn)
   ↓
8. Update `conversion_tracking`:
   - converted = true
   - conversion_date = NOW()
   - days_to_conversion = DATEDIFF(NOW(), registration_date)
   - converted_to_plan = 'premium' hoặc 'pro'
   ↓
9. Gửi email xác nhận upgrade
```

### 6.4. Flow kiểm tra hết hạn

```typescript
// Chạy daily cron job
async function checkExpiredSubscriptions(): void {
  // 1. Tìm subscriptions đã hết hạn
  const expired = await db.query(`
    SELECT * FROM plan_subscriptions 
    WHERE status = 'active' 
    AND expiry_date < NOW()
    AND auto_renew = false
  `);
  
  // 2. Update status
  for (const sub of expired) {
    await db.query(`
      UPDATE plan_subscriptions 
      SET status = 'expired',
          updated_at = NOW()
      WHERE id = $1
    `, [sub.id]);
    
    // 3. Gửi email thông báo hết hạn
    sendExpiryNotification(sub.user_id);
    
    // 4. Nếu là Premium/Pro → downgrade về Free
    if (sub.plan_id !== 'free') {
      await downgradeToFree(sub.user_id);
    }
  }
}

// Downgrade về Free
async function downgradeToFree(userId: number): void {
  // 1. Tạo subscription Free mới
  await createFreeSubscription(userId);
  
  // 2. Reset usage limits
  await resetFreeUsageLimits(userId);
}
```

### 6.5. Flow Daily Quota Reset (AI Writing/Speaking)

```typescript
// Chạy daily cron job vào 00:00
async function resetDailyQuota(): void {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset cho tất cả users có daily quota
  await db.query(`
    UPDATE free_user_usage 
    SET usage_count = 0,
        reset_date = $1,
        updated_at = NOW()
    WHERE skill_type IN ('writing', 'speaking')
    AND reset_date < $1
  `, [today]);
}
```

### 6.6. Flow Admin thay đổi Preset

```typescript
// Khi Admin thay đổi preset hoặc active preset khác
async function updateFreePreset(presetName: string): void {
  // 1. Lưu vào localStorage (client-side)
  localStorage.setItem('vstep_admin_active_free_preset', presetName);
  
  // 2. Trigger event để PricingPlansManagement reload
  window.dispatchEvent(new Event('storage'));
  
  // 3. Update trong database (server-side)
  await db.query(`
    UPDATE free_plan_presets 
    SET is_active = false
  `);
  
  await db.query(`
    UPDATE free_plan_presets 
    SET is_active = true 
    WHERE preset_name = $1
  `, [presetName]);
  
  // 4. Update limits cho tất cả Free users
  const preset = await getPresetConfig(presetName);
  await updateAllFreeUsersLimits(preset);
}

async function updateAllFreeUsersLimits(preset: PresetConfig): void {
  // Update reading
  await db.query(`
    UPDATE free_user_usage 
    SET limit_count = $1 
    WHERE skill_type = 'reading'
    AND user_id IN (
      SELECT user_id FROM plan_subscriptions 
      WHERE plan_id = 'free' AND status = 'active'
    )
  `, [preset.reading]);
  
  // Tương tự cho listening, writing, speaking, mocktest...
}
```

---

## 7. API & Data Flow

### 7.1. API Endpoints

#### User Management
```typescript
// Lấy danh sách users (có filter)
GET /api/users?role=Plan Student&status=active
Response: { users: User[], total: number }

// Lấy chi tiết 1 user
GET /api/users/:id
Response: { user: User, subscription: Subscription, usage: Usage[] }

// Tạo user mới
POST /api/users
Body: { name, email, phone, role, password }
Response: { user: User }

// Cập nhật user
PATCH /api/users/:id
Body: { name?, email?, phone?, role?, status? }
Response: { user: User }

// Xóa user
DELETE /api/users/:id
Response: { success: boolean }
```

#### Subscription Management
```typescript
// Lấy subscription của user
GET /api/subscriptions/:userId
Response: { subscription: Subscription }

// Tạo/Upgrade subscription
POST /api/subscriptions
Body: { userId, planId, duration, paymentMethod }
Response: { subscription: Subscription, payment: Payment }

// Hủy subscription
DELETE /api/subscriptions/:id
Response: { success: boolean }

// Check expiry
GET /api/subscriptions/:userId/check-expiry
Response: { isExpired: boolean, daysRemaining: number }
```

#### Free Plan Management
```typescript
// Lấy usage hiện tại
GET /api/free-usage/:userId
Response: { usage: Usage[] }

// Check limit trước khi làm bài
GET /api/free-usage/:userId/check-limit?skill=reading
Response: { allowed: boolean, remaining: number }

// Increment usage sau khi hoàn thành
POST /api/free-usage/:userId/increment
Body: { skillType: 'reading' | 'listening' | ... }
Response: { usage: Usage }

// Reset daily quota
POST /api/free-usage/reset-daily-quota
Response: { updated: number }
```

#### Preset Management
```typescript
// Lấy tất cả presets
GET /api/presets
Response: { presets: Preset[], activePreset: string }

// Lấy 1 preset
GET /api/presets/:name
Response: { preset: Preset }

// Tạo preset mới
POST /api/presets
Body: { name, reading, listening, ... }
Response: { preset: Preset }

// Cập nhật preset
PATCH /api/presets/:name
Body: { reading?, listening?, ... }
Response: { preset: Preset }

// Set preset active
POST /api/presets/:name/activate
Response: { success: boolean, updated: number }

// Xóa preset (chỉ custom, không xóa được basic/standard/extended)
DELETE /api/presets/:name
Response: { success: boolean }
```

#### Conversion Tracking
```typescript
// Track click Upgrade
POST /api/conversion/track-click
Body: { userId, clickSource: 'dashboard' | 'limit-popup' | ... }
Response: { success: boolean }

// Lấy conversion stats
GET /api/conversion/stats?from=2024-01-01&to=2024-12-31
Response: { 
  totalFreeUsers: number,
  clickedUpgrade: number,
  converted: number,
  conversionRate: number,
  avgDaysToConversion: number
}

// Lấy conversion funnel
GET /api/conversion/funnel
Response: {
  registered: number,
  clickedUpgrade: number,
  viewedPricing: number,
  converted: number
}
```

#### Voucher Management
```typescript
// Lấy vouchers của user
GET /api/vouchers/:userId
Response: { vouchers: UserVoucher[] }

// Tạo voucher mới (Admin)
POST /api/vouchers
Body: { code, discountType, discountValue, validFrom, validUntil, ... }
Response: { voucher: Voucher }

// Gửi voucher cho user
POST /api/vouchers/:voucherId/send
Body: { userId }
Response: { success: boolean }

// Apply voucher khi thanh toán
POST /api/vouchers/apply
Body: { userId, voucherCode, planId, duration }
Response: { 
  valid: boolean, 
  originalPrice: number, 
  discountAmount: number, 
  finalPrice: number 
}

// Sử dụng voucher
POST /api/vouchers/:userVoucherId/use
Response: { success: boolean }
```

#### Analytics & Reports
```typescript
// Dashboard stats
GET /api/analytics/dashboard
Response: {
  totalUsers: number,
  activeUsers: number,
  freeUsers: number,
  premiumUsers: number,
  proUsers: number,
  revenue: number,
  growth: number
}

// Free users behavior
GET /api/analytics/free-users/behavior
Response: {
  mostUsedSkill: { reading: number, listening: number, ... },
  avgStudyTime: number,
  avgCompletionRate: number,
  commonDropOffPoints: string[]
}

// Revenue by plan
GET /api/analytics/revenue?from=2024-01-01&to=2024-12-31
Response: {
  byPlan: { free: 0, premium: number, pro: number },
  byMonth: Array<{ month: string, revenue: number }>,
  total: number
}
```

### 7.2. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         VSTEPRO SYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Student    │         │    Admin     │         │   Database   │
│  (Browser)   │         │  Dashboard   │         │  (Postgres)  │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Register            │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 2. Create user & free subscription             │
       │<───────────────────────────────────────────────│
       │                        │                        │
       │ 3. Start exercise      │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 4. Check limit         │                        │
       │<───────────────────────────────────────────────│
       │                        │                        │
       │ (If allowed)           │                        │
       │ 5. Load exercise       │                        │
       │<───────────────────────────────────────────────│
       │                        │                        │
       │ 6. Submit answers      │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 7. Increment usage     │                        │
       │<───────────────────────────────────────────────│
       │                        │                        │
       │ (If limit reached)     │                        │
       │ 8. Show upgrade modal  │                        │
       │ 9. Track click         │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 10. Click Upgrade      │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 11. Payment process    │                        │
       │───────────────────────────────────────────────>│
       │                        │                        │
       │ 12. Create new subscription & update conversion│
       │<───────────────────────────────────────────────│
       │                        │                        │
       │                        │ 13. Admin change preset│
       │                        │───────────────────────>│
       │                        │                        │
       │                        │ 14. Update all free users limits
       │                        │<───────────────────────│
       │                        │                        │
       │ 15. Sync preset        │                        │
       │                        │<───────────────────────│
       │                        │                        │
       │                        │ (PricingPlansManagement auto-refresh)
       │                        │                        │
```

---

## 8. Tính năng nổi bật

### 8.1. Preset System (Hệ thống cấu hình sẵn)
- ✅ Admin có 3 preset mặc định: Basic, Standard, Extended
- ✅ Admin có thể tạo preset custom
- ✅ Khi chọn preset khác → tự động update tất cả Free users
- ✅ Đồng bộ real-time giữa FreeAccountManagementPage và PricingPlansManagement

### 8.2. Daily Quota (Hạn mức hàng ngày)
- ✅ AI Writing/Speaking có daily quota (VD: "1/ngày", "2/ngày")
- ✅ Reset tự động vào 00:00 mỗi ngày
- ✅ Hiển thị countdown timer cho user

### 8.3. Conversion Tracking (Theo dõi chuyển đổi)
- ✅ Track mọi click vào nút "Upgrade"
- ✅ Ghi nhận nguồn click (dashboard, limit-popup, notification)
- ✅ Tính toán days to conversion
- ✅ Phân tích conversion funnel
- ✅ A/B testing các CTA khác nhau

### 8.4. Behavior Analytics (Phân tích hành vi)
- ✅ Most used skill
- ✅ Average study time
- ✅ Completion rate
- ✅ Drop-off points
- ✅ Dùng để optimize user experience

### 8.5. Automation (Tự động hóa)
- ✅ Auto-send email khi gần hết quota
- ✅ Auto-send notification khi hết hạn
- ✅ Auto-send voucher cho users inactive
- ✅ Auto-downgrade khi hết hạn Premium/Pro

### 8.6. Tagging System (Hệ thống gắn tag)
- ✅ Admin gắn tag cho users (VD: "high-potential", "needs-help")
- ✅ Filter users theo tag
- ✅ Bulk actions theo tag (VD: gửi voucher cho tất cả users có tag "inactive")

### 8.7. Voucher System (Hệ thống voucher)
- ✅ Tạo voucher với % hoặc fixed amount
- ✅ Giới hạn số lần sử dụng
- ✅ Áp dụng cho plan cụ thể
- ✅ Track usage của voucher
- ✅ Gửi voucher targeted cho user groups

---

## 9. Best Practices & Recommendations

### 9.1. Performance
- ✅ Cache preset configs trong localStorage để giảm database queries
- ✅ Index các columns hay query (user_id, status, expiry_date)
- ✅ Sử dụng pagination cho danh sách users
- ✅ Lazy load analytics data

### 9.2. Security
- ✅ Hash passwords với bcrypt
- ✅ JWT tokens cho authentication
- ✅ Rate limiting cho API endpoints
- ✅ Validate input data
- ✅ SQL injection prevention với parameterized queries
- ✅ CORS configuration

### 9.3. UX/UI
- ✅ Hiển thị progress bar cho usage/limits
- ✅ Countdown timer cho daily quota
- ✅ Smooth animations khi upgrade
- ✅ Clear CTA buttons
- ✅ Tooltips giải thích các tính năng
- ✅ Mobile responsive

### 9.4. Business Logic
- ✅ Grace period khi hết hạn (VD: 3 ngày)
- ✅ Refund policy cho cancellation
- ✅ Auto-renewal với notification trước
- ✅ Downgrade path rõ ràng
- ✅ Upsell opportunities tại đúng thời điểm

### 9.5. Testing
- ✅ Unit tests cho business logic
- ✅ Integration tests cho API endpoints
- ✅ E2E tests cho critical flows (register, upgrade, payment)
- ✅ Load testing cho concurrent users
- ✅ A/B testing cho conversion optimization

---

## 10. Future Enhancements

### 10.1. Giai đoạn 2
- [ ] Trial period tự động cho Premium (VD: 7 ngày miễn phí)
- [ ] Referral program (giới thiệu bạn bè)
- [ ] Loyalty points system
- [ ] Gamification (badges, achievements)
- [ ] Social sharing features

### 10.2. Giai đoạn 3
- [ ] AI-powered personalized learning paths
- [ ] Adaptive testing (thay đổi độ khó dựa trên performance)
- [ ] Live classes integration
- [ ] Study groups/communities
- [ ] Mobile app (iOS/Android)

### 10.3. Giai đoạn 4
- [ ] B2B plans (cho trường học, công ty)
- [ ] White-label solution
- [ ] API cho third-party integrations
- [ ] Marketplace cho giáo viên đăng nội dung
- [ ] International expansion (multi-language, multi-currency)

---

## 11. Kết luận

Hệ thống Gói học & Tài khoản Free của VSTEPRO đã được thiết kế:
- ✅ **Linh hoạt**: Admin có thể thay đổi cấu hình dễ dàng
- ✅ **Scalable**: Database schema tối ưu cho mở rộng
- ✅ **User-friendly**: UX/UI rõ ràng, dễ sử dụng
- ✅ **Data-driven**: Tracking đầy đủ để phân tích và tối ưu
- ✅ **Conversion-optimized**: Nhiều điểm tiếp xúc để chuyển đổi Free → Premium/Pro

Tài liệu này sẽ được cập nhật thường xuyên theo sự phát triển của hệ thống.

---

**Last updated:** 24/12/2024  
**Version:** 1.0  
**Author:** VSTEPRO Development Team
