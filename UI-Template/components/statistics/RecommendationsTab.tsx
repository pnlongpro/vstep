import { Lightbulb, Target, BookOpen, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

interface RecommendationsTabProps {
  stats: any;
}

export function RecommendationsTab({ stats }: RecommendationsTabProps) {
  const { recommendations } = stats;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: 'text-red-600' };
      case 'medium': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', icon: 'text-orange-600' };
      case 'low': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: 'text-blue-600' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Lightbulb className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl mb-1">Gợi ý học tập cá nhân hóa</h2>
            <p className="text-sm text-purple-100">
              Dựa trên phân tích {recommendations.summary.totalPractices} bài tập và {recommendations.summary.totalTests} bài test
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-sm text-purple-100 mb-1">Điểm mạnh nhất</div>
            <div className="text-xl">{recommendations.summary.strongestSkill}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-sm text-purple-100 mb-1">Cần cải thiện</div>
            <div className="text-xl">{recommendations.summary.weakestSkill}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-sm text-purple-100 mb-1">Tiến bộ dự kiến</div>
            <div className="text-xl">+{recommendations.summary.expectedImprovement}</div>
          </div>
        </div>
      </div>

      {/* Priority Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">🎯 Ưu tiên hành động</h3>
        <div className="space-y-4">
          {recommendations.priority.map((item: any, index: number) => {
            const colors = getPriorityColor(item.priority);
            return (
              <div
                key={index}
                className={`p-5 rounded-xl border-2 ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-white rounded-lg`}>
                    {item.priority === 'high' ? (
                      <AlertCircle className={`size-6 ${colors.icon}`} />
                    ) : item.priority === 'medium' ? (
                      <Target className={`size-6 ${colors.icon}`} />
                    ) : (
                      <Lightbulb className={`size-6 ${colors.icon}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${colors.text} bg-white`}>
                        {item.priority === 'high' ? 'Ưu tiên cao' : 
                         item.priority === 'medium' ? 'Ưu tiên vừa' : 'Ưu tiên thấp'}
                      </span>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-sm mb-2">Hành động được đề xuất:</div>
                      {item.actions.map((action: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="size-4" />
                        <span>Thời gian: {item.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="size-4" />
                        <span>Tiềm năng cải thiện: {item.improvement}</span>
                      </div>
                    </div>

                    <button className={`mt-4 px-4 py-2 ${
                      item.priority === 'high' ? 'bg-red-600 hover:bg-red-700' :
                      item.priority === 'medium' ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    } text-white rounded-lg text-sm transition-colors`}>
                      Bắt đầu ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill-Specific Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.bySkill.map((skill: any, index: number) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${
                skill.skill === 'Reading' ? 'bg-blue-100' :
                skill.skill === 'Listening' ? 'bg-green-100' :
                skill.skill === 'Writing' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <BookOpen className={`size-5 ${
                  skill.skill === 'Reading' ? 'text-blue-600' :
                  skill.skill === 'Listening' ? 'text-green-600' :
                  skill.skill === 'Writing' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <div>
                <h4>{skill.skill}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Điểm hiện tại: {skill.currentScore}</span>
                  <span>•</span>
                  <span>Mục tiêu: {skill.targetScore}</span>
                </div>
              </div>
            </div>

            {/* Progress to Target */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Tiến độ đạt mục tiêu</span>
                <span className={`${
                  skill.skill === 'Reading' ? 'text-blue-600' :
                  skill.skill === 'Listening' ? 'text-green-600' :
                  skill.skill === 'Writing' ? 'text-purple-600' :
                  'text-orange-600'
                }`}>
                  {Math.round((skill.currentScore / skill.targetScore) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    skill.skill === 'Reading' ? 'bg-blue-600' :
                    skill.skill === 'Listening' ? 'bg-green-600' :
                    skill.skill === 'Writing' ? 'bg-purple-600' :
                    'bg-orange-600'
                  }`}
                  style={{ width: `${(skill.currentScore / skill.targetScore) * 100}%` }}
                />
              </div>
            </div>

            {/* Weak Points */}
            <div className="mb-4">
              <h5 className="text-sm mb-3">Điểm yếu cần khắc phục:</h5>
              <div className="space-y-2">
                {skill.weakPoints.map((point: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="size-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-700">{point.topic}</span>
                      <span className="text-gray-500 ml-2">({point.accuracy}% đúng)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Exercises */}
            <div className="pt-4 border-t border-gray-100">
              <h5 className="text-sm mb-3">Bài tập được đề xuất:</h5>
              <div className="space-y-2">
                {skill.recommendedExercises.map((exercise: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <BookOpen className="size-4 text-gray-400" />
                    <span className="flex-1 text-gray-700">{exercise}</span>
                    <Zap className="size-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Study Plan */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-6">📅 Kế hoạch học tập được đề xuất</h3>
        <div className="space-y-4">
          {recommendations.studyPlan.map((week: any, index: number) => (
            <div key={index} className="border-2 border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h4>Tuần {week.week}</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {week.totalHours}h học
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {week.days.map((day: any, dayIdx: number) => (
                  <div key={dayIdx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm mb-2">{day.day}</div>
                    <div className="space-y-2">
                      {day.activities.map((activity: string, actIdx: number) => (
                        <div key={actIdx} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-blue-600">•</span>
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Target className="size-4 text-green-600 mt-0.5" />
                  <div className="flex-1 text-sm text-green-900">
                    <strong>Mục tiêu tuần:</strong> {week.goal}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.tips.map((tip: any, index: number) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg">
                <Lightbulb className="size-5 text-blue-600" />
              </div>
              <h4 className="text-sm">{tip.category}</h4>
            </div>
            <p className="text-sm text-gray-700 mb-3">{tip.tip}</p>
            <div className="text-xs text-blue-600">💡 {tip.impact}</div>
          </div>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <div className="text-4xl mb-4">🎯</div>
        <blockquote className="text-xl mb-2">
          "{recommendations.motivation.quote}"
        </blockquote>
        <p className="text-sm text-purple-100">— {recommendations.motivation.author}</p>
      </div>
    </div>
  );
}
