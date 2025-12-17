'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSessions } from '@/hooks/usePractice';
import { Skill, SessionStatus } from '@/types/practice';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, XCircle, Pause } from 'lucide-react';

const skillOptions: { value: Skill | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
];

const statusOptions: { value: SessionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'in_progress', label: 'Đang làm' },
  { value: 'abandoned', label: 'Đã bỏ' },
];

const statusIcons: Record<SessionStatus, React.ReactNode> = {
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  paused: <Pause className="w-4 h-4 text-yellow-500" />,
  abandoned: <XCircle className="w-4 h-4 text-red-500" />,
  expired: <XCircle className="w-4 h-4 text-gray-500" />,
};

export default function PracticeHistoryPage() {
  const [skillFilter, setSkillFilter] = useState<Skill | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');

  const { data, isLoading } = useSessions({
    skill: skillFilter === 'all' ? undefined : skillFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Lịch sử luyện tập</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={skillFilter} onValueChange={(v) => setSkillFilter(v as Skill | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kỹ năng" />
            </SelectTrigger>
            <SelectContent>
              {skillOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SessionStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sessions list */}
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : data?.sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có lịch sử luyện tập.{' '}
            <Link href="/practice" className="text-blue-600 hover:underline">
              Bắt đầu ngay
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kỹ năng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 capitalize">{session.skill}</td>
                    <td className="px-4 py-3">{session.level}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {statusIcons[session.status]}
                        <span className="capitalize text-sm">{session.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {session.score !== null ? `${session.score.toFixed(1)}/10` : '-'}
                    </td>
                    <td className="px-4 py-3">{formatTime(session.timeSpent)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(session.createdAt)}</td>
                    <td className="px-4 py-3">
                      {session.status === 'completed' ? (
                        <Link href={`/practice/result/${session.id}`}>
                          <Button variant="ghost" size="sm">Xem kết quả</Button>
                        </Link>
                      ) : session.status === 'in_progress' || session.status === 'paused' ? (
                        <Link href={`/practice/${session.skill}/${session.id}`}>
                          <Button variant="ghost" size="sm">Tiếp tục</Button>
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
