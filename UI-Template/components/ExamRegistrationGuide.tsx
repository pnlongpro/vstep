import { ArrowLeft, FileText, Globe, CreditCard, CheckCircle, AlertCircle, Calendar, MapPin, Clock, User, Mail, Phone, IdCard, Camera, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ExamRegistrationGuideProps {
  onBack: () => void;
}

export function ExamRegistrationGuide({ onBack }: ExamRegistrationGuideProps) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Chuẩn bị hồ sơ',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Chuẩn bị đầy đủ giấy tờ và thông tin cần thiết',
    },
    {
      id: 2,
      title: 'Đăng kí online',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      description: 'Đăng kí thi qua hệ thống trực tuyến',
    },
    {
      id: 3,
      title: 'Thanh toán lệ phí',
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      description: 'Nộp lệ phí thi và hoàn tất đăng kí',
    },
    {
      id: 4,
      title: 'Nhận giấy báo thi',
      icon: CheckCircle,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      description: 'Nhận và kiểm tra thông tin giấy báo thi',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 md:p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl md:text-4xl mb-3">📋 Hướng dẫn đăng kí thi VSTEP</h1>
          <p className="text-lg text-white/90">Quy trình đăng kí thi chi tiết từ A đến Z</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Step Navigation */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl mb-6">Các bước đăng kí thi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? `${step.borderColor} ${step.bgColor} shadow-lg scale-105`
                      : isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? `bg-gradient-to-r ${step.color} text-white`
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="size-5" /> : index + 1}
                    </div>
                    <Icon
                      className={`size-6 ${
                        isActive ? step.textColor : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  {/* Step Title */}
                  <h3
                    className={`mb-1 ${
                      isActive ? step.textColor : isCompleted ? 'text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500">{step.description}</p>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-b-xl`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {activeStep === 1 && (
          <div className="space-y-6">
            {/* Step 1: Chuẩn bị hồ sơ */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <FileText className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl">Bước 1: Chuẩn bị hồ sơ</h2>
                  <p className="text-gray-600">Chuẩn bị đầy đủ các giấy tờ sau</p>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <IdCard className="size-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg text-blue-900 mb-2">1. Giấy tờ tùy thân</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>CMND/CCCD gốc</strong> còn hiệu lực (hoặc Hộ chiếu đối với người nước ngoài)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Bản sao công chứng</strong> CMND/CCCD (số lượng: 1 bản)</span>
                        </li>
                      </ul>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Giấy tờ phải còn hạn, không bị rách, nhòe. Họ tên trên giấy tờ phải khớp với thông tin đăng kí.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Camera className="size-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg text-purple-900 mb-2">2. Ảnh thẻ</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Kích thước:</strong> 3x4 cm hoặc 4x6 cm</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Nền:</strong> Màu trắng hoặc xanh nhạt</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Chụp:</strong> Trong vòng 6 tháng gần nhất</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Số lượng:</strong> 2 ảnh (file điện tử + in ra)</span>
                        </li>
                      </ul>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Không đội mũ, kính râm. Trang phục lịch sự. File ảnh điện tử không quá 500KB, định dạng JPG/PNG.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <User className="size-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg text-emerald-900 mb-2">3. Thông tin cá nhân cần có</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700"><strong>Họ và tên</strong></p>
                            <p className="text-sm text-gray-600">Theo CMND/CCCD (không dấu)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700"><strong>Ngày sinh</strong></p>
                            <p className="text-sm text-gray-600">DD/MM/YYYY</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700"><strong>Email</strong></p>
                            <p className="text-sm text-gray-600">Email thường xuyên sử dụng</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700"><strong>Số điện thoại</strong></p>
                            <p className="text-sm text-gray-600">Liên lạc được</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Step Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Tiếp tục: Đăng kí online
                  <ArrowLeft className="size-5 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            {/* Step 2: Đăng kí online */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <Globe className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl">Bước 2: Đăng kí online</h2>
                  <p className="text-gray-600">Thực hiện đăng kí qua hệ thống trực tuyến</p>
                </div>
              </div>

              {/* Registration Steps */}
              <div className="space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Truy cập trang đăng kí
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">Truy cập một trong các website sau để đăng kí thi VSTEP:</p>
                    <div className="space-y-2">
                      <a
                        href="https://vstep.hcmussh.edu.vn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <ExternalLink className="size-5 text-purple-600" />
                        <div>
                          <p className="text-purple-700 font-medium">ĐHKHXH&NV TP.HCM</p>
                          <p className="text-sm text-gray-600">vstep.hcmussh.edu.vn</p>
                        </div>
                      </a>
                      <a
                        href="https://vstep.vnu.edu.vn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <ExternalLink className="size-5 text-purple-600" />
                        <div>
                          <p className="text-purple-700 font-medium">ĐHQG Hà Nội</p>
                          <p className="text-sm text-gray-600">vstep.vnu.edu.vn</p>
                        </div>
                      </a>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          <strong>Lưu ý:</strong> Mỗi trường/trung tâm có website riêng. Kiểm tra kỹ địa chỉ website của đơn vị tổ chức thi bạn đăng kí.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Tạo tài khoản hoặc đăng nhập
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Nếu <strong>chưa có tài khoản</strong>: Click "Đăng kí" và điền đầy đủ thông tin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Nếu <strong>đã có tài khoản</strong>: Đăng nhập bằng email/số điện thoại và mật khẩu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Kiểm tra email để <strong>xác thực tài khoản</strong> (nếu là lần đầu đăng kí)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Chọn kỳ thi và địa điểm
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 mb-1"><strong>Chọn kỳ thi</strong></p>
                        <p className="text-sm text-gray-600">Lựa chọn ngày thi phù hợp (thường mở đăng kí trước 30-45 ngày)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 mb-1"><strong>Chọn địa điểm thi</strong></p>
                        <p className="text-sm text-gray-600">Chọn phòng thi gần nhà (nếu có nhiều lựa chọn)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 mb-1"><strong>Chọn ca thi</strong></p>
                        <p className="text-sm text-gray-600">Sáng (7h-12h) hoặc Chiều (13h-18h)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                    Điền thông tin và upload tài liệu
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Điền đầy đủ <strong>thông tin cá nhân</strong> (họ tên, ngày sinh, CMND/CCCD)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Upload <strong>ảnh thẻ</strong> (file JPG/PNG, không quá 500KB)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Upload <strong>bản sao CMND/CCCD</strong> (nếu yêu cầu)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Kiểm tra kỹ thông tin trước khi bấm <strong>"Xác nhận"</strong></span>
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">
                        <strong>Quan trọng:</strong> Thông tin sau khi xác nhận sẽ không thể sửa đổi. Kiểm tra kỹ họ tên, ngày sinh, số CMND/CCCD.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="size-5" />
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Tiếp tục: Thanh toán
                  <ArrowLeft className="size-5 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            {/* Step 3: Thanh toán */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <CreditCard className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl">Bước 3: Thanh toán lệ phí thi</h2>
                  <p className="text-gray-600">Nộp lệ phí để hoàn tất đăng kí</p>
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg text-emerald-900 mb-4">Mức lệ phí thi VSTEP</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Lệ phí thi chuẩn</span>
                    <span className="text-xl text-emerald-600"><strong>500.000 - 700.000 VNĐ</strong></span>
                  </div>
                  <p className="text-sm text-gray-600">
                    * Lệ phí có thể khác nhau tùy từng trường/trung tâm tổ chức thi. Kiểm tra chính xác trên website đăng kí.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg mb-4">Phương thức thanh toán</h3>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h4 className="text-purple-900 mb-3 flex items-center gap-2">
                    <CreditCard className="size-5 text-purple-600" />
                    <strong>1. Thanh toán online (Khuyến khích)</strong>
                  </h4>
                  <ul className="space-y-2 text-gray-700 ml-7">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Thẻ ATM nội địa:</strong> Qua cổng thanh toán VNPay, OnePay, MoMo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Thẻ Visa/Master:</strong> Thanh toán quốc tế</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Ví điện tử:</strong> MoMo, ZaloPay, ViettelPay</span>
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Ưu điểm:</strong> Nhanh chóng, tự động xác nhận sau khi thanh toán thành công, nhận giấy báo thi qua email.
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h4 className="text-blue-900 mb-3 flex items-center gap-2">
                    <MapPin className="size-5 text-blue-600" />
                    <strong>2. Thanh toán trực tiếp</strong>
                  </h4>
                  <ul className="space-y-2 text-gray-700 ml-7">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Nộp tiền mặt tại <strong>văn phòng đơn vị tổ chức thi</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Mang theo <strong>CMND/CCCD gốc</strong> và <strong>mã đăng kí</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Giờ làm việc: <strong>8h-11h30, 13h30-17h</strong> (Thứ 2 - Thứ 6)</span>
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Lưu ý:</strong> Phải hoàn tất thanh toán trong vòng 3-5 ngày kể từ khi đăng kí, nếu không hồ sơ sẽ bị hủy tự động.
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h4 className="text-indigo-900 mb-3 flex items-center gap-2">
                    <Download className="size-5 text-indigo-600" />
                    <strong>3. Chuyển khoản ngân hàng</strong>
                  </h4>
                  <ul className="space-y-2 text-gray-700 ml-7">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>Chuyển khoản vào <strong>số tài khoản</strong> của đơn vị tổ chức (xem trên website)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>Nội dung chuyển khoản: <strong>"Họ tên - Mã đăng kí - VSTEP"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>Chụp ảnh biên lai và <strong>gửi qua email</strong> xác nhận</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* After Payment */}
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h3 className="text-lg text-blue-900 mb-3">Sau khi thanh toán</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Hệ thống sẽ <strong>gửi email xác nhận</strong> thanh toán thành công</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra lại <strong>trạng thái đăng kí</strong> trên hệ thống (Đã thanh toán)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Lưu lại <strong>biên lai/mã giao dịch</strong> để tra cứu khi cần</span>
                  </li>
                </ul>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="size-5" />
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Tiếp tục: Nhận giấy báo thi
                  <ArrowLeft className="size-5 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            {/* Step 4: Nhận giấy báo thi */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                  <CheckCircle className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl">Bước 4: Nhận giấy báo thi</h2>
                  <p className="text-gray-600">Kiểm tra và chuẩn bị cho ngày thi</p>
                </div>
              </div>

              {/* Receive Confirmation */}
              <div className="space-y-4">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                  <h3 className="text-lg text-amber-900 mb-4">Thời gian nhận giấy báo thi</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Calendar className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Giấy báo thi sẽ được gửi qua email <strong>trước ngày thi 7-10 ngày</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Mail className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Kiểm tra cả hòm thư <strong>Spam/Junk Mail</strong> nếu không thấy email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Globe className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Có thể <strong>tải xuống giấy báo thi</strong> từ website đăng kí</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg mb-4">Thông tin trên giấy báo thi cần kiểm tra</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <User className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Họ và tên</strong></p>
                        <p className="text-sm text-gray-600">Phải khớp với CMND/CCCD</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <IdCard className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Số CMND/CCCD</strong></p>
                        <p className="text-sm text-gray-600">Kiểm tra từng chữ số</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Ngày thi</strong></p>
                        <p className="text-sm text-gray-600">Ghi nhớ ngày, tháng, năm</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Clock className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Giờ vào phòng thi</strong></p>
                        <p className="text-sm text-gray-600">Đến sớm 30 phút</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Địa điểm thi</strong></p>
                        <p className="text-sm text-gray-600">Số phòng, tòa nhà cụ thể</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <FileText className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Số báo danh</strong></p>
                        <p className="text-sm text-gray-600">Ghi nhớ hoặc chụp ảnh lại</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg text-red-900 mb-3">Nếu phát hiện sai sót</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Liên hệ <strong>ngay</strong> với đơn vị tổ chức qua email/hotline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Thời gian chỉnh sửa: Trước ngày thi ít nhất <strong>3 ngày làm việc</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Mang theo <strong>CMND/CCCD gốc và bản sao</strong> để làm căn cứ chỉnh sửa</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                  <h3 className="text-lg text-green-900 mb-4">Chuẩn bị cho ngày thi</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>In giấy báo thi</strong></p>
                        <p className="text-sm text-gray-600">In ra giấy A4, rõ nét (hoặc có thể dùng bản điện tử trên điện thoại)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Chuẩn bị giấy tờ</strong></p>
                        <p className="text-sm text-gray-600">CMND/CCCD gốc (không nhận bản photo), Giấy báo thi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Khảo sát địa điểm</strong></p>
                        <p className="text-sm text-gray-600">Tìm hiểu đường đi, phương tiện trước 1-2 ngày</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1"><strong>Đến sớm</strong></p>
                        <p className="text-sm text-gray-600">Có mặt trước giờ thi ít nhất 30 phút để làm thủ tục</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Message */}
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl mb-3">🎉 Hoàn tất đăng kí!</h3>
                <p className="text-white/90 mb-4">
                  Bạn đã hoàn thành toàn bộ quy trình đăng kí thi VSTEP. Hãy tập trung ôn luyện và chuẩn bị tốt nhất cho kỳ thi.
                </p>
                <p className="text-white/90">
                  <strong>Chúc bạn thi tốt và đạt kết quả cao! 🍀</strong>
                </p>
              </div>

              {/* Navigation Button */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="size-5" />
                  Quay lại
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle className="size-5" />
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
