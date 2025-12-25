import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Clock, Eye, AlertCircle, Send, Search, BookOpen, Headphones, PenTool, Mic, Star, Users, List, ChevronDown, ChevronUp, Plus, Trash2, Edit2, Library, X, Calendar, Download, Filter, FileText } from 'lucide-react';
import { assignmentLibraryData, getSessionsByCourse, getAllAssignmentsByCourse, type SessionData, type Assignment, type CourseType } from '../../data/assignmentLibraryData';
import { allLibraryItems, searchLibraryItems, type LibraryItem, type LibraryItemType, type DifficultyLevel } from '../../data/teacherLibraryData';

type AssignmentStatus = 'pending' | 'approved' | 'rejected';
type ViewMode = 'myContributions' | 'library' | 'sessions' | 'upload';
type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type AddAssignmentMode = 'choose' | 'library' | 'upload';

interface ContributedAssignment extends Assignment {
  status: AssignmentStatus;
  contributor: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  feedback?: string;
  views?: number;
  downloads?: number;
}

interface SessionAssignment {
  id: string;
  title: string;
  skill: SkillType;
  duration: string;
  questions: number;
  source: 'library' | 'upload';
  libraryId?: number;
}

interface ContributeSession {
  id: string;
  sessionNumber: number;
  title: string;
  description: string;
  assignments: SessionAssignment[];
}

export function ContributeAssignmentsPage() {
  const [activeCourse, setActiveCourse] = useState<CourseType>('VSTEP Complete');
  const [viewMode, setViewMode] = useState<ViewMode>('sessions');
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  
  // Upload form states
  const [uploadCourse, setUploadCourse] = useState<CourseType>('VSTEP Complete');
  const [contributeSessions, setContributeSessions] = useState<ContributeSession[]>([
    {
      id: 'cs1',
      sessionNumber: 1,
      title: 'Buổi 1',
      description: 'Mô tả buổi học',
      assignments: []
    }
  ]);
  const [expandedContributeSessions, setExpandedContributeSessions] = useState<string[]>(['cs1']);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState<string | null>(null);
  const [addAssignmentMode, setAddAssignmentMode] = useState<AddAssignmentMode>('choose');
  
  // Library modal states
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillType | 'all'>('all');
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
  
  // New library modal states for parts and exams
  const [modalTabType, setModalTabType] = useState<LibraryItemType>('assignment');
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>('all');
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<LibraryItem[]>([]);

  // Upload form file
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [roadmapName, setRoadmapName] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');

  // History tab states
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<string>('all');
  const [historyFilterSkill, setHistoryFilterSkill] = useState<string>('all');

  // Mock data for history
  const myContributions: ContributedAssignment[] = [
    {
      id: 1,
      title: 'Reading Comprehension - Unit 5',
      description: 'Bài tập đọc hiểu với 3 passages và 20 câu hỏi',
      skill: 'reading',
      estimatedTime: 45,
      questions: 20,
      status: 'approved',
      contributor: 'Teacher A',
      submittedDate: '2024-12-12',
      views: 312,
      downloads: 145
    },
    {
      id: 2,
      title: 'Grammar Quiz - Present Perfect',
      description: 'Bài tập trắc nghiệm ngữ pháp Present Perfect',
      skill: 'reading',
      estimatedTime: 20,
      questions: 15,
      status: 'pending',
      contributor: 'Teacher A',
      submittedDate: '2024-12-19',
      views: 8,
      downloads: 0
    },
    {
      id: 3,
      title: 'Speaking Practice - Job Interview',
      description: 'Bài tập Speaking về phỏng vấn xin việc',
      skill: 'speaking',
      estimatedTime: 15,
      questions: 5,
      status: 'approved',
      contributor: 'Teacher A',
      submittedDate: '2024-12-14',
      views: 203,
      downloads: 89
    },
    {
      id: 4,
      title: 'Listening Practice - Academic Lectures',
      description: 'Bài tập nghe bài giảng học thuật',
      skill: 'listening',
      estimatedTime: 30,
      questions: 25,
      status: 'rejected',
      contributor: 'Teacher A',
      submittedDate: '2024-12-08',
      feedback: 'Audio chất lượng chưa đạt yêu cầu. Vui lòng thu lại với chất lượng cao hơn.',
      views: 5,
      downloads: 0
    },
    {
      id: 5,
      title: 'Writing Task 2 - Essay Practice',
      description: 'Bài tập viết luận với 5 đề bài khác nhau',
      skill: 'writing',
      estimatedTime: 40,
      questions: 5,
      status: 'approved',
      contributor: 'Teacher A',
      submittedDate: '2024-12-16',
      views: 178,
      downloads: 67
    },
  ];

  // Filter history
  const filteredHistory = myContributions.filter(assignment => {
    const matchesSearch = historySearchTerm === '' ||
      assignment.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(historySearchTerm.toLowerCase());
    const matchesStatus = historyFilterStatus === 'all' || assignment.status === historyFilterStatus;
    const matchesSkill = historyFilterSkill === 'all' || assignment.skill === historyFilterSkill;
    return matchesSearch && matchesStatus && matchesSkill;
  });

  // Stats for history
  const historyStats = {
    total: myContributions.length,
    approved: myContributions.filter(a => a.status === 'approved').length,
    pending: myContributions.filter(a => a.status === 'pending').length,
    rejected: myContributions.filter(a => a.status === 'rejected').length,
    totalDownloads: myContributions.reduce((sum, a) => sum + (a.downloads || 0), 0),
    totalViews: myContributions.reduce((sum, a) => sum + (a.views || 0), 0)
  };

  // Use real data from assignmentLibraryData
  const currentSessions = getSessionsByCourse(activeCourse);
  const allLibraryAssignments = getAllAssignmentsByCourse(activeCourse);

  // For upload modal, use uploadCourse assignments
  const uploadLibraryAssignments = getAllAssignmentsByCourse(uploadCourse);

  const filteredLibraryAssignments = allLibraryAssignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = skillFilter === 'all' || assignment.skill === skillFilter;
    
    return matchesSearch && matchesSkill;
  });

  // Filter for modal in upload view - use uploadCourse assignments
  const filteredModalAssignments = uploadLibraryAssignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = skillFilter === 'all' || assignment.skill === skillFilter;
    
    return matchesSearch && matchesSkill;
  });

  // NEW: Filter library items for modal with tabs (assignments, parts, exams)
  const filteredLibraryItems = searchLibraryItems(
    searchTerm,
    modalTabType,
    skillFilter === 'all' ? undefined : skillFilter,
    levelFilter === 'all' ? undefined : levelFilter
  );

  // NEW: Add library items to session
  const addLibraryItemsToSession = (sessionId: string) => {
    if (selectedLibraryItems.length === 0) return;

    const newAssignments: SessionAssignment[] = selectedLibraryItems.map(item => ({
      id: `${sessionId}-${item.id}-${Date.now()}-${Math.random()}`,
      title: item.title,
      skill: item.skill,
      duration: `${item.estimatedTime} phút`,
      questions: item.questions,
      source: 'library',
      libraryId: undefined
    }));

    setContributeSessions(contributeSessions.map(s => 
      s.id === sessionId 
        ? { ...s, assignments: [...s.assignments, ...newAssignments] }
        : s
    ));

    // Reset
    setSelectedLibraryItems([]);
    setShowAddAssignmentModal(null);
    setAddAssignmentMode('choose');
    setSearchTerm('');
    setSkillFilter('all');
    setLevelFilter('all');
    setModalTabType('assignment');
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const toggleContributeSession = (sessionId: string) => {
    setExpandedContributeSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const addNewSession = () => {
    const newSession: ContributeSession = {
      id: `cs${contributeSessions.length + 1}`,
      sessionNumber: contributeSessions.length + 1,
      title: `Buổi ${contributeSessions.length + 1}`,
      description: 'Mô tả buổi học',
      assignments: []
    };
    setContributeSessions([...contributeSessions, newSession]);
    setExpandedContributeSessions([...expandedContributeSessions, newSession.id]);
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Bạn có chắc muốn xóa buổi học này?')) {
      setContributeSessions(contributeSessions.filter(s => s.id !== sessionId));
    }
  };

  const handleContributeAssignment = (assignment: Assignment) => {
    // Switch to upload view
    setViewMode('upload');
    
    // Create new assignment and add to first session
    const newAssignment: SessionAssignment = {
      id: `contrib-${assignment.id}-${Date.now()}`,
      title: assignment.title,
      skill: assignment.skill,
      duration: `${assignment.estimatedTime} phút`,
      questions: assignment.questions,
      source: 'library',
      libraryId: assignment.id
    };

    // Add to first session
    setContributeSessions(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          assignments: [...updated[0].assignments, newAssignment]
        };
        // Expand first session
        setExpandedContributeSessions([updated[0].id]);
      }
      return updated;
    });

    // Show notification
    alert(`Đã thêm bài tập "${assignment.title}" vào lộ trình đóng góp!`);
  };

  const updateSession = (sessionId: string, field: 'title' | 'description', value: string) => {
    setContributeSessions(contributeSessions.map(s => 
      s.id === sessionId ? { ...s, [field]: value } : s
    ));
  };

  const removeAssignmentFromSession = (sessionId: string, assignmentId: string) => {
    setContributeSessions(contributeSessions.map(s => 
      s.id === sessionId 
        ? { ...s, assignments: s.assignments.filter(a => a.id !== assignmentId) }
        : s
    ));
  };

  const addAssignmentsFromLibrary = (sessionId: string) => {
    if (selectedAssignments.length === 0) return;

    const newAssignments: SessionAssignment[] = selectedAssignments.map(assignment => ({
      id: `${sessionId}-${assignment.id}-${Date.now()}`,
      title: assignment.title,
      skill: assignment.skill,
      duration: `${assignment.estimatedTime} phút`,
      questions: assignment.questions,
      source: 'library',
      libraryId: assignment.id
    }));

    setContributeSessions(contributeSessions.map(s => 
      s.id === sessionId 
        ? { ...s, assignments: [...s.assignments, ...newAssignments] }
        : s
    ));

    // Reset
    setSelectedAssignments([]);
    setShowAddAssignmentModal(null);
    setAddAssignmentMode('choose');
    setSearchTerm('');
    setSkillFilter('all');
  };

  const handleSubmitRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roadmapName.trim()) {
      alert('Vui lòng nhập tên lộ trình');
      return;
    }
    
    if (contributeSessions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 buổi học');
      return;
    }

    const totalAssignments = contributeSessions.reduce((sum, s) => sum + s.assignments.length, 0);
    if (totalAssignments === 0) {
      alert('Vui lòng thêm ít nhất 1 bài tập vào lộ trình');
      return;
    }

    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            alert('Đã gửi lộ trình đóng góp thành công! Admin sẽ kiểm duyệt trong 24-48h.');
            // Reset form
            setRoadmapName('');
            setRoadmapDescription('');
            setContributeSessions([{
              id: 'cs1',
              sessionNumber: 1,
              title: 'Buổi 1',
              description: 'Mô tả buổi học',
              assignments: []
            }]);
            setExpandedContributeSessions(['cs1']);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return BookOpen;
      case 'listening': return Headphones;
      case 'writing': return PenTool;
      case 'speaking': return Mic;
      default: return BookOpen;
    }
  };

  const getSkillColor = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'listening': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'writing': return 'text-green-600 bg-green-50 border-green-200';
      case 'speaking': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: AssignmentStatus) => {
    const badges = {
      pending: { label: 'Chờ duyệt', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
      approved: { label: 'Đã duyệt', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Từ chối', icon: XCircle, color: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 ${badge.color} rounded-full text-sm font-medium`}>
        <Icon className="size-4" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đóng góp bài tập chung</h1>
          <p className="text-sm text-gray-600 mt-1">Chia sẻ bài tập và lộ trình học tập với cộng đồng</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('sessions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              viewMode === 'sessions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="size-5" />
            Xem theo buổi học
          </button>
          <button
            onClick={() => setViewMode('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              viewMode === 'upload'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="size-5" />
            Đóng góp lộ trình
          </button>
          <button
            onClick={() => setViewMode('myContributions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              viewMode === 'myContributions'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="size-5" />
            Lịch sử đóng góp
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              viewMode === 'myContributions' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {myContributions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Course Selector */}
      {(viewMode === 'sessions' || viewMode === 'upload') && (
        <div className="flex gap-2 flex-wrap">
          {([
            'VSTEP Complete',
            'VSTEP Foundation', 
            'VSTEP Starter',
            'VSTEP Builder',
            'VSTEP Developer',
            'VSTEP Booster',
            'VSTEP Intensive',
            'VSTEP Practice',
            'VSTEP Premium',
            'VSTEP Master'
          ] as CourseType[]).map(course => (
            <button
              key={course}
              onClick={() => {
                if (viewMode === 'upload') {
                  setUploadCourse(course);
                } else {
                  setActiveCourse(course);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                (viewMode === 'upload' ? uploadCourse : activeCourse) === course
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      )}

      {/* Sessions View */}
      {viewMode === 'sessions' && (
        <div className="space-y-4">
          {currentSessions.map(session => {
            const isExpanded = expandedSessions.includes(session.id.toString());
            
            return (
              <div key={session.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200">
                {/* Session Header */}
                <button
                  onClick={() => toggleSession(session.id.toString())}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{session.sessionNumber}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{session.assignments.length} bài tập</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="size-5 text-gray-400" /> : <ChevronDown className="size-5 text-gray-400" />}
                </button>

                {/* Session Assignments */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
                    {session.assignments.map((assignment, index) => {
                      const SkillIcon = getSkillIcon(assignment.skill);
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${getSkillColor(assignment.skill)} border`}>
                            <SkillIcon className="size-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">{assignment.questions} câu</span>
                              <span className="text-xs text-gray-500">⏱️ {assignment.estimatedTime} phút</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload View */}
      {viewMode === 'upload' && (
        <div className="space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmitRoadmap} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Thông tin lộ trình</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên lộ trình <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={roadmapName}
                    onChange={(e) => setRoadmapName(e.target.value)}
                    placeholder="Ví dụ: Lộ trình VSTEP B2 - 4 tuần"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả lộ trình</label>
                  <textarea
                    value={roadmapDescription}
                    onChange={(e) => setRoadmapDescription(e.target.value)}
                    placeholder="Mô tả ngắn gọn về lộ trình học tập..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="space-y-4">
              {contributeSessions.map(session => {
                const isExpanded = expandedContributeSessions.includes(session.id);
                
                return (
                  <div key={session.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200">
                    {/* Session Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
                      <button
                        type="button"
                        onClick={() => toggleContributeSession(session.id)}
                        className="flex items-center gap-4 flex-1"
                      >
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">{session.sessionNumber}</span>
                        </div>
                        <div className="text-left">
                          {editingSession === session.id ? (
                            <input
                              type="text"
                              value={session.title}
                              onChange={(e) => updateSession(session.id, 'title', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-gray-900 border-2 border-emerald-500 rounded px-2 py-1"
                            />
                          ) : (
                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                          )}
                          <p className="text-sm text-gray-600">{session.assignments.length} bài tập</p>
                        </div>
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSession(editingSession === session.id ? null : session.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="size-5" />
                        </button>
                        {contributeSessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteSession(session.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleContributeSession(session.id)}
                        >
                          {isExpanded ? <ChevronUp className="size-5 text-gray-400" /> : <ChevronDown className="size-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Session Content */}
                    {isExpanded && (
                      <div className="p-6 space-y-4">
                        {editingSession === session.id && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả buổi học</label>
                            <textarea
                              value={session.description}
                              onChange={(e) => updateSession(session.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        )}

                        {/* Assignments */}
                        <div className="space-y-2">
                          {session.assignments.map(assignment => {
                            const SkillIcon = getSkillIcon(assignment.skill);
                            
                            return (
                              <div key={assignment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`p-2 rounded-lg ${getSkillColor(assignment.skill)} border`}>
                                  <SkillIcon className="size-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span>{assignment.questions} câu</span>
                                    <span>•</span>
                                    <span>{assignment.duration}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAssignmentFromSession(session.id, assignment.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Assignment Button */}
                        <button
                          type="button"
                          onClick={() => setShowAddAssignmentModal(session.id)}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="size-5" />
                          Thêm bài tập
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Session Button */}
              <button
                type="button"
                onClick={addNewSession}
                className="w-full px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="size-5" />
                Thêm buổi học mới
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setRoadmapName('');
                  setRoadmapDescription('');
                  setContributeSessions([{
                    id: 'cs1',
                    sessionNumber: 1,
                    title: 'Buổi 1',
                    description: 'Mô tả buổi học',
                    assignments: []
                  }]);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Đặt lại
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Đang gửi... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Gửi đóng góp
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Contributions (History) View */}
      {viewMode === 'myContributions' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.total}</h3>
              <p className="text-sm text-gray-600">Tổng bài tập</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="size-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.pending}</h3>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.approved}</h3>
              <p className="text-sm text-gray-600">Đã duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="size-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.rejected}</h3>
              <p className="text-sm text-gray-600">Từ chối</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Download className="size-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.totalDownloads}</h3>
              <p className="text-sm text-gray-600">Lượt tải</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Eye className="size-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{historyStats.totalViews}</h3>
              <p className="text-sm text-gray-600">Lượt xem</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Skill Filter */}
              <div>
                <select
                  value={historyFilterSkill}
                  onChange={(e) => setHistoryFilterSkill(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả kỹ năng</option>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="writing">Writing</option>
                  <option value="speaking">Speaking</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={historyFilterStatus}
                  onChange={(e) => setHistoryFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-purple-600">{filteredHistory.length}</span> bài tập
            </p>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.map((assignment) => {
              const SkillIcon = getSkillIcon(assignment.skill);
              const skillColorClass = getSkillColor(assignment.skill);
              
              return (
                <div key={assignment.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Skill Icon */}
                    <div className={`p-3 rounded-lg ${skillColorClass} border-2`}>
                      <SkillIcon className="size-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-md text-sm font-medium border-2 ${skillColorClass}`}>
                          {assignment.skill.charAt(0).toUpperCase() + assignment.skill.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          {assignment.questions} câu
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          ⏱️ {assignment.estimatedTime} phút
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          {formatDate(assignment.submittedDate)}
                        </span>
                      </div>

                      {/* Stats - Only for approved */}
                      {assignment.status === 'approved' && (
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Download className="size-4 text-green-600" />
                            <span className="font-medium">{assignment.downloads}</span> lượt tải
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Eye className="size-4 text-blue-600" />
                            <span className="font-medium">{assignment.views}</span> lượt xem
                          </span>
                        </div>
                      )}

                      {/* Feedback for rejected */}
                      {assignment.status === 'rejected' && assignment.feedback && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong className="font-semibold">Lý do từ chối:</strong> {assignment.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài tập</h3>
              <p className="text-gray-600">
                Không có bài tập nào phù hợp với bộ lọc hiện tại
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Thêm bài tập vào buổi học</h3>
              <button
                onClick={() => {
                  setShowAddAssignmentModal(null);
                  setAddAssignmentMode('choose');
                  setSelectedAssignments([]);
                  setSelectedLibraryItems([]);
                  setSearchTerm('');
                  setSkillFilter('all');
                  setLevelFilter('all');
                  setModalTabType('assignment');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {addAssignmentMode === 'choose' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAddAssignmentMode('library')}
                    className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <Library className="size-12 text-gray-400 group-hover:text-blue-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Chọn từ thư viện</h4>
                    <p className="text-sm text-gray-600">Chọn bài tập có sẵn trong thư viện</p>
                  </button>
                  <button
                    onClick={() => {
                      setAddAssignmentMode('upload');
                      alert('Tính năng upload đang được phát triển!');
                    }}
                    className="p-8 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                  >
                    <Upload className="size-12 text-gray-400 group-hover:text-emerald-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Upload bài tập mới</h4>
                    <p className="text-sm text-gray-600">Tải lên bài tập của riêng bạn</p>
                  </button>
                </div>
              )}

              {addAssignmentMode === 'library' && (
                <div className="space-y-4">
                  {/* Tabs: Bài tập | Parts | Bộ đề */}
                  <div className="flex gap-2 border-b border-gray-200 pb-3">
                    <button
                      onClick={() => setModalTabType('assignment')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                        modalTabType === 'assignment'
                          ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="size-4" />
                      Bài tập đơn
                    </button>
                    <button
                      onClick={() => setModalTabType('part')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                        modalTabType === 'part'
                          ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="size-4" />
                      Parts kỹ năng
                    </button>
                    <button
                      onClick={() => setModalTabType('exam')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                        modalTabType === 'exam'
                          ? 'bg-emerald-100 text-emerald-700 border-b-2 border-emerald-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <BookOpen className="size-4" />
                      Bộ đề 4 kỹ năng
                    </button>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {modalTabType !== 'exam' && (
                      <select
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value as SkillType | 'all')}
                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Tất cả kỹ năng</option>
                        <option value="reading">Reading</option>
                        <option value="listening">Listening</option>
                        <option value="writing">Writing</option>
                        <option value="speaking">Speaking</option>
                      </select>
                    )}
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value as DifficultyLevel | 'all')}
                      className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả trình độ</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                    </select>
                  </div>

                  {/* Selected Count */}
                  {selectedLibraryItems.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-sm text-blue-800 font-medium">
                        Đã chọn {selectedLibraryItems.length} {modalTabType === 'assignment' ? 'bài tập' : modalTabType === 'part' ? 'parts' : 'bộ đề'}
                      </span>
                      <button
                        onClick={() => setSelectedLibraryItems([])}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  )}

                  {/* Library Items List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredLibraryItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="size-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Không tìm thấy kết quả</p>
                      </div>
                    ) : (
                      filteredLibraryItems.map(item => {
                        const SkillIcon = getSkillIcon(item.skill);
                        const isSelected = selectedLibraryItems.some(i => i.id === item.id);
                        
                        return (
                          <label
                            key={item.id}
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLibraryItems([...selectedLibraryItems, item]);
                                } else {
                                  setSelectedLibraryItems(selectedLibraryItems.filter(i => i.id !== item.id));
                                }
                              }}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div className={`p-2.5 rounded-lg ${getSkillColor(item.skill)} border-2`}>
                              <SkillIcon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm flex-1">{item.title}</h4>
                                {item.level && (
                                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                    item.level === 'C1' ? 'bg-red-100 text-red-700' :
                                    item.level === 'B2' ? 'bg-orange-100 text-orange-700' :
                                    item.level === 'B1' ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {item.level}
                                  </span>
                                )}
                                {item.type === 'part' && item.partNumber && (
                                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-100 text-purple-700">
                                    Part {item.partNumber}
                                  </span>
                                )}
                                {item.type === 'exam' && (
                                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-700">
                                    Full Test
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="font-medium text-gray-700">{item.id}</span>
                                <span>•</span>
                                <span>{item.questions} câu</span>
                                <span>•</span>
                                <span>⏱️ {item.estimatedTime} phút</span>
                                {item.rating && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                      {item.rating.toFixed(1)}
                                    </span>
                                  </>
                                )}
                                {item.usageCount && (
                                  <>
                                    <span>•</span>
                                    <span>{item.usageCount} lượt dùng</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {addAssignmentMode === 'library' && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAddAssignmentMode('choose');
                    setSelectedLibraryItems([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => addLibraryItemsToSession(showAddAssignmentModal!)}
                  disabled={selectedLibraryItems.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Thêm {selectedLibraryItems.length > 0 && `(${selectedLibraryItems.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}