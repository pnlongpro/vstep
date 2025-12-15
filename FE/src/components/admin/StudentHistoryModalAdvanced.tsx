import { useState } from 'react';
import { ArrowLeft, Search, Trophy, BookOpen, Headphones, Mic, PenTool, FileText, ChevronDown, Eye, Calendar, Clock, TrendingUp } from 'lucide-react';

interface StudentHistoryModalProps {
  onClose: () => void;
  student: any;
}

export function StudentHistoryModalAdvanced({ onClose, student }: StudentHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // Mock data cho thống kê
  const stats = {
    total: 10,
    reading: 2,
    listening: 2,
    writing: 2,
    speaking: 2,
    mockTest: 2
  };

  const averageScores = {
    overall: 7.4,
    reading: { score: 7.7, count: 2 },
    listening: { score: 7.3, count: 2 },
    writing: { score: 7.0, count: 2 },
    speaking: { score: 7.3, count: 2 }
  };

  // Mock data cho danh sách bài thi
  const examHistory = [
    {
      id: 1,
      title: 'Multiple Choice - Climate Change',
      type: 'reading',
      level: 'B2',
      date: '10:30 08/12/2025',
      duration: '25 phút',
      questions: '9/10 câu đúng',
      score: 8.5,
      status: 'Hiểu ý chính tốt',
      warning: 'Chú ý đến chi tiết nhỏ',
      breakdown: { reading: 8.5 },
      badges: ['Student']
    },
    {
      id: 2,
      title: 'VSTEP B1 - Full Test 01',
      type: 'fulltest',
      level: 'B1',
      date: '14:00 07/12/2025',
      duration: '145 phút',
      questions: '',
      score: 7.2,
      status: 'Reading và Speaking tốt',
      warning: 'Cải thiện Writing Task 2',
      breakdown: {
        reading: 7.5,
        listening: 7,
        writing: 6.8,
        speaking: 7.5
      },
      badges: ['Full Test']
    },
    {
      id: 3,
      title: 'Long Conversation - University Life',
      type: 'listening',
      level: 'B2',
      date: '16:20 06/12/2025',
      duration: '15 phút',
      questions: '8/10 câu đúng',
      score: 7.5,
      status: 'Nghe hiểu tốt',
      warning: '',
      breakdown: { listening: 7.5 },
      badges: ['Student', 'Teacher', 'Admin', 'Upload']
    },
    {
      id: 4,
      title: 'Essay Writing - Environmental Issues',
      type: 'writing',
      level: 'B2',
      date: '09:15 05/12/2025',
      duration: '40 phút',
      questions: '',
      score: 6.8,
      status: 'Cấu trúc tốt',
      warning: 'Cần phát triển ý sâu hơn',
      breakdown: { writing: 6.8 },
      badges: ['Student']
    },
    {
      id: 5,
      title: 'Speaking Part 3 - Daily Routine',
      type: 'speaking',
      level: 'B1',
      date: '11:30 04/12/2025',
      duration: '8 phút',
      questions: '',
      score: 7.3,
      status: 'Phát âm chuẩn',
      warning: 'Tăng độ tự tin',
      breakdown: { speaking: 7.3 },
      badges: ['Student', 'Teacher']
    }
  ];

  const getSkillIcon = (type: string) => {
    switch(type) {
      case 'reading': return <BookOpen className="size-5 text-blue-600" />;
      case 'listening': return <Headphones className="size-5 text-green-600" />;
      case 'writing': return <PenTool className="size-5 text-purple-600" />;
      case 'speaking': return <Mic className="size-5 text-orange-600" />;
      case 'fulltest': return <Trophy className="size-5 text-red-600" />;
      default: return <FileText className="size-5 text-gray-600" />;
    }
  };

  const getSkillColor = (type: string) => {
    switch(type) {
      case 'reading': return 'border-blue-200 bg-blue-50';
      case 'listening': return 'border-green-200 bg-green-50';
      case 'writing': return 'border-purple-200 bg-purple-50';
      case 'speaking': return 'border-orange-200 bg-orange-50';
      case 'fulltest': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Student': return 'bg-blue-100 text-blue-700';
      case 'Teacher': return 'bg-purple-100 text-purple-700';
      case 'Admin': return 'bg-red-100 text-red-700';
      case 'Upload': return 'bg-orange-100 text-orange-700';
      case 'Full Test': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredExams = examHistory.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = filterSkill === 'all' || exam.type === filterSkill;
    return matchesSearch && matchesSkill;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-4 bg-white z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="size-5 text-gray-600" />
            </button>
            <div>
              <h3 className="text-xl font-semibold">Lịch sử làm bài</h3>
              <p className="text-sm text-gray-500">Xem lại kết quả và phân tích chi tiết</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-3xl mb-1">{stats.total}</p>
                <p className="text-sm text-gray-600">Tổng bài</p>
              </div>
              <div className="bg-white border border-blue-200 rounded-xl p-4">
                <p className="text-3xl mb-1 text-blue-600">{stats.reading}</p>
                <p className="text-sm text-gray-600">Reading</p>
              </div>
              <div className="bg-white border border-green-200 rounded-xl p-4">
                <p className="text-3xl mb-1 text-green-600">{stats.listening}</p>
                <p className="text-sm text-gray-600">Listening</p>
              </div>
              <div className="bg-white border border-purple-200 rounded-xl p-4">
                <p className="text-3xl mb-1 text-purple-600">{stats.writing}</p>
                <p className="text-sm text-gray-600">Writing</p>
              </div>
              <div className="bg-white border border-orange-200 rounded-xl p-4">
                <p className="text-3xl mb-1 text-orange-600">{stats.speaking}</p>
                <p className="text-sm text-gray-600">Speaking</p>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-4">
                <p className="text-3xl mb-1 text-red-600">{stats.mockTest}</p>
                <p className="text-sm text-gray-600">Thi thử</p>
              </div>
            </div>

            {/* Average Scores */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Điểm trung bình từng kỹ năng</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="size-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Tổng quát</span>
                  </div>
                  <p className="text-3xl text-gray-900">{averageScores.overall}</p>
                  <p className="text-xs text-gray-500 mt-1">Điểm TB chung</p>
                </div>
                <div className="bg-white border-2 border-blue-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="size-5 text-blue-600" />
                    <span className="text-sm text-blue-600">Reading</span>
                  </div>
                  <p className="text-3xl text-blue-900">{averageScores.reading.score}</p>
                  <p className="text-xs text-gray-500 mt-1">{averageScores.reading.count} bài</p>
                </div>
                <div className="bg-white border-2 border-green-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="size-5 text-green-600" />
                    <span className="text-sm text-green-600">Listening</span>
                  </div>
                  <p className="text-3xl text-green-900">{averageScores.listening.score}</p>
                  <p className="text-xs text-gray-500 mt-1">{averageScores.listening.count} bài</p>
                </div>
                <div className="bg-white border-2 border-purple-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PenTool className="size-5 text-purple-600" />
                    <span className="text-sm text-purple-600">Writing</span>
                  </div>
                  <p className="text-3xl text-purple-900">{averageScores.writing.score}</p>
                  <p className="text-xs text-gray-500 mt-1">{averageScores.writing.count} bài</p>
                </div>
                <div className="bg-white border-2 border-orange-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="size-5 text-orange-600" />
                    <span className="text-sm text-orange-600">Speaking</span>
                  </div>
                  <p className="text-3xl text-orange-900">{averageScores.speaking.score}</p>
                  <p className="text-xs text-gray-500 mt-1">{averageScores.speaking.count} bài</p>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài luyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setFilterSkill('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterSkill('reading')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'reading' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Reading
              </button>
              <button
                onClick={() => setFilterSkill('listening')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'listening' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Listening
              </button>
              <button
                onClick={() => setFilterSkill('writing')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'writing' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Writing
              </button>
              <button
                onClick={() => setFilterSkill('speaking')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'speaking' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Speaking
              </button>
              <button
                onClick={() => setFilterSkill('fulltest')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterSkill === 'fulltest' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Thi thử
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                Tất cả cấp độ
                <ChevronDown className="size-4" />
              </button>
            </div>

            {/* Exam History List */}
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className={`border rounded-xl p-5 ${getSkillColor(exam.type)}`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 bg-white rounded-lg">
                      {getSkillIcon(exam.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Level */}
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{exam.title}</h5>
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          {exam.level}
                        </span>
                        {exam.type === 'fulltest' && (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                            Full Test
                          </span>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{exam.duration}</span>
                        </div>
                        {exam.questions && (
                          <span>{exam.questions}</span>
                        )}
                      </div>

                      {/* Status & Warning */}
                      <div className="space-y-1 mb-3">
                        {exam.status && (
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-green-600">✓</span>
                            <span className="text-gray-700">{exam.status}</span>
                          </div>
                        )}
                        {exam.warning && (
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600">!</span>
                            <span className="text-gray-700">{exam.warning}</span>
                          </div>
                        )}
                      </div>

                      {/* Score Breakdown */}
                      {exam.breakdown && (
                        <div className="flex items-center gap-3 mb-3">
                          {exam.breakdown.reading && (
                            <div className="bg-white px-3 py-1.5 rounded text-sm">
                              <span className="text-gray-600">Reading</span>
                              <span className="ml-2 font-medium text-blue-600">{exam.breakdown.reading}</span>
                            </div>
                          )}
                          {exam.breakdown.listening && (
                            <div className="bg-white px-3 py-1.5 rounded text-sm">
                              <span className="text-gray-600">Listening</span>
                              <span className="ml-2 font-medium text-green-600">{exam.breakdown.listening}</span>
                            </div>
                          )}
                          {exam.breakdown.writing && (
                            <div className="bg-white px-3 py-1.5 rounded text-sm">
                              <span className="text-gray-600">Writing</span>
                              <span className="ml-2 font-medium text-purple-600">{exam.breakdown.writing}</span>
                            </div>
                          )}
                          {exam.breakdown.speaking && (
                            <div className="bg-white px-3 py-1.5 rounded text-sm">
                              <span className="text-gray-600">Speaking</span>
                              <span className="ml-2 font-medium text-orange-600">{exam.breakdown.speaking}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Badges */}
                      {exam.badges && (
                        <div className="flex items-center gap-2">
                          {exam.badges.map((badge, idx) => (
                            <span key={idx} className={`px-2 py-1 text-xs rounded ${getBadgeColor(badge)}`}>
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Score & Action */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-3xl font-medium text-green-600">{exam.score}</p>
                        <p className="text-xs text-gray-500">điểm</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Eye className="size-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredExams.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>Không tìm thấy kết quả nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}