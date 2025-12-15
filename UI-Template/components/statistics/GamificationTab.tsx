import { Trophy, Award, Star, Flame, Target, TrendingUp, Zap, Crown, Medal, Gift } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface GamificationTabProps {
  stats: any;
}

export function GamificationTab({ stats }: GamificationTabProps) {
  const { gamification } = stats;

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'medal': return Medal;
      case 'crown': return Crown;
      case 'flame': return Flame;
      default: return Award;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return { from: 'from-purple-500', to: 'to-pink-600', text: 'text-purple-600' };
    if (level >= 15) return { from: 'from-blue-500', to: 'to-indigo-600', text: 'text-blue-600' };
    if (level >= 10) return { from: 'from-green-500', to: 'to-emerald-600', text: 'text-green-600' };
    if (level >= 5) return { from: 'from-yellow-500', to: 'to-orange-600', text: 'text-yellow-600' };
    return { from: 'from-gray-400', to: 'to-gray-600', text: 'text-gray-600' };
  };

  const levelColors = getLevelColor(gamification.level.current);

  return (
    <div className="space-y-6">
      {/* Player Profile Card */}
      <div className={`bg-gradient-to-br ${levelColors.from} ${levelColors.to} rounded-xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              <Crown className="size-12" />
            </div>
            <div>
              <h2 className="text-3xl mb-2">{gamification.playerName}</h2>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span>{gamification.level.title}</span>
                <span>•</span>
                <span>Level {gamification.level.current}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">{gamification.totalPoints}</div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2 opacity-90">
            <span>Tiến độ lên Level {gamification.level.current + 1}</span>
            <span>{gamification.level.currentXP} / {gamification.level.nextLevelXP} XP</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500"
              style={{ width: `${(gamification.level.currentXP / gamification.level.nextLevelXP) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-2 opacity-75">
            Còn {gamification.level.nextLevelXP - gamification.level.currentXP} XP nữa để lên level!
          </p>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="size-6 text-yellow-600" />
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <div className="text-2xl mb-1">{gamification.kpi.streakDays}</div>
          <div className="text-sm text-gray-600">Ngày streak</div>
          <div className="text-xs text-green-600 mt-1">+{gamification.kpi.streakBonus} XP/ngày</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Trophy className="size-6 text-blue-600" />
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <div className="text-2xl mb-1">{gamification.kpi.badgesEarned}</div>
          <div className="text-sm text-gray-600">Huy hiệu</div>
          <div className="text-xs text-gray-500 mt-1">{gamification.kpi.totalBadges} tổng</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="size-6 text-purple-600" />
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <div className="text-2xl mb-1">{gamification.kpi.goalsCompleted}</div>
          <div className="text-sm text-gray-600">Mục tiêu đạt</div>
          <div className="text-xs text-purple-600 mt-1">+{gamification.kpi.goalBonus} XP mỗi mục tiêu</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="size-6 text-green-600" />
            </div>
            <TrendingUp className="size-5 text-green-600" />
          </div>
          <div className="text-2xl mb-1">{gamification.kpi.perfectScores}</div>
          <div className="text-sm text-gray-600">Điểm 10</div>
          <div className="text-xs text-green-600 mt-1">+{gamification.kpi.perfectBonus} XP mỗi lần</div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl">🏆 Bộ sưu tập huy hiệu</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Tất cả
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors">
              Đã mở khóa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gamification.badges.map((badge: any, index: number) => {
            const BadgeIcon = getBadgeIcon(badge.iconType);
            return (
              <div
                key={index}
                className={`relative rounded-xl p-5 text-center transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg cursor-pointer'
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                {badge.unlocked && badge.isNew && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    NEW!
                  </div>
                )}
                
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  badge.unlocked
                    ? `bg-gradient-to-br ${badge.color}`
                    : 'bg-gray-200'
                }`}>
                  <BadgeIcon className={`size-8 ${badge.unlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>
                
                <h4 className="text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                
                {badge.unlocked ? (
                  <div className="text-xs text-green-600">
                    ✓ Đạt được {badge.unlockedDate}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {badge.current}/{badge.target} ({badge.progress}%)
                    </div>
                  </div>
                )}
                
                {badge.unlocked && (
                  <div className="mt-2 text-xs text-yellow-600">
                    +{badge.xpReward} XP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">🏅 Bảng xếp hạng</h3>
        <div className="space-y-3">
          {gamification.leaderboard.map((player: any, index: number) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                player.isCurrentUser
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Rank */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>

              {/* Avatar & Name */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>{player.name}</h4>
                  {player.isCurrentUser && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">Bạn</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Level {player.level}</span>
                  <span>•</span>
                  <span>{player.badges} huy hiệu</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-2xl text-blue-600">{player.points}</div>
                <div className="text-xs text-gray-500">điểm</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Phân tích năng lực toàn diện</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={gamification.skillRadar}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#666" />
              <PolarRadiusAxis domain={[0, 100]} stroke="#666" />
              <Radar
                name="Năng lực"
                dataKey="score"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Thành tích gần đây</h3>
          <div className="space-y-3">
            {gamification.recentAchievements.map((achievement: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="size-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600">+{achievement.xp} XP</div>
                  <div className="text-xs text-gray-500">{achievement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards & Milestones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">🎁 Phần thưởng & Cột mốc</h3>
        <div className="space-y-4">
          {gamification.milestones.map((milestone: any, index: number) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl border-2 ${
                milestone.achieved
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      milestone.achieved ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <Gift className={`size-6 ${
                        milestone.achieved ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="mb-1">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  {milestone.achieved ? (
                    <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs">
                      ✓ Đạt được
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">
                      Chưa đạt
                    </div>
                  )}
                </div>

                {!milestone.achieved && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="text-gray-900">
                        {milestone.current}/{milestone.target}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="size-4" />
                    <span>+{milestone.xpReward} XP</span>
                  </div>
                  {milestone.reward && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <Gift className="size-4" />
                      <span>{milestone.reward}</span>
                    </div>
                  )}
                </div>
              </div>

              {milestone.achieved && (
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Trophy className="size-32 text-green-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="size-6 text-purple-600" />
          <h3 className="text-xl">Nhiệm vụ hàng ngày</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gamification.dailyQuests.map((quest: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border-2 border-purple-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm">{quest.title}</h4>
                {quest.completed ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                )}
              </div>
              <div className="mb-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      quest.completed ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${(quest.current / quest.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {quest.current}/{quest.target} {quest.unit}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600">+{quest.xpReward} XP</span>
                <span className="text-xs text-gray-500">{quest.timeLeft}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
