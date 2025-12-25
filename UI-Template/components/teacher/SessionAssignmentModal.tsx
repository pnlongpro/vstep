import { useState } from 'react';
import { X, Calendar, Edit, Trash2, Plus, Library, BookOpen, Headphones, Mic, PenTool, Check, Clock, Send, FileUp, Target } from 'lucide-react';
import { getSessionsByCourse, getAssignmentsBySkill, type Assignment, type CourseType } from '../../data/assignmentLibraryData';
import { courseConfigs } from './courseConfigs';

interface SessionAssignment {
  id: string;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  questions: number;
  dueDate?: string;
  fromLibrary?: boolean;
  documentId?: number;
}

interface SessionConfig {
  sessionNumber: number;
  date: string;
  title: string;
  assignments: SessionAssignment[];
}

interface SessionAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classLevel: string;
  courseName?: string; // Add courseName prop to get correct session count
  startDate: string;
  onConfirm: (sessions: SessionConfig[]) => void;
}

const generateSessionDates = (startDateStr: string, totalSessions: number = 36): string[] => {
  const dates: string[] = [];
  const startDate = new Date(startDateStr);
  let currentDate = new Date(startDate);
  const sessionDays = [2, 4]; // Tuesday = 2, Thursday = 4
  
  for (let i = 0; i < totalSessions; i++) {
    while (!sessionDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

const formatDateVN = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

const getSkillIcon = (skill: string) => {
  switch (skill) {
    case 'reading': return <BookOpen className="size-4" />;
    case 'listening': return <Headphones className="size-4" />;
    case 'writing': return <PenTool className="size-4" />;
    case 'speaking': return <Mic className="size-4" />;
    default: return null;
  }
};

const getSkillColor = (skill: string) => {
  switch (skill) {
    case 'reading': return 'bg-blue-100 text-blue-700';
    case 'listening': return 'bg-purple-100 text-purple-700';
    case 'writing': return 'bg-emerald-100 text-emerald-700';
    case 'speaking': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getSkillLabel = (skill: string) => {
  switch (skill) {
    case 'reading': return 'Đọc';
    case 'listening': return 'Nghe';
    case 'writing': return 'Viết';
    case 'speaking': return 'Nói';
    default: return skill;
  }
};

export function SessionAssignmentModal({ 
  isOpen, 
  onClose, 
  className, 
  classLevel,
  courseName, // Add courseName prop to get correct session count
  startDate, 
  onConfirm 
}: SessionAssignmentModalProps) {
  // Map classLevel (B1/B2/C1) to CourseType
  const getCourseTypeFromLevel = (level: string): CourseType => {
    switch (level) {
      case 'A2': return 'VSTEP Starter';
      case 'B1': return 'VSTEP Foundation';
      case 'B2': return 'VSTEP Complete';
      case 'C1': return 'VSTEP Master';
      default: return 'VSTEP Complete';
    }
  };
  
  const courseType = getCourseTypeFromLevel(classLevel);
  const realSessions = getSessionsByCourse(courseType);
  
  // Get total sessions from courseName or fallback to config
  const totalSessionsCount = courseName && courseConfigs[courseName] 
    ? courseConfigs[courseName].sessions 
    : realSessions.length;
  
  // Initialize sessions with real data from library
  const [sessions, setSessions] = useState<SessionConfig[]>(() => {
    const dates = generateSessionDates(startDate, totalSessionsCount);
    
    return realSessions.map((realSession, i) => {
      const date = dates[i];
      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + 3);
      
      return {
        sessionNumber: realSession.sessionNumber,
        date,
        title: realSession.title,
        assignments: realSession.assignments.map(assignment => ({
          id: `${realSession.sessionNumber}-${assignment.id}`,
          title: assignment.title,
          skill: assignment.skill,
          questions: assignment.questions,
          dueDate: dueDate.toISOString().split('T')[0],
          fromLibrary: true,
          documentId: assignment.id,
        })),
      };
    });
  });

  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [editingDateSession, setEditingDateSession] = useState<number | null>(null);
  
  // NEW: Exam Bank & Upload modals
  const [showExamBank, setShowExamBank] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [examBankFilter, setExamBankFilter] = useState<'all' | 'A2' | 'B1' | 'B2' | 'C1'>('all');
  
  // NEW: Session range selection
  const [sessionRangeStart, setSessionRangeStart] = useState(1);
  const [sessionRangeEnd, setSessionRangeEnd] = useState(totalSessionsCount);

  // Filter sessions based on range
  const filteredSessions = sessions.filter(
    s => s.sessionNumber >= sessionRangeStart && s.sessionNumber <= sessionRangeEnd
  );

  const handleAddAssignment = (sessionNumber: number, assignment: SessionAssignment) => {
    setSessions(prev => prev.map(s => {
      if (s.sessionNumber === sessionNumber) {
        return {
          ...s,
          assignments: [...s.assignments, assignment],
        };
      }
      return s;
    }));
  };

  const handleRemoveAssignment = (sessionNumber: number, assignmentId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.sessionNumber === sessionNumber) {
        return {
          ...s,
          assignments: s.assignments.filter(a => a.id !== assignmentId),
        };
      }
      return s;
    }));
  };

  const handleAddFromLibrary = (sessionNumber: number, doc: Assignment) => {
    const session = sessions.find(s => s.sessionNumber === sessionNumber);
    if (!session) return;

    const dueDate = new Date(session.date);
    dueDate.setDate(dueDate.getDate() + 3);

    const newAssignment: SessionAssignment = {
      id: `${sessionNumber}-library-${doc.id}`,
      title: doc.title,
      skill: doc.skill,
      questions: doc.questions,
      dueDate: dueDate.toISOString().split('T')[0],
      fromLibrary: true,
      documentId: doc.id,
    };

    handleAddAssignment(sessionNumber, newAssignment);
    setShowLibrary(false);
  };

  const handleDateChange = (sessionNumber: number, newDate: string) => {
    setSessions(prev => prev.map(s => {
      if (s.sessionNumber === sessionNumber) {
        // Update session date and recalculate due dates for all assignments
        const dueDate = new Date(newDate);
        dueDate.setDate(dueDate.getDate() + 3);
        
        return {
          ...s,
          date: newDate,
          assignments: s.assignments.map(assignment => ({
            ...assignment,
            dueDate: dueDate.toISOString().split('T')[0],
          })),
        };
      }
      return s;
    }));
    setEditingDateSession(null);
  };

  const totalAssignments = sessions.reduce((acc, s) => acc + s.assignments.length, 0);

  // Get library documents based on course type
  const allLibraryDocs = getSessionsByCourse(courseType).flatMap(session => session.assignments);
  
  const filteredLibrary = libraryFilter === 'all' 
    ? allLibraryDocs
    : allLibraryDocs.filter(doc => doc.skill === libraryFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🗓️ Cấu hình lịch giao bài tập</h2>
            <p className="text-sm text-gray-600 mt-1">
              Lớp: <strong>{className}</strong> • {totalAssignments} bài tập cho {totalSessionsCount} buổi học
            </p>
          </div>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 p-6 border-b bg-gray-50">
          <div className="bg-white border border-emerald-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-600">{totalSessionsCount}</div>
            <div className="text-xs text-emerald-700">Buổi học</div>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{totalAssignments}</div>
            <div className="text-xs text-blue-700">Bài tập</div>
          </div>
          <div className="bg-white border border-purple-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">{Math.ceil(totalSessionsCount / 2)}</div>
            <div className="text-xs text-purple-700">Tuần</div>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">{classLevel}</div>
            <div className="text-xs text-orange-700">Trình độ</div>
          </div>
        </div>

        {/* Session Range Selector */}
        <div className="px-6 py-4 border-b bg-emerald-50">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-700">📅 Chọn buổi học:</div>
            <div className="flex items-center gap-2">
              <select
                value={sessionRangeStart}
                onChange={(e) => setSessionRangeStart(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {Array.from({ length: totalSessionsCount }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Buổi {num}</option>
                ))}
              </select>
              <span className="text-gray-600 font-medium">đến</span>
              <select
                value={sessionRangeEnd}
                onChange={(e) => setSessionRangeEnd(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {Array.from({ length: totalSessionsCount }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} disabled={num < sessionRangeStart}>
                    Buổi {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1"></div>
            <button
              onClick={() => {
                setSessionRangeStart(1);
                setSessionRangeEnd(totalSessionsCount);
              }}
              className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Chọn tất cả {totalSessionsCount} buổi
            </button>
            <div className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
              {filteredSessions.length} buổi được chọn
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <div 
                key={session.sessionNumber}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-300 transition-colors"
              >
                {/* Session Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {session.sessionNumber}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{session.title}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Calendar className="size-3" />
                        {editingDateSession === session.sessionNumber ? (
                          <input
                            type="date"
                            value={session.date}
                            onChange={(e) => handleDateChange(session.sessionNumber, e.target.value)}
                            onBlur={() => setEditingDateSession(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setEditingDateSession(null);
                              if (e.key === 'Enter') setEditingDateSession(null);
                            }}
                            autoFocus
                            className="px-2 py-1 border border-emerald-500 rounded bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDateSession(session.sessionNumber);
                            }}
                            className="hover:text-emerald-600 hover:underline transition-colors cursor-pointer"
                            title="Click để đổi ngày học"
                          >
                            {formatDateVN(session.date)}
                          </button>
                        )}
                        <span>•</span>
                        <span>{session.assignments.length} bài tập</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    onClick={() => setEditingSession(editingSession === session.sessionNumber ? null : session.sessionNumber)}
                    title="Chỉnh sửa buổi học"
                  >
                    <Edit className="size-4" />
                  </button>
                </div>

                {/* Assignments */}
                <div className="p-4 bg-white">
                  <div className="space-y-2">
                    {session.assignments.map((assignment) => (
                      <div 
                        key={assignment.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg group hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 ${getSkillColor(assignment.skill)} rounded-lg`}>
                            {getSkillIcon(assignment.skill)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{assignment.title}</div>
                            <div className="text-xs text-gray-600 flex items-center gap-3 mt-1">
                              <span>{assignment.questions} câu</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                Hạn: {assignment.dueDate ? formatDateVN(assignment.dueDate) : 'Chưa đặt'}
                              </span>
                              {assignment.fromLibrary && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600 flex items-center gap-1">
                                    <Library className="size-3" />
                                    Từ thư viện
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {editingSession === session.sessionNumber && (
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            onClick={() => handleRemoveAssignment(session.sessionNumber, assignment.id)}
                            title="Xóa bài tập"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Assignment Buttons */}
                  {editingSession === session.sessionNumber && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        className="px-3 py-2.5 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors flex flex-col items-center justify-center gap-1"
                        onClick={() => {
                          setShowLibrary(true);
                        }}
                      >
                        <Library className="size-5" />
                        <span className="font-medium">Từ thư viện bài tập</span>
                      </button>
                      <button
                        className="px-3 py-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-sm text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center gap-1"
                        onClick={() => {
                          setShowExamBank(true);
                        }}
                      >
                        <Target className="size-5" />
                        <span className="font-medium">Từ ngân hàng đề</span>
                      </button>
                      <button
                        className="px-3 py-2.5 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-sm text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors flex flex-col items-center justify-center gap-1"
                        onClick={() => {
                          setShowUpload(true);
                        }}
                      >
                        <FileUp className="size-5" />
                        <span className="font-medium">Tải file lên</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t bg-gray-50">
          <button
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
            onClick={() => onConfirm(sessions)}
          >
            <Send className="size-5" />
            Xác nhận & Giao {totalAssignments} bài tập
          </button>
        </div>
      </div>

      {/* Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">📚 Thư viện bài tập</h3>
                <p className="text-sm text-gray-600 mt-1">Chọn bài tập từ thư viện đã được duyệt</p>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowLibrary(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    libraryFilter === 'all' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setLibraryFilter('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    libraryFilter === 'reading' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setLibraryFilter('reading')}
                >
                  📖 Đọc
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    libraryFilter === 'listening' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setLibraryFilter('listening')}
                >
                  🎧 Nghe
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    libraryFilter === 'writing' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setLibraryFilter('writing')}
                >
                  ✍️ Viết
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    libraryFilter === 'speaking' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setLibraryFilter('speaking')}
                >
                  🗣️ Nói
                </button>
              </div>
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredLibrary.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => editingSession && handleAddFromLibrary(editingSession, doc)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 ${getSkillColor(doc.skill)} rounded-lg`}>
                        {getSkillIcon(doc.skill)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{doc.title}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-3 mt-1">
                          <span className={`px-2 py-0.5 ${getSkillColor(doc.skill)} rounded`}>
                            {getSkillLabel(doc.skill)}
                          </span>
                          <span>{doc.level}</span>
                          <span>•</span>
                          <span>{doc.questions} câu</span>
                          <span>•</span>
                          <span className="text-green-600 flex items-center gap-1">
                            <Check className="size-3" />
                            Đã duyệt
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Bank Modal */}
      {showExamBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">🎯 Ngân hàng đề thi</h3>
                <p className="text-sm text-gray-600 mt-1">Chọn đề thi từ ngân hàng để giao cho học viên</p>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowExamBank(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Filter by Level */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examBankFilter === 'all' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setExamBankFilter('all')}
                >
                  Tất cả trình độ
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examBankFilter === 'A2' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setExamBankFilter('A2')}
                >
                  A2
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examBankFilter === 'B1' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setExamBankFilter('B1')}
                >
                  B1
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examBankFilter === 'B2' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setExamBankFilter('B2')}
                >
                  B2
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examBankFilter === 'C1' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setExamBankFilter('C1')}
                >
                  C1
                </button>
              </div>
            </div>

            {/* Exam List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {[
                  { id: 1, title: 'VSTEP B1 - Đề thi mẫu 2024', level: 'B1', questions: 40, duration: 120 },
                  { id: 2, title: 'VSTEP B2 - Full Test 01', level: 'B2', questions: 50, duration: 150 },
                  { id: 3, title: 'VSTEP C1 - Practice Exam 2024', level: 'C1', questions: 50, duration: 180 },
                  { id: 4, title: 'VSTEP B1 - Mock Test Q2 2024', level: 'B1', questions: 40, duration: 120 },
                  { id: 5, title: 'VSTEP B2 - Advanced Practice', level: 'B2', questions: 50, duration: 150 },
                ].filter(exam => examBankFilter === 'all' || exam.level === examBankFilter).map((exam) => (
                  <div 
                    key={exam.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (editingSession) {
                        const session = sessions.find(s => s.sessionNumber === editingSession);
                        if (session) {
                          const dueDate = new Date(session.date);
                          dueDate.setDate(dueDate.getDate() + 7); // 7 days for full exam
                          
                          const newAssignment: SessionAssignment = {
                            id: `${editingSession}-exam-${exam.id}`,
                            title: exam.title,
                            skill: 'reading', // Full exam includes all skills
                            questions: exam.questions,
                            dueDate: dueDate.toISOString().split('T')[0],
                            fromLibrary: false,
                            documentId: exam.id,
                          };
                          handleAddAssignment(editingSession, newAssignment);
                          setShowExamBank(false);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                        <Target className="size-5 text-indigo-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{exam.title}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-3 mt-1">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                            {exam.level}
                          </span>
                          <span>{exam.questions} câu</span>
                          <span>•</span>
                          <span>{exam.duration} phút</span>
                          <span>•</span>
                          <span className="text-green-600 flex items-center gap-1">
                            <Check className="size-3" />
                            Đầy đủ 4 kỹ năng
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">📤 Tải file bài tập lên</h3>
                <p className="text-sm text-gray-600 mt-1">Tải file PDF, DOC, hoặc DOCX để giao cho học viên</p>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowUpload(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-100 rounded-full">
                    <FileUp className="size-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Click hoặc kéo thả file vào đây</p>
                    <p className="text-sm text-gray-600 mt-1">Hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>

              {/* Assignment Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên bài tập</label>
                  <input
                    type="text"
                    placeholder="Nhập tên bài tập..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="reading">📖 Đọc</option>
                      <option value="listening">🎧 Nghe</option>
                      <option value="writing">✍️ Viết</option>
                      <option value="speaking">🗣️ Nói</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi</label>
                    <input
                      type="number"
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <button
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => setShowUpload(false)}
                >
                  Hủy
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                  onClick={() => {
                    // Add uploaded file as assignment
                    if (editingSession) {
                      const session = sessions.find(s => s.sessionNumber === editingSession);
                      if (session) {
                        const dueDate = new Date(session.date);
                        dueDate.setDate(dueDate.getDate() + 3);
                        
                        const newAssignment: SessionAssignment = {
                          id: `${editingSession}-upload-${Date.now()}`,
                          title: 'Bài tập từ file upload',
                          skill: 'reading',
                          questions: 10,
                          dueDate: dueDate.toISOString().split('T')[0],
                          fromLibrary: false,
                        };
                        handleAddAssignment(editingSession, newAssignment);
                        setShowUpload(false);
                      }
                    }
                  }}
                >
                  <FileUp className="size-5" />
                  Xác nhận & Thêm bài tập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}