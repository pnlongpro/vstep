import { X, BookOpen, Headphones, PenTool, Mic, Clock, Users, Target, Star, TrendingUp, CheckCircle, Edit, Trash2, Link } from 'lucide-react';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

interface AssignmentDetailModalProps {
  assignment: {
    id: string;
    title: string;
    skill: SkillType;
    level: string;
    duration: number;
    questions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    objectives?: string[];
    tags?: string[];
    usageCount?: number;
    avgScore?: number;
    completionRate?: number;
  };
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUseAssignment?: () => void;
}

export function AssignmentDetailModal({ assignment, onClose, onEdit, onDelete, onUseAssignment }: AssignmentDetailModalProps) {
  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return <BookOpen className="size-5" />;
      case 'listening': return <Headphones className="size-5" />;
      case 'writing': return <PenTool className="size-5" />;
      case 'speaking': return <Mic className="size-5" />;
    }
  };

  const getSkillColor = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' };
      case 'listening': return { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' };
      case 'writing': return { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' };
      case 'speaking': return { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' };
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  const skillColors = getSkillColor(assignment.skill);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b ${skillColors.border} bg-gradient-to-r ${skillColors.bg}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl ${skillColors.badge} flex items-center justify-center`}>
                  {getSkillIcon(assignment.skill)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl mb-2 ${skillColors.text}`}>{assignment.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${skillColors.badge}`}>
                      {assignment.skill.charAt(0).toUpperCase() + assignment.skill.slice(1)}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                      {assignment.level}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                      {getDifficultyLabel(assignment.difficulty)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">ID: {assignment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-2">
                <Clock className="size-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{assignment.duration}</p>
              <p className="text-xs text-gray-600 mt-1">Phút</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-green-600 mb-2">
                <Target className="size-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{assignment.questions}</p>
              <p className="text-xs text-gray-600 mt-1">Câu hỏi</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-2">
                <Users className="size-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{assignment.usageCount || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Lần sử dụng</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 mb-3">
              <BookOpen className="size-5 text-gray-700" />
              Mô tả bài tập
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{assignment.description}</p>
          </div>

          {/* Learning Objectives */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 mb-3">
              <Target className="size-5 text-indigo-700" />
              Mục tiêu học tập
            </h4>
            <div className="space-y-2">
              {assignment.objectives?.map((objective, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{objective}</span>
                </div>
              )) || <p className="text-sm text-gray-500">Chưa có mục tiêu học tập</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="mb-3">🏷️ Tags</h4>
            <div className="flex flex-wrap gap-2">
              {assignment.tags?.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  {tag}
                </span>
              )) || <p className="text-sm text-gray-500">Chưa có tags</p>}
            </div>
          </div>

          {/* Performance Stats */}
          {assignment.avgScore !== undefined && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="mb-4">📊 Thống kê hiệu suất</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Star className="size-4" />
                    <span className="text-xs font-medium">Điểm trung bình</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{assignment.avgScore.toFixed(1)}<span className="text-lg text-gray-500">/10</span></p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(assignment.avgScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <TrendingUp className="size-4" />
                    <span className="text-xs font-medium">Tỷ lệ hoàn thành</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{assignment.completionRate || 0}%</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${assignment.completionRate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <BookOpen className="size-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">Xem trước nội dung bài tập</p>
            <p className="text-xs text-gray-500">Chức năng preview câu hỏi sẽ được thêm trong phiên bản tiếp theo</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="size-4" />
                  Chỉnh sửa
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="size-4" />
                  Xóa
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
              {onUseAssignment && (
                <button
                  onClick={onUseAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Link className="size-4" />
                  Sử dụng bài tập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}