import { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { HEADINGS, SPACING } from '../../constants/layout';

interface ForgotPasswordPageProps {
  onSubmit: (email: string) => void;
  onNavigateToLogin: () => void;
  onBack?: () => void;
}

export function ForgotPasswordPage({ onSubmit, onNavigateToLogin, onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      try {
        // Save reset request to localStorage
        localStorage.setItem('vstep_password_reset_email', email);
        localStorage.setItem('vstep_password_reset_time', new Date().toISOString());
        
        setIsSuccess(true);
        onSubmit(email);
      } catch (error) {
        setErrors({ general: 'Không thể gửi email. Vui lòng thử lại.' });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    setIsSuccess(false);
    setEmail('');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h1 className={HEADINGS.PAGE_TITLE + " mb-2"}>Email đã được gửi!</h1>
              <p className="text-gray-600">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email:
              </p>
              <p className="text-blue-600 mt-2">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm mb-2 text-blue-900">Các bước tiếp theo:</h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Kiểm tra hộp thư đến của bạn</li>
                <li>Mở email từ VSTEPRO</li>
                <li>Nhấp vào liên kết đặt lại mật khẩu</li>
                <li>Tạo mật khẩu mới</li>
              </ol>
            </div>

            {/* Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Email có thể mất vài phút để đến. Hãy kiểm tra cả thư mục spam nếu bạn không thấy email.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleResend}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="size-5" />
                <span>Gửi lại email</span>
              </button>
              
              <button
                onClick={onNavigateToLogin}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 VSTEPRO. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>
        )}

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
              <Mail className="size-8 text-white" />
            </div>
            <h1 className={HEADINGS.PAGE_TITLE + " mb-2"}>Quên mật khẩu?</h1>
            <p className="text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={SPACING.FORM_GAP}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email đăng ký
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="email@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Gửi hướng dẫn</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-3">
            <button
              onClick={onNavigateToLogin}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Quay lại đăng nhập
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => {
                    // Navigate to register - will be handled in parent
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm mb-2 text-orange-900">💡 Mẹo bảo mật:</h3>
            <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
              <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
              <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              <li>Không sử dụng lại mật khẩu cũ</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 VSTEPRO. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
