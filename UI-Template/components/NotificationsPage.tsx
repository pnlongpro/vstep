import { Bell, Search, Filter, Check, Pin, Trash2, X, AlertCircle, BookOpen, TrendingUp, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'important' | 'exercise' | 'progress' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isPinned: boolean;
  icon?: string;
}

interface NotificationGroup {
  type: 'important' | 'exercise' | 'progress' | 'system';
  title: string;
  icon: typeof AlertCircle;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('vstep_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    }
    return getMockNotifications();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'important' | 'exercise' | 'progress' | 'system'>('important');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('vstep_notifications', JSON.stringify(notifications));
    // Dispatch event to update badge count in header
    window.dispatchEvent(new Event('vstep-notifications-updated'));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs: NotificationGroup[] = [
    {
      type: 'important',
      title: 'Quan trọng',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      type: 'exercise',
      title: 'Bài tập',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      type: 'progress',
      title: 'Tiến độ & Kết quả',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      type: 'system',
      title: 'Hệ thống',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const togglePin = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const deleteNotification = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Filter notifications by search query and active tab
  const filteredNotifications = notifications
    .filter((n) => {
      // Filter by active tab
      if (n.type !== activeTab) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(query);
        const matchMessage = n.message.toLowerCase().includes(query);
        return matchTitle || matchMessage;
      }
      return true;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first

  // Get current tab config
  const currentTabConfig = tabs.find((t) => t.type === activeTab)!;
  const CurrentTabIcon = currentTabConfig.icon;

  // Count notifications per tab
  const getTabCount = (type: string) => {
    return notifications.filter((n) => n.type === type).length;
  };

  const getTabUnreadCount = (type: string) => {
    return notifications.filter((n) => n.type === type && !n.isRead).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Tabs */}
      <div
        className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="size-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg">Thông báo</h2>
                  <p className="text-xs text-gray-500">{unreadCount} chưa đọc</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-5 text-gray-600" />
              ) : (
                <ChevronLeft className="size-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Quick Actions */}
          {!isSidebarCollapsed && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Check className="size-4" />
              Đánh dấu đã đọc tất cả
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="py-3">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const count = getTabCount(tab.type);
            const unreadInTab = getTabUnreadCount(tab.type);
            const isActive = activeTab === tab.type;

            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`w-full px-6 py-3.5 flex items-center gap-3 transition-all relative ${
                  isActive
                    ? `${tab.bgColor} ${tab.color} border-r-4 ${tab.borderColor}`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? tab.title : ''}
              >
                <div className={`p-2 rounded-lg ${isActive ? tab.bgColor : 'bg-gray-100'}`}>
                  <TabIcon className={`size-5 ${isActive ? tab.color : 'text-gray-600'}`} />
                </div>

                {!isSidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="text-sm">{tab.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{count} thông báo</div>
                    </div>

                    {unreadInTab > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                        {unreadInTab}
                      </span>
                    )}
                  </>
                )}

                {isSidebarCollapsed && unreadInTab > 0 && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${currentTabConfig.bgColor}`}>
                <CurrentTabIcon className={`size-6 ${currentTabConfig.color}`} />
              </div>
              <div>
                <h1 className="text-2xl mb-1">{currentTabConfig.title}</h1>
                <p className="text-sm text-gray-500">
                  {filteredNotifications.length} thông báo
                  {searchQuery && ` (tìm kiếm: "${searchQuery}")`}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
              <CurrentTabIcon className={`size-16 mx-auto mb-4 ${currentTabConfig.color} opacity-30`} />
              <p className="text-gray-500 mb-2">
                {searchQuery ? 'Không tìm thấy thông báo nào' : `Không có thông báo ${currentTabConfig.title.toLowerCase()}`}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery
                  ? 'Thử thay đổi từ khóa tìm kiếm'
                  : 'Bạn sẽ nhận được thông báo khi có cập nhật mới'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Xóa tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all group hover:shadow-md ${
                    notification.isRead
                      ? 'border-gray-100'
                      : `${currentTabConfig.borderColor} bg-gradient-to-r from-white to-gray-50`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-xl ${currentTabConfig.bgColor}`}>
                      <CurrentTabIcon className={`size-5 ${currentTabConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {notification.isPinned && (
                            <Pin className="size-4 text-amber-500 fill-amber-500" />
                          )}
                          <h3 className={`text-base ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="size-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>

                      <p className={`text-sm mb-4 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                          >
                            <Check className="size-3.5" />
                            Đánh dấu đã đọc
                          </button>
                        )}
                        
                        <button
                          onClick={() => togglePin(notification.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs ${
                            notification.isPinned
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Pin className={`size-3.5 ${notification.isPinned ? 'fill-amber-600' : ''}`} />
                          {notification.isPinned ? 'Bỏ ghim' : 'Ghim'}
                        </button>

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                        >
                          <Trash2 className="size-3.5" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock notifications
function getMockNotifications(): Notification[] {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'important',
      title: 'Lớp B2 Intensive - Lịch học tuần sau thay đổi',
      message: 'Lịch học thứ 3 chuyển sang thứ 5, 19:00-21:00. Vui lòng sắp xếp thời gian phù hợp.',
      timestamp: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
      isRead: false,
      isPinned: true,
    },
    {
      id: '2',
      type: 'important',
      title: 'Thông báo nghỉ lễ 30/4 - 1/5',
      message: 'Lớp học sẽ nghỉ từ 30/4 đến 1/5. Bài tập về nhà được giao qua hệ thống.',
      timestamp: new Date(now.getTime() - 2 * 3600000), // 2 hours ago
      isRead: false,
      isPinned: false,
    },
    {
      id: '3',
      type: 'exercise',
      title: 'Bài tập Writing Task 2 - Deadline 22/12',
      message: 'Hãy hoàn thành bài luận về chủ đề "Technology in Education" trước 22/12.',
      timestamp: new Date(now.getTime() - 1 * 86400000), // 1 day ago
      isRead: false,
      isPinned: true,
    },
    {
      id: '4',
      type: 'progress',
      title: 'Chúc mừng! Bạn đã đạt 100 bài luyện tập',
      message: 'Bạn đã hoàn thành 100 bài luyện tập. Tiếp tục phát huy nhé! 🎉',
      timestamp: new Date(now.getTime() - 3 * 3600000), // 3 hours ago
      isRead: false,
      isPinned: false,
    },
    {
      id: '5',
      type: 'exercise',
      title: 'Bài tập mới: Reading Part 3 - Advanced',
      message: 'Đã thêm 5 bài tập đọc hiểu mới cấp độ C1 về chủ đề Khoa học & Công nghệ.',
      timestamp: new Date(now.getTime() - 2 * 86400000), // 2 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '6',
      type: 'progress',
      title: 'Điểm Reading tăng lên 8.0',
      message: 'Điểm trung bình Reading của bạn đã tăng từ 7.5 lên 8.0. Tuyệt vời!',
      timestamp: new Date(now.getTime() - 3 * 86400000), // 3 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '7',
      type: 'system',
      title: 'Tính năng mới: Trợ lý VSTEP AI',
      message: 'Trợ lý AI đã sẵn sàng! Hỏi bất cứ điều gì về VSTEP và nhận câu trả lời ngay.',
      timestamp: new Date(now.getTime() - 4 * 86400000), // 4 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '8',
      type: 'exercise',
      title: 'Nhắc nhở: 3 bài Listening chưa hoàn thành',
      message: 'Bạn có 3 bài tập Listening chưa hoàn thành. Hãy hoàn thành để đạt mục tiêu tuần này.',
      timestamp: new Date(now.getTime() - 5 * 86400000), // 5 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '9',
      type: 'system',
      title: 'Cập nhật ứng dụng thành công',
      message: 'VSTEPRO v2.3.0 đã được cài đặt với nhiều cải tiến về hiệu suất và giao diện.',
      timestamp: new Date(now.getTime() - 6 * 86400000), // 6 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '10',
      type: 'progress',
      title: 'Mục tiêu tuần đã hoàn thành 85%',
      message: 'Bạn đã hoàn thành 17/20 bài trong tuần này. Cố gắng thêm chút nữa nhé!',
      timestamp: new Date(now.getTime() - 7 * 86400000), // 7 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '11',
      type: 'important',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 23:00 - 01:00 ngày 15/12. Vui lòng lưu bài làm trước khi thoát.',
      timestamp: new Date(now.getTime() - 8 * 86400000), // 8 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '12',
      type: 'system',
      title: 'Lỗi đã được khắc phục',
      message: 'Lỗi không lưu được tiến độ Speaking đã được khắc phục. Cảm ơn bạn đã báo cáo!',
      timestamp: new Date(now.getTime() - 10 * 86400000), // 10 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '13',
      type: 'exercise',
      title: 'Bài tập Writing đã được cập nhật',
      message: 'Bài tập "Viết email xin việc" đã được thêm hướng dẫn chi tiết và ví dụ mẫu.',
      timestamp: new Date(now.getTime() - 12 * 86400000), // 12 days ago
      isRead: true,
      isPinned: false,
    },
    {
      id: '14',
      type: 'progress',
      title: 'Hoàn thành streak 7 ngày',
      message: 'Bạn đã học liên tục 7 ngày! Huy hiệu "Week Warrior" đã được mở khóa.',
      timestamp: new Date(now.getTime() - 14 * 86400000), // 14 days ago
      isRead: true,
      isPinned: false,
    },
  ];
}