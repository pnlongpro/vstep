'use client';

import Link from 'next/link';
import { BookOpen, Headphones, Edit3, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStatistics } from '@/hooks/usePractice';

const skills = [
  { id: 'reading', name: 'Reading', icon: BookOpen, color: 'blue', description: 'Luyện đọc hiểu văn bản' },
  { id: 'listening', name: 'Listening', icon: Headphones, color: 'green', description: 'Luyện nghe hiểu' },
  { id: 'writing', name: 'Writing', icon: Edit3, color: 'purple', description: 'Luyện viết bài luận' },
  { id: 'speaking', name: 'Speaking', icon: Mic, color: 'orange', description: 'Luyện nói (Coming soon)' },
];

export default function PracticeHomePage() {
  const { data: stats } = useUserStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Luyện tập VSTEP</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Chọn kỹ năng bạn muốn luyện tập</p>

        {/* Stats summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.completedSessions}</div>
              <div className="text-sm text-gray-500">Bài hoàn thành</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Điểm TB</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalTimeSpent / 60)}m</div>
              <div className="text-sm text-gray-500">Thời gian học</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.streakDays}</div>
              <div className="text-sm text-gray-500">Ngày streak</div>
            </div>
          </div>
        )}

        {/* Skill cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            const isDisabled = skill.id === 'speaking';
            const skillStat = stats?.bySkill.find((s) => s.skill === skill.id);

            return (
              <div
                key={skill.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${isDisabled ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${skill.color}-100 dark:bg-${skill.color}-900/30`}>
                    <Icon className={`w-6 h-6 text-${skill.color}-600`} />
                  </div>
                  {skillStat && (
                    <div className="text-right">
                      <div className="text-lg font-semibold">{skillStat.averageScore.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">{skillStat.sessionsCount} bài</div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{skill.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{skill.description}</p>
                <Link href={isDisabled ? '#' : `/practice/${skill.id}`}>
                  <Button className="w-full" disabled={isDisabled}>
                    {isDisabled ? 'Sắp ra mắt' : 'Bắt đầu luyện tập'}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Recent activity */}
        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.sessionId} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize">{activity.skill}</span>
                    <span className="text-gray-500 ml-2">Level {activity.level}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">{activity.score.toFixed(1)}/10</div>
                    <div className="text-xs text-gray-500">{new Date(activity.completedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
