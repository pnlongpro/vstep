# Phase 3: Enterprise Features

## 📋 Overview

| Attribute | Value |
|-----------|-------|
| **Phase** | 3 - Enterprise |
| **Duration** | 6 weeks (3 sprints) |
| **Focus** | Admin Panel, Gamification, Payment Integration |
| **Dependencies** | Phase 1 & 2 hoàn thành |

---

## 🎯 Goals

1. **Admin Panel**: Quản trị toàn diện hệ thống (users, exams, analytics, settings)
2. **Gamification**: Hệ thống XP, badges, goals, leaderboard
3. **Payment Integration**: Tích hợp VNPay, MoMo, gói subscription

---

## 📅 Sprint Breakdown

### Sprint 15-16: Admin Panel (2 weeks)

| Task ID | Title | Estimate | Priority |
|---------|-------|----------|----------|
| BE-054 | Admin Entity & RBAC | 4h | P0 |
| BE-055 | User Management Service | 6h | P0 |
| BE-056 | Exam Management Service | 6h | P0 |
| BE-057 | System Analytics | 6h | P1 |
| BE-058 | System Settings | 4h | P1 |
| FE-057 | Admin Layout & Navigation | 4h | P0 |
| FE-058 | User Management UI | 6h | P0 |
| FE-059 | Exam Management UI | 6h | P0 |
| FE-060 | Analytics Dashboard | 6h | P1 |
| FE-061 | System Settings UI | 4h | P1 |

**Total: 52 hours**

### Sprint 17-18: Gamification System (2 weeks)

| Task ID | Title | Estimate | Priority |
|---------|-------|----------|----------|
| BE-059 | XP & Level System | 6h | P0 |
| BE-060 | Badges Entity & Service | 6h | P0 |
| BE-061 | Goals Entity & Service | 6h | P0 |
| BE-062 | Leaderboard Service | 4h | P1 |
| BE-063 | Streak & Activity Tracking | 4h | P1 |
| FE-062 | XP Progress Bar | 4h | P0 |
| FE-063 | Badge Collection UI | 6h | P0 |
| FE-064 | Goals Management UI | 6h | P0 |
| FE-065 | Leaderboard UI | 4h | P1 |
| FE-066 | Achievement Notifications | 4h | P1 |

**Total: 50 hours**

### Sprint 19-20: Payment Integration (2 weeks)

| Task ID | Title | Estimate | Priority |
|---------|-------|----------|----------|
| BE-064 | Package & Subscription Entity | 6h | P0 |
| BE-065 | VNPay Integration | 8h | P0 |
| BE-066 | MoMo Integration | 6h | P1 |
| BE-067 | Transaction Service | 6h | P0 |
| BE-068 | Subscription Management | 6h | P0 |
| FE-067 | Pricing Page | 4h | P0 |
| FE-068 | Checkout Flow | 6h | P0 |
| FE-069 | Payment Success/Failure | 4h | P0 |
| FE-070 | Subscription Management UI | 6h | P1 |
| FE-071 | Invoice History | 4h | P1 |

**Total: 56 hours**

---

## 📊 Database Schema (New Tables)

### Admin & Settings

```sql
-- admin_logs: Track admin actions
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- system_settings: Key-value settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Gamification

```sql
-- achievements (badges)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(50),
  xp_reward INTEGER DEFAULT 0,
  criteria JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress JSONB,
  UNIQUE(user_id, achievement_id)
);

-- goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'custom'
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  metric VARCHAR(50) NOT NULL, -- 'practice_minutes', 'tests_completed', 'xp_earned'
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- leaderboard_entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  period VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'all_time'
  period_key VARCHAR(20), -- '2024-W01', '2024-01'
  level VARCHAR(10), -- 'A2', 'B1', 'B2', 'C1'
  xp INTEGER DEFAULT 0,
  rank INTEGER,
  tests_completed INTEGER DEFAULT 0,
  practice_hours DECIMAL(6,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, period, period_key, level)
);

-- user_xp_logs
CREATE TABLE user_xp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'practice', 'exam', 'achievement', 'streak'
  source_id UUID,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Payment & Subscription

```sql
-- packages (subscription plans)
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- 'free', 'basic', 'premium', 'vip'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'VND',
  duration_days INTEGER NOT NULL,
  features JSONB,
  limits JSONB, -- { "mock_tests_per_day": 5, "ai_grading": true }
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  package_id UUID REFERENCES packages(id),
  status VARCHAR(20) NOT NULL, -- 'active', 'cancelled', 'expired', 'pending'
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES user_subscriptions(id),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'VND',
  payment_method VARCHAR(20) NOT NULL, -- 'vnpay', 'momo', 'bank_transfer'
  payment_provider VARCHAR(50),
  provider_transaction_id VARCHAR(100),
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  metadata JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  vat_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  billing_info JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 API Endpoints

### Admin APIs

```
# User Management
GET    /api/admin/users                    # List users with filters
GET    /api/admin/users/:id                # User details
PATCH  /api/admin/users/:id                # Update user
POST   /api/admin/users/:id/ban            # Ban user
POST   /api/admin/users/:id/unban          # Unban user
DELETE /api/admin/users/:id                # Delete user

# Exam Management
GET    /api/admin/exam-sets                # List exam sets
POST   /api/admin/exam-sets                # Create exam set
PUT    /api/admin/exam-sets/:id            # Update exam set
DELETE /api/admin/exam-sets/:id            # Delete exam set
POST   /api/admin/exam-sets/:id/publish    # Publish exam set
POST   /api/admin/questions/import         # Bulk import questions

# Analytics
GET    /api/admin/analytics/overview       # Dashboard stats
GET    /api/admin/analytics/users          # User analytics
GET    /api/admin/analytics/revenue        # Revenue analytics
GET    /api/admin/analytics/exams          # Exam analytics

# Settings
GET    /api/admin/settings                 # Get all settings
PUT    /api/admin/settings/:key            # Update setting

# Logs
GET    /api/admin/logs                     # Admin action logs
```

### Gamification APIs

```
# XP & Level
GET    /api/users/me/xp                    # Get XP & level
GET    /api/users/me/xp/history            # XP history

# Badges
GET    /api/badges                         # All badges
GET    /api/users/me/badges                # My badges
GET    /api/users/me/badges/progress       # Badge progress

# Goals
GET    /api/goals                          # My goals
POST   /api/goals                          # Create goal
PUT    /api/goals/:id                      # Update goal
DELETE /api/goals/:id                      # Delete goal
POST   /api/goals/:id/complete             # Mark as complete

# Leaderboard
GET    /api/leaderboard                    # Get leaderboard
GET    /api/leaderboard/my-rank            # My rank
```

### Payment APIs

```
# Packages
GET    /api/packages                       # List packages
GET    /api/packages/:code                 # Package details

# Subscription
GET    /api/subscription/current           # Current subscription
POST   /api/subscription/subscribe         # Start subscription
POST   /api/subscription/cancel            # Cancel subscription
POST   /api/subscription/renew             # Renew subscription

# Payment
POST   /api/payment/vnpay/create           # Create VNPay payment
GET    /api/payment/vnpay/callback         # VNPay IPN callback
POST   /api/payment/momo/create            # Create MoMo payment
POST   /api/payment/momo/callback          # MoMo callback

# Transactions
GET    /api/transactions                   # Transaction history
GET    /api/transactions/:id               # Transaction details
GET    /api/transactions/:id/invoice       # Get invoice
```

---

## 🏗️ Architecture

### Admin Panel Architecture

```
┌─────────────────────────────────────────────┐
│              Admin SPA (Next.js)            │
│  ┌─────────┐ ┌─────────┐ ┌─────────────┐   │
│  │ Users   │ │ Exams   │ │  Analytics  │   │
│  │ CRUD    │ │ CRUD    │ │  Dashboard  │   │
│  └────┬────┘ └────┬────┘ └──────┬──────┘   │
└───────┼──────────┼─────────────┼───────────┘
        │          │             │
        └──────────┴─────────────┘
                   │
          ┌────────┴────────┐
          │   Admin Guard   │ ← Role check
          │   (BE Middleware)│
          └────────┬────────┘
                   │
    ┌──────────────┴──────────────┐
    │        Admin Services       │
    │  ┌───────┐ ┌───────┐ ┌────┐│
    │  │ User  │ │ Exam  │ │Log ││
    │  │ Mgmt  │ │ Mgmt  │ │Svc ││
    │  └───────┘ └───────┘ └────┘│
    └─────────────────────────────┘
```

### Gamification Flow

```
User Action (Practice/Exam/etc.)
           │
           ▼
   ┌───────────────┐
   │ XP Calculator │ ← Base XP + Bonus (streak, difficulty)
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │  XP Service   │ ← Update user XP, check level up
   └───────┬───────┘
           │
   ┌───────┴───────┐
   │               │
   ▼               ▼
┌───────┐    ┌───────────┐
│ Badge │    │   Goal    │
│ Check │    │  Progress │
└───┬───┘    └─────┬─────┘
    │              │
    ▼              ▼
┌───────────────────────┐
│  Notification Event   │ ← Badge unlocked, Goal complete
└───────────────────────┘
```

### Payment Flow

```
┌─────────┐    ┌─────────────┐    ┌──────────────┐
│  User   │───▶│ Pricing Page│───▶│ Select Plan  │
└─────────┘    └─────────────┘    └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │   Checkout   │
                                  │  (Select Pay)│
                                  └──────┬───────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
       ┌────────────┐            ┌────────────┐             ┌────────────┐
       │   VNPay    │            │    MoMo    │             │   Bank     │
       │  Gateway   │            │  Gateway   │             │  Transfer  │
       └─────┬──────┘            └─────┬──────┘             └─────┬──────┘
             │                         │                          │
             └─────────────────────────┴──────────────────────────┘
                                       │
                                       ▼
                               ┌───────────────┐
                               │   Callback    │
                               │   Handler     │
                               └───────┬───────┘
                                       │
                        ┌──────────────┼──────────────┐
                        │              │              │
                        ▼              ▼              ▼
                   ┌─────────┐  ┌───────────┐  ┌───────────┐
                   │ Success │  │  Failed   │  │  Pending  │
                   │ Page    │  │  Page     │  │  Page     │
                   └────┬────┘  └───────────┘  └───────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ Activate    │
                 │ Subscription│
                 └─────────────┘
```

---

## 📁 Sprint Folders

```
PHASE_3_ENTERPRISE/
├── README.md                              # This file
├── SPRINT_15_16_ADMIN/
│   ├── README.md
│   ├── BE-054_ADMIN_ENTITY_RBAC.md
│   ├── BE-055_USER_MANAGEMENT_SERVICE.md
│   ├── BE-056_EXAM_MANAGEMENT_SERVICE.md
│   ├── BE-057_SYSTEM_ANALYTICS.md
│   ├── BE-058_SYSTEM_SETTINGS.md
│   ├── FE-057_ADMIN_LAYOUT.md
│   ├── FE-058_USER_MANAGEMENT_UI.md
│   ├── FE-059_EXAM_MANAGEMENT_UI.md
│   ├── FE-060_ANALYTICS_DASHBOARD.md
│   └── FE-061_SYSTEM_SETTINGS_UI.md
│
├── SPRINT_17_18_GAMIFICATION/
│   ├── README.md
│   ├── BE-059_XP_LEVEL_SYSTEM.md
│   ├── BE-060_BADGES_SERVICE.md
│   ├── BE-061_GOALS_SERVICE.md
│   ├── BE-062_LEADERBOARD_SERVICE.md
│   ├── BE-063_STREAK_ACTIVITY.md
│   ├── FE-062_XP_PROGRESS_BAR.md
│   ├── FE-063_BADGE_COLLECTION.md
│   ├── FE-064_GOALS_MANAGEMENT.md
│   ├── FE-065_LEADERBOARD_UI.md
│   └── FE-066_ACHIEVEMENT_NOTIFICATIONS.md
│
└── SPRINT_19_20_PAYMENT/
    ├── README.md
    ├── BE-064_PACKAGE_SUBSCRIPTION_ENTITY.md
    ├── BE-065_VNPAY_INTEGRATION.md
    ├── BE-066_MOMO_INTEGRATION.md
    ├── BE-067_TRANSACTION_SERVICE.md
    ├── BE-068_SUBSCRIPTION_MANAGEMENT.md
    ├── FE-067_PRICING_PAGE.md
    ├── FE-068_CHECKOUT_FLOW.md
    ├── FE-069_PAYMENT_RESULT.md
    ├── FE-070_SUBSCRIPTION_MANAGEMENT_UI.md
    └── FE-071_INVOICE_HISTORY.md
```

---

## ⚠️ Chú ý quan trọng

1. **Admin Role**: Tất cả admin APIs phải check role `admin` hoặc `super_admin`
2. **Audit Log**: Mọi thao tác admin phải được log vào `admin_logs`
3. **XP Calculation**: XP được tính dựa trên độ khó + thời gian + streak
4. **Payment Security**: VNPay/MoMo callbacks phải verify signature
5. **Subscription Check**: Mọi premium feature phải check subscription status
6. **Timezone**: Mọi tính toán streak/goal phải theo timezone user (default UTC+7)
