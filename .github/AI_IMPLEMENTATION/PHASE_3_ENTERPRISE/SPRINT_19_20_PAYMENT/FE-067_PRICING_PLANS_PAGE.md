# FE-067: Pricing Plans Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-067 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-066 |

---

## 🎯 Objective

Build pricing plans page:
- Display subscription plans
- Feature comparison table
- Highlight recommended plan
- CTA buttons for purchase

---

## 📝 Implementation

### 1. Types & Hooks

```typescript
// src/types/subscription.ts
export interface SubscriptionPlan {
  id: string;
  code: 'FREE' | 'BASIC' | 'PREMIUM' | 'VIP';
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeatures;
  isPopular: boolean;
  badge?: string;
}

export interface PlanFeatures {
  mockTestsPerMonth: number;
  aiWritingReviewsPerMonth: number;
  aiSpeakingReviewsPerMonth: number;
  accessToAllPractice: boolean;
  accessToAdvancedAnalytics: boolean;
  accessToPersonalizedPath: boolean;
  prioritySupport: boolean;
  teacherFeedback: boolean;
  downloadMaterials: boolean;
  offlineMode: boolean;
  certificateOfCompletion: boolean;
  groupStudyFeatures: boolean;
  customStudyPlan: boolean;
  liveClasses: boolean;
  oneOnOneTutoring: boolean;
}

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

// src/hooks/useSubscription.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/services/subscription.api';

export function usePlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionApi.getPlans(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => subscriptionApi.getMySubscription(),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      planCode: string;
      billingCycle: 'monthly' | 'yearly';
      paymentMethod: 'vnpay' | 'momo';
    }) => subscriptionApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    },
  });
}
```

### 2. Pricing Page

```typescript
// src/app/(main)/pricing/page.tsx
import { Metadata } from 'next';
import { PricingPlans } from '@/features/pricing/PricingPlans';

export const metadata: Metadata = {
  title: 'Bảng giá - VSTEP Learning',
  description: 'Chọn gói học phù hợp với mục tiêu luyện thi VSTEP của bạn',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn gói học phù hợp với bạn
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nâng cao khả năng tiếng Anh và đạt mục tiêu VSTEP với các gói học
            được thiết kế phù hợp cho từng nhu cầu
          </p>
        </div>

        {/* Plans */}
        <PricingPlans />

        {/* FAQ */}
        <PricingFAQ />

        {/* Trust badges */}
        <TrustBadges />
      </div>
    </div>
  );
}
```

### 3. Pricing Plans Component

```typescript
// src/features/pricing/PricingPlans.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlans, useMySubscription, useCreatePayment } from '@/hooks/useSubscription';
import { PaymentMethodModal } from './PaymentMethodModal';

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { data: plans, isLoading } = usePlans();
  const { data: currentSubscription } = useMySubscription();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscount = (monthly: number, yearly: number) => {
    const yearlyMonthly = yearly / 12;
    return Math.round(((monthly - yearlyMonthly) / monthly) * 100);
  };

  if (isLoading) {
    return <PricingPlansSkeleton />;
  }

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={cn(
          'text-sm font-medium',
          !isYearly ? 'text-blue-600' : 'text-gray-500'
        )}>
          Thanh toán hàng tháng
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className={cn(
          'text-sm font-medium',
          isYearly ? 'text-blue-600' : 'text-gray-500'
        )}>
          Thanh toán hàng năm
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
            Tiết kiệm 20%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans?.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
            isCurrentPlan={currentSubscription?.plan.code === plan.code}
            onSelect={() => setSelectedPlan(plan.code)}
            formatPrice={formatPrice}
            getDiscount={getDiscount}
            index={index}
          />
        ))}
      </div>

      {/* Feature Comparison */}
      <FeatureComparison plans={plans || []} />

      {/* Payment Modal */}
      <PaymentMethodModal
        isOpen={!!selectedPlan}
        planCode={selectedPlan!}
        billingCycle={isYearly ? 'yearly' : 'monthly'}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}

// Plan Card Component
interface PlanCardProps {
  plan: SubscriptionPlan;
  isYearly: boolean;
  isCurrentPlan: boolean;
  onSelect: () => void;
  formatPrice: (price: number) => string;
  getDiscount: (monthly: number, yearly: number) => number;
  index: number;
}

const PLAN_STYLES = {
  FREE: {
    gradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    button: 'bg-gray-600 hover:bg-gray-700',
    icon: null,
  },
  BASIC: {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700',
    icon: null,
  },
  PREMIUM: {
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700',
    icon: Sparkles,
  },
  VIP: {
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-300',
    button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    icon: Zap,
  },
};

function PlanCard({
  plan,
  isYearly,
  isCurrentPlan,
  onSelect,
  formatPrice,
  getDiscount,
  index,
}: PlanCardProps) {
  const style = PLAN_STYLES[plan.code];
  const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
  const discount = getDiscount(plan.monthlyPrice, plan.yearlyPrice);
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative rounded-2xl p-6 bg-gradient-to-b',
        style.gradient,
        'border-2',
        style.border,
        plan.isPopular && 'ring-2 ring-purple-500 ring-offset-2',
      )}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-purple-600 text-white px-4">
            Phổ biến nhất
          </Badge>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        {Icon && (
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-4">
            <Icon className="w-6 h-6 text-amber-500" />
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {plan.monthlyPrice === 0 ? 'Miễn phí' : formatPrice(price)}
          </span>
          {plan.monthlyPrice > 0 && (
            <span className="text-gray-500">/tháng</span>
          )}
        </div>
        {isYearly && plan.yearlyPrice > 0 && discount > 0 && (
          <div className="mt-2">
            <span className="text-sm text-gray-500 line-through mr-2">
              {formatPrice(plan.monthlyPrice)}
            </span>
            <Badge variant="outline" className="text-green-600 border-green-300">
              Tiết kiệm {discount}%
            </Badge>
          </div>
        )}
        {isYearly && plan.yearlyPrice > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {formatPrice(plan.yearlyPrice)}/năm
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        <FeatureItem
          enabled
          text={`${plan.features.mockTestsPerMonth === -1 ? 'Không giới hạn' : plan.features.mockTestsPerMonth} mock test/tháng`}
        />
        <FeatureItem
          enabled
          text={`${plan.features.aiWritingReviewsPerMonth === -1 ? 'Không giới hạn' : plan.features.aiWritingReviewsPerMonth} AI chấm Writing/tháng`}
        />
        <FeatureItem
          enabled={plan.features.accessToAdvancedAnalytics}
          text="Phân tích chi tiết"
        />
        <FeatureItem
          enabled={plan.features.teacherFeedback}
          text="Giáo viên chấm bài"
        />
        <FeatureItem
          enabled={plan.features.prioritySupport}
          text="Hỗ trợ ưu tiên"
        />
      </ul>

      {/* CTA Button */}
      <Button
        className={cn('w-full', style.button)}
        onClick={onSelect}
        disabled={isCurrentPlan || plan.code === 'FREE'}
      >
        {isCurrentPlan ? 'Gói hiện tại' : plan.code === 'FREE' ? 'Đang sử dụng' : 'Chọn gói này'}
      </Button>
    </motion.div>
  );
}

function FeatureItem({ enabled, text }: { enabled: boolean; text: string }) {
  return (
    <li className="flex items-center gap-3">
      {enabled ? (
        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={cn(
        'text-sm',
        enabled ? 'text-gray-700' : 'text-gray-400',
      )}>
        {text}
      </span>
    </li>
  );
}
```

### 4. Feature Comparison Table

```typescript
// src/features/pricing/FeatureComparison.tsx
'use client';

import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/types/subscription';

interface FeatureComparisonProps {
  plans: SubscriptionPlan[];
}

const FEATURE_GROUPS = [
  {
    name: 'Bài thi & Luyện tập',
    features: [
      { key: 'mockTestsPerMonth', label: 'Mock test/tháng' },
      { key: 'accessToAllPractice', label: 'Truy cập tất cả bài luyện tập' },
      { key: 'downloadMaterials', label: 'Tải tài liệu' },
      { key: 'offlineMode', label: 'Học offline' },
    ],
  },
  {
    name: 'AI & Phân tích',
    features: [
      { key: 'aiWritingReviewsPerMonth', label: 'AI chấm Writing/tháng' },
      { key: 'aiSpeakingReviewsPerMonth', label: 'AI chấm Speaking/tháng' },
      { key: 'accessToAdvancedAnalytics', label: 'Phân tích chi tiết' },
      { key: 'accessToPersonalizedPath', label: 'Lộ trình học cá nhân' },
    ],
  },
  {
    name: 'Hỗ trợ & Tính năng nâng cao',
    features: [
      { key: 'teacherFeedback', label: 'Giáo viên chấm bài' },
      { key: 'prioritySupport', label: 'Hỗ trợ ưu tiên' },
      { key: 'groupStudyFeatures', label: 'Học nhóm' },
      { key: 'liveClasses', label: 'Lớp học trực tuyến' },
      { key: 'oneOnOneTutoring', label: 'Kèm cặp 1-1' },
      { key: 'certificateOfCompletion', label: 'Chứng chỉ hoàn thành' },
    ],
  },
];

export function FeatureComparison({ plans }: FeatureComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderValue = (value: number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return (
      <span className="font-medium">
        {value === -1 ? 'Không giới hạn' : value}
      </span>
    );
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          So sánh chi tiết các gói
        </h2>
        <p className="text-gray-600 mt-2">
          Xem đầy đủ các tính năng của từng gói
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 w-1/3">Tính năng</th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  className={cn(
                    'text-center py-4 px-4',
                    plan.isPopular && 'bg-purple-50',
                  )}
                >
                  <span className="font-bold">{plan.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURE_GROUPS.map((group, groupIndex) => (
              <>
                {/* Group Header */}
                <tr key={`group-${groupIndex}`} className="bg-gray-50">
                  <td
                    colSpan={plans.length + 1}
                    className="py-3 px-4 font-semibold text-gray-700"
                  >
                    {group.name}
                  </td>
                </tr>

                {/* Features */}
                {group.features.map((feature, featureIndex) => {
                  // Show only first 2 features if collapsed
                  if (!isExpanded && groupIndex > 0 && featureIndex > 1) {
                    return null;
                  }

                  return (
                    <tr
                      key={feature.key}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-600">
                        {feature.label}
                      </td>
                      {plans.map((plan) => (
                        <td
                          key={plan.id}
                          className={cn(
                            'py-4 px-4 text-center',
                            plan.isPopular && 'bg-purple-50/50',
                          )}
                        >
                          {renderValue(plan.features[feature.key as keyof typeof plan.features])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand/Collapse */}
      <div className="text-center mt-6">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Xem thêm tính năng <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

### 5. Pricing FAQ

```typescript
// src/features/pricing/PricingFAQ.tsx
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Tôi có thể thay đổi gói sau khi đăng ký không?',
    answer: 'Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Khi nâng cấp, bạn sẽ được hưởng ngay các tính năng mới. Khi hạ cấp, thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.',
  },
  {
    question: 'Phương thức thanh toán nào được hỗ trợ?',
    answer: 'Chúng tôi hỗ trợ thanh toán qua VNPay (thẻ ATM nội địa, thẻ quốc tế Visa/Mastercard) và MoMo. Tất cả giao dịch đều được bảo mật theo tiêu chuẩn quốc tế.',
  },
  {
    question: 'Có thể hoàn tiền không?',
    answer: 'Có, bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày đăng ký nếu chưa sử dụng quá 20% tính năng của gói. Vui lòng liên hệ bộ phận hỗ trợ để được hướng dẫn.',
  },
  {
    question: 'Gói miễn phí có giới hạn gì?',
    answer: 'Gói miễn phí cho phép bạn làm 3 mock test/tháng, 5 bài AI chấm Writing/tháng, và truy cập các bài luyện tập cơ bản. Đây là cách tốt để bạn trải nghiệm nền tảng trước khi quyết định nâng cấp.',
  },
  {
    question: 'Thanh toán hàng năm khác gì hàng tháng?',
    answer: 'Thanh toán hàng năm giúp bạn tiết kiệm 20% so với thanh toán hàng tháng. Bạn sẽ thanh toán một lần cho cả năm và có thể hủy bất cứ lúc nào.',
  },
  {
    question: 'Tôi có thể chia sẻ tài khoản không?',
    answer: 'Mỗi tài khoản chỉ dành cho một người dùng. Chia sẻ tài khoản có thể dẫn đến việc tài khoản bị khóa. Nếu bạn cần tài khoản cho nhóm hoặc tổ chức, vui lòng liên hệ chúng tôi để biết thêm về gói Enterprise.',
  },
];

export function PricingFAQ() {
  return (
    <div className="mt-20 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Câu hỏi thường gặp
        </h2>
        <p className="text-gray-600 mt-2">
          Giải đáp các thắc mắc về gói học và thanh toán
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
```

### 6. Trust Badges

```typescript
// src/features/pricing/TrustBadges.tsx
import { Shield, CreditCard, RefreshCcw, Headphones } from 'lucide-react';

const BADGES = [
  {
    icon: Shield,
    title: 'Bảo mật cao',
    description: 'Thanh toán được mã hóa SSL 256-bit',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán an toàn',
    description: 'VNPay & MoMo verified',
  },
  {
    icon: RefreshCcw,
    title: 'Hoàn tiền 7 ngày',
    description: 'Đảm bảo hài lòng hoặc hoàn tiền',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng',
  },
];

export function TrustBadges() {
  return (
    <div className="mt-20 border-t pt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {BADGES.map((badge, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <badge.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{badge.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Display 4 subscription plans
- [ ] Toggle between monthly/yearly billing
- [ ] Show savings for yearly plans
- [ ] Highlight popular plan
- [ ] Feature comparison table works
- [ ] FAQ accordion functional
- [ ] Mobile responsive layout
- [ ] CTA buttons trigger payment flow

---

## 🧪 Test Cases

```typescript
describe('PricingPlans', () => {
  it('displays all plans', () => {
    render(<PricingPlans />);

    expect(screen.getByText('Miễn phí')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('toggles billing cycle', async () => {
    render(<PricingPlans />);

    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);

    expect(screen.getByText(/năm/)).toBeInTheDocument();
  });

  it('shows discount for yearly billing', async () => {
    render(<PricingPlans />);

    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);

    expect(screen.getByText(/Tiết kiệm 20%/)).toBeInTheDocument();
  });

  it('disables button for current plan', () => {
    mockUseMySubscription.mockReturnValue({
      data: { plan: { code: 'BASIC' } },
    });

    render(<PricingPlans />);

    const basicCard = screen.getByText('Basic').closest('div');
    const button = within(basicCard).getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Gói hiện tại');
  });
});
```
