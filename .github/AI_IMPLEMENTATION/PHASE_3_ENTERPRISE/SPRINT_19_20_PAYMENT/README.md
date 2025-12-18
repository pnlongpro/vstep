# Sprint 19-20: Payment Integration

## 📋 Sprint Info

| Attribute | Value |
|-----------|-------|
| **Sprint Number** | 19-20 |
| **Duration** | 4 weeks |
| **Phase** | 3 - Enterprise |
| **Start Date** | Week 37 |
| **Total Tasks** | 10 |
| **Total Hours** | 60h |

---

## 🎯 Sprint Goals

Implement complete payment and subscription system:
1. VNPay integration for Vietnam payments
2. MoMo wallet integration
3. Subscription plans (Free/Basic/Premium/VIP)
4. Transaction management
5. Invoice generation

---

## 📊 Task Breakdown

### Backend Tasks (5 tasks, 35h)

| Task ID | Title | Priority | Hours | Dependencies |
|---------|-------|----------|-------|--------------|
| BE-064 | VNPay Integration | P0 | 8h | - |
| BE-065 | MoMo Integration | P1 | 8h | - |
| BE-066 | Subscription Service | P0 | 8h | BE-064, BE-065 |
| BE-067 | Transaction Management | P1 | 6h | BE-066 |
| BE-068 | Invoice Generation | P2 | 5h | BE-067 |

### Frontend Tasks (5 tasks, 25h)

| Task ID | Title | Priority | Hours | Dependencies |
|---------|-------|----------|-------|--------------|
| FE-067 | Pricing Plans Page | P0 | 5h | BE-066 |
| FE-068 | Checkout Flow | P0 | 6h | BE-064, BE-065 |
| FE-069 | Transaction History | P1 | 4h | BE-067 |
| FE-070 | Subscription Management | P1 | 5h | BE-066 |
| FE-071 | Invoice Download | P2 | 5h | BE-068 |

---

## 🗄️ Database Schema

### New Tables

```sql
-- Subscription Plans
CREATE TABLE subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code ENUM('free', 'basic', 'premium', 'vip') NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  duration_months INT NOT NULL DEFAULT 1,
  features JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Subscriptions
CREATE TABLE user_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  plan_id VARCHAR(36) NOT NULL REFERENCES subscription_plans(id),
  status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_status (user_id, status),
  INDEX idx_end_date (end_date)
);

-- Payment Transactions
CREATE TABLE payment_transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  subscription_id VARCHAR(36) REFERENCES user_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'VND',
  payment_method ENUM('vnpay', 'momo', 'bank_transfer') NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  gateway_transaction_id VARCHAR(100),
  gateway_response JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_user_transactions (user_id, created_at),
  INDEX idx_status (status)
);

-- Invoices
CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  transaction_id VARCHAR(36) NOT NULL REFERENCES payment_transactions(id),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  billing_info JSON NOT NULL,
  items JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('draft', 'issued', 'paid', 'cancelled') DEFAULT 'draft',
  issued_at TIMESTAMP,
  due_date DATE,
  pdf_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_invoices (user_id, created_at),
  INDEX idx_invoice_number (invoice_number)
);

-- Promo Codes
CREATE TABLE promo_codes (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  applicable_plans JSON, -- null = all plans
  usage_limit INT,
  used_count INT DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_active_dates (is_active, start_date, end_date)
);

-- Promo Code Usage
CREATE TABLE promo_code_usages (
  id VARCHAR(36) PRIMARY KEY,
  promo_code_id VARCHAR(36) NOT NULL REFERENCES promo_codes(id),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  transaction_id VARCHAR(36) REFERENCES payment_transactions(id),
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_promo (promo_code_id, user_id)
);
```

---

## 💰 Subscription Plans

```typescript
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Miễn phí',
    price: 0,
    durationMonths: 0, // Unlimited
    features: {
      mockTestsPerMonth: 2,
      practiceUnlimited: false,
      aiWritingFeedback: false,
      aiSpeakingFeedback: false,
      progressTracking: true,
      basicAnalytics: true,
      communityAccess: true,
    },
  },
  basic: {
    name: 'Cơ bản',
    price: 99000, // 99,000 VND/month
    durationMonths: 1,
    features: {
      mockTestsPerMonth: 10,
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: false,
      progressTracking: true,
      detailedAnalytics: true,
      communityAccess: true,
      emailSupport: true,
    },
  },
  premium: {
    name: 'Cao cấp',
    price: 199000, // 199,000 VND/month
    durationMonths: 1,
    features: {
      mockTestsPerMonth: -1, // Unlimited
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: true,
      progressTracking: true,
      advancedAnalytics: true,
      communityAccess: true,
      prioritySupport: true,
      downloadResources: true,
    },
  },
  vip: {
    name: 'VIP',
    price: 499000, // 499,000 VND/month
    durationMonths: 1,
    features: {
      mockTestsPerMonth: -1, // Unlimited
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: true,
      progressTracking: true,
      advancedAnalytics: true,
      communityAccess: true,
      prioritySupport: true,
      downloadResources: true,
      oneOnOneTutoring: 2, // hours per month
      personalizedPlan: true,
      certificateDownload: true,
    },
  },
};
```

---

## 💳 Payment Gateway Integration

### VNPay Flow

```
1. User selects plan → FE
2. Create pending transaction → BE
3. Generate VNPay payment URL → BE
4. Redirect to VNPay → FE
5. User completes payment → VNPay
6. VNPay callback (IPN) → BE webhook
7. Verify signature & update transaction → BE
8. Activate subscription → BE
9. Redirect to success page → FE
```

### MoMo Flow

```
1. User selects plan → FE
2. Create pending transaction → BE
3. Generate MoMo QR/deeplink → BE
4. Display QR or open MoMo app → FE
5. User completes payment → MoMo
6. MoMo webhook notification → BE
7. Verify signature & update → BE
8. Activate subscription → BE
9. Show success → FE
```

---

## 📁 File Structure

```
BE/src/modules/
├── payment/
│   ├── payment.module.ts
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   ├── gateways/
│   │   ├── vnpay.gateway.ts
│   │   └── momo.gateway.ts
│   ├── dto/
│   │   ├── create-payment.dto.ts
│   │   └── verify-payment.dto.ts
│   └── entities/
│       └── payment-transaction.entity.ts
│
├── subscription/
│   ├── subscription.module.ts
│   ├── subscription.controller.ts
│   ├── subscription.service.ts
│   ├── dto/
│   │   ├── create-subscription.dto.ts
│   │   └── subscription-query.dto.ts
│   └── entities/
│       ├── subscription-plan.entity.ts
│       └── user-subscription.entity.ts
│
├── invoice/
│   ├── invoice.module.ts
│   ├── invoice.controller.ts
│   ├── invoice.service.ts
│   ├── templates/
│   │   └── invoice.hbs
│   └── entities/
│       └── invoice.entity.ts
│
└── promo/
    ├── promo.module.ts
    ├── promo.controller.ts
    ├── promo.service.ts
    └── entities/
        ├── promo-code.entity.ts
        └── promo-usage.entity.ts

FE/src/features/
├── payment/
│   ├── hooks/
│   │   ├── usePayment.ts
│   │   └── useTransactions.ts
│   ├── components/
│   │   ├── PaymentMethodSelect.tsx
│   │   ├── PaymentForm.tsx
│   │   └── PaymentSuccess.tsx
│   └── pages/
│       └── CheckoutPage.tsx
│
├── subscription/
│   ├── hooks/
│   │   ├── useSubscription.ts
│   │   └── usePlans.ts
│   ├── components/
│   │   ├── PlanCard.tsx
│   │   ├── PlanComparison.tsx
│   │   ├── CurrentPlanCard.tsx
│   │   └── UpgradeModal.tsx
│   └── pages/
│       ├── PricingPage.tsx
│       └── SubscriptionManagePage.tsx
│
└── invoice/
    ├── hooks/
    │   └── useInvoices.ts
    └── components/
        ├── InvoiceList.tsx
        ├── InvoiceDetail.tsx
        └── InvoiceDownloadButton.tsx
```

---

## 🔧 Environment Variables

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://your-domain.com/payment/vnpay/return
VNPAY_IPN_URL=https://your-domain.com/api/payment/vnpay/ipn

# MoMo Configuration
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api
MOMO_RETURN_URL=https://your-domain.com/payment/momo/return
MOMO_IPN_URL=https://your-domain.com/api/payment/momo/ipn
```

---

## ✅ Sprint Acceptance Criteria

### Week 1 (BE-064, BE-065)
- [ ] VNPay sandbox integration working
- [ ] MoMo sandbox integration working
- [ ] Payment webhooks verified
- [ ] Transaction logging complete

### Week 2 (BE-066, BE-067)
- [ ] Subscription plans CRUD
- [ ] User subscription activation
- [ ] Auto-renewal scheduling
- [ ] Transaction history API

### Week 3 (FE-067, FE-068)
- [ ] Pricing page with plan comparison
- [ ] Checkout flow with payment selection
- [ ] VNPay redirect flow
- [ ] MoMo QR/deeplink flow

### Week 4 (FE-069, FE-070, FE-071, BE-068)
- [ ] Transaction history page
- [ ] Subscription management UI
- [ ] Invoice PDF generation
- [ ] Invoice download functionality

---

## 🧪 Test Strategy

### Unit Tests
- Payment gateway signature verification
- Subscription activation/expiration logic
- Promo code validation
- Invoice number generation

### Integration Tests
- Full payment flow (sandbox)
- Webhook processing
- Subscription lifecycle
- Invoice PDF generation

### E2E Tests
- User purchases subscription
- Payment success/failure flows
- Subscription renewal
- Invoice download
