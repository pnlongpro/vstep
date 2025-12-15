import { ArrowLeft, Plus, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GoalCard } from './GoalCard';
import { GoalSettingModal } from './GoalSettingModal';
import { GoalAchievedModal } from './GoalAchievedModal';
import { 
  getUserGoals, 
  deleteGoal, 
  getTodayGoals, 
  getWeeklyGoals,
  getActiveGoals,
  getCompletedGoals,
  resetGoalsIfNeeded,
  Goal
} from '../utils/goalService';

interface GoalsProps {
  onBack: () => void;
}

type TabType = 'all' | 'today' | 'weekly' | 'completed';

export function Goals({ onBack }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showAchievedModal, setShowAchievedModal] = useState(false);
  const [achievedGoal, setAchievedGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const loadGoals = () => {
    resetGoalsIfNeeded();
    setGoals(getUserGoals());
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      deleteGoal(goalId);
      loadGoals();
    }
  };

  const handleGoalCreated = () => {
    loadGoals();
  };

  // Filter goals based on active tab
  const filteredGoals = (() => {
    switch (activeTab) {
      case 'today':
        return getTodayGoals();
      case 'weekly':
        return getWeeklyGoals();
      case 'completed':
        return getCompletedGoals();
      default:
        return getActiveGoals();
    }
  })();

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const todayGoals = getTodayGoals();
  const overallProgress = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Mục tiêu học tập</h1>
              <p className="text-blue-100">
                Đặt và theo dõi các mục tiêu để nâng cao hiệu quả học tập
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl">🎯</div>
              <div className="mt-2 text-2xl">
                {completedGoals.length}/{goals.length}
              </div>
              <div className="text-sm text-blue-100">Hoàn thành</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          {goals.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-100">Tiến độ tổng thể</span>
                <span className="font-semibold">{overallProgress}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="size-4" />
                <span className="text-sm text-blue-100">Đang theo đuổi</span>
              </div>
              <div className="text-2xl">{activeGoals.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="size-4" />
                <span className="text-sm text-blue-100">Hôm nay</span>
              </div>
              <div className="text-2xl">{todayGoals.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="size-4" />
                <span className="text-sm text-blue-100">Đã đạt</span>
              </div>
              <div className="text-2xl">{completedGoals.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Tabs */}
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tất cả ({activeGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hôm nay ({todayGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tuần này ({getWeeklyGoals().length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Đã hoàn thành ({completedGoals.length})
            </button>
          </div>

          <button
            onClick={() => setShowSettingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="size-5" />
            <span>Thêm mục tiêu</span>
          </button>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onDelete={handleDeleteGoal}
                size="medium"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            {activeTab === 'completed' ? (
              <>
                <CheckCircle className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg">Chưa có mục tiêu nào được hoàn thành</p>
                <p className="text-sm text-gray-400 mb-4">Tiếp tục nỗ lực để đạt được mục tiêu đầu tiên!</p>
              </>
            ) : (
              <>
                <Target className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg">Chưa có mục tiêu nào</p>
                <p className="text-sm text-gray-400 mb-4">
                  {activeTab === 'today'
                    ? 'Không có mục tiêu nào cho hôm nay'
                    : activeTab === 'weekly'
                    ? 'Không có mục tiêu nào cho tuần này'
                    : 'Bắt đầu bằng cách đặt mục tiêu học tập đầu tiên'}
                </p>
                <button
                  onClick={() => setShowSettingModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Đặt mục tiêu đầu tiên
                </button>
              </>
            )}
          </div>
        )}

        {/* Tips Section */}
        {goals.length > 0 && activeGoals.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <h3 className="text-lg mb-2 text-gray-800">Mẹo đạt mục tiêu</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Chia mục tiêu lớn thành các mục tiêu nhỏ dễ đạt hơn</li>
                  <li>• Học đều đặn mỗi ngày tốt hơn học dồn vào cuối tuần</li>
                  <li>• Kết hợp nhiều kỹ năng để tiến bộ toàn diện</li>
                  <li>• Theo dõi tiến độ thường xuyên để điều chỉnh kịp thời</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalSettingModal
        isOpen={showSettingModal}
        onClose={() => setShowSettingModal(false)}
        onGoalCreated={handleGoalCreated}
      />

      <GoalAchievedModal
        isOpen={showAchievedModal}
        onClose={() => setShowAchievedModal(false)}
        goal={achievedGoal}
      />
    </div>
  );
}
