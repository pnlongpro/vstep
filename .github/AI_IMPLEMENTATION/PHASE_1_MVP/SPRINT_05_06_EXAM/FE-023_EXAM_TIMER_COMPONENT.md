# FE-023: Exam Timer Component

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-023 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 1h |
| **Dependencies** | FE-020, FE-022 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `components/exam/ExamInterface.tsx` - ✅ Đã có Timer logic
> - `components/exam/PreparationTimer.tsx` - ✅ Đã có
> - `components/exam/TransitionCountdownModal.tsx` - ✅ Đã có

**Action:**
- 🚫 **KHÔNG TẠO TIMER MỚI**
- ✅ ENHANCE timer trong ExamInterface với server sync
- ✅ ADD BE-021 time sync API calls
- ✅ EXTRACT timer logic to custom hook nếu cần

---

## 🎯 Objective

ENHANCE Exam Timer với server sync:
- Accurate countdown display
- Server time sync
- Visual warnings for low time
- Section-specific timing
- Offline recovery handling

---

## 💻 Implementation

### Step 1: Timer Hook with Server Sync

```typescript
// src/hooks/useExamTimerSync.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { examService } from '@/services/examService';
import { TimeSyncResponse } from '@/types/exam';

interface UseExamTimerSyncOptions {
  attemptId: string;
  initialTotalTime?: number;
  initialSectionTime?: number;
  syncInterval?: number;
  onTimeout?: () => void;
  onWarning?: (message: string) => void;
  onSync?: (response: TimeSyncResponse) => void;
}

interface TimerState {
  totalTimeRemaining: number;
  sectionTimeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isExpired: boolean;
  lastSyncTime: number;
  serverOffset: number;
  warnings: string[];
}

export function useExamTimerSync({
  attemptId,
  initialTotalTime = 0,
  initialSectionTime = 0,
  syncInterval = 10000,
  onTimeout,
  onWarning,
  onSync,
}: UseExamTimerSyncOptions) {
  const [state, setState] = useState<TimerState>({
    totalTimeRemaining: initialTotalTime,
    sectionTimeRemaining: initialSectionTime,
    isRunning: false,
    isPaused: false,
    isExpired: false,
    lastSyncTime: Date.now(),
    serverOffset: 0,
    warnings: [],
  });

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const syncRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedTimeRef = useRef(initialTotalTime);
  const retryCountRef = useRef(0);

  // Sync with server
  const syncWithServer = useCallback(async () => {
    try {
      const response = await examService.timer.sync(
        attemptId,
        state.totalTimeRemaining
      );

      // Calculate server offset (for drift detection)
      const serverOffset = Date.now() - response.serverTimestamp;

      setState((prev) => ({
        ...prev,
        totalTimeRemaining: response.totalTimeRemaining,
        sectionTimeRemaining: response.sectionTimeRemaining,
        isExpired: response.isExpired,
        lastSyncTime: Date.now(),
        serverOffset,
        warnings: response.warnings,
      }));

      lastSyncedTimeRef.current = response.totalTimeRemaining;
      retryCountRef.current = 0;

      // Handle warnings
      if (response.warnings.length > 0) {
        response.warnings.forEach((warning) => {
          onWarning?.(warning);
        });
      }

      // Handle auto-submit trigger
      if (response.shouldSubmit) {
        onTimeout?.();
      }

      onSync?.(response);
    } catch (error) {
      console.error('Timer sync failed:', error);
      retryCountRef.current++;

      // After 3 retries, show warning
      if (retryCountRef.current >= 3) {
        onWarning?.('Timer sync failed. Please check your connection.');
      }
    }
  }, [attemptId, state.totalTimeRemaining, onTimeout, onWarning, onSync]);

  // Local countdown
  const startCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setState((prev) => {
        const newTotal = Math.max(0, prev.totalTimeRemaining - 1);
        const newSection = Math.max(0, prev.sectionTimeRemaining - 1);

        // Check for timeout
        if (newTotal === 0 && prev.totalTimeRemaining > 0) {
          onTimeout?.();
        }

        return {
          ...prev,
          totalTimeRemaining: newTotal,
          sectionTimeRemaining: newSection,
          isExpired: newTotal === 0,
        };
      });
    }, 1000);

    setState((prev) => ({ ...prev, isRunning: true }));
  }, [onTimeout]);

  // Start sync interval
  const startSync = useCallback(() => {
    if (syncRef.current) {
      clearInterval(syncRef.current);
    }

    // Initial sync
    syncWithServer();

    // Periodic sync
    syncRef.current = setInterval(syncWithServer, syncInterval);
  }, [syncWithServer, syncInterval]);

  // Initialize
  useEffect(() => {
    startCountdown();
    startSync();

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [attemptId]);

  // Pause timer
  const pause = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setState((prev) => ({ ...prev, isRunning: false, isPaused: true }));
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    startCountdown();
    syncWithServer();
    setState((prev) => ({ ...prev, isPaused: false }));
  }, [startCountdown, syncWithServer]);

  // Force sync
  const forceSync = useCallback(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Handle visibility change (tab switch)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Sync immediately when tab becomes visible
        syncWithServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [syncWithServer]);

  // Handle online/offline
  useEffect(() => {
    const handleOnline = () => {
      syncWithServer();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncWithServer]);

  return {
    ...state,
    pause,
    resume,
    forceSync,
  };
}
```

### Step 2: Countdown Timer Display Component

```tsx
// src/components/exam/CountdownTimer.tsx
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CountdownTimerProps {
  timeRemaining: number; // in seconds
  label?: string;
  warningThreshold?: number; // seconds
  criticalThreshold?: number; // seconds
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
  lastSyncTime?: number;
  className?: string;
}

export function CountdownTimer({
  timeRemaining,
  label,
  warningThreshold = 300, // 5 minutes
  criticalThreshold = 60, // 1 minute
  showIcon = true,
  size = 'md',
  isOnline = true,
  lastSyncTime,
  className,
}: CountdownTimerProps) {
  const [flash, setFlash] = useState(false);

  // Flash effect when time changes in critical period
  useEffect(() => {
    if (timeRemaining <= criticalThreshold && timeRemaining > 0) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [timeRemaining, criticalThreshold]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatus = () => {
    if (timeRemaining === 0) return 'expired';
    if (timeRemaining <= criticalThreshold) return 'critical';
    if (timeRemaining <= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-lg px-4 py-2',
    lg: 'text-2xl px-6 py-3',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const statusClasses = {
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const timeSinceSync = lastSyncTime
    ? Math.floor((Date.now() - lastSyncTime) / 1000)
    : 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg border font-mono font-bold',
              sizeClasses[size],
              statusClasses[status],
              status === 'critical' && 'animate-pulse',
              flash && 'ring-2 ring-red-500',
              className
            )}
          >
            {showIcon && (
              <>
                {status === 'critical' ? (
                  <AlertTriangle className={cn(iconSizes[size], 'text-red-500')} />
                ) : (
                  <Clock className={iconSizes[size]} />
                )}
              </>
            )}

            <div>
              {label && (
                <p className="text-xs opacity-70 font-normal">{label}</p>
              )}
              <p>{formatTime(timeRemaining)}</p>
            </div>

            {!isOnline && (
              <WifiOff className={cn(iconSizes[size], 'text-red-500 ml-2')} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              {status === 'expired'
                ? 'Time has expired'
                : `${formatTime(timeRemaining)} remaining`}
            </p>
            {lastSyncTime && (
              <p className="text-gray-400">
                Synced {timeSinceSync}s ago
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Step 3: Exam Timer Header Component

```tsx
// src/components/exam/ExamTimerHeader.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useExamTimerSync } from '@/hooks/useExamTimerSync';
import { CountdownTimer } from './CountdownTimer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Clock,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-react';

interface ExamTimerHeaderProps {
  attemptId: string;
  initialTotalTime: number;
  initialSectionTime: number;
  currentSectionName?: string;
  onTimeout: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
}

export function ExamTimerHeader({
  attemptId,
  initialTotalTime,
  initialSectionTime,
  currentSectionName,
  onTimeout,
  onPause,
  onResume,
  isPaused: externalPaused = false,
}: ExamTimerHeaderProps) {
  const [warning, setWarning] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const handleWarning = useCallback((message: string) => {
    setWarning(message);
    setTimeout(() => setWarning(null), 5000);
  }, []);

  const {
    totalTimeRemaining,
    sectionTimeRemaining,
    isExpired,
    lastSyncTime,
    pause,
    resume,
    forceSync,
    isPaused,
  } = useExamTimerSync({
    attemptId,
    initialTotalTime,
    initialSectionTime,
    onTimeout,
    onWarning: handleWarning,
  });

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle external pause state
  useEffect(() => {
    if (externalPaused) {
      pause();
    } else if (!externalPaused && isPaused) {
      resume();
    }
  }, [externalPaused, isPaused, pause, resume]);

  const handlePauseToggle = () => {
    if (isPaused) {
      resume();
      onResume?.();
    } else {
      pause();
      onPause?.();
    }
  };

  // Calculate progress percentage
  const progressPercent = initialTotalTime > 0
    ? ((initialTotalTime - totalTimeRemaining) / initialTotalTime) * 100
    : 0;

  return (
    <div className="bg-white border-b">
      {/* Timer Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Total Timer */}
          <div className="flex items-center gap-4">
            <CountdownTimer
              timeRemaining={totalTimeRemaining}
              label="Total Time"
              size="lg"
              isOnline={isOnline}
              lastSyncTime={lastSyncTime}
            />

            {/* Section Timer */}
            {currentSectionName && sectionTimeRemaining > 0 && (
              <div className="border-l pl-4">
                <CountdownTimer
                  timeRemaining={sectionTimeRemaining}
                  label={currentSectionName}
                  size="md"
                  warningThreshold={180}
                  criticalThreshold={30}
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sync Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={forceSync}
              className="gap-1 text-gray-500"
            >
              <RefreshCw className="w-4 h-4" />
              Sync
            </Button>

            {/* Pause/Resume */}
            {onPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseToggle}
                className="gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <Progress
            value={progressPercent}
            className={cn(
              'h-1.5 transition-all',
              totalTimeRemaining <= 60 && 'bg-red-100'
            )}
          />
        </div>
      </div>

      {/* Warnings */}
      {warning && (
        <Alert className="mx-4 mb-3 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Offline Warning */}
      {!isOnline && (
        <Alert className="mx-4 mb-3 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You are offline. Your progress is being saved locally and will sync
            when you reconnect.
          </AlertDescription>
        </Alert>
      )}

      {/* Paused Indicator */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-xl">
            <Pause className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Paused</h2>
            <p className="text-gray-600 mb-6">
              Timer is stopped. Click resume to continue.
            </p>
            <Button onClick={handlePauseToggle} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Resume Exam
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Time Warning Modal

```tsx
// src/components/exam/TimeWarningModal.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface TimeWarningModalProps {
  timeRemaining: number;
  warningThresholds?: number[]; // Array of seconds to show warnings
  onDismiss: () => void;
  onSubmitNow: () => void;
}

export function TimeWarningModal({
  timeRemaining,
  warningThresholds = [300, 60], // 5 min, 1 min
  onDismiss,
  onSubmitNow,
}: TimeWarningModalProps) {
  const [shownWarnings, setShownWarnings] = useState<Set<number>>(new Set());
  const [currentWarning, setCurrentWarning] = useState<number | null>(null);

  useEffect(() => {
    // Check if we crossed a threshold
    for (const threshold of warningThresholds) {
      if (
        timeRemaining <= threshold &&
        timeRemaining > threshold - 5 &&
        !shownWarnings.has(threshold)
      ) {
        setCurrentWarning(threshold);
        setShownWarnings((prev) => new Set([...prev, threshold]));
        break;
      }
    }
  }, [timeRemaining, warningThresholds, shownWarnings]);

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      return `${Math.floor(seconds / 60)} minute${seconds >= 120 ? 's' : ''}`;
    }
    return `${seconds} seconds`;
  };

  const handleDismiss = () => {
    setCurrentWarning(null);
    onDismiss();
  };

  const isCritical = currentWarning !== null && currentWarning <= 60;

  return (
    <Dialog open={currentWarning !== null} onOpenChange={() => handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCritical ? (
              <>
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span className="text-red-600">Critical Time Warning!</span>
              </>
            ) : (
              <>
                <Clock className="w-6 h-6 text-amber-500" />
                <span className="text-amber-600">Time Warning</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCritical
              ? 'Your exam will auto-submit very soon!'
              : 'Please be mindful of your remaining time.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center">
          <p className="text-4xl font-bold mb-2">
            {currentWarning && formatTime(currentWarning)}
          </p>
          <p className="text-gray-600">remaining</p>
        </div>

        <div
          className={`rounded-lg p-4 ${
            isCritical ? 'bg-red-50' : 'bg-amber-50'
          }`}
        >
          <h4
            className={`font-medium mb-2 ${
              isCritical ? 'text-red-800' : 'text-amber-800'
            }`}
          >
            {isCritical ? 'What happens next:' : 'Recommendations:'}
          </h4>
          <ul
            className={`text-sm space-y-1 ${
              isCritical ? 'text-red-700' : 'text-amber-700'
            }`}
          >
            {isCritical ? (
              <>
                <li>• Your exam will auto-submit when time runs out</li>
                <li>• All answered questions will be saved</li>
                <li>• Consider submitting now to avoid issues</li>
              </>
            ) : (
              <>
                <li>• Review your flagged questions</li>
                <li>• Complete any unanswered questions</li>
                <li>• Double-check your Writing responses</li>
              </>
            )}
          </ul>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleDismiss}>
            Continue Exam
          </Button>
          <Button
            onClick={onSubmitNow}
            className={isCritical ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Submit Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 5: Timer Utilities

```typescript
// src/utils/time.ts

/**
 * Format seconds into human-readable duration
 * @param seconds - Total seconds
 * @returns Formatted string like "1:30:45" or "30:00"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds into words
 * @param seconds - Total seconds
 * @returns String like "1 hour 30 minutes"
 */
export function formatDurationWords(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}

/**
 * Calculate time elapsed between two timestamps
 * @param startTime - ISO date string or timestamp
 * @param endTime - ISO date string or timestamp (defaults to now)
 * @returns Elapsed time in seconds
 */
export function getElapsedSeconds(
  startTime: string | number,
  endTime?: string | number
): number {
  const start = typeof startTime === 'string' ? new Date(startTime).getTime() : startTime;
  const end = endTime
    ? typeof endTime === 'string'
      ? new Date(endTime).getTime()
      : endTime
    : Date.now();

  return Math.floor((end - start) / 1000);
}

/**
 * Get server time offset for sync
 * @param serverTimestamp - Server timestamp in milliseconds
 * @returns Offset in milliseconds (positive = client ahead of server)
 */
export function calculateServerOffset(serverTimestamp: number): number {
  return Date.now() - serverTimestamp;
}

/**
 * Check if time has significant drift
 * @param clientTime - Client's tracked time
 * @param serverTime - Server's actual time
 * @param threshold - Allowed drift in seconds (default 30)
 * @returns Whether drift exceeds threshold
 */
export function hasSignificantDrift(
  clientTime: number,
  serverTime: number,
  threshold = 30
): boolean {
  return Math.abs(clientTime - serverTime) > threshold;
}
```

---

## ✅ Acceptance Criteria

- [ ] Timer syncs with server every 10 seconds
- [ ] Local countdown updates every second
- [ ] Visual warnings at 5 min and 1 min
- [ ] Timer pauses when exam paused
- [ ] Handles offline/online transitions
- [ ] Tab visibility change triggers sync
- [ ] Time warning modals display correctly
- [ ] Critical time shows animation/pulse

---

## ⏭️ Next Task

→ `FE-024_EXAM_NAVIGATION.md` - Exam Navigation Component
