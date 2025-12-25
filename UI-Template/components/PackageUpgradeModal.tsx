import { useState } from 'react';
import { RefreshCw, Package, Crown, CheckCircle, X, CreditCard, Smartphone, Building2, Sparkles } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

interface PackageUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProductType?: 'plan' | 'course'; // What user currently has
}

export function PackageUpgradeModal({ isOpen, onClose, currentProductType = 'plan' }: PackageUpgradeModalProps) {
  const [packageAction, setPackageAction] = useState<'renew' | 'change'>('renew');
  const [productType, setProductType] = useState<'plan' | 'course'>('plan');
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 6 | 12>(3);
  const [selectedCourse, setSelectedCourse] = useState<number>(1);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro'>('premium');
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'banking'>('card');
  const [showQR, setShowQR] = useState(false); // NEW: Show QR code after confirm

  const handleClose = () => {
    setShowQR(false); // Reset QR state when closing
    onClose();
  };

  // Subscription Plans (Gói tự học)
  const subscriptionPlans = [
    {
      id: 'premium',
      name: '👑 Premium',
      description: 'Gói tự học cao cấp',
      price: 299, // 299k/month
      features: ['Truy cập tất cả đề thi', 'Chấm AI Writing/Speaking', 'Lưu kết quả unlimited', 'Hỗ trợ qua email']
    },
    {
      id: 'pro',
      name: '🏆 Pro',
      description: 'Gói tự học chuyên nghiệp',
      price: 499, // 499k/month
      features: ['Tất cả tính năng Premium', 'Chấm AI không giới hạn', 'Lộ trình cá nhân hoá', 'Hỗ trợ ưu tiên 24/7']
    }
  ];

  // 10 VSTEP Courses
  const allCourses = [
    { 
      id: 1, 
      name: '📚 VSTEP Complete', 
      description: 'Khóa học toàn diện từ A2 đến C1',
      duration: '6 tháng',
      sessions: 40,
      price: 4500,
      features: ['4 kỹ năng hoàn chỉnh', 'Chấm AI unlimited', 'Lộ trình cá nhân', 'Support 24/7'],
      popular: true
    },
    { 
      id: 2, 
      name: '🎯 VSTEP Foundation', 
      description: 'Nền tảng vững chắc cho người mới',
      duration: '4 tháng',
      sessions: 30,
      price: 3000,
      features: ['Bài giảng chi tiết', 'Thực hành cơ bản', 'Chấm AI cơ bản', 'Hỗ trợ trong giờ']
    },
    { 
      id: 3, 
      name: '🚀 VSTEP Starter', 
      description: 'Khởi đầu với VSTEP hiệu quả',
      duration: '3 tháng',
      sessions: 25,
      price: 2500,
      features: ['Kiến thức nền tảng', '100+ bài tập', 'Chấm tự động', 'Email support']
    },
    { 
      id: 4, 
      name: '🏗️ VSTEP Builder', 
      description: 'Xây dựng kỹ năng vững vàng',
      duration: '5 tháng',
      sessions: 35,
      price: 3800,
      features: ['Luyện tập chuyên sâu', 'Mock test hàng tuần', 'Feedback chi tiết', 'Group study']
    },
    { 
      id: 5, 
      name: '💻 VSTEP Developer', 
      description: 'Phát triển kỹ năng nâng cao',
      duration: '4 tháng',
      sessions: 30,
      price: 3500,
      features: ['Kỹ thuật nâng cao', 'Strategy training', 'AI feedback', '1-on-1 session']
    },
    { 
      id: 6, 
      name: '⚡ VSTEP Booster', 
      description: 'Tăng tốc điểm số nhanh chóng',
      duration: '4 tuần',
      sessions: 28,
      price: 3200,
      features: ['Intensive training', 'Daily practice', 'Quick review', 'Score guarantee']
    },
    { 
      id: 7, 
      name: '🔥 VSTEP Intensive', 
      description: 'Học tập chuyên sâu & đột phá',
      duration: '6 tuần',
      sessions: 45,
      price: 4000,
      features: ['Marathon training', '3x practice/week', 'Premium feedback', 'Priority support']
    },
    { 
      id: 8, 
      name: '📝 VSTEP Practice', 
      description: 'Luyện đề & thực hành liên tục',
      duration: '2 tháng',
      sessions: 20,
      price: 2000,
      features: ['500+ exercises', 'Mock tests', 'Auto grading', 'Progress tracking']
    },
    { 
      id: 9, 
      name: '👑 VSTEP Premium', 
      description: 'Gói học cao cấp & VIP',
      duration: '8 tháng',
      sessions: 50,
      price: 6500,
      features: ['All-in-one package', 'Private tutor', 'Unlimited AI', 'Lifetime access'],
      premium: true
    },
    { 
      id: 10, 
      name: '🏆 VSTEP Master', 
      description: 'Đạt trình độ Master & C1',
      duration: '10 tháng',
      sessions: 60,
      price: 7500,
      features: ['Master program', 'Expert coaching', 'Certification prep', 'Job ready'],
      premium: true
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl text-gray-800">Gia hạn / Nâng cấp gói</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showQR ? (
            <>
          {/* Action Type Selection */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">Chọn hành động</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPackageAction('renew')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  packageAction === 'renew'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RefreshCw className={`size-6 mx-auto mb-2 ${
                  packageAction === 'renew' ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  packageAction === 'renew' ? 'text-purple-700' : 'text-gray-600'
                }`}>Gia hạn gói hiện tại</p>
              </button>
              <button
                onClick={() => setPackageAction('change')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  packageAction === 'change'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Package className={`size-6 mx-auto mb-2 ${
                  packageAction === 'change' ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  packageAction === 'change' ? 'text-purple-700' : 'text-gray-600'
                }`}>Đổi gói khác</p>
              </button>
            </div>
          </div>

          {/* Product Type Selection (only for 'change' action) */}
          {packageAction === 'change' && (
            <div>
              <label className="block text-sm mb-3 text-gray-700">Chọn loại sản phẩm</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProductType('plan')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    productType === 'plan'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Package className={`size-6 mx-auto mb-2 ${
                    productType === 'plan' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium mb-1 ${
                    productType === 'plan' ? 'text-blue-700' : 'text-gray-600'
                  }`}>🎯 Gói tự học</p>
                  <p className="text-xs text-gray-500">Tiết kiệm, tự học linh hoạt</p>
                </button>
                <button
                  onClick={() => setProductType('course')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    productType === 'course'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Crown className={`size-6 mx-auto mb-2 ${
                    productType === 'course' ? 'text-emerald-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium mb-1 ${
                    productType === 'course' ? 'text-emerald-700' : 'text-gray-600'
                  }`}>📚 Khóa học</p>
                  <p className="text-xs text-gray-500">Nội dung chuyên sâu, có lộ trình</p>
                </button>
              </div>
            </div>
          )}

          {/* Subscription Plan Selection (for 'plan' type) */}
          {packageAction === 'change' && productType === 'plan' && (
            <div>
              <label className="block text-sm font-medium mb-4 text-gray-700 flex items-center gap-2">
                <Package className="size-5 text-blue-500" />
                Chọn gói tự học
              </label>
              <div className="grid grid-cols-2 gap-3">
                {subscriptionPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`font-medium mb-1 ${
                      selectedPlan === plan.id ? 'text-blue-700' : 'text-gray-900'
                    }`}>{plan.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{plan.description}</p>
                    <p className={`text-xl font-bold mb-3 ${
                      selectedPlan === plan.id ? 'text-blue-600' : 'text-gray-700'
                    }`}>{new Intl.NumberFormat('vi-VN').format(plan.price * 1000)}đ/tháng</p>
                    <div className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <p key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                          <CheckCircle className="size-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </p>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Course Selection (for 'course' type) */}
          {packageAction === 'change' && productType === 'course' && (
            <div>
              <label className="block text-sm font-medium mb-4 text-gray-700 flex items-center gap-2">
                <Crown className="size-5 text-yellow-500" />
                🎓 Chọn khóa học VSTEP
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {allCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      selectedCourse === course.id
                        ? 'border-purple-600 bg-purple-50'
                        : course.premium
                        ? 'border-yellow-200 bg-yellow-50/30 hover:border-yellow-300'
                        : course.popular
                        ? 'border-blue-200 bg-blue-50/30 hover:border-blue-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Badge */}
                    {(course.premium || course.popular) && (
                      <div className="absolute -top-2 -right-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                          course.premium 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        }`}>
                          {course.premium ? '👑' : '🔥'}
                        </span>
                      </div>
                    )}
                    
                    <p className={`font-medium mb-1 ${
                      selectedCourse === course.id ? 'text-purple-700' : 'text-gray-900'
                    }`}>{course.name}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>{course.duration}</span>
                      <span>{course.sessions} buổi</span>
                    </div>
                    <p className={`text-lg font-bold ${
                      selectedCourse === course.id ? 'text-purple-600' : 'text-blue-600'
                    }`}>{new Intl.NumberFormat('vi-VN').format(course.price * 1000)}đ</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration Selection */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">Chọn thời hạn</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { months: 1, discount: 0 },
                { months: 3, discount: 5 },
                { months: 6, discount: 10 },
                { months: 12, discount: 20 },
              ].map((duration) => (
                <button
                  key={duration.months}
                  onClick={() => setSelectedDuration(duration.months as any)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedDuration === duration.months
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`mb-1 ${
                    selectedDuration === duration.months ? 'text-purple-700' : 'text-gray-900'
                  }`}>{duration.months} tháng</p>
                  {duration.discount > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      -{duration.discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Renewal Toggle */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="size-5 text-blue-600" />
                <div>
                  <p className="text-gray-900 mb-1">Gia hạn tự động</p>
                  <p className="text-xs text-gray-600">Tự động gia hạn khi hết hạn</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={autoRenewal}
                onChange={setAutoRenewal}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">Phương thức thanh toán</label>
            <div className="space-y-2">
              {[
                { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: CreditCard },
                { id: 'momo', name: 'Ví MoMo', icon: Smartphone },
                { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: Building2 },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === method.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`size-5 ${
                      paymentMethod === method.id ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <span className={`${
                      paymentMethod === method.id ? 'text-purple-700' : 'text-gray-700'
                    }`}>{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {packageAction === 'change' && productType === 'plan' ? 'Gói tự học:' : 'Khóa học:'}
                </span>
                <span className="text-gray-900 font-medium">
                  {packageAction === 'renew' 
                    ? (currentProductType === 'plan' ? subscriptionPlans.find(p => p.id === 'premium')?.name : '📚 VSTEP Complete')
                    : productType === 'plan'
                    ? subscriptionPlans.find(p => p.id === selectedPlan)?.name || ''
                    : allCourses.find(c => c.id === selectedCourse)?.name || ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời hạn:</span>
                <span className="text-gray-900">{selectedDuration} tháng</span>
              </div>
              {selectedDuration > 1 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>
                    -{selectedDuration === 3 ? '5' : selectedDuration === 6 ? '10' : '20'}%
                  </span>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-purple-200 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Tổng thanh toán:</span>
              <span className="text-2xl font-bold text-purple-700">
                {(() => {
                  let basePrice;
                  
                  if (packageAction === 'renew') {
                    basePrice = currentProductType === 'plan' ? 299 : 4500;
                  } else if (productType === 'plan') {
                    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
                    basePrice = plan?.price || 299;
                  } else {
                    const course = allCourses.find(c => c.id === selectedCourse);
                    basePrice = course?.price || 4500;
                  }
                  
                  const totalBeforeDiscount = basePrice * selectedDuration;
                  const discount = selectedDuration === 3 ? 0.05 : 
                    selectedDuration === 6 ? 0.1 : 
                    selectedDuration === 12 ? 0.2 : 0;
                  const total = totalBeforeDiscount * (1 - discount);
                  return new Intl.NumberFormat('vi-VN').format(total * 1000);
                })()}đ
              </span>
            </div>
            {/* Show savings comparison for subscription plans */}
            {packageAction === 'change' && productType === 'plan' && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Tiết kiệm hơn so với mua khóa học riêng lẻ!
                </p>
              </div>
            )}
          </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 rounded-full">
                  <CheckCircle className="size-5 text-green-600" />
                  <p className="text-green-700 font-medium">Đơn hàng đã được tạo</p>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quét mã QR để thanh toán</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Sử dụng ứng dụng {paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'banking' ? 'Banking' : 'Banking'} để quét mã
                </p>

                {/* QR Code Container */}
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-purple-200">
                  <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    {/* Simple QR-like pattern */}
                    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Background */}
                      <rect width="240" height="240" fill="white" rx="8"/>
                      
                      {/* Top-left corner */}
                      <rect x="20" y="20" width="60" height="60" stroke="#7C3AED" strokeWidth="6" fill="none"/>
                      <rect x="32" y="32" width="36" height="36" fill="#7C3AED"/>
                      
                      {/* Top-right corner */}
                      <rect x="160" y="20" width="60" height="60" stroke="#7C3AED" strokeWidth="6" fill="none"/>
                      <rect x="172" y="32" width="36" height="36" fill="#7C3AED"/>
                      
                      {/* Bottom-left corner */}
                      <rect x="20" y="160" width="60" height="60" stroke="#7C3AED" strokeWidth="6" fill="none"/>
                      <rect x="32" y="172" width="36" height="36" fill="#7C3AED"/>
                      
                      {/* Data patterns */}
                      <rect x="100" y="20" width="12" height="12" fill="#7C3AED"/>
                      <rect x="120" y="20" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="20" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="20" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="20" y="120" width="12" height="12" fill="#7C3AED"/>
                      <rect x="20" y="140" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="120" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="160" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="180" y="100" width="12" height="12" fill="#7C3AED"/>
                      <rect x="200" y="100" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="120" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="120" width="12" height="12" fill="#7C3AED"/>
                      <rect x="180" y="120" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="140" width="12" height="12" fill="#7C3AED"/>
                      <rect x="120" y="140" width="12" height="12" fill="#7C3AED"/>
                      <rect x="160" y="140" width="12" height="12" fill="#7C3AED"/>
                      <rect x="200" y="140" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="160" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="160" width="12" height="12" fill="#7C3AED"/>
                      <rect x="160" y="160" width="12" height="12" fill="#7C3AED"/>
                      <rect x="200" y="160" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="180" width="12" height="12" fill="#7C3AED"/>
                      <rect x="120" y="180" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="180" width="12" height="12" fill="#7C3AED"/>
                      <rect x="180" y="180" width="12" height="12" fill="#7C3AED"/>
                      
                      <rect x="100" y="200" width="12" height="12" fill="#7C3AED"/>
                      <rect x="140" y="200" width="12" height="12" fill="#7C3AED"/>
                      <rect x="160" y="200" width="12" height="12" fill="#7C3AED"/>
                      <rect x="180" y="200" width="12" height="12" fill="#7C3AED"/>
                      <rect x="200" y="200" width="12" height="12" fill="#7C3AED"/>
                    </svg>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-6 max-w-md mx-auto">
                  💡 Hệ thống sẽ tự động xác nhận thanh toán sau khi bạn chuyển khoản thành công
                </p>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-3">Thông tin chuyển khoản</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-mono font-medium text-gray-900">1234 5678 9012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium text-gray-900">Vietcombank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium text-gray-900">VSTEPRO EDUCATION</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="text-lg font-bold text-purple-700">
                      {(() => {
                        let basePrice;
                        
                        if (packageAction === 'renew') {
                          basePrice = currentProductType === 'plan' ? 299 : 4500;
                        } else if (productType === 'plan') {
                          const plan = subscriptionPlans.find(p => p.id === selectedPlan);
                          basePrice = plan?.price || 299;
                        } else {
                          const course = allCourses.find(c => c.id === selectedCourse);
                          basePrice = course?.price || 4500;
                        }
                        
                        const totalBeforeDiscount = basePrice * selectedDuration;
                        const discount = selectedDuration === 3 ? 0.05 : 
                          selectedDuration === 6 ? 0.1 : 
                          selectedDuration === 12 ? 0.2 : 0;
                        const total = totalBeforeDiscount * (1 - discount);
                        return new Intl.NumberFormat('vi-VN').format(total * 1000);
                      })()}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-mono text-xs font-medium text-gray-900 bg-yellow-100 px-2 py-1 rounded">
                      VSTEP {Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (!showQR) {
                setShowQR(true);
              } else {
                alert('Thanh toán thành công! Gói học đã được cập nhật.');
                onClose();
              }
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            {showQR ? 'Xác nhận thanh toán' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}