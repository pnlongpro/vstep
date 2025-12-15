import { useState } from 'react';
import { 
  Bell, X, Filter, Search, Check, CheckCheck, Star, Pin, PinOff,
  GraduationCap, FileText, Award, Bot, BookOpen, Shield, CreditCard, 
  Settings, ArrowLeft, Download, Eye, Trash2, Clock, Calendar,
  ChevronDown, AlertCircle, Info, CheckCircle
} from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

type NotificationType = 
  | 'class_updates'
  | 'assignments' 
  | 'scores_results'
  | 'ai_assistant'
  | 'materials'
  | 'account_security'
  | 'billing'
  | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  isPinned: boolean;
  hasAttachment?: boolean;
  attachmentType?: 'pdf' | 'image' | 'video';
  attachmentName?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function Notifications({ onBack }: NotificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    // Class Updates
    {
      id: 1,
      type: 'class_updates',
      title: 'Lớp B2 Intensive - Lịch học tuần sau thay đổi',
      description: 'Lịch học thứ 3 chuyển sang thứ 5, 19:00-21:00. Vui lòng sắp xếp thời gian phù hợp.',
      time: '5 phút trước',
      isRead: false,
      isPinned: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'class_updates',
      title: 'Thông báo nghỉ lễ 30/4 - 1/5',
      description: 'Lớp học sẽ nghỉ từ 30/4 đến 1/5. Bài tập về nhà được giao qua hệ thống.',
      time: '2 giờ trước',
      isRead: false,
      isPinned: true,
      priority: 'high'
    },
    // Assignments
    {
      id: 3,
      type: 'assignments',
      title: 'Bài tập Writing Task 2 - Deadline 20/12',
      description: 'Essay về chủ đề "Education". Yêu cầu tối thiểu 250 từ. Nộp qua hệ thống trước 23:59.',
      time: '1 ngày trước',
      isRead: false,
      isPinned: false,
      hasAttachment: true,
      attachmentType: 'pdf',
      attachmentName: 'Writing_Task2_Instructions.pdf',
      priority: 'high'
    },
    {
      id: 4,
      type: 'assignments',
      title: 'Listening Practice Set 5 - Đã có đáp án',
      description: 'Giáo viên đã chấm và có nhận xét chi tiết. Xem kết quả trong mục Bài tập.',
      time: '2 ngày trước',
      isRead: true,
      isPinned: false,
      priority: 'medium'
    },
    // Scores & Results
    {
      id: 5,
      type: 'scores_results',
      title: 'Kết quả Mock Test #3 - Điểm 7.5/10',
      description: 'Bạn đã cải thiện 0.5 điểm so với lần trước! Reading: 8.0, Listening: 7.5, Writing: 7.0, Speaking: 7.5',
      time: '3 giờ trước',
      isRead: false,
      isPinned: true,
      priority: 'high'
    },
    {
      id: 6,
      type: 'scores_results',
      title: 'Speaking Part 2 đã được chấm',
      description: 'Pronunciation: 7.5, Fluency: 7.0, Vocabulary: 8.0, Grammar: 7.5. Xem feedback chi tiết.',
      time: '1 ngày trước',
      isRead: false,
      isPinned: false,
      priority: 'medium'
    },
    // AI Assistant
    {
      id: 7,
      type: 'ai_assistant',
      title: '🤖 Gợi ý luyện tập hôm nay',
      description: 'Dựa trên phân tích điểm yếu, AI đề xuất luyện "Listening Part 3" và "Writing Task 1".',
      time: 'Hôm nay',
      isRead: false,
      isPinned: false,
      priority: 'medium'
    },
    {
      id: 8,
      type: 'ai_assistant',
      title: '💡 Từ vựng Academic cần ôn tập',
      description: 'AI phát hiện bạn chưa thuộc 15 từ vựng quan trọng trong chủ đề Environment.',
      time: 'Hôm qua',
      isRead: true,
      isPinned: false,
      priority: 'low'
    },
    // Materials
    {
      id: 9,
      type: 'materials',
      title: 'Tài liệu mới: VSTEP B2 Complete Guide',
      description: 'Giáo viên vừa upload tài liệu tổng hợp toàn bộ kỹ năng cho kỳ thi VSTEP B2.',
      time: '4 giờ trước',
      isRead: false,
      isPinned: false,
      hasAttachment: true,
      attachmentType: 'pdf',
      attachmentName: 'VSTEP_B2_Complete_Guide.pdf',
      priority: 'medium'
    },
    {
      id: 10,
      type: 'materials',
      title: 'Video hướng dẫn: Speaking Strategies',
      description: 'Video 45 phút về chiến lược làm bài Speaking hiệu quả từ giáo viên.',
      time: '2 ngày trước',
      isRead: true,
      isPinned: false,
      hasAttachment: true,
      attachmentType: 'video',
      attachmentName: 'Speaking_Strategies.mp4',
      priority: 'low'
    },
    // Account & Security
    {
      id: 11,
      type: 'account_security',
      title: 'Đăng nhập từ thiết bị mới',
      description: 'Phát hiện đăng nhập từ Windows 11, Chrome tại TP.HCM lúc 14:30 hôm nay.',
      time: '6 giờ trước',
      isRead: true,
      isPinned: false,
      priority: 'high'
    },
    {
      id: 12,
      type: 'account_security',
      title: 'Nhắc nhở đổi mật khẩu',
      description: 'Để bảo mật tài khoản, bạn nên đổi mật khẩu định kỳ 3 tháng/lần.',
      time: '1 tuần trước',
      isRead: true,
      isPinned: false,
      priority: 'low'
    },
    // Billing
    {
      id: 13,
      type: 'billing',
      title: 'Gói Premium sắp hết hạn - 5 ngày nữa',
      description: 'Gói Premium của bạn sẽ hết hạn vào 25/12/2024. Gia hạn ngay để tiếp tục học!',
      time: 'Hôm qua',
      isRead: false,
      isPinned: true,
      priority: 'high'
    },
    {
      id: 14,
      type: 'billing',
      title: 'Hóa đơn tháng 12 đã được tạo',
      description: 'Hóa đơn 500,000 VNĐ cho gói Premium. Xem chi tiết trong mục Thanh toán.',
      time: '3 ngày trước',
      isRead: true,
      isPinned: false,
      hasAttachment: true,
      attachmentType: 'pdf',
      attachmentName: 'Invoice_Dec2024.pdf',
      priority: 'medium'
    },
    // System
    {
      id: 15,
      type: 'system',
      title: 'Bảo trì hệ thống - 22/12, 2:00-4:00 AM',
      description: 'Hệ thống sẽ tạm ngưng để nâng cấp. Vui lòng lưu bài làm trước khi bảo trì.',
      time: '5 giờ trước',
      isRead: false,
      isPinned: true,
      priority: 'high'
    },
    {
      id: 16,
      type: 'system',
      title: 'Cập nhật tính năng mới: AI Pronunciation Coach',
      description: 'Tính năng mới giúp sửa phát âm chi tiết theo từng âm tiết. Trải nghiệm ngay!',
      time: '1 tuần trước',
      isRead: true,
      isPinned: false,
      priority: 'medium'
    }
  ]);

  const notificationTypes = [
    { id: 'all', name: 'Tất cả', icon: Bell, color: 'text-gray-600' },
    { id: 'class_updates', name: 'Lớp học', icon: GraduationCap, color: 'text-blue-600' },
    { id: 'assignments', name: 'Bài tập', icon: FileText, color: 'text-purple-600' },
    { id: 'scores_results', name: 'Điểm số', icon: Award, color: 'text-yellow-600' },
    { id: 'ai_assistant', name: 'AI Assistant', icon: Bot, color: 'text-green-600' },
    { id: 'materials', name: 'Tài liệu', icon: BookOpen, color: 'text-orange-600' },
    { id: 'account_security', name: 'Bảo mật', icon: Shield, color: 'text-red-600' },
    { id: 'billing', name: 'Thanh toán', icon: CreditCard, color: 'text-indigo-600' },
    { id: 'system', name: 'Hệ thống', icon: Settings, color: 'text-gray-600' }
  ];

  const getNotificationIcon = (type: NotificationType) => {
    const typeConfig = notificationTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : Bell;
  };

  const getNotificationColor = (type: NotificationType) => {
    const typeConfig = notificationTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.color : 'text-gray-600';
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="size-4 text-red-500" />;
      case 'medium':
        return <Info className="size-4 text-blue-500" />;
      case 'low':
        return <CheckCircle className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || notif.type === selectedType;
    const matchesPinned = !showPinnedOnly || notif.isPinned;
    const matchesUnread = !showUnreadOnly || !notif.isRead;
    
    return matchesSearch && matchesType && matchesPinned && matchesUnread;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pinnedCount = notifications.filter(n => n.isPinned).length;

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const togglePin = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Bell className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl">Thông báo</h1>
                  <p className="text-sm text-gray-600">
                    {unreadCount} chưa đọc • {pinnedCount} đã ghim
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mark all as read */}
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <CheckCheck className="size-4" />
                <span className="hidden sm:inline">Đánh dấu đã đọc</span>
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilter ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Filter className="size-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thông báo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showUnreadOnly
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span>Chưa đọc ({unreadCount})</span>
                </button>
                <button
                  onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showPinnedOnly
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white border border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <span>Đã ghim ({pinnedCount})</span>
                </button>
              </div>

              {/* Type Filters */}
              <div>
                <p className="text-sm mb-2">Loại thông báo:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {notificationTypes.map((type) => {
                    const Icon = type.icon;
                    const count = notifications.filter(n => type.id === 'all' || n.type === type.id).length;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id as any)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type.id
                            ? 'bg-white border-2 border-blue-500 shadow-sm'
                            : 'bg-white border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Icon className={`size-4 ${type.color}`} />
                        <span className="flex-1 text-left truncate">{type.name}</span>
                        <span className="text-xs text-gray-500">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Bell className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">Không có thông báo</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Không tìm thấy thông báo phù hợp' : 'Bạn chưa có thông báo nào'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const color = getNotificationColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                    notification.isRead
                      ? 'border-gray-100'
                      : 'border-l-4 border-l-blue-500 bg-blue-50/30'
                  } ${notification.isPinned ? 'ring-2 ring-yellow-200' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${
                      notification.isRead ? 'from-gray-100 to-gray-200' : 'from-blue-50 to-purple-50'
                    } flex items-center justify-center`}>
                      <Icon className={`size-6 ${notification.isRead ? 'text-gray-400' : color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {notification.isPinned && (
                            <Pin className="size-4 text-yellow-500 flex-shrink-0" />
                          )}
                          <h3 className={`${notification.isRead ? '' : 'font-semibold'}`}>
                            {notification.title}
                          </h3>
                          {getPriorityIcon(notification.priority)}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Time */}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {notification.description}
                      </p>

                      {/* Attachment */}
                      {notification.hasAttachment && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm mb-3">
                          {notification.attachmentType === 'pdf' && (
                            <FileText className="size-4 text-red-500" />
                          )}
                          {notification.attachmentType === 'image' && (
                            <Eye className="size-4 text-blue-500" />
                          )}
                          {notification.attachmentType === 'video' && (
                            <Eye className="size-4 text-purple-500" />
                          )}
                          <span className="text-gray-700 truncate max-w-xs">
                            {notification.attachmentName}
                          </span>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Download className="size-3 text-gray-600" />
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => toggleRead(notification.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {notification.isRead ? (
                            <>
                              <Check className="size-3" />
                              <span>Đánh dấu chưa đọc</span>
                            </>
                          ) : (
                            <>
                              <CheckCheck className="size-3" />
                              <span>Đánh dấu đã đọc</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => togglePin(notification.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            notification.isPinned
                              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {notification.isPinned ? (
                            <>
                              <PinOff className="size-3" />
                              <span>Bỏ ghim</span>
                            </>
                          ) : (
                            <>
                              <Pin className="size-3" />
                              <span>Ghim</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-3" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
