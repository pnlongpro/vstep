import { X, Building2, CreditCard, Copy, Check, Download, BookOpen } from 'lucide-react';
import { useState, useRef } from 'react';

interface Course {
  id: number;
  title: string;
  price: string;
}

interface BankTransferQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Bank Config (trong thực tế sẽ lấy từ Settings)
const BANK_CONFIG = {
  bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
  accountNumber: '1234567890',
  accountName: 'CONG TY TNHH VSTEPRO',
  branch: 'Chi nhánh Hà Nội',
};

// Mock Courses
const COURSES: Course[] = [
  { id: 1, title: '📚 VSTEP Foundation', price: '2,000,000đ' },
  { id: 2, title: '🎯 VSTEP Complete', price: '1,500,000đ' },
  { id: 3, title: '🏆 VSTEP Master', price: '3,500,000đ' },
  { id: 4, title: '🚀 VSTEP Intensive', price: '1,200,000đ' },
  { id: 5, title: '💼 VSTEP Business', price: '2,500,000đ' },
  { id: 6, title: '🎓 VSTEP Academic', price: '2,200,000đ' },
  { id: 7, title: '⚡ VSTEP Sprint', price: '800,000đ' },
  { id: 8, title: '🌟 VSTEP Excellence', price: '2,800,000đ' },
  { id: 9, title: '🔥 VSTEP Pro', price: '2,600,000đ' },
  { id: 10, title: '💎 VSTEP Premium', price: '3,000,000đ' },
];

export function BankTransferQRModal({ isOpen, onClose }: BankTransferQRModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Parse price to number (remove commas and đ)
  const priceNumber = selectedCourse ? parseInt(selectedCourse.price.replace(/[^\d]/g, '')) : 0;
  
  // Generate transfer content
  const transferContent = selectedCourse ? `VSTEPRO ${selectedCourse.title} HV${String(selectedCourse.id).padStart(4, '0')}` : '';
  
  // Generate VietQR link
  const qrCodeUrl = selectedCourse 
    ? `https://img.vietqr.io/image/${BANK_CONFIG.accountNumber}-${BANK_CONFIG.accountNumber.slice(-4)}-compact2.jpg?amount=${priceNumber}&addInfo=${encodeURIComponent(transferContent)}`
    : '';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl || !selectedCourse) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-${selectedCourse.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl mb-1 flex items-center gap-2">
                <CreditCard className="size-6 text-red-600" />
                Thanh toán chuyển khoản
              </h3>
              <p className="text-sm text-gray-600">Chọn khóa học và quét mã QR để thanh toán nhanh chóng</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Course Selection */}
          <div className="mb-6">
            <label className="block text-sm mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-blue-600" />
              Chọn khóa học để thanh toán
            </label>
            <select
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const course = COURSES.find(c => c.id === parseInt(e.target.value));
                setSelectedCourse(course || null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn khóa học --</option>
              {COURSES.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title} - {course.price}
                </option>
              ))}
            </select>
          </div>

          {!selectedCourse ? (
            <div className="text-center py-12">
              <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Vui lòng chọn khóa học để hiển thị thông tin thanh toán</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div 
                  ref={qrRef}
                  className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-lg"
                >
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      // Fallback if QR generation fails
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="size-4" />
                  Tải mã QR
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Sử dụng app ngân hàng quét mã QR
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Thông tin thanh toán sẽ tự động điền
                  </p>
                </div>
              </div>

              {/* Right: Transfer Info */}
              <div className="space-y-4">
                {/* Course Info */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Khóa học</p>
                  <p className="text-sm mb-2">{selectedCourse.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Học phí:</span>
                    <span className="text-xl text-red-600">{selectedCourse.price}</span>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <Building2 className="size-5 text-red-600" />
                    <span>Thông tin chuyển khoản</span>
                  </div>

                  {/* Bank Name */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Ngân hàng</p>
                    <p className="text-sm">{BANK_CONFIG.bankName}</p>
                  </div>

                  {/* Account Number */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số tài khoản</p>
                        <p className="text-sm">{BANK_CONFIG.accountNumber}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(BANK_CONFIG.accountNumber, 'account')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Sao chép"
                      >
                        {copied === 'account' ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Chủ tài khoản</p>
                        <p className="text-sm">{BANK_CONFIG.accountName}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(BANK_CONFIG.accountName, 'name')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Sao chép"
                      >
                        {copied === 'name' ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Transfer Amount */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số tiền</p>
                        <p className="text-sm">{selectedCourse.price}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(priceNumber.toString(), 'amount')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Sao chép"
                      >
                        {copied === 'amount' ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Transfer Content */}
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-yellow-700 mb-1">Nội dung chuyển khoản</p>
                        <p className="text-sm break-all">{transferContent}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(transferContent, 'content')}
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors ml-2"
                        title="Sao chép"
                      >
                        {copied === 'content' ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4 text-yellow-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm mb-2">📝 Lưu ý quan trọng:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• Vui lòng nhập <strong>CHÍNH XÁC</strong> nội dung chuyển khoản để hệ thống tự động xác nhận</li>
              <li>• Học phí sẽ được kích hoạt tự động sau 5-10 phút kể từ khi chuyển khoản thành công</li>
              <li>• Nếu sau 30 phút chưa được kích hoạt, vui lòng liên hệ hotline: <strong>1900-xxxx</strong></li>
              <li>• Lưu lại mã QR hoặc ảnh chụp màn hình để đối chiếu nếu cần</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Mã giao dịch: <span className="font-mono">TXN{Date.now()}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}