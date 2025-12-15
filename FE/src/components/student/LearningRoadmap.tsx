import { useState } from 'react';
import { Target, Calendar, Clock, TrendingUp, CheckCircle2, AlertCircle, Edit2, ChevronRight, BookOpen, Headphones, PenTool, Mic, Trophy, Flame } from 'lucide-react';

type VSTEPLevel = 'B1' | 'B2' | 'C1';

interface LearningGoal {
  targetLevel: VSTEPLevel;
  startDate: string;
  endDate: string;
  targetScore: number;
  currentProgress: number;
}

interface DailyTask {
  id: number;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  duration: number; // minutes
  completed: boolean;
}

interface WeeklyGoal {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  target: number;
  current: number;
  unit: string; // "bài", "phút", "từ"
}

interface EndGoalMetric {
  label: string;
  target: string;
  current: string;
  progress: number;
}

export function LearningRoadmap() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [learningGoal, setLearningGoal] = useState<LearningGoal>({
    targetLevel: 'B2',
    startDate: '2024-10-01',
    endDate: '2025-01-01',
    targetScore: 7.0,
    currentProgress: 65
  });

  const dailyTasks: DailyTask[] = [
    { id: 1, title: 'Hoàn thành Reading Part 2', skill: 'reading', duration: 20, completed: false },
    { id: 2, title: 'Luyện Listening - Conversations', skill: 'listening', duration: 15, completed: true },
    { id: 3, title: 'Viết essay - Task 2', skill: 'writing', duration: 30, completed: false },
  ];

  const weeklyGoals: WeeklyGoal[] = [
    { skill: 'reading', target: 10, current: 7, unit: 'bài' },
    { skill: 'listening', target: 5, current: 3, unit: 'bài' },
    { skill: 'writing', target: 3, current: 2, unit: 'bài' },
  ];

  const endGoalMetrics: EndGoalMetric[] = [
    { label: 'Reading Score', target: '7.0', current: '6.5', progress: 93 },
    { label: 'Listening Score', target: '7.0', current: '6.2', progress: 89 },
    { label: 'Writing Score', target: '7.0', current: '6.0', progress: 86 },
    { label: 'Speaking Score', target: '7.0', current: '6.3', progress: 90 },
  ];

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading': return <BookOpen className="size-4" />;
      case 'listening': return <Headphones className="size-4" />;
      case 'writing': return <PenTool className="size-4" />;
      case 'speaking': return <Mic className="size-4" />;
      default: return <BookOpen className="size-4" />;
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-cyan-500';
      case 'listening': return 'from-purple-500 to-pink-500';
      case 'writing': return 'from-emerald-500 to-teal-500';
      case 'speaking': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
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

  const getLevelColor = (level: VSTEPLevel) => {
    switch (level) {
      case 'B1': return 'from-blue-500 to-blue-600';
      case 'B2': return 'from-purple-500 to-purple-600';
      case 'C1': return 'from-orange-500 to-orange-600';
    }
  };

  const getDaysRemaining = () => {
    const end = new Date(learningGoal.endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWeeksRemaining = () => {
    return Math.ceil(getDaysRemaining() / 7);
  };

  return (
    <div className="space-y-6">
      {/* Main Goal Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-purple-100 text-sm mb-2">
              <Target className="size-4" />
              Mục tiêu của bạn
            </div>
            <h2 className="text-2xl font-bold">
              Đạt {learningGoal.targetLevel} trong {getWeeksRemaining()} tuần
            </h2>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Edit2 className="size-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-purple-100">Tiến độ tổng thể</span>
            <span className="font-semibold">{learningGoal.currentProgress}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${learningGoal.currentProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-100">
            Bắt đầu: {new Date(learningGoal.startDate).toLocaleDateString('vi-VN')}
          </span>
          <span className="text-purple-100">
            Kết thúc: {new Date(learningGoal.endDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Nhiệm vụ hôm nay</h3>
            </div>
            <span className="text-sm text-gray-600">
              {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length} hoàn thành
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  task.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-300'
                }`}>
                  {task.completed && <CheckCircle2 className="size-4 text-white" />}
                </div>

                <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${getSkillColor(task.skill)} rounded-lg flex items-center justify-center`}>
                  {getSkillIcon(task.skill)}
                  <span className="text-white text-xs sr-only">{getSkillLabel(task.skill)}</span>
                </div>

                <div className="flex-1">
                  <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {task.duration} phút
                    </span>
                  </div>
                </div>

                {!task.completed && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Bắt đầu
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mục tiêu tuần này</h3>
            </div>
            <span className="text-sm text-gray-600">Tuần 8/12</span>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getSkillColor(goal.skill)} rounded-lg flex items-center justify-center`}>
                      {getSkillIcon(goal.skill)}
                    </div>
                    <span className="font-medium text-gray-900">
                      Làm {goal.target} {goal.unit} {getSkillLabel(goal.skill)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getSkillColor(goal.skill)} transition-all duration-500`}
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End Goal Metrics */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Trophy className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Khi kết thúc phải đạt</h3>
            </div>
            <span className="text-sm font-semibold text-orange-600">
              Target: {learningGoal.targetScore}/10
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {endGoalMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{metric.current}</span>
                    <ChevronRight className="size-3 text-gray-400" />
                    <span className="text-sm font-bold text-orange-600">{metric.target}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">Tiến độ</span>
                  <span className="text-xs font-semibold text-orange-600">{metric.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Target Summary */}
          <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-300">
            <div className="flex items-center gap-3">
              <Trophy className="size-8 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Mục tiêu cuối kỳ</p>
                <p className="text-sm text-gray-700">
                  Đạt điểm trung bình <strong className="text-orange-600">{learningGoal.targetScore}/10</strong> cho 4 kỹ năng để đạt chuẩn {learningGoal.targetLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Stats */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Thống kê tuần này</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="size-5 text-blue-100" />
              <span className="text-2xl font-bold">12.5h</span>
            </div>
            <p className="text-sm text-blue-100">Thời gian học</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="size-5 text-green-100" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-sm text-blue-100">Bài đã làm</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Flame className="size-5 text-orange-100" />
              <span className="text-2xl font-bold">7 ngày</span>
            </div>
            <p className="text-sm text-blue-100">Streak</p>
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chỉnh sửa mục tiêu</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mục tiêu VSTEP
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['B1', 'B2', 'C1'] as VSTEPLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setLearningGoal({ ...learningGoal, targetLevel: level })}
                      className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                        learningGoal.targetLevel === level
                          ? `bg-gradient-to-r ${getLevelColor(level)} text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={learningGoal.endDate}
                  onChange={(e) => setLearningGoal({ ...learningGoal, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm mục tiêu
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={learningGoal.targetScore}
                  onChange={(e) => setLearningGoal({ ...learningGoal, targetScore: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-600 mt-1">Điểm trung bình 4 kỹ năng (0-10)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
