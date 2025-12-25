import { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, Zap, Target, TrendingUp, Calendar, CheckCircle, Lock, Gift, Sparkles, BarChart3, Clock, BookOpen, Users, Flame, ChevronRight } from 'lucide-react';

export function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'leaderboard' | 'rewards'>('achievements');

  // Mock data - Achievements
  const achievements = [
    {
      id: 1,
      title: 'Người mới bắt đầu',
      description: 'Hoàn thành bài học đầu tiên',
      icon: Star,
      color: 'blue',
      unlocked: true,
      unlockedDate: '2025-12-01',
      progress: 100,
      points: 10,
    },
    {
      id: 2,
      title: 'Chuỗi 7 ngày',
      description: 'Học liên tục 7 ngày',
      icon: Flame,
      color: 'orange',
      unlocked: true,
      unlockedDate: '2025-12-08',
      progress: 100,
      points: 50,
    },
    {
      id: 3,
      title: 'Chuyên gia Reading',
      description: 'Hoàn thành 20 bài Reading',
      icon: BookOpen,
      color: 'blue',
      unlocked: true,
      unlockedDate: '2025-12-10',
      progress: 100,
      points: 100,
    },
    {
      id: 4,
      title: 'Chinh phục Listening',
      description: 'Đạt 9.0 trong bài Listening',
      icon: Medal,
      color: 'green',
      unlocked: false,
      unlockedDate: null,
      progress: 75,
      points: 150,
    },
    {
      id: 5,
      title: 'Chuỗi 30 ngày',
      description: 'Học liên tục 30 ngày',
      icon: Crown,
      color: 'yellow',
      unlocked: false,
      unlockedDate: null,
      progress: 23,
      points: 200,
    },
    {
      id: 6,
      title: 'Master Writing',
      description: 'Hoàn thành 50 bài Writing',
      icon: Trophy,
      color: 'purple',
      unlocked: false,
      unlockedDate: null,
      progress: 30,
      points: 250,
    },
  ];

  // Mock data - Badges
  const badges = [
    {
      id: 1,
      name: 'Siêu sao VSTEP',
      description: 'Đạt 8.5+ trong đề thi đầy đủ',
      icon: Star,
      color: 'yellow',
      rarity: 'Huyền thoại',
      unlocked: false,
    },
    {
      id: 2,
      name: 'Tốc độ ánh sáng',
      description: 'Hoàn thành bài trong thời gian kỷ lục',
      icon: Zap,
      color: 'yellow',
      rarity: 'Hiếm',
      unlocked: true,
    },
    {
      id: 3,
      name: 'Người kiên trì',
      description: 'Học liên tục 60 ngày',
      icon: Target,
      color: 'red',
      rarity: 'Sử thi',
      unlocked: false,
    },
    {
      id: 4,
      name: 'Thần đồng',
      description: 'Đạt 10/10 trong 5 bài liên tiếp',
      icon: Crown,
      color: 'purple',
      rarity: 'Huyền thoại',
      unlocked: false,
    },
  ];

  // Mock data - Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=A&background=FFD700&color=000', points: 2450, badge: '🏆' },
    { rank: 2, name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=B&background=C0C0C0&color=000', points: 2300, badge: '🥈' },
    { rank: 3, name: 'Lê Hoàng C', avatar: 'https://ui-avatars.com/api/?name=C&background=CD7F32&color=000', points: 2150, badge: '🥉' },
    { rank: 4, name: 'Phạm Minh D', avatar: 'https://ui-avatars.com/api/?name=D&background=3B82F6&color=fff', points: 2000, badge: '' },
    { rank: 5, name: 'Hoàng Thu E', avatar: 'https://ui-avatars.com/api/?name=E&background=8B5CF6&color=fff', points: 1890, badge: '' },
    { rank: 6, name: 'Đỗ Văn F', avatar: 'https://ui-avatars.com/api/?name=F&background=10B981&color=fff', points: 1750, badge: '' },
    { rank: 7, name: 'Bạn', avatar: 'https://ui-avatars.com/api/?name=You&background=3B82F6&color=fff', points: 1650, badge: '⭐', isCurrentUser: true },
    { rank: 8, name: 'Vũ Thị G', avatar: 'https://ui-avatars.com/api/?name=G&background=F59E0B&color=fff', points: 1520, badge: '' },
  ];

  // Mock data - Rewards
  const rewards = [
    {
      id: 1,
      name: '1 tháng Premium',
      description: 'Truy cập toàn bộ tính năng Premium',
      points: 500,
      icon: Crown,
      color: 'yellow',
      available: true,
    },
    {
      id: 2,
      name: 'Khóa học B2 miễn phí',
      description: 'Nhận khóa học B2 trị giá 2.000.000đ',
      points: 1000,
      icon: Gift,
      color: 'purple',
      available: true,
    },
    {
      id: 3,
      name: 'Ưu đãi 50%',
      description: 'Giảm 50% cho lần mua tiếp theo',
      points: 300,
      icon: Sparkles,
      color: 'blue',
      available: true,
    },
    {
      id: 4,
      name: 'Chấm bài 1-1 với giáo viên',
      description: '30 phút chấm và nhận xét trực tiếp',
      points: 800,
      icon: Users,
      color: 'green',
      available: false,
    },
  ];

  const stats = {
    totalPoints: 1650,
    totalAchievements: achievements.filter(a => a.unlocked).length,
    totalBadges: badges.filter(b => b.unlocked).length,
    rank: 7,
    streak: 7,
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Huyền thoại': return 'text-yellow-600 bg-yellow-100';
      case 'Sử thi': return 'text-purple-600 bg-purple-100';
      case 'Hiếm': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">🏆 Thành tích</h1>
            <p className="text-yellow-100">
              Theo dõi và khoe những thành tựu của bạn
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">#{stats.rank}</div>
            <p className="text-sm text-yellow-100">Xếp hạng</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Star className="size-8 text-yellow-600" />
            <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Top 10
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.totalPoints}</p>
          <p className="text-sm text-gray-600">Tổng điểm</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="size-8 text-purple-600" />
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              +{stats.totalAchievements}
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.totalAchievements}/{achievements.length}</p>
          <p className="text-sm text-gray-600">Thành tích mở khóa</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Medal className="size-8 text-blue-600" />
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              +{stats.totalBadges}
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.totalBadges}/{badges.length}</p>
          <p className="text-sm text-gray-600">Huy hiệu sở hữu</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Flame className="size-8 text-orange-600" />
            <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Streak
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.streak} ngày</p>
          <p className="text-sm text-gray-600">Chuỗi học liên tục</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'achievements', label: 'Thành tích', icon: Trophy },
              { id: 'badges', label: 'Huy hiệu', icon: Medal },
              { id: 'leaderboard', label: 'Bảng xếp hạng', icon: BarChart3 },
              { id: 'rewards', label: 'Phần thưởng', icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl p-6 border-2 transition-all ${
                      achievement.unlocked
                        ? `bg-${achievement.color}-50 border-${achievement.color}-200 hover:shadow-lg`
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {!achievement.unlocked && (
                      <Lock className="absolute top-4 right-4 size-6 text-gray-400" />
                    )}
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                        achievement.unlocked ? `bg-${achievement.color}-100` : 'bg-gray-200'
                      }`}>
                        <Icon className={`size-8 ${
                          achievement.unlocked ? `text-${achievement.color}-600` : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg mb-1 ${
                          achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>

                    {achievement.unlocked ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          <span>Mở khóa: {achievement.unlockedDate}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-${achievement.color}-100 text-${achievement.color}-700`}>
                          <Star className="size-4" />
                          <span>+{achievement.points}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                          <span>Tiến độ: {achievement.progress}%</span>
                          <span>+{achievement.points} điểm</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-xl p-6 text-center transition-all ${
                      badge.unlocked
                        ? `bg-gradient-to-br from-${badge.color}-50 to-${badge.color}-100 border-2 border-${badge.color}-300 hover:scale-105`
                        : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                    }`}
                  >
                    {!badge.unlocked && (
                      <Lock className="absolute top-4 right-4 size-5 text-gray-400" />
                    )}
                    
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      badge.unlocked ? `bg-${badge.color}-500` : 'bg-gray-300'
                    }`}>
                      <Icon className={`size-10 ${
                        badge.unlocked ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>

                    <h3 className={`mb-2 ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    user.isCurrentUser
                      ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                      : 'bg-white border border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    user.rank === 2 ? 'bg-gray-200 text-gray-700' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.badge || `#${user.rank}`}
                  </div>

                  {/* Avatar */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />

                  {/* Name */}
                  <div className="flex-1">
                    <p className={`mb-1 ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                      {user.name}
                      {user.isCurrentUser && <span className="ml-2 text-xs text-blue-600">(Bạn)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{user.points} điểm</span>
                    </div>
                  </div>

                  {/* Action */}
                  {!user.isCurrentUser && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Xem
                    </button>
                  )}
                </div>
              ))}

              <div className="text-center pt-4">
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mx-auto">
                  <span>Xem thêm</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div>
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="size-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Điểm hiện tại</p>
                      <p className="text-2xl text-gray-900">{stats.totalPoints} điểm</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Đổi điểm
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  const canAfford = stats.totalPoints >= reward.points;
                  
                  return (
                    <div
                      key={reward.id}
                      className={`relative rounded-xl p-6 border-2 transition-all ${
                        reward.available && canAfford
                          ? `bg-${reward.color}-50 border-${reward.color}-200 hover:shadow-lg`
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      {!reward.available && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          Hết hàng
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                          reward.available && canAfford ? `bg-${reward.color}-100` : 'bg-gray-200'
                        }`}>
                          <Icon className={`size-8 ${
                            reward.available && canAfford ? `text-${reward.color}-600` : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg mb-1">{reward.name}</h3>
                          <p className="text-sm text-gray-600">{reward.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="size-5 text-yellow-600" />
                          <span className="text-lg text-gray-900">{reward.points} điểm</span>
                        </div>
                        {reward.available && canAfford && (
                          <button className={`px-4 py-2 bg-${reward.color}-600 text-white rounded-lg hover:bg-${reward.color}-700 transition-colors`}>
                            Đổi ngay
                          </button>
                        )}
                        {reward.available && !canAfford && (
                          <span className="text-sm text-gray-500">
                            Cần thêm {reward.points - stats.totalPoints} điểm
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
