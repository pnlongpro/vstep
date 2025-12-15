import { Trophy, TrendingUp, Calendar, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface TestHistoryTabProps {
  stats: any;
}

export function TestHistoryTab({ stats }: TestHistoryTabProps) {
  const { tests } = stats;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50';
    if (score >= 6.5) return 'bg-blue-50';
    if (score >= 5) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getDifference = (current: number, previous: number) => {
    const diff = current - previous;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      isNeutral: diff === 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="size-5" />
            <span className="text-sm text-blue-100">Tổng số test</span>
          </div>
          <div className="text-3xl mb-1">{tests.summary.totalTests}</div>
          <div className="text-sm text-blue-100">bài kiểm tra</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-5" />
            <span className="text-sm text-green-100">Điểm TB</span>
          </div>
          <div className="text-3xl mb-1">{tests.summary.avgScore}</div>
          <div className="text-sm text-green-100">Tất cả các test</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="size-5" />
            <span className="text-sm text-purple-100">Điểm cao nhất</span>
          </div>
          <div className="text-3xl mb-1">{tests.summary.highestScore}</div>
          <div className="text-sm text-purple-100">{tests.summary.highestTest}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-5" />
            <span className="text-sm text-orange-100">Tiến bộ</span>
          </div>
          <div className="text-3xl mb-1">+{tests.summary.improvement}</div>
          <div className="text-sm text-orange-100">So với test đầu</div>
        </div>
      </div>

      {/* Score Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Tiến độ điểm số qua các lần test</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={tests.scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="test" stroke="#666" />
            <YAxis domain={[0, 10]} stroke="#666" />
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
              dataKey="overall"
              stroke="#8B5CF6"
              strokeWidth={3}
              name="Tổng"
              dot={{ fill: '#8B5CF6', r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="reading"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Reading"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="listening"
              stroke="#10B981"
              strokeWidth={2}
              name="Listening"
              dot={{ fill: '#10B981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="writing"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="Writing"
              dot={{ fill: '#8B5CF6', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="speaking"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Speaking"
              dot={{ fill: '#F59E0B', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test History List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Danh sách bài kiểm tra</h3>
        <div className="space-y-3">
          {tests.history.map((test: any, index: number) => {
            const scoreDiff = index < tests.history.length - 1 
              ? getDifference(test.overall, tests.history[index + 1].overall)
              : null;

            return (
              <div
                key={test.id}
                className="border-2 border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{test.title}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {test.level}
                      </span>
                      {test.isPassed && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                          ✓ Đạt
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{test.date}</span>
                      </div>
                      <span>•</span>
                      <span>{test.duration} phút</span>
                      <span>•</span>
                      <span>Lần {test.attempt}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-3xl ${getScoreColor(test.overall)}`}>
                      {test.overall}
                    </div>
                    {scoreDiff && !scoreDiff.isNeutral && (
                      <div className={`flex items-center gap-1 text-sm mt-1 ${
                        scoreDiff.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scoreDiff.isPositive ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                        <span>{scoreDiff.value.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill Breakdown */}
                <div className="grid grid-cols-4 gap-3">
                  <div className={`p-3 ${getScoreBgColor(test.reading)} rounded-lg`}>
                    <div className="text-xs text-gray-600 mb-1">Reading</div>
                    <div className={`text-xl ${getScoreColor(test.reading)}`}>
                      {test.reading}
                    </div>
                  </div>
                  <div className={`p-3 ${getScoreBgColor(test.listening)} rounded-lg`}>
                    <div className="text-xs text-gray-600 mb-1">Listening</div>
                    <div className={`text-xl ${getScoreColor(test.listening)}`}>
                      {test.listening}
                    </div>
                  </div>
                  <div className={`p-3 ${getScoreBgColor(test.writing)} rounded-lg`}>
                    <div className="text-xs text-gray-600 mb-1">Writing</div>
                    <div className={`text-xl ${getScoreColor(test.writing)}`}>
                      {test.writing}
                    </div>
                  </div>
                  <div className={`p-3 ${getScoreBgColor(test.speaking)} rounded-lg`}>
                    <div className="text-xs text-gray-600 mb-1">Speaking</div>
                    <div className={`text-xl ${getScoreColor(test.speaking)}`}>
                      {test.speaking}
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Comparison - Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">So sánh kỹ năng - Test mới nhất</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={tests.latestSkillBreakdown}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#666" />
              <PolarRadiusAxis domain={[0, 10]} stroke="#666" />
              <Radar
                name="Điểm số"
                dataKey="score"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Score by Level */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Điểm trung bình theo cấp độ</h3>
          <div className="space-y-4">
            {tests.scoreByLevel.map((level: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{level.level}</span>
                    <span className="text-xs text-gray-500">
                      ({level.tests} tests)
                    </span>
                  </div>
                  <span className={`text-lg ${getScoreColor(level.avgScore)}`}>
                    {level.avgScore}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      level.avgScore >= 8
                        ? 'bg-green-500'
                        : level.avgScore >= 6.5
                        ? 'bg-blue-500'
                        : level.avgScore >= 5
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(level.avgScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Phân tích tiến bộ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tests.improvement.map((item: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                item.trend === 'up'
                  ? 'border-green-200 bg-green-50'
                  : item.trend === 'down'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{item.skill}</span>
                {item.trend === 'up' ? (
                  <ArrowUpRight className="size-5 text-green-600" />
                ) : item.trend === 'down' ? (
                  <ArrowDownRight className="size-5 text-red-600" />
                ) : (
                  <div className="w-5 h-0.5 bg-gray-400" />
                )}
              </div>
              <div className={`text-2xl mb-1 ${
                item.trend === 'up'
                  ? 'text-green-600'
                  : item.trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}
                {item.change}
              </div>
              <p className="text-xs text-gray-600">So với 3 test trước</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-xl mb-4">💡 Nhận xét & Gợi ý</h3>
        <div className="space-y-3">
          {tests.insights.map((insight: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className={`p-2 ${
                insight.type === 'positive' ? 'bg-green-100' :
                insight.type === 'warning' ? 'bg-orange-100' :
                'bg-blue-100'
              } rounded-lg`}>
                {insight.type === 'positive' ? '✓' :
                 insight.type === 'warning' ? '⚠' : 'ℹ'}
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
