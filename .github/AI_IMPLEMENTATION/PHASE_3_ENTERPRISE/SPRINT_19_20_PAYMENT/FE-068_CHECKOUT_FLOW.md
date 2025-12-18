# FE-068: Checkout Flow

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-068 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | FE-067, BE-064, BE-065 |

---

## 🎯 Objective

Build checkout flow:
- Payment method selection (VNPay/MoMo)
- Promo code application
- Order summary
- Success/failure result pages

---

## 📝 Implementation

### 1. Types & API

```typescript
// src/types/payment.ts
export interface PaymentMethod {
  id: 'vnpay' | 'momo' | 'bank_transfer';
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  validUntil: string;
}

export interface CheckoutData {
  planCode: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: 'vnpay' | 'momo';
  promoCode?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}

// src/services/payment.api.ts
import { apiClient } from '@/lib/api-client';

export const paymentApi = {
  validatePromoCode: (code: string, planCode: string) =>
    apiClient.post<PromoCode>('/payment/promo/validate', { code, planCode }),

  createPayment: (data: CheckoutData) =>
    apiClient.post<{ paymentUrl: string }>('/payment/create', data),

  getPaymentResult: (transactionId: string) =>
    apiClient.get<PaymentResult>(`/payment/result/${transactionId}`),
};

// src/hooks/usePayment.ts
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/services/payment.api';

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: ({ code, planCode }: { code: string; planCode: string }) =>
      paymentApi.validatePromoCode(code, planCode),
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: CheckoutData) => paymentApi.createPayment(data),
    onSuccess: (data) => {
      // Redirect to payment gateway
      window.location.href = data.paymentUrl;
    },
  });
}
```

### 2. Payment Method Modal

```typescript
// src/features/pricing/PaymentMethodModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Building, Check, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePlans } from '@/hooks/useSubscription';
import { useValidatePromoCode, useCreatePayment } from '@/hooks/usePayment';

interface PaymentMethodModalProps {
  isOpen: boolean;
  planCode: string;
  billingCycle: 'monthly' | 'yearly';
  onClose: () => void;
}

const PAYMENT_METHODS = [
  {
    id: 'vnpay',
    name: 'VNPay',
    icon: '/images/vnpay-logo.png',
    description: 'Thẻ ATM, Visa, Mastercard',
    isAvailable: true,
  },
  {
    id: 'momo',
    name: 'MoMo',
    icon: '/images/momo-logo.png',
    description: 'Ví điện tử MoMo',
    isAvailable: true,
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản',
    icon: Building,
    description: 'Chuyển khoản ngân hàng',
    isAvailable: false,
    comingSoon: true,
  },
];

export function PaymentMethodModal({
  isOpen,
  planCode,
  billingCycle,
  onClose,
}: PaymentMethodModalProps) {
  const [step, setStep] = useState<'method' | 'summary'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const { data: plans } = usePlans();
  const validatePromo = useValidatePromoCode();
  const createPayment = useCreatePayment();

  const plan = plans?.find((p) => p.code === planCode);
  const basePrice = billingCycle === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice;

  const discount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? Math.min((basePrice! * appliedPromo.discountValue) / 100, appliedPromo.maxDiscount || Infinity)
      : appliedPromo.discountValue
    : 0;

  const finalPrice = Math.max(0, (basePrice || 0) - discount);

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const result = await validatePromo.mutateAsync({
        code: promoCode,
        planCode,
      });
      setAppliedPromo(result);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePayment = () => {
    if (!selectedMethod) return;

    createPayment.mutate({
      planCode,
      billingCycle,
      paymentMethod: selectedMethod as 'vnpay' | 'momo',
      promoCode: appliedPromo?.code,
    });
  };

  const handleClose = () => {
    setStep('method');
    setSelectedMethod(null);
    setPromoCode('');
    setAppliedPromo(null);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'method' ? 'Chọn phương thức thanh toán' : 'Xác nhận đơn hàng'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'method' ? (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Payment Methods */}
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodOption
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onSelect={() => method.isAvailable && setSelectedMethod(method.id)}
                  />
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-2">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={!!appliedPromo}
                  />
                  {appliedPromo ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode('');
                      }}
                    >
                      Xóa
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleValidatePromo}
                      disabled={!promoCode.trim() || validatePromo.isPending}
                    >
                      {validatePromo.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Áp dụng'
                      )}
                    </Button>
                  )}
                </div>
                {validatePromo.isError && (
                  <p className="text-sm text-red-500 mt-1">
                    Mã giảm giá không hợp lệ
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center gap-2 mt-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">
                      Giảm {appliedPromo.discountType === 'percentage'
                        ? `${appliedPromo.discountValue}%`
                        : formatPrice(appliedPromo.discountValue)}
                    </span>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <Button
                className="w-full"
                disabled={!selectedMethod}
                onClick={() => setStep('summary')}
              >
                Tiếp tục <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gói</span>
                  <span className="font-medium">{plan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chu kỳ</span>
                  <span className="font-medium">
                    {billingCycle === 'yearly' ? 'Hàng năm' : 'Hàng tháng'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gốc</span>
                  <span className="font-medium">{formatPrice(basePrice || 0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                  <span>Tổng thanh toán</span>
                  <span className="text-blue-600">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.icon}
                  alt={selectedMethod}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-medium">
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('method')}
                >
                  Quay lại
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={createPayment.isPending}
                >
                  {createPayment.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Thanh toán {formatPrice(finalPrice)}</>
                  )}
                </Button>
              </div>

              {/* Security Note */}
              <p className="text-xs text-gray-500 text-center">
                🔒 Giao dịch được bảo mật bởi {selectedMethod === 'vnpay' ? 'VNPay' : 'MoMo'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Payment Method Option Component
function PaymentMethodOption({
  method,
  isSelected,
  onSelect,
}: {
  method: typeof PAYMENT_METHODS[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300',
        !method.isAvailable && 'opacity-50 cursor-not-allowed',
      )}
      onClick={onSelect}
      disabled={!method.isAvailable}
    >
      {typeof method.icon === 'string' ? (
        <img src={method.icon} alt={method.name} className="w-10 h-10 object-contain" />
      ) : (
        <method.icon className="w-10 h-10 text-gray-400" />
      )}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium">{method.name}</span>
          {method.comingSoon && (
            <Badge variant="secondary" className="text-xs">
              Sắp ra mắt
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{method.description}</p>
      </div>
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
}
```

### 3. Payment Result Pages

```typescript
// src/app/(main)/payment/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get('txnId');
  const planName = searchParams.get('plan');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#8b5cf6'],
    });
  }, []);

  const formatPrice = (price: string | null) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đăng ký gói {planName}. Bạn có thể bắt đầu sử dụng các tính năng premium ngay bây giờ.
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Mã giao dịch</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Gói đăng ký</span>
              <span className="font-medium">{planName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-bold text-green-600">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Bắt đầu học ngay <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/settings/subscription')}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải hóa đơn
            </Button>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}

// src/app/(main)/payment/failed/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ERROR_MESSAGES: Record<string, string> = {
  '24': 'Giao dịch bị hủy bởi người dùng',
  '51': 'Tài khoản không đủ số dư',
  '65': 'Vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng đang bảo trì',
  '99': 'Lỗi không xác định',
  default: 'Giao dịch không thể hoàn tất',
};

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get('error') || 'default';
  const transactionId = searchParams.get('txnId');

  const errorMessage = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán không thành công
          </h1>
          <p className="text-gray-600 mb-6">
            {errorMessage}. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </p>

          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Mã giao dịch</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => router.push('/pricing')}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.open('mailto:support@vstep.vn', '_blank')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Liên hệ hỗ trợ
            </Button>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}

// src/app/(main)/payment/pending/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/services/payment.api';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get('txnId');

  // Poll for payment status
  const { data: result } = useQuery({
    queryKey: ['payment-result', transactionId],
    queryFn: () => paymentApi.getPaymentResult(transactionId!),
    enabled: !!transactionId,
    refetchInterval: 3000, // Poll every 3 seconds
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (result?.success === true) {
      router.push(`/payment/success?txnId=${transactionId}`);
    } else if (result?.success === false) {
      router.push(`/payment/failed?txnId=${transactionId}`);
    }
  }, [result, transactionId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Clock className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đang xử lý thanh toán
        </h1>
        <p className="text-gray-600 mb-6">
          Vui lòng chờ trong giây lát. Chúng tôi đang xác nhận giao dịch của bạn.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </Card>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Payment method selection works
- [ ] Promo code validation works
- [ ] Order summary shows correct amounts
- [ ] Redirect to payment gateway
- [ ] Success page with confetti
- [ ] Failed page with error message
- [ ] Pending page polls for status
- [ ] Mobile responsive

---

## 🧪 Test Cases

```typescript
describe('PaymentMethodModal', () => {
  it('selects payment method', async () => {
    render(<PaymentMethodModal isOpen planCode="PREMIUM" billingCycle="monthly" />);

    const vnpayOption = screen.getByText('VNPay');
    await userEvent.click(vnpayOption);

    expect(screen.getByRole('button', { name: /Tiếp tục/ })).not.toBeDisabled();
  });

  it('validates promo code', async () => {
    mockValidatePromo.mockResolvedValue({
      code: 'TEST20',
      discountType: 'percentage',
      discountValue: 20,
    });

    render(<PaymentMethodModal isOpen planCode="PREMIUM" billingCycle="monthly" />);

    const input = screen.getByPlaceholderText('Nhập mã giảm giá');
    await userEvent.type(input, 'TEST20');
    await userEvent.click(screen.getByText('Áp dụng'));

    await waitFor(() => {
      expect(screen.getByText(/Giảm 20%/)).toBeInTheDocument();
    });
  });

  it('calculates final price with discount', async () => {
    render(<PaymentMethodModal isOpen planCode="PREMIUM" billingCycle="monthly" />);

    // Apply promo
    // ... apply promo

    // Go to summary
    await userEvent.click(screen.getByText('Tiếp tục'));

    expect(screen.getByText(/Tổng thanh toán/)).toBeInTheDocument();
  });

  it('redirects to payment gateway on submit', async () => {
    mockCreatePayment.mockResolvedValue({ paymentUrl: 'https://vnpay.vn/...' });

    render(<PaymentMethodModal isOpen planCode="PREMIUM" billingCycle="monthly" />);

    // Select method and continue
    await userEvent.click(screen.getByText('VNPay'));
    await userEvent.click(screen.getByText('Tiếp tục'));
    await userEvent.click(screen.getByText(/Thanh toán/));

    await waitFor(() => {
      expect(window.location.href).toBe('https://vnpay.vn/...');
    });
  });
});

describe('PaymentSuccessPage', () => {
  it('shows confetti on load', () => {
    render(<PaymentSuccessPage />);
    expect(confetti).toHaveBeenCalled();
  });

  it('displays transaction details', () => {
    render(<PaymentSuccessPage />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('TXN123')).toBeInTheDocument();
  });
});
```
