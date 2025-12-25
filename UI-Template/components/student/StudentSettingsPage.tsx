import { useState } from 'react';
import { Settings, User, Bell, Lock, Eye, EyeOff, Save, CreditCard, Calendar, TrendingUp, Check, Crown, Zap, ArrowRight, Package, Sparkles } from 'lucide-react';
import { PackageUpgradeModal } from '../PackageUpgradeModal';

export function StudentSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'notifications' | 'security'>('profile');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [currentProductType, setCurrentProductType] = useState<'plan' | 'course'>('course'); // Mock: currently on course

  const tabs = [
    { id: 'profile' as const, label: 'Thông tin cá nhân', icon: User },
    { id: 'subscription' as const, label: 'Gói học & Gia hạn', icon: CreditCard },
    { id: 'notifications' as const, label: 'Thông báo', icon: Bell },
    { id: 'security' as const, label: 'Bảo mật', icon: Lock }
  ];

  // Current subscription - Pick from 10 courses
  const currentSubscription = {
    course: '📚 VSTEP Complete',
    level: 'Khóa 12',
    startDate: '01/09/2024',
    endDate: '01/03/2025',
    daysLeft: 73,
    status: 'active',
    progress: 60,
    totalSessions: 40,
    completedSessions: 24,
    price: '4.500.000 VNĐ'
  };

  // All 10 courses for upgrade
  const allCourses = [
    { 
      id: 1, 
      name: '📚 VSTEP Complete', 
      description: 'Khóa học toàn diện từ A2 đến C1',
      duration: '6 tháng',
      sessions: 40,
      price: '4.500.000 VNĐ',
      features: ['4 kỹ năng hoàn chỉnh', 'Chấm AI unlimited', 'Lộ trình cá nhân', 'Support 24/7'],
      popular: true
    },
    { 
      id: 2, 
      name: '🎯 VSTEP Foundation', 
      description: 'Nền tảng vững chắc cho người mới',
      duration: '4 tháng',
      sessions: 30,
      price: '3.000.000 VNĐ',
      features: ['Bài giảng chi tiết', 'Thực hành cơ bản', 'Chấm AI cơ bản', 'Hỗ trợ trong giờ']
    },
    { 
      id: 3, 
      name: '🚀 VSTEP Starter', 
      description: 'Khởi đầu với VSTEP hiệu quả',
      duration: '3 tháng',
      sessions: 25,
      price: '2.500.000 VNĐ',
      features: ['Kiến thức nền tảng', '100+ bài tập', 'Chấm tự động', 'Email support']
    },
    { 
      id: 4, 
      name: '🏗️ VSTEP Builder', 
      description: 'Xây dựng kỹ năng vững vàng',
      duration: '5 tháng',
      sessions: 35,
      price: '3.800.000 VNĐ',
      features: ['Luyện tập chuyên sâu', 'Mock test hàng tuần', 'Feedback chi tiết', 'Group study']
    },
    { 
      id: 5, 
      name: '💻 VSTEP Developer', 
      description: 'Phát triển kỹ năng nâng cao',
      duration: '4 tháng',
      sessions: 30,
      price: '3.500.000 VNĐ',
      features: ['Kỹ thuật nâng cao', 'Strategy training', 'AI feedback', '1-on-1 session']
    },
    { 
      id: 6, 
      name: '⚡ VSTEP Booster', 
      description: 'Tăng tốc điểm số nhanh chóng',
      duration: '4 tuần',
      sessions: 28,
      price: '3.200.000 VNĐ',
      features: ['Intensive training', 'Daily practice', 'Quick review', 'Score guarantee']
    },
    { 
      id: 7, 
      name: '🔥 VSTEP Intensive', 
      description: 'Học tập chuyên sâu & đột phá',
      duration: '6 tuần',
      sessions: 45,
      price: '4.000.000 VNĐ',
      features: ['Marathon training', '3x practice/week', 'Premium feedback', 'Priority support']
    },
    { 
      id: 8, 
      name: '📝 VSTEP Practice', 
      description: 'Luyện đề & thực hành liên tục',
      duration: '2 tháng',
      sessions: 20,
      price: '2.000.000 VNĐ',
      features: ['500+ exercises', 'Mock tests', 'Auto grading', 'Progress tracking']
    },
    { 
      id: 9, 
      name: '👑 VSTEP Premium', 
      description: 'Gói học cao cấp & VIP',
      duration: '8 tháng',
      sessions: 50,
      price: '6.500.000 VNĐ',
      features: ['All-in-one package', 'Private tutor', 'Unlimited AI', 'Lifetime access'],
      premium: true
    },
    { 
      id: 10, 
      name: '🏆 VSTEP Master', 
      description: 'Đạt trình độ Master & C1',
      duration: '10 tháng',
      sessions: 60,
      price: '7.500.000 VNĐ',
      features: ['Master program', 'Expert coaching', 'Certification prep', 'Job ready'],
      premium: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Hồ sơ & Cài đặt</h2>
        <p className="text-blue-100">Quản lý thông tin cá nhân và gói học của bạn</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap gap-2 p-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Package Info Card - NEW */}
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="size-8 text-purple-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">💳 Gói học của bạn</h3>
                        <p className="text-sm text-gray-600">
                          {currentProductType === 'plan' ? '🎯 Gói tự học Premium' : '📚 Khóa học VSTEP Complete'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Hết hạn</p>
                        <p className="font-medium text-gray-900">01/03/2025</p>
                        <p className="text-xs text-orange-600 mt-1">Còn 73 ngày</p>
                      </div>
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Giá trị</p>
                        <p className="font-medium text-gray-900">
                          {currentProductType === 'plan' ? '299.000đ/tháng' : '4.500.000đ'}
                        </p>
                        <p className="text-xs text-green-600 mt-1">Tiết kiệm 20%</p>
                      </div>
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          <p className="font-medium text-green-700">Hoạt động</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium whitespace-nowrap"
                    >
                      <Package className="size-5" />
                      Gia hạn / Nâng cấp
                    </button>
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                  👨‍🎓
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ảnh đại diện</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Thay đổi ảnh
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    defaultValue="Nguyễn Văn Học Viên"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue="student@vstepro.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Số điện thoại</label>
                  <input
                    type="tel"
                    defaultValue="0987654321"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ngày sinh</label>
                  <input
                    type="date"
                    defaultValue="2000-01-01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mục tiêu học tập</label>
                <textarea
                  rows={4}
                  defaultValue="Đạt điểm VSTEP B2 trong 6 tháng để tốt nghiệp đại học"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-8">
              {/* Current Subscription */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="size-6 text-blue-600" />
                  Gói học hiện tại
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-bold text-gray-900">{currentSubscription.course}</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                          Đang hoạt động
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{currentSubscription.level}</p>
                      <p className="text-sm text-gray-500">
                        Bắt đầu: {currentSubscription.startDate} • Kết thúc: {currentSubscription.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                      <p className="text-3xl font-bold text-blue-600">{currentSubscription.daysLeft}</p>
                      <p className="text-sm text-gray-600">ngày</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                      <span className="text-sm font-bold text-blue-600">{currentSubscription.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${currentSubscription.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {currentSubscription.completedSessions}/{currentSubscription.totalSessions} buổi học hoàn thành
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowPackageModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Calendar className="size-5" />
                      Gia hạn gói học
                    </button>
                    <button 
                      onClick={() => setShowPackageModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                    >
                      <TrendingUp className="size-5" />
                      Nâng cấp gói cao hơn
                    </button>
                  </div>
                </div>
              </div>

              {/* Upgrade Options */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Crown className="size-7 text-yellow-500" />
                  🎓 10 Khóa học VSTEP - Chọn gói phù hợp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`relative bg-white border-2 rounded-xl p-5 hover:shadow-lg transition-all ${
                        course.premium 
                          ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' 
                          : course.popular 
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Badge */}
                      {(course.premium || course.popular) && (
                        <div className="absolute -top-3 -right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                            course.premium 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          }`}>
                            {course.premium ? '👑 VIP' : '🔥 Phổ biến'}
                          </span>
                        </div>
                      )}

                      <h4 className="text-xl font-bold mb-2">{course.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="size-4 text-blue-500" />
                          <span>{course.duration} • {course.sessions} buổi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {course.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        course.premium || course.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        Chọn gói này
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="size-6 text-gray-600" />
                  Lịch sử giao dịch
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ngày</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Gói học</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">01/09/2024</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">📚 VSTEP Complete - Khóa 12</td>
                        <td className="px-6 py-4 text-sm text-gray-900">4.500.000 VNĐ</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Thành công
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">01/03/2024</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">🎯 VSTEP Foundation - Khóa 07</td>
                        <td className="px-6 py-4 text-sm text-gray-900">3.000.000 VNĐ</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Email thông báo</h3>
                <div className="space-y-3">
                  {[
                    { id: 'new-assignment', label: 'Bài tập mới', description: 'Nhận email khi có bài tập mới được giao' },
                    { id: 'deadline-reminder', label: 'Nhắc nhở deadline', description: 'Nhắc nhở trước hạn nộp bài 24h' },
                    { id: 'grade-update', label: 'Cập nhật điểm', description: 'Nhận email khi có điểm bài thi mới' },
                    { id: 'class-announcement', label: 'Thông báo lớp học', description: 'Thông báo quan trọng từ giáo viên' },
                    { id: 'weekly-progress', label: 'Báo cáo tiến độ', description: 'Báo cáo tiến độ học tập hàng tuần' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Push notifications</h3>
                <div className="space-y-3">
                  {[
                    { id: 'push-assignment', label: 'Bài tập mới', description: 'Thông báo ngay trên trình duyệt' },
                    { id: 'push-message', label: 'Tin nhắn mới', description: 'Thông báo tin nhắn từ giáo viên' },
                    { id: 'push-reminder', label: 'Nhắc nhở học tập', description: 'Nhắc nhở lịch học và deadline' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Mật khẩu mới</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Xác thực hai yếu tố</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-w-xl">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="two-factor"
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor="two-factor" className="text-sm font-medium cursor-pointer block mb-1">
                        Bật xác thực hai yếu tố
                      </label>
                      <p className="text-xs text-gray-600">
                        Thêm một lớp bảo mật cho tài khoản của bạn
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Phiên đăng nhập</h3>
                <div className="space-y-3 max-w-xl">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1">Windows - Chrome</p>
                      <p className="text-xs text-gray-600">Địa chỉ IP: 192.168.1.10 • Đang hoạt động</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">Hiện tại</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1">Android - Chrome</p>
                      <p className="text-xs text-gray-600">Địa chỉ IP: 192.168.1.20 • 1 giờ trước</p>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700 font-medium">Đăng xuất</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Upgrade Modal */}
      <PackageUpgradeModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        currentProductType={currentProductType}
      />
    </div>
  );
}