import { useState } from 'react';
import { Send, Bell, Users, Calendar, CheckCircle, X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { teacherClasses } from '../../data/teacherClassData';

interface Notification {
  id: string;
  title: string;
  message: string;
  classIds: string[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent';
}

export function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Thông báo nghỉ học',
      message: 'Lớp sẽ nghỉ học vào ngày 20/12/2024 do giáo viên có việc đột xuất.',
      classIds: ['VSTEP-FOUNDATION-M01', 'VSTEP-COMPLETE-A01'],
      createdAt: new Date('2024-12-15'),
      priority: 'high',
      status: 'sent',
    },
    {
      id: '2',
      title: 'Nhắc nhở nộp bài',
      message: 'Hạn nộp bài tập Writing Task 2 là 18/12/2024. Các em nhớ nộp bài đúng hạn nhé!',
      classIds: ['VSTEP-FOUNDATION-M01'],
      createdAt: new Date('2024-12-14'),
      priority: 'medium',
      status: 'sent',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    classIds: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Use real class data from teacherClassData.ts
  const classes = teacherClasses.map(c => ({
    id: c.code,
    name: c.name,
    students: c.students
  }));

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message || newNotification.classIds.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      classIds: newNotification.classIds,
      createdAt: new Date(),
      priority: newNotification.priority,
      status: 'sent',
    };

    setNotifications([notification, ...notifications]);
    setShowCreateModal(false);
    setNewNotification({
      title: '',
      message: '',
      classIds: [],
      priority: 'medium',
    });

    // Show success message
    alert('Gửi thông báo thành công!');
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const toggleClassSelection = (classId: string) => {
    setNewNotification(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }));
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Quản lý thông báo</h2>
          <p className="text-gray-600">Gửi thông báo cho các lớp học của bạn</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="size-5" />
          Tạo thông báo mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bell className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng thông báo</p>
              <p className="text-2xl">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="size-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã gửi</p>
              <p className="text-2xl">{notifications.filter(n => n.status === 'sent').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lớp học</p>
              <p className="text-2xl">{classes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg">Danh sách thông báo</h3>
        </div>
        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg text-gray-900">{notification.title}</h4>
                        <span className={`px-3 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}>
                          {getPriorityLabel(notification.priority)}
                        </span>
                        {notification.status === 'sent' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                            Đã gửi
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {notification.classIds.map((classId) => {
                          const classInfo = classes.find(c => c.id === classId);
                          return (
                            <span
                              key={classId}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                            >
                              <Users className="size-3" />
                              {classInfo?.name || classId}
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="size-4" />
                        {notification.createdAt.toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl">Tạo thông báo mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Ví dụ: Thông báo nghỉ học"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Mức độ ưu tiên
                </label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewNotification({ ...newNotification, priority })}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        newNotification.priority === priority
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getPriorityLabel(priority)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Nội dung thông báo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Nhập nội dung thông báo..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Select Classes */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Chọn lớp học <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {classes.map((classItem) => (
                    <button
                      key={classItem.id}
                      onClick={() => toggleClassSelection(classItem.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        newNotification.classIds.includes(classItem.id)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        newNotification.classIds.includes(classItem.id)
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300'
                      }`}>
                        {newNotification.classIds.includes(classItem.id) && (
                          <CheckCircle className="size-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{classItem.name}</p>
                        <p className="text-sm text-gray-600">{classItem.students} học viên</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Note */}
              <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">Thông báo sẽ được gửi đến tất cả học viên trong các lớp được chọn.</p>
                  <p>Học viên sẽ nhận được thông báo qua hệ thống và email (nếu có).</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateNotification}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="size-5" />
                Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}