import { Award, BookOpen, Clock, Flame, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewTabProps {
  stats: any;
}

export function OverviewTab({ stats }: OverviewTabProps) {
  const { overview, gpaHistory } = stats;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* GPA */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Award className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.gpa.toFixed(2)}</div>
          <div className="text-sm text-blue-100">GPA (Grade Point Average)</div>
          <div className="mt-2 text-xs text-blue-200">
            +0.3 so với tháng trước
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Target className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.completionRate}%</div>
          <div className="text-sm text-green-100">Tỷ lệ hoàn thành</div>
          <div className="mt-2 text-xs text-green-200">
            {overview.completedCourses}/{overview.totalCourses} khóa học
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.totalCourses}</div>
          <div className="text-sm text-purple-100">Tổng số khóa học</div>
          <div className="mt-2 text-xs text-purple-200">
            {overview.activeCourses} đang học
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.totalStudyHours}h</div>
          <div className="text-sm text-orange-100">Tổng thời gian học</div>
          <div className="mt-2 text-xs text-orange-200">
            {overview.avgDailyMinutes} phút/ngày
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Flame className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.currentStreak}</div>
          <div className="text-sm text-red-100">Ngày liên tiếp</div>
          <div className="mt-2 text-xs text-red-200">
            Kỷ lục: {overview.longestStreak} ngày
          </div>
        </div>

        {/* Total Practices */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Award className="size-6" />
            </div>
            <TrendingUp className="size-5 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{overview.totalPractices}</div>
          <div className="text-sm text-indigo-100">Bài đã hoàn thành</div>
          <div className="mt-2 text-xs text-indigo-200">
            Tuần này: +{overview.weeklyPractices}
          </div>
        </div>
      </div>

      {/* GPA Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Xu hướng GPA theo thời gian</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gpaHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis domain={[0, 10]} stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name="GPA"
              dot={{ fill: '#3B82F6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Award className="size-5 text-blue-600" />
            </div>
            <h4>Điểm cao nhất</h4>
          </div>
          <div className="text-2xl text-blue-600 mb-1">9.5</div>
          <p className="text-sm text-gray-600">Reading - B2 Level</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <BookOpen className="size-5 text-green-600" />
            </div>
            <h4>Kỹ năng tốt nhất</h4>
          </div>
          <div className="text-2xl text-green-600 mb-1">Reading</div>
          <p className="text-sm text-gray-600">GPA: 7.8/10</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="size-5 text-purple-600" />
            </div>
            <h4>Mục tiêu tuần này</h4>
          </div>
          <div className="text-2xl text-purple-600 mb-1">8/10</div>
          <p className="text-sm text-gray-600">Bài luyện tập hoàn thành</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Thành tích gần đây</h3>
        <div className="space-y-3">
          {overview.recentAchievements.map((achievement: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-3 bg-${achievement.color}-100 rounded-lg`}>
                <Award className={`size-5 text-${achievement.color}-600`} />
              </div>
              <div className="flex-1">
                <h4>{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
              <div className="text-sm text-gray-500">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
