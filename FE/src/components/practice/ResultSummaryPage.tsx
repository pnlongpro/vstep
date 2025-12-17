'use client';

import { SessionResult, Skill } from '@/types/practice';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ResultSummaryPageProps {
  result: SessionResult;
}

const skillNames: Record<Skill, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
};

export default function ResultSummaryPage({ result }: ResultSummaryPageProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hoàn thành!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {skillNames[result.skill]} - Level {result.level}
          </p>
        </div>

        {/* Score card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{result.overallScore.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Điểm / 10</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{result.percentage}%</div>
              <div className="text-sm text-gray-500">Tỷ lệ đúng</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{result.correctCount}/{result.totalQuestions}</div>
              <div className="text-sm text-gray-500">Câu đúng</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{formatTime(result.totalTimeSpent)}</div>
              <div className="text-sm text-gray-500">Thời gian</div>
            </div>
          </div>

          {result.vstepScore && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Điểm VSTEP tương đương</div>
              <div className="text-4xl font-bold text-yellow-600">{result.vstepScore}</div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {result.suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Gợi ý cải thiện
            </h3>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section results */}
        {result.sectionResults.map((section, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4">
              {section.partNumber ? `Part ${section.partNumber}` : skillNames[section.skill]}
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${section.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{section.percentage}%</span>
            </div>
            <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> {section.correctCount} đúng</span>
              <span className="flex items-center"><XCircle className="w-4 h-4 mr-1 text-red-500" /> {section.incorrectCount} sai</span>
              <span>{section.skippedCount} bỏ qua</span>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/practice">
            <Button variant="outline" size="lg">Quay lại trang luyện tập</Button>
          </Link>
          <Link href={`/practice/${result.skill}?level=${result.level}`}>
            <Button size="lg">Luyện tập tiếp</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
