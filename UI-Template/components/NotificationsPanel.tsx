import { Bell, X, ChevronDown, ChevronUp, AlertCircle, BookOpen, TrendingUp, Settings, Check, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'important' | 'exercise' | 'progress' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
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

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
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

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['important', 'exercise', 'progress', 'system'])
  );

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('vstep_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const groups: NotificationGroup[] = [
    {
      type: 'important',
      title: 'Thông báo quan trọng',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      type: 'exercise',
      title: 'Thông báo về bài tập',
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
      title: 'Thông báo hệ thống',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  // Group notifications by type
  const groupedNotifications = groups.map((group) => ({
    ...group,
    notifications: notifications
      .filter((n) => n.type === group.type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
  }));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
      setNotifications([]);
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

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all group"
        aria-label="Thông báo"
      >
        <Bell className="size-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-14 w-[480px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bell className="size-6 text-blue-600" />
                  <h3 className="text-xl">Thông báo</h3>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  aria-label="Đóng"
                >
                  <X className="size-5 text-gray-500" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 text-xs rounded-lg transition-colors border border-blue-200"
                  >
                    <Check className="size-3.5" />
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs rounded-lg transition-colors border border-red-200"
                  >
                    <Trash2 className="size-3.5" />
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <Bell className="size-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-1">Không có thông báo mới</p>
                  <p className="text-sm text-gray-400">
                    Bạn sẽ nhận được thông báo khi có cập nhật mới
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {groupedNotifications.map((group) => {
                    if (group.notifications.length === 0) return null;

                    const GroupIcon = group.icon;
                    const isExpanded = expandedGroups.has(group.type);
                    const unreadInGroup = group.notifications.filter((n) => !n.isRead).length;

                    return (
                      <div key={group.type} className="bg-white">
                        {/* Group Header */}
                        <button
                          onClick={() => toggleGroup(group.type)}
                          className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${group.bgColor}`}>
                              <GroupIcon className={`size-4 ${group.color}`} />
                            </div>
                            <span className="text-sm">{group.title}</span>
                            <span className="text-xs text-gray-500">
                              ({group.notifications.length})
                            </span>
                            {unreadInGroup > 0 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                {unreadInGroup} mới
                              </span>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="size-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="size-5 text-gray-400" />
                          )}
                        </button>

                        {/* Group Notifications */}
                        {isExpanded && (
                          <div className="bg-gray-50/50">
                            {group.notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-6 py-4 border-l-4 hover:bg-white transition-all group ${
                                  notification.isRead
                                    ? 'border-transparent bg-white'
                                    : `${group.borderColor} bg-white`
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Icon */}
                                  <div
                                    className={`flex-shrink-0 p-2 rounded-lg ${group.bgColor} ${
                                      notification.isRead ? 'opacity-60' : ''
                                    }`}
                                  >
                                    <GroupIcon className={`size-4 ${group.color}`} />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <h4
                                        className={`text-sm ${
                                          notification.isRead ? 'text-gray-600' : 'text-gray-900'
                                        }`}
                                      >
                                        {notification.title}
                                      </h4>
                                      {!notification.isRead && (
                                        <div className="size-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                      )}
                                    </div>
                                    <p
                                      className={`text-sm mb-2 ${
                                        notification.isRead ? 'text-gray-400' : 'text-gray-600'
                                      }`}
                                    >
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-400">
                                        {formatTimestamp(notification.timestamp)}
                                      </span>

                                      {/* Actions */}
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.isRead && (
                                          <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Đánh dấu đã đọc"
                                          >
                                            <Check className="size-3.5 text-blue-600" />
                                          </button>
                                        )}
                                        <button
                                          onClick={() => deleteNotification(notification.id)}
                                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                          title="Xóa"
                                        >
                                          <Trash2 className="size-3.5 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Mock notifications for demo
function getMockNotifications(): Notification[] {
  const now = new Date();
  return [
    // Important
    {
      id: '1',
      type: 'important',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 23:00 - 01:00 ngày 15/12. Vui lòng lưu bài làm trước khi thoát.',
      timestamp: new Date(now.getTime() - 30 * 60000), // 30 minutes ago
      isRead: false,
    },
    {
      id: '2',
      type: 'important',
      title: 'Cập nhật chính sách',
      message: 'Chính sách bảo mật đã được cập nhật. Vui lòng xem lại để tiếp tục sử dụng.',
      timestamp: new Date(now.getTime() - 2 * 3600000), // 2 hours ago
      isRead: false,
    },

    // Exercise
    {
      id: '3',
      type: 'exercise',
      title: 'Bài tập mới: Reading Part 3',
      message: 'Đã thêm 5 bài tập đọc hiểu mới cấp độ B2 về chủ đề Công nghệ.',
      timestamp: new Date(now.getTime() - 1 * 3600000), // 1 hour ago
      isRead: false,
    },
    {
      id: '4',
      type: 'exercise',
      title: 'Yêu cầu hoàn thành bài',
      message: 'Bạn có 3 bài tập Listening chưa hoàn thành. Hãy hoàn thành để đạt mục tiêu tuần này.',
      timestamp: new Date(now.getTime() - 3 * 3600000), // 3 hours ago
      isRead: true,
    },
    {
      id: '5',
      type: 'exercise',
      title: 'Bài tập Writing đã được cập nhật',
      message: 'Bài tập "Viết email xin việc" đã được thêm hướng dẫn chi tiết và ví dụ mẫu.',
      timestamp: new Date(now.getTime() - 5 * 3600000), // 5 hours ago
      isRead: true,
    },

    // Progress
    {
      id: '6',
      type: 'progress',
      title: 'Chúc mừng! Bạn đã đạt 100 bài',
      message: 'Bạn đã hoàn thành 100 bài luyện tập. Tiếp tục phát huy nhé! 🎉',
      timestamp: new Date(now.getTime() - 4 * 3600000), // 4 hours ago
      isRead: false,
    },
    {
      id: '7',
      type: 'progress',
      title: 'Điểm Reading tăng lên 8.0',
      message: 'Điểm trung bình Reading của bạn đã tăng từ 7.5 lên 8.0. Tuyệt vời!',
      timestamp: new Date(now.getTime() - 6 * 3600000), // 6 hours ago
      isRead: true,
    },
    {
      id: '8',
      type: 'progress',
      title: 'Mục tiêu tuần đã hoàn thành 85%',
      message: 'Bạn đã hoàn thành 17/20 bài trong tuần này. Cố gắng thêm chút nữa nhé!',
      timestamp: new Date(now.getTime() - 1 * 86400000), // 1 day ago
      isRead: true,
    },

    // System
    {
      id: '9',
      type: 'system',
      title: 'Tính năng mới: Trợ lý AI',
      message: 'Trợ lý VSTEP AI đã sẵn sàng! Hỏi bất cứ điều gì về VSTEP và nhận câu trả lời ngay.',
      timestamp: new Date(now.getTime() - 2 * 86400000), // 2 days ago
      isRead: false,
    },
    {
      id: '10',
      type: 'system',
      title: 'Cập nhật ứng dụng thành công',
      message: 'VSTEPRO v2.3.0 đã được cài đặt với nhiều cải tiến về hiệu suất và giao diện.',
      timestamp: new Date(now.getTime() - 3 * 86400000), // 3 days ago
      isRead: true,
    },
    {
      id: '11',
      type: 'system',
      title: 'Lỗi đã được khắc phục',
      message: 'Lỗi không lưu được tiến độ Speaking đã được khắc phục. Cảm ơn bạn đã báo cáo!',
      timestamp: new Date(now.getTime() - 4 * 86400000), // 4 days ago
      isRead: true,
    },
  ];
}
