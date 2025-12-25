import { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, Eye, Plus, Star, TrendingUp, ChevronDown, ChevronUp, Headphones, PenTool, Mic, Grid3x3, List, Edit, Trash2, X, Save, Link, Upload, Check, XCircle, CheckCircle, Library, UserPlus, FileText } from 'lucide-react';
import { assignmentLibraryData, getSessionsByCourse, getAllAssignmentsByCourse, type Assignment, type SessionData, type CourseType } from '../../data/assignmentLibraryData';
import { allLibraryItems, searchLibraryItems, type LibraryItem, type LibraryItemType, type DifficultyLevel } from '../../data/teacherLibraryData';
import { AssignmentDetailModal } from './AssignmentDetailModal';
import { TeacherContributionsTab } from './TeacherContributionsTab';
import { AdminLibrarySelectionModal } from './AdminLibrarySelectionModal';
import { AdminAddAssignmentModal } from './AdminAddAssignmentModal';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type ViewMode = 'sessions' | 'all';
type TabMode = 'library' | 'contributions';
type LibraryModalTab = 'assignment' | 'part' | 'exam';

export function AdminAssignmentLibraryPage() {
  const [activeTab, setActiveTab] = useState<TabMode>('library');
  const [activeCourse, setActiveCourse] = useState<CourseType>('VSTEP Complete');
  const [viewMode, setViewMode] = useState<ViewMode>('sessions');
  const [expandedSessions, setExpandedSessions] = useState<string[]>(['vstep-complete-1']);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillType | 'all'>('all');
  const [editingSession, setEditingSession] = useState<SessionData | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [libraryModalTab, setLibraryModalTab] = useState<LibraryModalTab>('assignment');
  const [libraryModalItem, setLibraryModalItem] = useState<LibraryItem | null>(null);
  const [libraryModalSearchTerm, setLibraryModalSearchTerm] = useState('');
  const [customSessions, setCustomSessions] = useState<SessionData[]>([]);
  const [addingAssignmentToSession, setAddingAssignmentToSession] = useState<string | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [deletedAssignments, setDeletedAssignments] = useState<string[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<string[]>([]);
  const [addedAssignments, setAddedAssignments] = useState<Record<string, Assignment[]>>({});

  // Use real data from assignmentLibraryData + custom sessions
  const baseSessions = getSessionsByCourse(activeCourse);
  
  // Merge base sessions with added assignments
  const currentSessions = [...baseSessions, ...customSessions.filter(s => s.course === activeCourse)]
    .filter(s => !deletedSessions.includes(s.id))
    .map(session => ({
      ...session,
      assignments: [
        ...session.assignments,
        ...(addedAssignments[session.id] || [])
      ]
    }));
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
      case 'writing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'speaking': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Count assignments by course
  const countByCourse: Record<CourseType, number> = {
    'VSTEP Complete': assignmentLibraryData['VSTEP Complete'].length,
    'VSTEP Foundation': assignmentLibraryData['VSTEP Foundation'].length,
    'VSTEP Starter': assignmentLibraryData['VSTEP Starter'].length,
    'VSTEP Builder': assignmentLibraryData['VSTEP Builder'].length,
    'VSTEP Developer': assignmentLibraryData['VSTEP Developer'].length,
    'VSTEP Booster': assignmentLibraryData['VSTEP Booster'].length,
    'VSTEP Intensive': assignmentLibraryData['VSTEP Intensive'].length,
    'VSTEP Practice': assignmentLibraryData['VSTEP Practice'].length,
    'VSTEP Premium': assignmentLibraryData['VSTEP Premium'].length,
    'VSTEP Master': assignmentLibraryData['VSTEP Master'].length,
  };

  const countAssignmentsByCourse: Record<CourseType, number> = {
    'VSTEP Complete': getAllAssignmentsByCourse('VSTEP Complete').length,
    'VSTEP Foundation': getAllAssignmentsByCourse('VSTEP Foundation').length,
    'VSTEP Starter': getAllAssignmentsByCourse('VSTEP Starter').length,
    'VSTEP Builder': getAllAssignmentsByCourse('VSTEP Builder').length,
    'VSTEP Developer': getAllAssignmentsByCourse('VSTEP Developer').length,
    'VSTEP Booster': getAllAssignmentsByCourse('VSTEP Booster').length,
    'VSTEP Intensive': getAllAssignmentsByCourse('VSTEP Intensive').length,
    'VSTEP Practice': getAllAssignmentsByCourse('VSTEP Practice').length,
    'VSTEP Premium': getAllAssignmentsByCourse('VSTEP Premium').length,
    'VSTEP Master': getAllAssignmentsByCourse('VSTEP Master').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📚 Ngân hàng bài tập</h1>
            <p className="text-red-100">
              Quản lý bài tập theo buổi học và khóa học
            </p>
          </div>
          <button
            onClick={() => setShowAddSessionModal(true)}
            className="hidden flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            <Plus className="size-5" />
            Thêm buổi học
          </button>
        </div>
      </div>

      {/* Main Tabs - Library vs Contributions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Library className="size-5" />
            Thư viện bài tập
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'library' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {totalAssignments}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'contributions'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="size-5" />
            Đóng góp từ GV
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'contributions' ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}>
              6
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'contributions' ? (
        <TeacherContributionsTab />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="size-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{currentSessions.length}</h3>
              <p className="text-sm text-gray-600">Buổi học</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Grid3x3 className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalAssignments}</h3>
              <p className="text-sm text-gray-600">Bài tập</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="size-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {allAssignments.reduce((sum, a) => sum + a.usageCount, 0).toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">Lượt làm bài</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Star className="size-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {(allAssignments.reduce((sum, a) => sum + a.rating, 0) / allAssignments.length).toFixed(1)}
              </h3>
              <p className="text-sm text-gray-600">Đánh giá trung bình</p>
            </div>
          </div>

          {/* Course Tabs */}
          <div className="bg-white rounded-xl border shadow-sm p-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Complete');
                  setExpandedSessions(['vstep-complete-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Complete'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>🎯 VSTEP Complete</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Complete']} buổi • {countAssignmentsByCourse['VSTEP Complete']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Foundation');
                  setExpandedSessions(['vstep-foundation-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Foundation'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>📚 VSTEP Foundation</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Foundation']} buổi • {countAssignmentsByCourse['VSTEP Foundation']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Starter');
                  setExpandedSessions(['vstep-starter-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Starter'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>🚀 VSTEP Starter</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Starter']} buổi • {countAssignmentsByCourse['VSTEP Starter']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Builder');
                  setExpandedSessions(['vstep-builder-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Builder'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>🏗️ VSTEP Builder</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Builder']} buổi • {countAssignmentsByCourse['VSTEP Builder']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Developer');
                  setExpandedSessions(['vstep-developer-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Developer'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>💻 VSTEP Developer</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Developer']} buổi • {countAssignmentsByCourse['VSTEP Developer']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Booster');
                  setExpandedSessions(['vstep-booster-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Booster'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>⚡ VSTEP Booster</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Booster']} buổi • {countAssignmentsByCourse['VSTEP Booster']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Intensive');
                  setExpandedSessions(['vstep-intensive-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Intensive'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>🔥 VSTEP Intensive</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Intensive']} buổi • {countAssignmentsByCourse['VSTEP Intensive']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Practice');
                  setExpandedSessions(['vstep-practice-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Practice'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>📝 VSTEP Practice</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Practice']} buổi • {countAssignmentsByCourse['VSTEP Practice']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Premium');
                  setExpandedSessions(['vstep-premium-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Premium'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>👑 VSTEP Premium</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Premium']} buổi • {countAssignmentsByCourse['VSTEP Premium']} bài</div>
              </button>
              <button
                onClick={() => {
                  setActiveCourse('VSTEP Master');
                  setExpandedSessions(['vstep-master-1']);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCourse === 'VSTEP Master'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div>🏆 VSTEP Master</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse['VSTEP Master']} buổi • {countAssignmentsByCourse['VSTEP Master']} bài</div>
              </button>
            </div>
          </div>

          {/* View Mode Toggle & Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('sessions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'sessions'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="size-4" />
                  Theo buổi học
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Grid3x3 className="size-4" />
                  Tất cả bài tập
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Skill Filter */}
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value as SkillType | 'all')}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>
          </div>

          {/* Sessions View */}
          {viewMode === 'sessions' && (
            <div className="space-y-4">
              {currentSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
                  {/* Session Header */}
                  <div 
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSession(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            Buổi {session.sessionNumber}
                          </span>
                          <h3 className="font-semibold text-gray-900">{session.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Grid3x3 className="size-4" />
                            {session.assignments.filter(a => !deletedAssignments.includes(a.id)).length} bài tập
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock className="size-4" />
                            {session.assignments.filter(a => !deletedAssignments.includes(a.id)).reduce((sum, a) => sum + a.estimatedTime, 0)} phút
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Users className="size-4" />
                            {session.assignments.filter(a => !deletedAssignments.includes(a.id)).reduce((sum, a) => sum + a.usageCount, 0)} lượt làm
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSession(session);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="size-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Xóa buổi học "${session.title}"?\n\nLưu ý: Tất cả bài tập trong buổi học sẽ bị xóa theo.`)) {
                              // Remove from customSessions
                              setCustomSessions(prev => prev.filter(s => s.id !== session.id));
                              // Remove from expandedSessions
                              setExpandedSessions(prev => prev.filter(id => id !== session.id));
                              // Add to deletedSessions
                              setDeletedSessions(prev => [...prev, session.id]);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </button>
                        {expandedSessions.includes(session.id) ? (
                          <ChevronUp className="size-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="size-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Session Assignments */}
                  {expandedSessions.includes(session.id) && (
                    <div className="border-t-2 border-gray-200 bg-gray-50 p-5">
                      {/* Add Assignment Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingAssignmentToSession(session.id);
                          setShowLibraryModal(true);
                        }}
                        className="w-full mb-3 px-4 py-3 bg-white border-2 border-dashed border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <Plus className="size-5" />
                        Thêm bài tập vào buổi học này
                      </button>

                      <div className="space-y-3">
                        {session.assignments.filter(a => !deletedAssignments.includes(a.id)).map((assignment) => (
                          <div key={assignment.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getSkillColor(assignment.skill)}`}>
                                    {getSkillIcon(assignment.skill)}
                                    {assignment.skill.toUpperCase()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                                    {assignment.difficulty === 'easy' ? 'Dễ' : assignment.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                                  </span>
                                  <div className="flex items-center gap-1 text-yellow-600">
                                    <Star className="size-4 fill-yellow-600" />
                                    <span className="text-sm font-medium">{assignment.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{assignment.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{assignment.questions} câu hỏi</span>
                                  <span>•</span>
                                  <span>{assignment.estimatedTime} phút</span>
                                  <span>•</span>
                                  <span>{assignment.usageCount} lượt làm</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingAssignment(assignment)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit className="size-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Xóa bài tập "${assignment.title}"?`)) {
                                      setDeletedAssignments(prev => [...prev, assignment.id]);
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setShowDetailModal(true);
                                  }}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                  Xem chi tiết
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Session Button at Bottom */}
              <button
                onClick={() => setShowAddSessionModal(true)}
                className="w-full px-6 py-4 bg-white border-3 border-dashed border-red-300 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="size-6" />
                <span className="text-lg">Thêm buổi học mới</span>
              </button>
            </div>
          )}

          {/* All Assignments View */}
          {viewMode === 'all' && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
              <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Hiển thị <span className="font-semibold text-red-600">{filteredAssignments.length}</span> / {totalAssignments} bài tập
                </p>
              </div>
              <div className="divide-y-2 divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getSkillColor(assignment.skill)}`}>
                            {getSkillIcon(assignment.skill)}
                            {assignment.skill.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty === 'easy' ? 'Dễ' : assignment.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                            {assignment.course}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="size-4 fill-yellow-600" />
                            <span className="text-sm font-medium">{assignment.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{assignment.questions} câu hỏi</span>
                          <span>•</span>
                          <span>{assignment.estimatedTime} phút</span>
                          <span>•</span>
                          <span>{assignment.usageCount} lượt làm</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {assignment.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingAssignment(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="size-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Xóa bài tập này?')) {
                              // Handle delete
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowDetailModal(true);
                          }}
                          className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAssignments.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài tập</h3>
              <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}

          {/* Assignment Detail Modal */}
          {showDetailModal && selectedAssignment && (
            <AssignmentDetailModal
              assignment={selectedAssignment}
              onClose={() => setShowDetailModal(false)}
            />
          )}

          {/* Add/Edit Session Modal */}
          {(showAddSessionModal || editingSession) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingSession ? 'Chỉnh sửa buổi học' : 'Thêm buổi học mới'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddSessionModal(false);
                      setEditingSession(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const sessionNumber = parseInt(formData.get('sessionNumber') as string);
                    const title = formData.get('title') as string;
                    const description = formData.get('description') as string;
                    const course = formData.get('course') as CourseType;

                    if (editingSession) {
                      // Update existing session
                      setCustomSessions(prev => 
                        prev.map(s => 
                          s.id === editingSession.id 
                            ? { ...s, sessionNumber, title, description, course }
                            : s
                        )
                      );
                    } else {
                      // Add new session
                      const newSession: SessionData = {
                        id: `custom-${course.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                        sessionNumber,
                        title,
                        description,
                        course,
                        assignments: []
                      };
                      setCustomSessions(prev => [...prev, newSession]);
                      setExpandedSessions(prev => [...prev, newSession.id]);
                    }
                    
                    setShowAddSessionModal(false);
                    setEditingSession(null);
                  }}
                  className="p-6 space-y-4"
                >
                  {/* Session Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số buổi học *
                    </label>
                    <input
                      type="number"
                      name="sessionNumber"
                      required
                      min="1"
                      defaultValue={editingSession?.sessionNumber || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="1"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề buổi học *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingSession?.title || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Làm quen với VSTEP Reading"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      defaultValue={editingSession?.description || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Mô tả nội dung buổi học..."
                    />
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khóa học *
                    </label>
                    <select
                      name="course"
                      required
                      defaultValue={activeCourse}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="VSTEP Complete">🎓 VSTEP Complete</option>
                      <option value="VSTEP Foundation">📚 VSTEP Foundation</option>
                      <option value="VSTEP Starter">🚀 VSTEP Starter</option>
                      <option value="VSTEP Builder">📖 VSTEP Builder</option>
                      <option value="VSTEP Developer">💻 VSTEP Developer</option>
                      <option value="VSTEP Booster">⚡ VSTEP Booster</option>
                      <option value="VSTEP Intensive">🔥 VSTEP Intensive</option>
                      <option value="VSTEP Practice">📝 VSTEP Practice</option>
                      <option value="VSTEP Premium">👑 VSTEP Premium</option>
                      <option value="VSTEP Master">🏆 VSTEP Master</option>
                    </select>
                  </div>

                  {/* Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Lưu ý:</strong> Sau khi tạo buổi học, bạn có thể thêm bài tập vào buổi học bằng cách nhấn nút "Thêm bài tập" trong buổi học.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddSessionModal(false);
                        setEditingSession(null);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {editingSession ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Assignment Modal */}
          {editingAssignment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chỉnh sửa bài tập
                  </h3>
                  <button
                    onClick={() => setEditingAssignment(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Cập nhật bài tập - Chức năng đang phát triển!');
                    setEditingAssignment(null);
                  }}
                  className="p-6 space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề bài tập *
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={editingAssignment.title}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      required
                      rows={3}
                      defaultValue={editingAssignment.description}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setEditingAssignment(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Assignment to Session Modal */}
          {showLibraryModal && addingAssignmentToSession && (
            <AdminAddAssignmentModal
              isOpen={showLibraryModal}
              sessionId={addingAssignmentToSession}
              onClose={() => {
                setShowLibraryModal(false);
                setAddingAssignmentToSession(null);
              }}
              onSelect={(item) => {
                // Convert LibraryItem to Assignment
                const newAssignment: Assignment = {
                  id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  title: item.title,
                  description: item.description,
                  skill: item.skill,
                  difficulty: 'medium',
                  questions: item.questions,
                  estimatedTime: item.estimatedTime,
                  tags: [],
                  rating: item.rating || 0,
                  usageCount: 0,
                  course: activeCourse
                };

                // Add assignment to the session
                setAddedAssignments(prev => ({
                  ...prev,
                  [addingAssignmentToSession]: [
                    ...(prev[addingAssignmentToSession] || []),
                    newAssignment
                  ]
                }));

                setShowLibraryModal(false);
                setAddingAssignmentToSession(null);
              }}
            />
          )}

          {/* Library Selection Modal */}
          {libraryModalItem && (
            <AdminLibrarySelectionModal
              isOpen={libraryModalItem !== null}
              onClose={() => setLibraryModalItem(null)}
              onSelect={(item) => {
                alert(`Đã chọn: ${item.title} (${item.id})`);
                setLibraryModalItem(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}