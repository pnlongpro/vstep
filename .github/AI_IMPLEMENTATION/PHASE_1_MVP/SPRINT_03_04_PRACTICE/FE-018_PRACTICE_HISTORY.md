# FE-018: Practice History Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-018 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008, FE-015 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - History page chưa có - **CÓ THỂ TẠO MỚI**
> - Sử dụng shadcn/ui Table, Badge, Pagination

**Action:**
- ✅ CREATE page `app/(dashboard)/practice/history/page.tsx`
- ✅ CREATE `components/practice/PracticeHistoryList.tsx`
- ✅ ADD filters và pagination

---

## 🎯 Objective

Implement Practice History Page:
- List tất cả practice sessions
- Filter theo skill, level, date range
- Pagination
- Session details preview

---

## 💻 Implementation

### Step 1: History Page Route

```typescript
// src/app/practice/history/page.tsx
import { Metadata } from 'next';
import { PracticeHistory } from '@/features/practice/components/PracticeHistory';

export const metadata: Metadata = {
  title: 'Practice History | VSTEPRO',
  description: 'View your practice history and progress',
};

export default function PracticeHistoryPage() {
  return <PracticeHistory />;
}
```

### Step 2: History Component

```tsx
// src/features/practice/components/PracticeHistory.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FunnelIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HistoryFilters } from './HistoryFilters';
import { HistoryTable } from './HistoryTable';
import { HistoryCards } from './HistoryCards';
import { SessionPreviewModal } from './SessionPreviewModal';
import { practiceService } from '@/services/practice.service';
import { PracticeSession, SkillType, VstepLevel } from '@/types/practice';
import { format } from 'date-fns';

interface FilterState {
  skill?: SkillType;
  level?: VstepLevel;
  status?: 'completed' | 'in_progress' | 'abandoned';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function PracticeHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    skill: searchParams.get('skill') as SkillType | undefined,
    level: searchParams.get('level') as VstepLevel | undefined,
    status: searchParams.get('status') as any,
  });

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await practiceService.getHistory({
        ...filters,
        page,
        limit,
      });
      setSessions(response.items);
      setTotalCount(response.total);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = params.toString() 
      ? `/practice/history?${params.toString()}` 
      : '/practice/history';
    router.replace(newUrl, { scroll: false });
  }, [filters, page, router]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Practice History</h1>
              <p className="mt-1 text-gray-500">
                {totalCount} sessions • View and analyze your practice progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'cards' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cards
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                  hasActiveFilters || showFilters
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6">
            <HistoryFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.skill && (
              <FilterPill 
                label={`Skill: ${filters.skill}`}
                onRemove={() => handleFilterChange({ ...filters, skill: undefined })}
              />
            )}
            {filters.level && (
              <FilterPill 
                label={`Level: ${filters.level}`}
                onRemove={() => handleFilterChange({ ...filters, level: undefined })}
              />
            )}
            {filters.status && (
              <FilterPill 
                label={`Status: ${filters.status}`}
                onRemove={() => handleFilterChange({ ...filters, status: undefined })}
              />
            )}
            {(filters.startDate || filters.endDate) && (
              <FilterPill 
                label={`Date: ${filters.startDate || ''} - ${filters.endDate || ''}`}
                onRemove={() => handleFilterChange({ 
                  ...filters, 
                  startDate: undefined, 
                  endDate: undefined 
                })}
              />
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : sessions.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClear={handleClearFilters} />
        ) : viewMode === 'table' ? (
          <HistoryTable 
            sessions={sessions} 
            onPreview={setSelectedSession}
          />
        ) : (
          <HistoryCards 
            sessions={sessions}
            onPreview={setSelectedSession}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Preview Modal */}
      {selectedSession && (
        <SessionPreviewModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

// Filter Pill Component
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <XMarkIcon className="w-4 h-4" />
      </button>
    </span>
  );
}

// Pagination Component
function Pagination({ 
  page, 
  totalPages, 
  onPageChange 
}: { 
  page: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisible = 5;
  
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-lg hover:bg-gray-100"
            >
              1
            </button>
            {start > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg ${
              p === page 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}
        
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-lg hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton({ viewMode }: { viewMode: 'table' | 'cards' }) {
  if (viewMode === 'table') {
    return (
      <div className="bg-white rounded-xl border animate-pulse">
        <div className="h-12 bg-gray-100 rounded-t-xl" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 border-t border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// Empty State
function EmptyState({ 
  hasFilters, 
  onClear 
}: { 
  hasFilters: boolean; 
  onClear: () => void;
}) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border">
      <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? 'No matching sessions' : 'No practice history yet'}
      </h3>
      <p className="text-gray-500 mb-4">
        {hasFilters 
          ? 'Try adjusting your filters to find more sessions.'
          : 'Start practicing to build your history.'
        }
      </p>
      {hasFilters ? (
        <button
          onClick={onClear}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      ) : (
        <a
          href="/practice"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Practicing
        </a>
      )}
    </div>
  );
}
```

### Step 3: History Filters Component

```tsx
// src/features/practice/components/HistoryFilters.tsx
'use client';

import { FC } from 'react';
import { SkillType, VstepLevel } from '@/types/practice';

interface FilterState {
  skill?: SkillType;
  level?: VstepLevel;
  status?: 'completed' | 'in_progress' | 'abandoned';
  startDate?: string;
  endDate?: string;
}

interface HistoryFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export const HistoryFilters: FC<HistoryFiltersProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill
          </label>
          <select
            value={filters.skill || ''}
            onChange={(e) => onChange({ 
              ...filters, 
              skill: e.target.value as SkillType || undefined 
            })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Skills</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="writing">Writing</option>
            <option value="speaking">Speaking</option>
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => onChange({ 
              ...filters, 
              level: e.target.value as VstepLevel || undefined 
            })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onChange({ 
              ...filters, 
              status: e.target.value as any || undefined 
            })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
```

### Step 4: History Table Component

```tsx
// src/features/practice/components/HistoryTable.tsx
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { PracticeSession } from '@/types/practice';

interface HistoryTableProps {
  sessions: PracticeSession[];
  onPreview: (session: PracticeSession) => void;
}

const SKILL_COLORS: Record<string, string> = {
  reading: 'bg-blue-100 text-blue-700',
  listening: 'bg-purple-100 text-purple-700',
  writing: 'bg-green-100 text-green-700',
  speaking: 'bg-orange-100 text-orange-700',
};

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  completed: {
    icon: CheckCircleIcon,
    color: 'text-green-600',
    label: 'Completed',
  },
  in_progress: {
    icon: PlayIcon,
    color: 'text-yellow-600',
    label: 'In Progress',
  },
  abandoned: {
    icon: XCircleIcon,
    color: 'text-red-600',
    label: 'Abandoned',
  },
};

export const HistoryTable: FC<HistoryTableProps> = ({ sessions, onPreview }) => {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Session
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Score
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Duration
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Date
            </th>
            <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sessions.map((session) => {
            const statusConfig = STATUS_CONFIG[session.status];
            const StatusIcon = statusConfig.icon;

            return (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${SKILL_COLORS[session.skill]}
                    `}>
                      {session.skill}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {session.level}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">
                      {session.mode === 'mock_test' ? 'Mock Test' : 'Practice'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm">{statusConfig.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {session.status === 'completed' && session.score !== null ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        session.score >= 80 ? 'text-green-600' :
                        session.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(session.score)}%
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            session.score >= 80 ? 'bg-green-500' :
                            session.score >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${session.score}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    {Math.round((session.timeSpent || 0) / 60)} min
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {format(new Date(session.createdAt), 'MMM d, yyyy')}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {format(new Date(session.createdAt), 'h:mm a')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onPreview(session)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Quick Preview"
                    >
                      <EyeIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    {session.status === 'completed' ? (
                      <Link
                        href={`/practice/result/${session.id}`}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        View Result
                      </Link>
                    ) : session.status === 'in_progress' ? (
                      <Link
                        href={`/practice/session/${session.id}`}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Continue
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

### Step 5: Session Preview Modal

```tsx
// src/features/practice/components/SessionPreviewModal.tsx
'use client';

import { FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { format } from 'date-fns';
import { XMarkIcon, ClockIcon, CheckIcon, XIcon } from '@heroicons/react/24/outline';
import { PracticeSession } from '@/types/practice';
import Link from 'next/link';

interface SessionPreviewModalProps {
  session: PracticeSession;
  onClose: () => void;
}

export const SessionPreviewModal: FC<SessionPreviewModalProps> = ({
  session,
  onClose,
}) => {
  const isCompleted = session.status === 'completed';

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-gray-900 capitalize">
                      {session.skill} Session
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      {format(new Date(session.createdAt), 'MMMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="text-xl font-bold">{session.level}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Mode</p>
                    <p className="text-xl font-bold capitalize">
                      {session.mode === 'mock_test' ? 'Mock Test' : 'Practice'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Time Spent</p>
                    <p className="text-xl font-bold flex items-center gap-1">
                      <ClockIcon className="w-5 h-5" />
                      {Math.round((session.timeSpent || 0) / 60)}m
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className={`text-xl font-bold ${
                      !isCompleted ? 'text-gray-400' :
                      (session.score || 0) >= 80 ? 'text-green-600' :
                      (session.score || 0) >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {isCompleted && session.score !== null
                        ? `${Math.round(session.score)}%`
                        : '—'
                      }
                    </p>
                  </div>
                </div>

                {/* Answers Summary (if completed) */}
                {isCompleted && session.totalQuestions && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Answers Summary
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            {session.correctAnswers || 0}
                          </p>
                          <p className="text-xs text-gray-500">Correct</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <XMarkIcon className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-red-600">
                            {session.totalQuestions - (session.correctAnswers || 0)}
                          </p>
                          <p className="text-xs text-gray-500">Incorrect</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {session.status === 'completed' ? (
                    <Link
                      href={`/practice/result/${session.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                    >
                      View Full Result
                    </Link>
                  ) : session.status === 'in_progress' ? (
                    <Link
                      href={`/practice/session/${session.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                    >
                      Continue Session
                    </Link>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

---

## ✅ Acceptance Criteria

- [ ] History list displays all sessions
- [ ] Filters work correctly (skill, level, status, date)
- [ ] Pagination handles large datasets
- [ ] Table and card views toggle
- [ ] Preview modal shows session summary
- [ ] Continue button works for in-progress sessions

---

## ⏭️ Next Task

→ Sprint 03-04 Complete! Next: `SPRINT_05_06_EXAM/BE-020_EXAM_ATTEMPT_ENTITY.md`
