import { useState } from 'react';
import { Bell, Search, Filter, Users, Calendar, Eye, Target, MessageSquare } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'announcement' | 'assignment' | 'exam' | 'reminder' | 'update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read';
  createdDate: string;
  createdBy: string;
}

export function StudentNotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - Thông báo cho học viên
  const notifications: Notification[] = [
    {
      id: 1,
      title: '🎉 Khai giảng khóa học VSTEP Complete mới',
      content: 'Khóa học VSTEP Complete - Khóa 13 sẽ khai giảng vào ngày 05/01/2025. Đăng ký ngay để được ưu đãi 20% học phí!',
      type: 'announcement',
      priority: 'high',
      status: 'unread',
      createdDate: '15/12/2024 09:00',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 2,
      title: '⚠️ Bảo trì hệ thống định kỳ',
      content: 'Hệ thống sẽ được bảo trì vào lúc 02:00 - 04:00 sáng ngày 20/12/2024. Trong thời gian này, một số tính năng có thể không khả dụng.',
      type: 'system',
      priority: 'urgent',
      status: 'read',
      createdDate: '17/12/2024 14:30',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 3,
      title: '📚 Bài tập mới: VSTEP Reading Practice',
      content: 'Giáo viên Trần Thị B đã giao bài tập mới cho lớp VSTEP Foundation - Khóa 08. Hạn nộp: 25/12/2024.',
      type: 'assignment',
      priority: 'high',
      status: 'unread',
      createdDate: '18/12/2024 10:15',
      createdBy: 'Teacher - Trần Thị B'
    },
    {
      id: 4,
      title: '🎯 Đề thi thử VSTEP tháng 12',
      content: 'Đề thi thử VSTEP toàn phần sẽ được tổ chức vào ngày 28/12/2024. Đăng ký tham gia tại mục "Thi thử".',
      type: 'exam',
      priority: 'high',
      status: 'unread',
      createdDate: '16/12/2024 16:00',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 5,
      title: '⏰ Nhắc nhở: Buổi học sắp diễn ra',
      content: 'Buổi học VSTEP Complete - Khóa 12 sẽ bắt đầu sau 1 giờ nữa (19:00). Vui lòng chuẩn bị và tham gia đúng giờ.',
      type: 'reminder',
      priority: 'medium',
      status: 'read',
      createdDate: '19/12/2024 18:00',
      createdBy: 'System Auto'
    },
    {
      id: 6,
      title: '✨ Cập nhật tính năng mới: Chấm điểm AI nâng cao',
      content: 'Hệ thống chấm điểm AI đã được nâng cấp với độ chính xác cao hơn và feedback chi tiết hơn cho Writing và Speaking.',
      type: 'update',
      priority: 'medium',
      status: 'read',
      createdDate: '14/12/2024 11:00',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 7,
      title: '🎓 Chúc mừng! Bạn đạt điểm cao',
      content: 'Chúc mừng bạn đã đạt điểm VSTEP B2 trong bài thi thử ngày 10/12/2024. Tiếp tục cố gắng để đạt kết quả tốt hơn!',
      type: 'announcement',
      priority: 'low',
      status: 'read',
      createdDate: '12/12/2024 15:30',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 8,
      title: '📝 Hướng dẫn sử dụng tính năng Voice Recording',
      content: 'Video hướng dẫn chi tiết cách sử dụng tính năng ghi âm Speaking đã được đăng tải tại mục "Tài liệu hướng dẫn".',
      type: 'update',
      priority: 'low',
      status: 'read',
      createdDate: '11/12/2024 10:00',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 9,
      title: '🔔 Họp phụ huynh trực tuyến',
      content: 'Cuộc họp phụ huynh trực tuyến sẽ diễn ra vào 20:00 ngày 23/12/2024. Link họp sẽ được gửi qua email.',
      type: 'announcement',
      priority: 'medium',
      status: 'unread',
      createdDate: '18/12/2024 14:00',
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 10,
      title: '⏰ Nhắc nhở: Hạn nộp bài tập sắp đến',
      content: 'Bài tập VSTEP Writing Task 2 sẽ hết hạn vào 23:59 ngày 20/12/2024. Vui lòng hoàn thành và nộp bài đúng hạn.',
      type: 'reminder',
      priority: 'high',
      status: 'unread',
      createdDate: '19/12/2024 08:00',
      createdBy: 'System Auto'
    }
  ];

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    read: notifications.filter(n => n.status === 'read').length,
    important: notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'system': return 'bg-red-100 text-red-700 border-red-200';
      case 'announcement': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assignment': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'exam': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'update': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'system': return '⚙️ Hệ thống';
      case 'announcement': return '📢 Thông báo';
      case 'assignment': return '📚 Bài tập';
      case 'exam': return '🎯 Đề thi';
      case 'reminder': return '⏰ Nhắc nhở';
      case 'update': return '✨ Cập nhật';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Quan trọng';
      case 'medium': return 'Bình thường';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const handleMarkAsRead = (id: number) => {
    console.log('Mark as read:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">🔔 Thông báo của tôi</h1>
        <p className="text-blue-100">Xem tất cả thông báo và cập nhật từ hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="size-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">{stats.total}</p>
          <p className="text-sm text-gray-600">Tổng thông báo</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageSquare className="size-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-orange-600">{stats.unread}</p>
          <p className="text-sm text-gray-600">Chưa đọc</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="size-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-green-600">{stats.read}</p>
          <p className="text-sm text-gray-600">Đã đọc</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="size-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-red-600">{stats.important}</p>
          <p className="text-sm text-gray-600">Quan trọng</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="system">Hệ thống</option>
                <option value="announcement">Thông báo</option>
                <option value="assignment">Bài tập</option>
                <option value="exam">Đề thi</option>
                <option value="reminder">Nhắc nhở</option>
                <option value="update">Cập nhật</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="unread">Chưa đọc</option>
              <option value="read">Đã đọc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-white border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer ${
              notification.status === 'unread' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
            }`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {notification.status === 'unread' && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                  <h3 className={`text-xl font-semibold ${notification.status === 'unread' ? 'text-blue-900' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className={`px-3 py-1 text-xs rounded-lg border ${getTypeColor(notification.type)}`}>
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-lg ${getPriorityColor(notification.priority)}`}>
                    {getPriorityLabel(notification.priority)}
                  </span>
                </div>
                <p className={`text-gray-600 mb-3 ${notification.status === 'unread' ? 'font-medium' : ''}`}>
                  {notification.content}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>{notification.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{notification.createdBy}</span>
                  </div>
                  {notification.status === 'unread' && (
                    <span className="text-blue-600 font-medium">• Mới</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Bell className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
