import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Video, Bell, ChevronLeft, ChevronRight, Plus, Filter, BookOpen, User, CheckCircle, AlertCircle, X } from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day';

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock data - Events/Classes
  const events = [
    {
      id: 1,
      title: 'Lớp B1 Sáng - Writing Task 1',
      type: 'class',
      startTime: '08:00',
      endTime: '10:00',
      date: '2025-12-16',
      location: 'Phòng 201',
      teacher: 'Thầy Nguyễn Văn A',
      students: 25,
      isOnline: false,
      color: 'blue',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Ôn tập Listening Part 2',
      type: 'study',
      startTime: '14:00',
      endTime: '15:30',
      date: '2025-12-16',
      location: 'Online',
      teacher: null,
      students: null,
      isOnline: true,
      color: 'green',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Deadline: Nộp bài Writing Task 2',
      type: 'deadline',
      startTime: '23:59',
      endTime: '23:59',
      date: '2025-12-16',
      location: null,
      teacher: null,
      students: null,
      isOnline: false,
      color: 'red',
      status: 'urgent',
    },
    {
      id: 4,
      title: 'Lớp B2 Chiều - Speaking Practice',
      type: 'class',
      startTime: '14:00',
      endTime: '16:00',
      date: '2025-12-17',
      location: 'Phòng 305',
      teacher: 'Cô Trần Thị B',
      students: 20,
      isOnline: false,
      color: 'orange',
      status: 'upcoming',
    },
    {
      id: 5,
      title: 'Mock Test VSTEP B2',
      type: 'exam',
      startTime: '09:00',
      endTime: '12:00',
      date: '2025-12-18',
      location: 'Phòng thi A',
      teacher: null,
      students: 50,
      isOnline: false,
      color: 'purple',
      status: 'upcoming',
    },
    {
      id: 6,
      title: 'Lớp B1 Sáng - Reading Comprehension',
      type: 'class',
      startTime: '08:00',
      endTime: '10:00',
      date: '2025-12-18',
      location: 'Phòng 201',
      teacher: 'Thầy Nguyễn Văn A',
      students: 25,
      isOnline: false,
      color: 'blue',
      status: 'upcoming',
    },
    {
      id: 7,
      title: 'Buổi tư vấn 1-1',
      type: 'meeting',
      startTime: '16:00',
      endTime: '17:00',
      date: '2025-12-19',
      location: 'Online - Zoom',
      teacher: 'Cô Lê Thị C',
      students: 1,
      isOnline: true,
      color: 'indigo',
      status: 'upcoming',
    },
    {
      id: 8,
      title: 'Luyện tập từ vựng',
      type: 'study',
      startTime: '20:00',
      endTime: '21:00',
      date: '2025-12-19',
      location: 'Tự học',
      teacher: null,
      students: null,
      isOnline: false,
      color: 'green',
      status: 'upcoming',
    },
  ];

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };

  // Get week days
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayEvents = getEventsForDate(selectedDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'class': return 'Lớp học';
      case 'study': return 'Tự học';
      case 'exam': return 'Thi';
      case 'deadline': return 'Deadline';
      case 'meeting': return 'Họp';
      default: return type;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class': return BookOpen;
      case 'study': return User;
      case 'exam': return CheckCircle;
      case 'deadline': return AlertCircle;
      case 'meeting': return Users;
      default: return CalendarIcon;
    }
  };

  // Navigate week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">📅 Lịch học</h1>
            <p className="text-indigo-100">
              Quản lý thời gian học tập hiệu quả
            </p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Plus className="size-5" />
            <span>Thêm sự kiện</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="size-8 text-blue-600" />
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Tuần này
            </span>
          </div>
          <p className="text-2xl mb-1">12</p>
          <p className="text-sm text-gray-600">Lớp học</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="size-8 text-green-600" />
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Hoàn thành
            </span>
          </div>
          <p className="text-2xl mb-1">8/12</p>
          <p className="text-sm text-gray-600">Buổi học</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="size-8 text-red-600" />
            <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Sắp tới
            </span>
          </div>
          <p className="text-2xl mb-1">3</p>
          <p className="text-sm text-gray-600">Deadline</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="size-8 text-purple-600" />
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Hôm nay
            </span>
          </div>
          <p className="text-2xl mb-1">4h 30m</p>
          <p className="text-sm text-gray-600">Thời gian học</p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h2 className="text-xl text-gray-900">
              {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hôm nay
            </button>
            
            {/* View mode buttons - commented for now, only week view */}
            {/* <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'day' ? 'Ngày' : mode === 'week' ? 'Tuần' : 'Tháng'}
                </button>
              ))}
            </div> */}
          </div>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
            <div key={day} className="text-center p-3 text-sm text-gray-600">
              {day}
            </div>
          ))}

          {/* Day cells */}
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isSelected = isSameDate(day, selectedDate);
            const isDayToday = isToday(day);

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`min-h-32 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : isDayToday
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`text-center mb-2 ${
                  isDayToday ? 'text-blue-600' : isSelected ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    isDayToday ? 'bg-blue-600 text-white' : ''
                  }`}>
                    {day.getDate()}
                  </div>
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1.5 rounded bg-${event.color}-100 text-${event.color}-700 truncate`}
                      title={event.title}
                    >
                      {event.startTime} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-600 text-center">
                      +{dayEvents.length - 3} sự kiện
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Events */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">
            Sự kiện ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
            {isToday(selectedDate) && (
              <span className="ml-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Hôm nay
              </span>
            )}
          </h2>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <Filter className="size-4" />
            <span>Lọc</span>
          </button>
        </div>

        {todayEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">Không có sự kiện</h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có lịch học hoặc sự kiện nào trong ngày này
            </p>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Thêm sự kiện mới
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayEvents.map((event) => {
              const Icon = getEventIcon(event.type);
              
              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                  }}
                  className={`p-5 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-md border-${event.color}-500 bg-${event.color}-50`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-${event.color}-100`}>
                      <Icon className={`size-6 text-${event.color}-600`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg mb-1">{event.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full bg-${event.color}-100 text-${event.color}-700`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                        </div>
                        {event.status === 'urgent' && (
                          <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                            Gấp
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="size-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            {event.isOnline ? <Video className="size-4" /> : <MapPin className="size-4" />}
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.teacher && (
                          <div className="flex items-center gap-2">
                            <User className="size-4" />
                            <span>{event.teacher}</span>
                          </div>
                        )}
                        {event.students && (
                          <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>{event.students} học viên</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Modal (Simple placeholder) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
              <h3 className="text-2xl">
                {selectedEvent ? 'Chi tiết sự kiện' : 'Thêm sự kiện mới'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-8">
              {selectedEvent ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Tiêu đề</h4>
                    <p className="text-lg text-gray-900">{selectedEvent.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Thời gian bắt đầu</h4>
                      <p className="text-gray-900">{selectedEvent.startTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Thời gian kết thúc</h4>
                      <p className="text-gray-900">{selectedEvent.endTime}</p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Địa điểm</h4>
                      <p className="text-gray-900">{selectedEvent.location}</p>
                    </div>
                  )}

                  {selectedEvent.teacher && (
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Giảng viên</h4>
                      <p className="text-gray-900">{selectedEvent.teacher}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Tham gia
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Bell className="size-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  Form thêm sự kiện mới (Coming soon)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
