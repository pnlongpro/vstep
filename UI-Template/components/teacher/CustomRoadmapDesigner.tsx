import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, GripVertical, Upload, Library, BookOpen, Clock, X, Search, Headphones, PenTool, Mic, Star, Users, FileText, FolderOpen, Download, Calendar } from 'lucide-react';
import { assignmentLibraryData, getAllAssignmentsByCourse, type Assignment, type CourseType } from '../../data/assignmentLibraryData';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

interface SessionAssignment {
  id: string;
  title: string;
  skill: SkillType;
  duration: string;
  questions: number;
  source: 'library' | 'upload' | 'class-materials' | 'shared-materials';
  libraryId?: string;
}

interface MaterialDocument {
  id: string;
  title: string;
  skill: SkillType;
  description: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  rating: number;
}

interface RoadmapSession {
  id: string;
  sessionNumber: number;
  title: string;
  description: string;
  assignments: SessionAssignment[];
}

// Mock data for class materials
const classMaterialsData: MaterialDocument[] = [
  {
    id: 'cm1',
    title: 'Bài giảng Grammar - Present Perfect',
    skill: 'reading',
    description: 'Slide bài giảng chi tiết về thì hiện tại hoàn thành với ví dụ và bài tập',
    fileType: 'PPTX',
    fileSize: '2.3 MB',
    uploadedBy: 'Bạn',
    uploadDate: '15/12/2024',
    downloads: 45,
    rating: 4.8
  },
  {
    id: 'cm2',
    title: 'Tài liệu từ vựng Academic Words',
    skill: 'reading',
    description: 'Danh sách 500 từ vựng học thuật quan trọng cho VSTEP',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadedBy: 'Bạn',
    uploadDate: '12/12/2024',
    downloads: 67,
    rating: 4.9
  },
  {
    id: 'cm3',
    title: 'Bài tập Listening - Note-taking',
    skill: 'listening',
    description: 'Các bài tập luyện kỹ năng ghi chép trong bài nghe',
    fileType: 'DOCX',
    fileSize: '850 KB',
    uploadedBy: 'Bạn',
    uploadDate: '10/12/2024',
    downloads: 34,
    rating: 4.7
  },
  {
    id: 'cm4',
    title: 'Writing Template - Essay Structure',
    skill: 'writing',
    description: 'Các mẫu cấu trúc bài luận cho Writing Task 2',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadedBy: 'Bạn',
    uploadDate: '08/12/2024',
    downloads: 89,
    rating: 5.0
  }
];

// Mock data for shared materials
const sharedMaterialsData: MaterialDocument[] = [
  {
    id: 'sm1',
    title: 'Speaking Topics - Advanced Level',
    skill: 'speaking',
    description: 'Tổng hợp 100+ chủ đề speaking cho trình độ C1',
    fileType: 'PDF',
    fileSize: '3.5 MB',
    uploadedBy: 'Nguyễn Văn A',
    uploadDate: '14/12/2024',
    downloads: 234,
    rating: 4.9
  },
  {
    id: 'sm2',
    title: 'Phrasal Verbs Complete Guide',
    skill: 'reading',
    description: 'Hướng dẫn đầy đủ về phrasal verbs thường gặp trong VSTEP',
    fileType: 'PPTX',
    fileSize: '4.1 MB',
    uploadedBy: 'Trần Thị B',
    uploadDate: '13/12/2024',
    downloads: 456,
    rating: 4.8
  },
  {
    id: 'sm3',
    title: 'Listening Practice - TED Talks',
    skill: 'listening',
    description: 'Bài tập nghe với các TED Talks có transcript',
    fileType: 'PDF',
    fileSize: '2.7 MB',
    uploadedBy: 'Lê Văn C',
    uploadDate: '11/12/2024',
    downloads: 178,
    rating: 4.7
  },
  {
    id: 'sm4',
    title: 'Writing Sample Essays - Band 8+',
    skill: 'writing',
    description: 'Tuyển tập các bài luận mẫu điểm cao',
    fileType: 'DOCX',
    fileSize: '1.9 MB',
    uploadedBy: 'Phạm Thị D',
    uploadDate: '09/12/2024',
    downloads: 567,
    rating: 5.0
  },
  {
    id: 'sm5',
    title: 'Grammar Exercises - All Tenses',
    skill: 'reading',
    description: 'Bài tập ngữ pháp về tất cả các thì trong tiếng Anh',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploadedBy: 'Hoàng Văn E',
    uploadDate: '07/12/2024',
    downloads: 389,
    rating: 4.6
  }
];

export function CustomRoadmapDesigner() {
  const [activeLevel, setActiveLevel] = useState<CourseType>('VSTEP Complete');
  const [sessions, setSessions] = useState<RoadmapSession[]>([
    {
      id: 's1',
      sessionNumber: 1,
      title: 'Giới thiệu & Từ vựng cơ bản',
      description: 'Làm quen với format bài thi và từ vựng chủ đề thường gặp',
      assignments: []
    }
  ]);
  const [expandedSessions, setExpandedSessions] = useState<string[]>(['s1']);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState<string | null>(null);
  const [addAssignmentMode, setAddAssignmentMode] = useState<'choose' | 'library' | 'upload' | 'class-materials' | 'shared-materials'>('choose');
  
  // Library modal states
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillType | 'all'>('all');
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialDocument[]>([]);
  
  // Upload modal states
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    skill: 'reading' as SkillType,
    duration: '',
    questions: '',
    description: ''
  });
  
  const allLibraryAssignments = getAllAssignmentsByCourse(activeLevel);

  const filteredLibraryAssignments = allLibraryAssignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const addNewSession = () => {
    const newSession: RoadmapSession = {
      id: `s${sessions.length + 1}`,
      sessionNumber: sessions.length + 1,
      title: `Buổi ${sessions.length + 1}`,
      description: 'Mô tả buổi học',
      assignments: []
    };
    setSessions([...sessions, newSession]);
    setExpandedSessions([...expandedSessions, newSession.id]);
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Bạn có chắc muốn xóa buổi học này?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };

  const updateSession = (sessionId: string, field: 'title' | 'description', value: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, [field]: value } : s
    ));
  };

  const removeAssignmentFromSession = (sessionId: string, assignmentId: string) => {
    setSessions(sessions.map(s => 
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

    setSessions(sessions.map(s => 
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

  const countBySkill = {
    reading: allLibraryAssignments.filter(a => a.skill === 'reading').length,
    listening: allLibraryAssignments.filter(a => a.skill === 'listening').length,
    writing: allLibraryAssignments.filter(a => a.skill === 'writing').length,
    speaking: allLibraryAssignments.filter(a => a.skill === 'speaking').length,
  };

  const totalAssignments = sessions.reduce((sum, s) => sum + s.assignments.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎨 Thiết kế lộ trình học tập riêng của giáo viên</h1>
            <p className="text-purple-100">
              Tự do tạo lộ trình học tập riêng cho lớp của bạn
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{sessions.length}</div>
            <div className="text-sm text-purple-100">Buổi học</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="size-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{sessions.length}</div>
          </div>
          <div className="text-sm text-gray-600">Tổng buổi học</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Library className="size-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalAssignments}</div>
          </div>
          <div className="text-sm text-gray-600">Tổng bài tập</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="size-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">~12</div>
          </div>
          <div className="text-sm text-gray-600">Tuần học</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="size-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">3</div>
          </div>
          <div className="text-sm text-gray-600">Lớp đang dùng</div>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="bg-white rounded-xl border shadow-sm p-2 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveLevel('VSTEP Complete')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Complete'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">🎯 VSTEP Complete</div>
            <div className="text-xs opacity-80">{sessions.filter(s => true).length} buổi • {sessions.reduce((sum, s) => sum + s.assignments.length, 0)} bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Foundation')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Foundation'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">📚 VSTEP Foundation</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Starter')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Starter'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">🚀 VSTEP Starter</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Builder')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Builder'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">🏗️ VSTEP Builder</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Developer')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Developer'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">💻 VSTEP Developer</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Booster')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Booster'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">⚡ VSTEP Booster</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Intensive')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Intensive'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">🔥 VSTEP Intensive</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Practice')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Practice'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">📝 VSTEP Practice</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Premium')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Premium'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">👑 VSTEP Premium</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
          <button
            onClick={() => setActiveLevel('VSTEP Master')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeLevel === 'VSTEP Master'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold">🏆 VSTEP Master</div>
            <div className="text-xs opacity-80">0 buổi • 0 bài</div>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4 mb-6">
        {sessions.map((session) => {
          const isExpanded = expandedSessions.includes(session.id);
          const isEditing = editingSession === session.id;

          return (
            <div key={session.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
              {/* Session Header */}
              <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="cursor-move">
                    <GripVertical className="size-5 text-gray-400" />
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                    activeLevel === 'B1' ? 'bg-blue-100 text-blue-700' :
                    activeLevel === 'B2' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {session.sessionNumber}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={session.title}
                          onChange={(e) => updateSession(session.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Tiêu đề buổi học"
                        />
                        <input
                          type="text"
                          value={session.description}
                          onChange={(e) => updateSession(session.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Mô tả buổi học"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900">Buổi {session.sessionNumber}: {session.title}</h3>
                        <p className="text-sm text-gray-600">{session.description}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingSession(isEditing ? null : session.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="size-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </button>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {session.assignments.length} bài tập
                  </span>
                  <button
                    onClick={() => toggleSession(session.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Session Content */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  {session.assignments.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {session.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-white rounded-lg border-2 border-gray-200 p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${getSkillColor(assignment.skill)}`}>
                              {getSkillIcon(assignment.skill)}
                              <span className="text-xs font-medium">{getSkillLabel(assignment.skill)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="size-4" />
                                  {assignment.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="size-4" />
                                  {assignment.questions} câu
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  assignment.source === 'library' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {assignment.source === 'library' ? '📚 Thư viện' : '📤 Upload'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAssignmentFromSession(session.id, assignment.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Library className="size-12 mx-auto mb-2 text-gray-300" />
                      <p>Chưa có bài tập nào trong buổi này</p>
                    </div>
                  )}

                  {/* Add Assignment Button */}
                  <button
                    onClick={() => setShowAddAssignmentModal(session.id)}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="size-5" />
                    Thêm bài tập vào buổi này
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Session Button */}
      <button
        onClick={addNewSession}
        className="w-full px-6 py-4 bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-700 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
      >
        <Plus className="size-5" />
        Thêm buổi học mới
      </button>

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Thêm bài tập vào buổi học</h2>
              <button
                onClick={() => {
                  setShowAddAssignmentModal(null);
                  setAddAssignmentMode('choose');
                  setSelectedAssignments([]);
                  setSearchTerm('');
                  setSkillFilter('all');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {addAssignmentMode === 'choose' && (
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setAddAssignmentMode('library')}
                    className="p-8 border-2 border-gray-200 hover:border-purple-400 rounded-xl transition-all group"
                  >
                    <Library className="size-16 mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Ngân hàng đề thi</h3>
                    <p className="text-gray-600">Sử dụng bài tập có sẵn trong thư viện</p>
                  </button>
                  <button
                    onClick={() => setAddAssignmentMode('upload')}
                    className="p-8 border-2 border-gray-200 hover:border-blue-400 rounded-xl transition-all group"
                  >
                    <Upload className="size-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Upload bài tập mới</h3>
                    <p className="text-gray-600">Tải lên bài tập từ máy tính</p>
                  </button>
                  <button
                    onClick={() => setAddAssignmentMode('class-materials')}
                    className="p-8 border-2 border-gray-200 hover:border-green-400 rounded-xl transition-all group"
                  >
                    <FileText className="size-16 mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Thư viện tài liệu lớp học</h3>
                    <p className="text-gray-600">Chọn tài liệu từ thư viện lớp học</p>
                  </button>
                  <button
                    onClick={() => setAddAssignmentMode('shared-materials')}
                    className="p-8 border-2 border-gray-200 hover:border-amber-400 rounded-xl transition-all group"
                  >
                    <FolderOpen className="size-16 mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Thư viện tài liệu chung</h3>
                    <p className="text-gray-600">Chọn tài liệu từ thư viện tài liệu chung</p>
                  </button>
                </div>
              )}

              {addAssignmentMode === 'library' && (
                <>
                  {/* Search & Filter */}
                  <div className="bg-gray-50 rounded-xl border p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm bài tập..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSkillFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          skillFilter === 'all'
                            ? 'bg-gray-800 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Tất cả
                      </button>
                      <button
                        onClick={() => setSkillFilter('reading')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          skillFilter === 'reading'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <BookOpen className="size-4" />
                        Đọc ({countBySkill.reading})
                      </button>
                      <button
                        onClick={() => setSkillFilter('listening')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          skillFilter === 'listening'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Headphones className="size-4" />
                        Nghe ({countBySkill.listening})
                      </button>
                      <button
                        onClick={() => setSkillFilter('writing')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          skillFilter === 'writing'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <PenTool className="size-4" />
                        Viết ({countBySkill.writing})
                      </button>
                      <button
                        onClick={() => setSkillFilter('speaking')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          skillFilter === 'speaking'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Mic className="size-4" />
                        Nói ({countBySkill.speaking})
                      </button>
                    </div>
                  </div>

                  {/* Selected Count */}
                  {selectedAssignments.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <p className="text-purple-900 font-medium">
                        Đã chọn {selectedAssignments.length} bài tập
                      </p>
                    </div>
                  )}

                  {/* Assignments Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {filteredLibraryAssignments.map((assignment) => {
                      const isSelected = selectedAssignments.some(a => a.id === assignment.id);
                      
                      return (
                        <button
                          key={assignment.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAssignments(selectedAssignments.filter(a => a.id !== assignment.id));
                            } else {
                              setSelectedAssignments([...selectedAssignments, assignment]);
                            }
                          }}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${getSkillColor(assignment.skill)}`}>
                              {getSkillIcon(assignment.skill)}
                              <span className="text-xs font-medium">{getSkillLabel(assignment.skill)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{assignment.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="size-4" />
                              {assignment.estimatedTime}p
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="size-4" />
                              {assignment.questions} câu
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="size-4" />
                              {assignment.usageCount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {addAssignmentMode === 'upload' && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Thông tin bài tập mới</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề bài tập *
                        </label>
                        <input
                          type="text"
                          value={uploadFormData.title}
                          onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                          placeholder="VD: Reading Comprehension - Environment"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kỹ năng *
                          </label>
                          <select
                            value={uploadFormData.skill}
                            onChange={(e) => setUploadFormData({...uploadFormData, skill: e.target.value as SkillType})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="reading">Đọc (Reading)</option>
                            <option value="listening">Nghe (Listening)</option>
                            <option value="writing">Viết (Writing)</option>
                            <option value="speaking">Nói (Speaking)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian (phút) *
                          </label>
                          <input
                            type="number"
                            value={uploadFormData.duration}
                            onChange={(e) => setUploadFormData({...uploadFormData, duration: e.target.value})}
                            placeholder="45"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số câu hỏi *
                        </label>
                        <input
                          type="number"
                          value={uploadFormData.questions}
                          onChange={(e) => setUploadFormData({...uploadFormData, questions: e.target.value})}
                          placeholder="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả
                        </label>
                        <textarea
                          value={uploadFormData.description}
                          onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                          placeholder="Mô tả ngắn gọn về nội dung bài tập..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload className="size-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">Tải file bài tập lên</p>
                        <p className="text-sm text-gray-500 mb-3">Hỗ trợ PDF, DOCX, PPTX (tối đa 10MB)</p>
                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          Chọn file
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {addAssignmentMode === 'class-materials' && (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thư viện tài liệu lớp học</h3>
                    <p className="text-gray-600">Chọn tài liệu từ thư viện lớp học của bạn</p>
                  </div>

                  {/* Selected Count */}
                  {selectedMaterials.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-900 font-medium">
                        Đã chọn {selectedMaterials.length} tài liệu
                      </p>
                    </div>
                  )}

                  {/* Materials Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {classMaterialsData.map((material) => {
                      const isSelected = selectedMaterials.some(m => m.id === material.id);
                      
                      return (
                        <button
                          key={material.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMaterials(selectedMaterials.filter(m => m.id !== material.id));
                            } else {
                              setSelectedMaterials([...selectedMaterials, material]);
                            }
                          }}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${getSkillColor(material.skill)}`}>
                              {getSkillIcon(material.skill)}
                              <span className="text-xs font-medium">{getSkillLabel(material.skill)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{material.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{material.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                              {material.fileType}
                            </span>
                            <span>{material.fileSize}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {addAssignmentMode === 'shared-materials' && (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thư viện tài liệu chung</h3>
                    <p className="text-gray-600">Chọn tài liệu được chia sẻ bởi các giáo viên khác</p>
                  </div>

                  {/* Selected Count */}
                  {selectedMaterials.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <p className="text-amber-900 font-medium">
                        Đã chọn {selectedMaterials.length} tài liệu
                      </p>
                    </div>
                  )}

                  {/* Materials Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {sharedMaterialsData.map((material) => {
                      const isSelected = selectedMaterials.some(m => m.id === material.id);
                      
                      return (
                        <button
                          key={material.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMaterials(selectedMaterials.filter(m => m.id !== material.id));
                            } else {
                              setSelectedMaterials([...selectedMaterials, material]);
                            }
                          }}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${getSkillColor(material.skill)}`}>
                              {getSkillIcon(material.skill)}
                              <span className="text-xs font-medium">{getSkillLabel(material.skill)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{material.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{material.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                {material.fileType}
                              </span>
                              <span>{material.fileSize}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Download className="size-4" />
                              <span>{material.downloads}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Users className="size-3" />
                            <span>{material.uploadedBy}</span>
                            <span>•</span>
                            <Calendar className="size-3" />
                            <span>{material.uploadDate}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setAddAssignmentMode('choose');
                  setSelectedAssignments([]);
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                {addAssignmentMode === 'choose' ? 'Hủy' : 'Quay lại'}
              </button>
              {addAssignmentMode === 'library' && (
                <button
                  onClick={() => addAssignmentsFromLibrary(showAddAssignmentModal)}
                  disabled={selectedAssignments.length === 0}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="size-5" />
                  Thêm {selectedAssignments.length > 0 ? `${selectedAssignments.length} bài tập` : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}