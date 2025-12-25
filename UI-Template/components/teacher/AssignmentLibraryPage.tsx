import { useState } from 'react';
import { ArrowLeft, Search, Filter, BookOpen, Clock, Users, Eye, Plus, Star, TrendingUp, ChevronDown, ChevronUp, Headphones, PenTool, Mic, Grid3x3, List } from 'lucide-react';
import { assignmentLibraryData, getSessionsByCourse, getAllAssignmentsByCourse, type Assignment, type SessionData, type CourseType } from '../../data/assignmentLibraryData';

interface AssignmentLibraryPageProps {
  onBack: () => void;
  onSelectAssignment?: (assignment: Assignment) => void;
}

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type ViewMode = 'sessions' | 'all';

export function AssignmentLibraryPage({ onBack, onSelectAssignment }: AssignmentLibraryPageProps) {
  const [activeCourse, setActiveCourse] = useState<CourseType>('VSTEP Complete');
  const [viewMode, setViewMode] = useState<ViewMode>('sessions');
  const [expandedSessions, setExpandedSessions] = useState<string[]>(['vstep-complete-1']);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillType | 'all'>('all');

  // Use real data from assignmentLibraryData
  const currentSessions = getSessionsByCourse(activeCourse);
  const allAssignments = getAllAssignmentsByCourse(activeCourse);
  const totalAssignments = allAssignments.length;

  // Filter assignments
  const filteredAssignments = allAssignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = skillFilter === 'all' || assignment.skill === skillFilter;
    
    return matchesSearch && matchesSkill;
  });

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return <BookOpen className="size-4" />;
      case 'listening': return <Headphones className="size-4" />;
      case 'writing': return <PenTool className="size-4" />;
      case 'speaking': return <Mic className="size-4" />;
    }
  };

  const getSkillColor = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'listening': return 'bg-green-100 text-green-700 border-green-200';
      case 'writing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'speaking': return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getSkillLabel = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return 'Đọc';
      case 'listening': return 'Nghe';
      case 'writing': return 'Viết';
      case 'speaking': return 'Nói';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
    }
  };

  // Count by skill
  const countBySkill = {
    reading: allAssignments.filter(a => a.skill === 'reading').length,
    listening: allAssignments.filter(a => a.skill === 'listening').length,
    writing: allAssignments.filter(a => a.skill === 'writing').length,
    speaking: allAssignments.filter(a => a.skill === 'speaking').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📚 Thư viện bài tập</h1>
                <p className="text-sm text-gray-600">
                  {viewMode === 'sessions' ? 'Bài tập được sắp xếp theo buổi học' : 'Tất cả bài tập có sẵn'}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('sessions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'sessions'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="size-4" />
                Theo buổi học
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="size-4" />
                Tất cả bài tập
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="size-8 opacity-80" />
              <div className="text-3xl font-bold">{totalAssignments}</div>
            </div>
            <div className="text-sm opacity-90">Bài tập ({activeCourse})</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="size-8 opacity-80" />
              <div className="text-3xl font-bold">{currentSessions.length}</div>
            </div>
            <div className="text-sm opacity-90">Buổi học</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Star className="size-8 opacity-80" />
              <div className="text-3xl font-bold">4.6</div>
            </div>
            <div className="text-sm opacity-90">Đánh giá TB</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="size-8 opacity-80" />
              <div className="text-3xl font-bold">{filteredAssignments.length}</div>
            </div>
            <div className="text-sm opacity-90">Kết quả lọc</div>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="bg-white rounded-xl border shadow-sm p-2 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setActiveCourse('VSTEP Complete')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Complete'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>🎯 VSTEP Complete</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Complete'].length} buổi • {getAllAssignmentsByCourse('VSTEP Complete').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Foundation')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Foundation'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>📚 VSTEP Foundation</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Foundation'].length} buổi • {getAllAssignmentsByCourse('VSTEP Foundation').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Starter')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Starter'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>🚀 VSTEP Starter</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Starter'].length} buổi • {getAllAssignmentsByCourse('VSTEP Starter').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Builder')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Builder'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>🏗️ VSTEP Builder</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Builder'].length} buổi • {getAllAssignmentsByCourse('VSTEP Builder').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Developer')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Developer'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>💻 VSTEP Developer</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Developer'].length} buổi • {getAllAssignmentsByCourse('VSTEP Developer').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Booster')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Booster'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>⚡ VSTEP Booster</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Booster'].length} buổi • {getAllAssignmentsByCourse('VSTEP Booster').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Intensive')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Intensive'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>🔥 VSTEP Intensive</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Intensive'].length} buổi • {getAllAssignmentsByCourse('VSTEP Intensive').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Practice')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Practice'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>📝 VSTEP Practice</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Practice'].length} buổi • {getAllAssignmentsByCourse('VSTEP Practice').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Premium')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Premium'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>👑 VSTEP Premium</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Premium'].length} buổi • {getAllAssignmentsByCourse('VSTEP Premium').length} bài</div>
            </button>
            <button
              onClick={() => setActiveCourse('VSTEP Master')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeCourse === 'VSTEP Master'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>🏆 VSTEP Master</div>
              <div className="text-xs opacity-80 mt-1">{assignmentLibraryData['VSTEP Master'].length} buổi • {getAllAssignmentsByCourse('VSTEP Master').length} bài</div>
            </button>
          </div>
        </div>

        {/* View: All Assignments */}
        {viewMode === 'all' && (
          <>
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài tập theo tiêu đề, mô tả hoặc tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Skill Filters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSkillFilter('all')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      skillFilter === 'all'
                        ? 'bg-gray-800 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả ({totalAssignments})
                  </button>
                  <button
                    onClick={() => setSkillFilter('reading')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      skillFilter === 'reading'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="size-4" />
                    Đọc ({countBySkill.reading})
                  </button>
                  <button
                    onClick={() => setSkillFilter('listening')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      skillFilter === 'listening'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Headphones className="size-4" />
                    Nghe ({countBySkill.listening})
                  </button>
                  <button
                    onClick={() => setSkillFilter('writing')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      skillFilter === 'writing'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <PenTool className="size-4" />
                    Viết ({countBySkill.writing})
                  </button>
                  <button
                    onClick={() => setSkillFilter('speaking')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      skillFilter === 'speaking'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Mic className="size-4" />
                    Nói ({countBySkill.speaking})
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Hiển thị <strong>{filteredAssignments.length}</strong> bài tập
              {searchTerm && ` với từ khóa "${searchTerm}"`}
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all p-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${getSkillColor(assignment.skill)}`}>
                      {getSkillIcon(assignment.skill)}
                      <span className="text-xs font-semibold">{getSkillLabel(assignment.skill)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{assignment.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4 text-gray-400" />
                      <span className="text-gray-700">{assignment.estimatedTime} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="size-4 text-gray-400" />
                      <span className="text-gray-700">{assignment.questions} câu</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="size-4 text-gray-400" />
                      <span className="text-gray-700">{assignment.usageCount} lượt</span>
                    </div>
                    <div className={`text-sm font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                      {getDifficultyLabel(assignment.difficulty)}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {assignment.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {assignment.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{assignment.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                      onClick={() => onSelectAssignment && onSelectAssignment(assignment)}
                    >
                      <Plus className="size-4" />
                      Sử dụng
                    </button>
                    <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAssignments.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài tập</h3>
                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            )}
          </>
        )}

        {/* View: By Sessions */}
        {viewMode === 'sessions' && (
          <div className="space-y-4">
            {currentSessions.map((session) => {
              const isExpanded = expandedSessions.includes(session.id);
              
              return (
                <div key={session.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  {/* Session Header */}
                  <button
                    onClick={() => toggleSession(session.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                        activeCourse === 'Full Course' ? 'bg-blue-100 text-blue-700' :
                        activeCourse === 'Course 1' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {session.sessionNumber}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Buổi {session.sessionNumber}: {session.title}</h3>
                        <p className="text-sm text-gray-600">{session.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {session.assignments.length} bài tập
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Session Content */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <div className="space-y-3">
                        {session.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-white rounded-lg border-2 border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* Left: Assignment Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${getSkillColor(assignment.skill)}`}>
                                    {getSkillIcon(assignment.skill)}
                                    <span className="text-xs font-medium">{getSkillLabel(assignment.skill)}</span>
                                  </div>
                                  <span className={`text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                                    {getDifficultyLabel(assignment.difficulty)}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                                
                                {/* Stats Row */}
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="size-4" />
                                    <span>{assignment.estimatedTime} phút</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="size-4" />
                                    <span>{assignment.questions} câu hỏi</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                    <span>{assignment.rating.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="size-4" />
                                    <span>{assignment.usageCount} lượt dùng</span>
                                  </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {assignment.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex flex-col gap-2 min-w-[120px]">
                                <button
                                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                  onClick={() => onSelectAssignment && onSelectAssignment(assignment)}
                                >
                                  <Plus className="size-4" />
                                  Sử dụng
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Eye className="size-4" />
                                  Xem
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}