import { Book, Calendar, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CourseProgressTabProps {
  stats: any;
}

export function CourseProgressTab({ stats }: CourseProgressTabProps) {
  const { courses } = stats;

  const getSkillColor = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'reading': return '#3B82F6';
      case 'listening': return '#10B981';
      case 'writing': return '#8B5CF6';
      case 'speaking': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Course Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${getSkillColor(course.skill)}20` }}
                >
                  <Book className="size-6" style={{ color: getSkillColor(course.skill) }} />
                </div>
                <div>
                  <h3>{course.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${getSkillColor(course.skill)}20`,
                        color: getSkillColor(course.skill),
                      }}
                    >
                      {course.skill}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ExternalLink className="size-4 text-gray-600" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tiến độ hoàn thành</span>
                <span className="text-sm" style={{ color: getSkillColor(course.skill) }}>
                  {course.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: getSkillColor(course.skill),
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {course.completedLessons}/{course.totalLessons} bài học đã hoàn thành
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg" style={{ color: getSkillColor(course.skill) }}>
                  {course.currentScore}
                </div>
                <div className="text-xs text-gray-600">Điểm hiện tại</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg text-gray-700">{course.totalTime}h</div>
                <div className="text-xs text-gray-600">Thời gian học</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg text-gray-700">{course.attempts}</div>
                <div className="text-xs text-gray-600">Lần làm bài</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm mb-3">Hoạt động gần đây</h4>
              <div className="space-y-2">
                {course.recentActivity.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <span className="text-gray-700">{activity.lesson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm"
                        style={{ color: getSkillColor(course.skill) }}
                      >
                        {activity.score}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Access */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="size-4" />
              <span>Truy cập lần cuối: {course.lastAccess}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Course Performance Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">So sánh hiệu suất khóa học</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={courses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="title" stroke="#666" angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="currentScore" name="Điểm số" radius={[8, 8, 0, 0]}>
              {courses.map((course: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getSkillColor(course.skill)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Study Goals by Course */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">Mục tiêu học tập theo khóa</h3>
        <div className="space-y-4">
          {courses.map((course: any) => (
            <div key={course.id} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{course.title}</span>
                  <span className="text-sm text-gray-600">
                    Mục tiêu: {course.targetScore}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${(course.currentScore / course.targetScore) * 100}%`,
                      backgroundColor: getSkillColor(course.skill),
                    }}
                  />
                </div>
              </div>
              <div className="text-right min-w-[80px]">
                <div className="text-lg" style={{ color: getSkillColor(course.skill) }}>
                  {course.currentScore}/{course.targetScore}
                </div>
                <div className="text-xs text-gray-500">
                  {course.progress >= 100 ? 'Hoàn thành' : `Còn ${course.targetScore - course.currentScore}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
