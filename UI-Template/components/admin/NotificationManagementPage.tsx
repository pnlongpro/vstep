import { useState } from 'react';
import { Bell, Plus, Send, Edit2, Trash2, Eye, Search, Filter, Users, Calendar, Clock, Check, X, TrendingUp, AlertCircle, MessageSquare, FileText, Target, ChevronRight } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'announcement' | 'assignment' | 'exam' | 'reminder' | 'update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target: 'all' | 'students' | 'teachers' | 'class' | 'user';
  targetDetails?: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: string;
  createdDate: string;
  sentDate?: string;
  readCount: number;
  totalRecipients: number;
  createdBy: string;
}

export function NotificationManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState<Notification['type']>('announcement');
  const [formPriority, setFormPriority] = useState<Notification['priority']>('medium');
  const [formTarget, setFormTarget] = useState<Notification['target']>('all');
  const [formTargetDetails, setFormTargetDetails] = useState('');
  const [formScheduled, setFormScheduled] = useState(false);
  const [formScheduledDate, setFormScheduledDate] = useState('');

  // Mock data
  const notifications: Notification[] = [
    {
      id: 1,
      title: '🎉 Khai giảng khóa học VSTEP Complete mới',
      content: 'Khóa học VSTEP Complete - Khóa 13 sẽ khai giảng vào ngày 05/01/2025. Đăng ký ngay để được ưu đãi 20% học phí!',
      type: 'announcement',
      priority: 'high',
      target: 'all',
      status: 'sent',
      createdDate: '15/12/2024 09:00',
      sentDate: '15/12/2024 09:30',
      readCount: 856,
      totalRecipients: 1234,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 2,
      title: '⚠️ Bảo trì hệ thống định kỳ',
      content: 'Hệ thống sẽ được bảo trì vào lúc 02:00 - 04:00 sáng ngày 20/12/2024. Trong thời gian này, một số tính năng có thể không khả dụng.',
      type: 'system',
      priority: 'urgent',
      target: 'all',
      status: 'scheduled',
      scheduledDate: '19/12/2024 20:00',
      createdDate: '17/12/2024 14:30',
      readCount: 0,
      totalRecipients: 1234,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 3,
      title: '📚 Bài tập mới: VSTEP Reading Practice',
      content: 'Giáo viên Trần Thị B đã giao bài tập mới cho lớp VSTEP Foundation - Khóa 08. Hạn nộp: 25/12/2024.',
      type: 'assignment',
      priority: 'high',
      target: 'class',
      targetDetails: 'VSTEP Foundation - Khóa 08',
      status: 'sent',
      createdDate: '18/12/2024 10:15',
      sentDate: '18/12/2024 10:20',
      readCount: 28,
      totalRecipients: 30,
      createdBy: 'Teacher - Trần Thị B'
    },
    {
      id: 4,
      title: '🎯 Đề thi thử VSTEP tháng 12',
      content: 'Đề thi thử VSTEP toàn phần sẽ được tổ chức vào ngày 28/12/2024. Đăng ký tham gia tại mục "Thi thử".',
      type: 'exam',
      priority: 'high',
      target: 'students',
      status: 'scheduled',
      scheduledDate: '22/12/2024 09:00',
      createdDate: '16/12/2024 16:00',
      readCount: 0,
      totalRecipients: 892,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 5,
      title: '⏰ Nhắc nhở: Buổi học sắp diễn ra',
      content: 'Buổi học VSTEP Complete - Khóa 12 sẽ bắt đầu sau 1 giờ nữa (19:00). Vui lòng chuẩn bị và tham gia đúng giờ.',
      type: 'reminder',
      priority: 'medium',
      target: 'class',
      targetDetails: 'VSTEP Complete - Khóa 12',
      status: 'scheduled',
      scheduledDate: '19/12/2024 18:00',
      createdDate: '18/12/2024 08:00',
      readCount: 0,
      totalRecipients: 25,
      createdBy: 'System Auto'
    },
    {
      id: 6,
      title: '✨ Cập nhật tính năng mới: Chấm điểm AI nâng cao',
      content: 'Hệ thống chấm điểm AI đã được nâng cấp với độ chính xác cao hơn và feedback chi tiết hơn cho Writing và Speaking.',
      type: 'update',
      priority: 'medium',
      target: 'all',
      status: 'sent',
      createdDate: '14/12/2024 11:00',
      sentDate: '14/12/2024 11:30',
      readCount: 1105,
      totalRecipients: 1234,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 7,
      title: '🎓 Chúc mừng học viên đạt điểm cao',
      content: 'Chúc mừng 15 học viên đã đạt điểm VSTEP B2+ trong kỳ thi tháng 11/2024. Tiếp tục cố gắng!',
      type: 'announcement',
      priority: 'low',
      target: 'students',
      status: 'sent',
      createdDate: '12/12/2024 15:30',
      sentDate: '12/12/2024 16:00',
      readCount: 723,
      totalRecipients: 892,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 8,
      title: '📝 Hướng dẫn sử dụng tính năng Voice Recording',
      content: 'Video hướng dẫn chi tiết cách sử dụng tính năng ghi âm Speaking đã được đăng tải tại mục "Tài liệu hướng dẫn".',
      type: 'update',
      priority: 'low',
      target: 'students',
      status: 'draft',
      createdDate: '19/12/2024 10:00',
      readCount: 0,
      totalRecipients: 892,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 9,
      title: '🔔 Họp phụ huynh trực tuyến',
      content: 'Cuộc họp phụ huynh trực tuyến sẽ diễn ra vào 20:00 ngày 23/12/2024. Link họp sẽ được gửi qua email.',
      type: 'announcement',
      priority: 'medium',
      target: 'students',
      status: 'scheduled',
      scheduledDate: '21/12/2024 18:00',
      createdDate: '18/12/2024 14:00',
      readCount: 0,
      totalRecipients: 892,
      createdBy: 'Admin - Nguyễn Văn A'
    },
    {
      id: 10,
      title: '👨‍🏫 Thông báo nghỉ phép giáo viên',
      content: 'Giáo viên Lê Văn C sẽ nghỉ phép từ 26/12 đến 02/01. Các lớp sẽ được giáo viên thay thế đảm nhiệm.',
      type: 'announcement',
      priority: 'high',
      target: 'teachers',
      status: 'sent',
      createdDate: '17/12/2024 09:00',
      sentDate: '17/12/2024 09:15',
      readCount: 42,
      totalRecipients: 48,
      createdBy: 'Admin - Nguyễn Văn A'
    }
  ];

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    const matchesTarget = filterTarget === 'all' || notification.target === filterTarget;
    
    return matchesSearch && matchesType && matchesStatus && matchesTarget;
  });

  // Stats
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    draft: notifications.filter(n => n.status === 'draft').length,
    readRate: Math.round((notifications.reduce((acc, n) => acc + n.readCount, 0) / notifications.reduce((acc, n) => acc + n.totalRecipients, 0)) * 100)
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
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'sent': return '✓ Đã gửi';
      case 'scheduled': return '⏰ Đã lên lịch';
      case 'draft': return '📝 Nháp';
      default: return status;
    }
  };

  const getTargetLabel = (target: string, details?: string) => {
    switch(target) {
      case 'all': return '👥 Tất cả';
      case 'students': return '🎓 Học viên';
      case 'teachers': return '👨‍🏫 Giáo viên';
      case 'class': return `📚 ${details || 'Lớp học'}`;
      case 'user': return `👤 ${details || 'Người dùng'}`;
      default: return target;
    }
  };

  const handleCreateNotification = () => {
    setEditingNotification(null);
    setFormTitle('');
    setFormContent('');
    setFormType('announcement');
    setFormPriority('medium');
    setFormTarget('all');
    setFormTargetDetails('');
    setFormScheduled(false);
    setFormScheduledDate('');
    setShowCreateModal(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setFormTitle(notification.title);
    setFormContent(notification.content);
    setFormType(notification.type);
    setFormPriority(notification.priority);
    setFormTarget(notification.target);
    setFormTargetDetails(notification.targetDetails || '');
    setFormScheduled(!!notification.scheduledDate);
    setFormScheduledDate(notification.scheduledDate || '');
    setShowCreateModal(true);
  };

  const handleSaveNotification = () => {
    console.log('Save notification:', {
      title: formTitle,
      content: formContent,
      type: formType,
      priority: formPriority,
      target: formTarget,
      targetDetails: formTargetDetails,
      scheduled: formScheduled,
      scheduledDate: formScheduledDate
    });
    setShowCreateModal(false);
  };

  const handleSendNow = (notification: Notification) => {
    console.log('Send notification now:', notification.id);
  };

  const handleDeleteNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Delete notification:', selectedNotification?.id);
    setShowDeleteModal(false);
    setSelectedNotification(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="size-5 text-blue-600" />
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold mb-1">{stats.total}</p>
          <p className="text-sm text-gray-600">Tổng thông báo</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="size-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-green-600">{stats.sent}</p>
          <p className="text-sm text-gray-600">Đã gửi</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="size-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-blue-600">{stats.scheduled}</p>
          <p className="text-sm text-gray-600">Đã lên lịch</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="size-5 text-gray-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-gray-700">{stats.draft}</p>
          <p className="text-sm text-gray-600">Nháp</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1 text-purple-600">{stats.readRate}%</p>
          <p className="text-sm text-gray-600">Tỷ lệ đọc</p>
        </div>
      </div>

      {/* Filters & Actions */}
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
              <option value="sent">Đã gửi</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="draft">Nháp</option>
            </select>

            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả đối tượng</option>
              <option value="all">Tất cả người dùng</option>
              <option value="students">Học viên</option>
              <option value="teachers">Giáo viên</option>
              <option value="class">Lớp học cụ thể</option>
            </select>

            <button
              onClick={handleCreateNotification}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="size-5" />
              Tạo thông báo
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-semibold">{notification.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-lg border ${getTypeColor(notification.type)}`}>
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-lg ${getPriorityColor(notification.priority)}`}>
                    {getPriorityLabel(notification.priority)}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-lg border ${getStatusColor(notification.status)}`}>
                    {getStatusLabel(notification.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{notification.content}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{getTargetLabel(notification.target, notification.targetDetails)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="size-4" />
                    <span>{notification.totalRecipients} người nhận</span>
                  </div>
                  {notification.status === 'sent' && (
                    <div className="flex items-center gap-2">
                      <Eye className="size-4" />
                      <span>{notification.readCount}/{notification.totalRecipients} đã đọc ({Math.round((notification.readCount / notification.totalRecipients) * 100)}%)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>Tạo: {notification.createdDate}</span>
                  </div>
                  {notification.scheduledDate && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="size-4" />
                      <span>Lên lịch: {notification.scheduledDate}</span>
                    </div>
                  )}
                  {notification.sentDate && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Send className="size-4" />
                      <span>Đã gửi: {notification.sentDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  Người tạo: {notification.createdBy}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {(notification.status === 'draft' || notification.status === 'scheduled') && (
                  <button
                    onClick={() => handleSendNow(notification)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Gửi ngay"
                  >
                    <Send className="size-5" />
                  </button>
                )}
                <button
                  onClick={() => handleEditNotification(notification)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="size-5" />
                </button>
                <button
                  onClick={() => handleDeleteNotification(notification)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Bell className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy thông báo nào</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingNotification ? '✏️ Chỉnh sửa thông báo' : '➕ Tạo thông báo mới'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Nhập nội dung thông báo..."
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại thông báo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Notification['type'])}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="announcement">📢 Thông báo</option>
                    <option value="system">⚙️ Hệ thống</option>
                    <option value="assignment">📚 Bài tập</option>
                    <option value="exam">🎯 Đề thi</option>
                    <option value="reminder">⏰ Nhắc nhở</option>
                    <option value="update">✨ Cập nhật</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ ưu tiên <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Notification['priority'])}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <select
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value as Notification['target'])}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">👥 Tất cả người dùng</option>
                  <option value="students">🎓 Học viên</option>
                  <option value="teachers">👨‍🏫 Giáo viên</option>
                  <option value="class">📚 Lớp học cụ thể</option>
                  <option value="user">👤 Người dùng cụ thể</option>
                </select>
              </div>

              {/* Target Details */}
              {(formTarget === 'class' || formTarget === 'user') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi tiết đối tượng
                  </label>
                  <input
                    type="text"
                    value={formTargetDetails}
                    onChange={(e) => setFormTargetDetails(e.target.value)}
                    placeholder={formTarget === 'class' ? 'Nhập tên lớp học...' : 'Nhập email hoặc ID người dùng...'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Schedule */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formScheduled}
                    onChange={(e) => setFormScheduled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Lên lịch gửi sau
                  </span>
                </label>
              </div>

              {formScheduled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian gửi
                  </label>
                  <input
                    type="datetime-local"
                    value={formScheduledDate}
                    onChange={(e) => setFormScheduledDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveNotification}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="size-5" />
                  {formScheduled ? 'Lên lịch' : 'Gửi ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Xác nhận xóa</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thông báo "<strong>{selectedNotification.title}</strong>"? 
              Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="size-5" />
                Xóa thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
