import { Crown, CheckCircle, Trophy, Shield, Award } from 'lucide-react';

interface PremiumModalProps {
  showPremiumModal: boolean;
  showPaymentInfo: boolean;
  selectedPlan: '1month' | '3months' | '6months' | '1year';
  planType: 'premium' | 'pro';
  voucherCode: string;
  userEmail: string;
  onClose: () => void;
  onSelectPlan: (plan: '1month' | '3months' | '6months' | '1year') => void;
  onSelectPlanType: (type: 'premium' | 'pro') => void;
  onVoucherChange: (code: string) => void;
  onApplyVoucher: () => void;
  onConfirmUpgrade: () => void;
  onBackToPlanSelection: () => void;
}

const premiumPricingData = {
  '1month': { price: 299000, label: '1 Tháng', discount: 0 },
  '3months': { price: 799000, label: '3 Tháng', discount: 10 },
  '6months': { price: 1499000, label: '6 Tháng', discount: 16 },
  '1year': { price: 2699000, label: '1 Năm', discount: 25 }
};

const proPricingData = {
  '1month': { price: 399000, label: '1 Tháng', discount: 0 },
  '3months': { price: 1099000, label: '3 Tháng', discount: 8 },
  '6months': { price: 1999000, label: '6 Tháng', discount: 16 },
  '1year': { price: 3599000, label: '1 Năm', discount: 25 }
};

export function PremiumModal({
  showPremiumModal,
  showPaymentInfo,
  selectedPlan,
  planType,
  voucherCode,
  userEmail,
  onClose,
  onSelectPlan,
  onSelectPlanType,
  onVoucherChange,
  onApplyVoucher,
  onConfirmUpgrade,
  onBackToPlanSelection
}: PremiumModalProps) {
  if (!showPremiumModal) return null;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const pricingData = planType === 'premium' ? premiumPricingData : proPricingData;
  const planLabel = planType === 'premium' ? 'Premium' : 'Pro';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Gradient */}
        <div className={`bg-gradient-to-r ${planType === 'premium' ? 'from-orange-500 to-red-500' : 'from-purple-600 to-indigo-600'} p-8 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              {planType === 'premium' ? <Crown className="size-10" /> : <Award className="size-10" />}
            </div>
            <h3 className="text-3xl font-bold mb-2">
              {!showPaymentInfo ? `Nâng cấp lên ${planLabel}` : 'Thông tin thanh toán'}
            </h3>
            <p className="text-white/90 text-lg">
              {!showPaymentInfo ? 'Chọn gói phù hợp với bạn' : 'Hoàn tất đơn hàng của bạn'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {!showPaymentInfo ? (
            <>
              {/* SCREEN 1: Plan Selection */}
              
              {/* Plan Type Tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => onSelectPlanType('premium')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    planType === 'premium'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Crown className="size-5" />
                  Premium
                  {planType === 'premium' && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">✓</span>}
                </button>
                <button
                  onClick={() => onSelectPlanType('pro')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    planType === 'pro'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Award className="size-5" />
                  Pro
                  {planType === 'pro' && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">✓</span>}
                </button>
              </div>

              {/* Plan Selection Cards with Pricing */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(pricingData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => onSelectPlan(key as any)}
                    className={`w-full p-4 rounded-xl font-bold transition-all relative overflow-hidden ${
                      selectedPlan === key
                        ? planType === 'premium' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl scale-[1.02]'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl scale-[1.02]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-lg">{data.label}</span>
                        {data.discount > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedPlan === key ? 'bg-white/20' : planType === 'premium' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            -{data.discount}%
                          </span>
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${selectedPlan === key ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(data.price * (1 - data.discount / 100))}
                      </p>
                      {data.discount > 0 && (
                        <p className={`text-sm line-through ${selectedPlan === key ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatCurrency(data.price)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Voucher Code Input */}
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => onVoucherChange(e.target.value)}
                  placeholder="Nhập mã voucher (nếu có)"
                  className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={onApplyVoucher}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap"
                >
                  Áp dụng
                </button>
              </div>

              {/* Features - Dynamic based on Plan Type */}
              <div className={`bg-gradient-to-br border rounded-xl p-6 mb-6 ${
                planType === 'premium' 
                  ? 'from-orange-50 to-red-50 border-orange-200' 
                  : 'from-purple-50 to-indigo-50 border-purple-200'
              }`}>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {planType === 'premium' ? <Crown className="size-5 text-orange-600" /> : <Award className="size-5 text-purple-600" />}
                  Đặc quyền {planLabel}:
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`} />
                    <div>
                      <p className="font-semibold text-gray-900">Không giới hạn</p>
                      <p className="text-sm text-gray-600">AI Speaking & Writing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`} />
                    <div>
                      <p className="font-semibold text-gray-900">1000+ đề thi</p>
                      <p className="text-sm text-gray-600">Mock Test đầy đủ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`} />
                    <div>
                      <p className="font-semibold text-gray-900">AI Feedback</p>
                      <p className="text-sm text-gray-600">Chi tiết từng câu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`} />
                    <div>
                      <p className="font-semibold text-gray-900">{planType === 'premium' ? 'Hỗ trợ 24/7' : '1-on-1 Coaching'}</p>
                      <p className="text-sm text-gray-600">{planType === 'premium' ? 'Tư vấn miễn phí' : 'Với giáo viên'}</p>
                    </div>
                  </div>
                  {planType === 'pro' && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Lộ trình AI</p>
                          <p className="text-sm text-gray-600">Cá nhân hóa</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Chứng nhận</p>
                          <p className="text-sm text-gray-600">Hoàn thành khóa học</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirmUpgrade}
                  className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all ${
                    planType === 'premium' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }`}
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </>
          ) : (
            <>
              {/* SCREEN 2: Payment Info */}
              
              {/* Order Summary */}
              <div className={`bg-gradient-to-br border-2 rounded-2xl p-6 mb-6 ${
                planType === 'premium' 
                  ? 'from-orange-50 to-red-50 border-orange-200' 
                  : 'from-purple-50 to-indigo-50 border-purple-200'
              }`}>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className={`size-5 ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`} />
                  Đơn hàng của bạn:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Gói {planLabel} {pricingData[selectedPlan].label}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(pricingData[selectedPlan].price)}</span>
                  </div>
                  {pricingData[selectedPlan].discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Giảm giá gói {pricingData[selectedPlan].label}</span>
                      <span className="font-bold text-red-600">-{pricingData[selectedPlan].discount}%</span>
                    </div>
                  )}
                  {voucherCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Mã voucher: {voucherCode}</span>
                      <span className="font-bold text-green-600">Đã áp dụng ✓</span>
                    </div>
                  )}
                  <div className={`pt-3 border-t-2 flex items-center justify-between ${
                    planType === 'premium' ? 'border-orange-300' : 'border-purple-300'
                  }`}>
                    <span className="font-bold text-lg text-gray-900">Tổng thanh toán:</span>
                    <span className={`font-bold text-2xl ${planType === 'premium' ? 'text-orange-600' : 'text-purple-600'}`}>
                      {formatCurrency(pricingData[selectedPlan].price * (1 - pricingData[selectedPlan].discount / 100))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Info */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="size-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Thông tin chuyển khoản:
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Bank Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Ngân hàng:</p>
                      <p className="font-bold text-gray-900 text-lg">MB Bank (Quân Đội)</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Số tài khoản:</p>
                      <p className="font-bold text-gray-900 text-lg">0123456789</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Chủ tài khoản:</p>
                      <p className="font-bold text-gray-900 text-lg">NGUYEN VAN A</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Nội dung chuyển khoản:</p>
                      <p className="font-bold text-blue-700 text-sm break-all">
                        PREMIUM {userEmail.split('@')[0].toUpperCase()} {selectedPlan.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right: QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-lg">
                      <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <svg className="size-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                          <p className="text-sm text-gray-500">QR Code</p>
                          <p className="text-xs text-gray-400 mt-1">Quét để thanh toán</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center max-w-xs">
                      Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản nhanh chóng
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Lưu ý quan trọng:</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Vui lòng chuyển khoản ĐÚNG nội dung để hệ thống tự động kích hoạt</li>
                      <li>• Tài khoản sẽ được nâng cấp trong vòng 5-10 phút sau khi chuyển khoản</li>
                      <li>• Nếu sau 15 phút chưa được kích hoạt, vui lòng liên hệ hỗ trợ</li>
                      <li>• Liên hệ: support@vstepro.com hoặc Hotline: 1900 1234</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onBackToPlanSelection}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Đã chuyển khoản ✓
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                💡 Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận và kích hoạt tài khoản Premium
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}