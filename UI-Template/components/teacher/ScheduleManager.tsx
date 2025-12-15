import { useState } from 'react';
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, Video, Users, CheckCircle, X, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleManagerProps {
  classInfo: any;
  scheduleData: any[];
}

interface ScheduleSession {
  id: number;
  date: string;
  day: string;
  time: string;
  topic: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  attendance?: number;
  total: number;
  zoomLink?: string;
  room?: string;
  notes?: string;
}

export function ScheduleManager({ classInfo, scheduleData: initialData }: ScheduleManagerProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleSession[]>(initialData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduleSession | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Form states
  const [formData, setFormData] = useState({
    date: '',
    time: '19:00-21:00',
    topic: '',
    room: '',
    zoomLink: '',
    notes: '',
    repeatWeekly: false,
    repeatCount: 1,
  });

  const handleAddSession = () => {
    if (!formData.date || !formData.topic) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newSessions: ScheduleSession[] = [];
    const baseDate = new Date(formData.date);

    for (let i = 0; i < (formData.repeatWeekly ? formData.repeatCount : 1); i++) {
      const sessionDate = new Date(baseDate);
      if (formData.repeatWeekly) {
        sessionDate.setDate(sessionDate.getDate() + (i * 7));
      }

      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const dayName = dayNames[sessionDate.getDay()];

      newSessions.push({
        id: Date.now() + i,
        date: sessionDate.toLocaleDateString('vi-VN'),
        day: dayName,
        time: formData.time,
        topic: formData.topic,
        status: 'upcoming',
        total: classInfo.totalStudents,
        zoomLink: formData.zoomLink,
        room: formData.room,
        notes: formData.notes,
      });
    }

    setScheduleData([...scheduleData, ...newSessions].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    }));

    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateSession = () => {
    if (!editingSession || !formData.date || !formData.topic) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const sessionDate = new Date(formData.date);
    const dayName = dayNames[sessionDate.getDay()];

    setScheduleData(scheduleData.map(session => 
      session.id === editingSession.id 
        ? {
            ...session,
            date: sessionDate.toLocaleDateString('vi-VN'),
            day: dayName,
            time: formData.time,
            topic: formData.topic,
            room: formData.room,
            zoomLink: formData.zoomLink,
            notes: formData.notes,
          }
        : session
    ));

    setEditingSession(null);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteSession = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa buổi học này?')) {
      setScheduleData(scheduleData.filter(session => session.id !== id));
    }
  };

  const handleEditSession = (session: ScheduleSession) => {
    setEditingSession(session);
    const [day, month, year] = session.date.split('/');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    setFormData({
      date: isoDate,
      time: session.time,
      topic: session.topic,
      room: session.room || '',
      zoomLink: session.zoomLink || '',
      notes: session.notes || '',
      repeatWeekly: false,
      repeatCount: 1,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '19:00-21:00',
      topic: '',
      room: '',
      zoomLink: '',
      notes: '',
      repeatWeekly: false,
      repeatCount: 1,
    });
  };

  const handleCopyZoomLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Đã copy link Zoom!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Đã học</span>;
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Sắp tới</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Đã hủy</span>;
      default:
        return null;
    }
  };

  const completedCount = scheduleData.filter(s => s.status === 'completed').length;
  const upcomingCount = scheduleData.filter(s => s.status === 'upcoming').length;

  // Calendar helper functions
  const getMonthName = (date: Date) => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return months[date.getMonth()];
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getSessionsForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toLocaleDateString('vi-VN');
    
    return scheduleData.filter(session => session.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // Empty cells before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const sessions = getSessionsForDate(day);
      const today = isToday(day);

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            today ? 'bg-purple-50 border-purple-300' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              today ? 'text-purple-600' : 'text-gray-700'
            }`}>
              {day}
            </span>
            {sessions.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                {sessions.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {sessions.slice(0, 2).map((session) => (
              <div
                key={session.id}
                onClick={() => handleEditSession(session)}
                className={`p-2 rounded text-xs cursor-pointer transition-all hover:scale-105 ${
                  session.status === 'completed'
                    ? 'bg-green-100 border border-green-300'
                    : session.status === 'cancelled'
                    ? 'bg-red-100 border border-red-300'
                    : 'bg-blue-100 border border-blue-300'
                }`}
              >
                <p className="font-medium truncate">
                  {session.time.split('-')[0]}
                </p>
                <p className="truncate text-gray-700">
                  {session.topic}
                </p>
              </div>
            ))}
            {sessions.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{sessions.length - 2} buổi nữa
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <h3 className="text-lg font-medium">
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="px-2 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số buổi</p>
              <p className="text-2xl font-bold">{scheduleData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sắp tới</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Danh sách
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'calendar'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lịch tháng
          </button>
        </div>

        <button
          onClick={() => {
            setEditingSession(null);
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="size-5" />
          Thêm buổi học
        </button>
      </div>

      {/* Schedule List/Calendar */}
      {view === 'list' ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ngày</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Thời gian</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Chủ đề</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Địa điểm</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Điểm danh</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scheduleData.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{session.date}</p>
                        <p className="text-sm text-gray-600">{session.day}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="size-4" />
                        {session.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{session.topic}</p>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {session.room && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="size-4" />
                          {session.room}
                        </div>
                      )}
                      {session.zoomLink && (
                        <button
                          onClick={() => handleCopyZoomLink(session.zoomLink!)}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1"
                        >
                          <Video className="size-4" />
                          Copy Zoom
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {session.status === 'completed' ? (
                        <div className="text-sm">
                          <p className="font-medium text-green-600">
                            {session.attendance}/{session.total}
                          </p>
                          <p className="text-gray-600">
                            ({Math.round((session.attendance! / session.total) * 100)}%)
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSession(session)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        renderCalendar()
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingSession ? 'Chỉnh sửa buổi học' : 'Thêm buổi học mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSession(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="VD: 19:00-21:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề bài học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="VD: Reading Strategies - Skimming & Scanning"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Room & Zoom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="VD: A201, Online"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Zoom
                  </label>
                  <input
                    type="text"
                    value={formData.zoomLink}
                    onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm về buổi học..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Repeat Weekly */}
              {!editingSession && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="repeatWeekly"
                      checked={formData.repeatWeekly}
                      onChange={(e) => setFormData({ ...formData, repeatWeekly: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="repeatWeekly" className="text-sm font-medium text-gray-700">
                      Lặp lại hàng tuần
                    </label>
                  </div>

                  {formData.repeatWeekly && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tuần lặp lại
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={formData.repeatCount}
                        onChange={(e) => setFormData({ ...formData, repeatCount: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Sẽ tạo {formData.repeatCount} buổi học liên tiếp cách nhau 7 ngày
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSession(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={editingSession ? handleUpdateSession : handleAddSession}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingSession ? 'Cập nhật' : 'Thêm buổi học'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}