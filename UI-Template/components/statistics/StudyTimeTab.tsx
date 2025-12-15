import { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StudyTimeTabProps {
  stats: any;
}

export function StudyTimeTab({ stats }: StudyTimeTabProps) {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { studyTime } = stats;

  const getCurrentData = () => {
    switch (timeView) {
      case 'daily':
        return studyTime.daily;
      case 'weekly':
        return studyTime.weekly;
      case 'monthly':
        return studyTime.monthly;
      default:
        return studyTime.daily;
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-5" />
            <span className="text-sm text-blue-100">Hôm nay</span>
          </div>
          <div className="text-3xl mb-1">{studyTime.summary.today}</div>
          <div className="text-sm text-blue-100">phút học</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="size-5" />
            <span className="text-sm text-green-100">Tuần này</span>
          </div>
          <div className="text-3xl mb-1">{formatMinutes(studyTime.summary.thisWeek)}</div>
          <div className="text-sm text-green-100">tổng thời gian</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-5" />
            <span className="text-sm text-purple-100">Trung bình/ngày</span>
          </div>
          <div className="text-3xl mb-1">{studyTime.summary.avgDaily}</div>
          <div className="text-sm text-purple-100">phút</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-5" />
            <span className="text-sm text-orange-100">Tháng này</span>
          </div>
          <div className="text-3xl mb-1">{studyTime.summary.thisMonth}h</div>
          <div className="text-sm text-orange-100">tổng thời gian</div>
        </div>
      </div>

      {/* Time View Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl">Thống kê thời gian học</h3>
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeView('daily')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                timeView === 'daily'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo ngày
            </button>
            <button
              onClick={() => setTimeView('weekly')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                timeView === 'weekly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo tuần
            </button>
            <button
              onClick={() => setTimeView('monthly')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                timeView === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo tháng
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={getCurrentData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" stroke="#666" />
            <YAxis stroke="#666" label={{ value: 'Phút', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [`${value} phút`, 'Thời gian học']}
            />
            <Bar dataKey="minutes" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Thời gian học" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Study Time by Skill */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Phân bổ thời gian theo kỹ năng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studyTime.bySkill} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#666" />
            <YAxis dataKey="skill" type="category" stroke="#666" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [`${value} giờ`, 'Thời gian']}
            />
            <Bar dataKey="hours" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Giờ học" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Study Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Study Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Khung giờ học tập hiệu quả</h3>
          <div className="space-y-3">
            {studyTime.peakHours.map((hour: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{hour.time}</div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end px-3 text-white text-sm"
                      style={{ width: `${hour.percentage}%` }}
                    >
                      {hour.percentage > 30 && `${hour.sessions} buổi`}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {hour.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Consistency */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Tính nhất quán</h3>
          
          {/* Consistency Score */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white mb-3">
              <div>
                <div className="text-4xl">{studyTime.consistency.score}</div>
                <div className="text-sm text-green-100">điểm</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{studyTime.consistency.label}</p>
          </div>

          {/* Weekly Pattern */}
          <div className="space-y-3">
            <h4 className="text-sm">Mẫu học tập trong tuần</h4>
            <div className="grid grid-cols-7 gap-2">
              {studyTime.consistency.weekPattern.map((day: any, index: number) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-full h-12 rounded-lg mb-1 ${
                      day.studied
                        ? 'bg-green-500'
                        : 'bg-gray-100'
                    }`}
                    title={`${day.label}: ${day.minutes || 0} phút`}
                  />
                  <div className="text-xs text-gray-600">{day.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Gợi ý:</strong> {studyTime.consistency.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Study Sessions Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Lịch sử các buổi học gần đây</h3>
        <div className="space-y-3">
          {studyTime.recentSessions.map((session: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4>{session.activity}</h4>
                <p className="text-sm text-gray-600">{session.course}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">{session.duration}</div>
                <div className="text-xs text-gray-500">{session.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cumulative Study Time */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Tích lũy thời gian học</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={studyTime.cumulative}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" label={{ value: 'Giờ', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalHours"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Tổng giờ học"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
