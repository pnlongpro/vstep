import { CheckCircle2, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface ExercisePerformanceTabProps {
  stats: any;
}

export function ExercisePerformanceTab({ stats }: ExercisePerformanceTabProps) {
  const { exercises } = stats;

  const COLORS = {
    correct: '#10B981',
    incorrect: '#EF4444',
    skipped: '#F59E0B',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-2xl text-green-600">{exercises.summary.correctRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ đúng</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {exercises.summary.totalCorrect}/{exercises.summary.totalQuestions} câu
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="size-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-2xl text-red-600">{exercises.summary.incorrectRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ sai</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {exercises.summary.totalIncorrect}/{exercises.summary.totalQuestions} câu
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-2xl text-blue-600">{exercises.summary.avgScore}</div>
              <div className="text-sm text-gray-600">Điểm TB</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Trong {exercises.summary.totalExercises} bài tập
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="size-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-2xl text-purple-600">{exercises.summary.avgTime}</div>
              <div className="text-sm text-gray-600">Thời gian TB</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Mỗi câu hỏi
          </p>
        </div>
      </div>

      {/* Accuracy Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Phân bố kết quả</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exercises.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {exercises.distribution.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Đúng' ? COLORS.correct : entry.name === 'Sai' ? COLORS.incorrect : COLORS.skipped}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance by Skill */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl mb-6">Hiệu suất theo kỹ năng</h3>
          <div className="space-y-4">
            {exercises.bySkill.map((skill: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-sm text-gray-600">{skill.correctRate}% đúng</span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute h-full bg-green-500 flex items-center justify-start px-2 text-white text-xs"
                    style={{ width: `${skill.correctRate}%` }}
                  >
                    {skill.correctRate > 20 && `${skill.correct} đúng`}
                  </div>
                  <div
                    className="absolute h-full bg-red-500 flex items-center justify-end px-2 text-white text-xs"
                    style={{
                      width: `${skill.incorrectRate}%`,
                      left: `${skill.correctRate}%`,
                    }}
                  >
                    {skill.incorrectRate > 20 && `${skill.incorrect} sai`}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>{skill.total} câu hỏi</span>
                  <span>Điểm TB: {skill.avgScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Xu hướng điểm số</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={exercises.scoreTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
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
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Điểm số"
              dot={{ fill: '#3B82F6', r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Trung bình"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise Details Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Chi tiết từng bài tập</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Bài tập</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Kỹ năng</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Điểm</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Đúng/Tổng</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Tỷ lệ đúng</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Thời gian</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Ngày làm</th>
              </tr>
            </thead>
            <tbody>
              {exercises.details.map((exercise: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-sm">{exercise.title}</div>
                      <div className="text-xs text-gray-500">{exercise.level}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        exercise.skill === 'Reading'
                          ? 'bg-blue-100 text-blue-600'
                          : exercise.skill === 'Listening'
                          ? 'bg-green-100 text-green-600'
                          : exercise.skill === 'Writing'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {exercise.skill}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-sm ${
                        exercise.score >= 8
                          ? 'text-green-600'
                          : exercise.score >= 6.5
                          ? 'text-blue-600'
                          : exercise.score >= 5
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {exercise.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <span className="text-green-600">{exercise.correct}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{exercise.total}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${exercise.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{exercise.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {exercise.duration}
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-500">
                    {exercise.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weak Areas Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="size-5 text-orange-600" />
          <h3 className="text-xl">Điểm cần cải thiện</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.weakAreas.map((area: any, index: number) => (
            <div
              key={index}
              className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm">{area.topic}</h4>
                <span className="text-xs px-2 py-1 bg-orange-200 text-orange-700 rounded">
                  {area.skill}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Tỷ lệ đúng</span>
                  <span className="text-orange-600">{area.accuracy}%</span>
                </div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${area.accuracy}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">
                {area.mistakes} lỗi trong {area.attempts} lần thử
              </p>
              <button className="mt-3 w-full px-3 py-2 bg-orange-600 text-white rounded-lg text-xs hover:bg-orange-700 transition-colors">
                Luyện tập thêm
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Phân tích thời gian làm bài</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={exercises.timeAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="skill" stroke="#666" />
            <YAxis stroke="#666" label={{ value: 'Giây/câu', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="avgTime" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Thời gian TB" />
            <Bar dataKey="targetTime" fill="#D1D5DB" radius={[8, 8, 0, 0]} name="Mục tiêu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
