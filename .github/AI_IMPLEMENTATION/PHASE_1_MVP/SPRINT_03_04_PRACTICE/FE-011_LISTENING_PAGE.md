# FE-011: Listening Practice Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-011 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008, FE-009 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `components/listening/ListeningExercise.tsx` - ✅ Đã có full UI với audio player!
> - `components/listening/ListeningResult.tsx` - ✅ Đã có result display

**Action:**
- ❌ KHÔNG tạo mới AudioPlayer, UI components
- ✅ CREATE page route `app/(dashboard)/practice/listening/page.tsx`
- ✅ INTEGRATE existing `ListeningExercise.tsx` với practice API
- ✅ ADD React Query hooks để fetch data

---

## 🎯 Objective

INTEGRATE Listening Practice Page (dùng component có sẵn):
- Custom Audio Player với playback controls
- Transcript hiển thị (toggle on/off)
- Playback speed control (0.5x - 2x)
- Auto-pause khi chuyển câu hỏi
- Skip/replay segment

---

## 💻 Implementation

### File Structure

```
src/app/practice/listening/
├── page.tsx
├── [sessionId]/
│   ├── page.tsx
│   └── result/
│       └── page.tsx
└── components/
    ├── ListeningLayout.tsx
    ├── AudioPlayer.tsx
    ├── TranscriptViewer.tsx
    └── ListeningToolbar.tsx
```

### Step 1: Custom Audio Player

```tsx
// src/app/practice/listening/components/AudioPlayer.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  SkipForward,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  disabled?: boolean;
  autoPlay?: boolean;
  maxPlays?: number;  // Giới hạn số lần phát (thi thật)
}

export default function AudioPlayer({
  src,
  title,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  disabled = false,
  autoPlay = false,
  maxPlays,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playCount, setPlayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Check if can play (for exam mode with play limits)
  const canPlay = maxPlays === undefined || playCount < maxPlays;

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || disabled) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!canPlay) return;
      audioRef.current.play();
      if (!isPlaying) {
        setPlayCount(prev => prev + 1);
      }
    }
  }, [isPlaying, disabled, canPlay]);

  // Handle seeking
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || disabled) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration, disabled]);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (!audioRef.current || disabled) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
  }, [duration, disabled]);

  // Replay from start
  const replay = useCallback(() => {
    if (!audioRef.current || disabled) return;
    audioRef.current.currentTime = 0;
    if (!isPlaying && canPlay) {
      audioRef.current.play();
      setPlayCount(prev => prev + 1);
    }
  }, [disabled, isPlaying, canPlay]);

  // Change playback rate
  const cyclePlaybackRate = useCallback(() => {
    const currentIndex = playbackRates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % playbackRates.length;
    const newRate = playbackRates[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  }, [playbackRate]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  }, [isMuted]);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded]);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && audioRef.current && !disabled && canPlay) {
      audioRef.current.play();
      setPlayCount(1);
    }
  }, [autoPlay, disabled, canPlay]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4',
      disabled && 'opacity-60'
    )}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title */}
      {title && (
        <div className="text-center mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        className={cn(
          'relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer mb-3',
          disabled && 'cursor-not-allowed'
        )}
      >
        {/* Buffered */}
        <div 
          className="absolute h-full bg-gray-300 dark:bg-gray-600 rounded-full"
          style={{ width: '100%' }} // In real app, use buffered ranges
        />
        {/* Progress */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full shadow"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left: Volume */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-gray-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Center: Play Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={replay}
            disabled={disabled}
            className={cn(
              'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
              disabled && 'cursor-not-allowed'
            )}
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-5 h-5 text-gray-500" />
          </button>

          <button
            onClick={() => skip(-10)}
            disabled={disabled}
            className={cn(
              'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
              disabled && 'cursor-not-allowed'
            )}
            title="Lùi 10 giây"
          >
            <span className="text-xs font-medium text-gray-500">-10s</span>
          </button>

          <button
            onClick={togglePlay}
            disabled={disabled || !canPlay}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              'bg-blue-600 hover:bg-blue-700 text-white',
              (disabled || !canPlay) && 'bg-gray-400 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            disabled={disabled}
            className={cn(
              'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
              disabled && 'cursor-not-allowed'
            )}
            title="Tiến 10 giây"
          >
            <span className="text-xs font-medium text-gray-500">+10s</span>
          </button>

          <button
            onClick={() => skip(30)}
            disabled={disabled}
            className={cn(
              'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
              disabled && 'cursor-not-allowed'
            )}
            title="Tiến 30 giây"
          >
            <SkipForward className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Right: Speed & Play Count */}
        <div className="flex items-center space-x-2">
          <button
            onClick={cyclePlaybackRate}
            className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Tốc độ phát"
          >
            <Gauge className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {playbackRate}x
            </span>
          </button>

          {maxPlays !== undefined && (
            <span className="text-xs text-gray-500">
              {playCount}/{maxPlays} lần
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Transcript Viewer

```tsx
// src/app/practice/listening/components/TranscriptViewer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  showByDefault?: boolean;
  onSeek?: (time: number) => void;
}

export default function TranscriptViewer({
  segments,
  currentTime,
  showByDefault = false,
  onSeek,
}: TranscriptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(showByDefault);
  const [searchQuery, setSearchQuery] = useState('');
  const activeRef = useRef<HTMLDivElement>(null);

  // Find current segment
  const currentSegmentIndex = segments.findIndex(
    seg => currentTime >= seg.startTime && currentTime < seg.endTime
  );

  // Auto-scroll to current segment
  useEffect(() => {
    if (isVisible && isExpanded && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentSegmentIndex, isVisible, isExpanded]);

  // Filter segments by search
  const filteredSegments = searchQuery
    ? segments.filter(seg => 
        seg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : segments;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Transcript
        </span>
        <div className="flex items-center space-x-2">
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(!isVisible);
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title={isVisible ? 'Ẩn nội dung' : 'Hiện nội dung'}
            >
              {isVisible ? (
                <Eye className="w-4 h-4 text-gray-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Search */}
          {isVisible && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Tìm trong transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>
          )}

          {/* Segments */}
          <div className="max-h-60 overflow-y-auto">
            {isVisible ? (
              filteredSegments.length > 0 ? (
                filteredSegments.map((segment, index) => {
                  const isActive = segments.indexOf(segment) === currentSegmentIndex;
                  return (
                    <div
                      key={segment.id}
                      ref={isActive ? activeRef : null}
                      onClick={() => onSeek?.(segment.startTime)}
                      className={cn(
                        'flex items-start px-4 py-2 cursor-pointer',
                        'hover:bg-gray-50 dark:hover:bg-gray-700',
                        isActive && 'bg-blue-50 dark:bg-blue-900/30'
                      )}
                    >
                      <span className="flex-shrink-0 w-12 text-xs text-gray-400 font-mono">
                        {formatTime(segment.startTime)}
                      </span>
                      {segment.speaker && (
                        <span className="flex-shrink-0 w-20 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {segment.speaker}:
                        </span>
                      )}
                      <p className={cn(
                        'flex-1 text-sm text-gray-700 dark:text-gray-300',
                        isActive && 'font-medium text-gray-900 dark:text-white'
                      )}>
                        {segment.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  Không tìm thấy kết quả
                </div>
              )
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Transcript đang ẩn</p>
                <button
                  onClick={() => setIsVisible(true)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Hiển thị
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Listening Layout

```tsx
// src/app/practice/listening/components/ListeningLayout.tsx
'use client';

import { ReactNode } from 'react';

interface ListeningLayoutProps {
  toolbar: ReactNode;
  audioPlayer: ReactNode;
  transcript?: ReactNode;
  questions: ReactNode;
  navigator: ReactNode;
}

export default function ListeningLayout({
  toolbar,
  audioPlayer,
  transcript,
  questions,
  navigator,
}: ListeningLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {toolbar}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Audio Player - Sticky */}
          <div className="sticky top-0 z-10 pb-4">
            {audioPlayer}
          </div>

          {/* Transcript (collapsible) */}
          {transcript}

          {/* Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {questions}
          </div>
        </div>
      </div>

      {/* Bottom Navigator */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {navigator}
      </div>
    </div>
  );
}
```

### Step 4: Listening Practice Page

```tsx
// src/app/practice/listening/[sessionId]/page.tsx
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { QuestionRenderer } from '@/components/practice/questions';
import ListeningLayout from '../components/ListeningLayout';
import AudioPlayer from '../components/AudioPlayer';
import TranscriptViewer from '../components/TranscriptViewer';
import ReadingToolbar from '@/app/practice/reading/components/ReadingToolbar';
import QuestionNavigator from '@/app/practice/reading/components/QuestionNavigator';
import { Loader2 } from 'lucide-react';

export default function ListeningPracticePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [audioTime, setAudioTime] = useState(0);
  const audioTimeRef = useRef(0);

  const {
    session,
    questions,
    answers,
    currentIndex,
    currentQuestion,
    currentAnswer,
    isLoading,
    error,
    timeSpent,
    progress,
    loadSession,
    submitAnswer,
    goToQuestion,
    goNext,
    goPrevious,
    toggleFlag,
    pauseSession,
    resumeSession,
    completeSession,
  } = usePracticeSession({
    onSessionEnd: (session) => {
      router.push(`/practice/listening/${session.id}/result`);
    },
  });

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  // Track audio time
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    setAudioTime(currentTime);
    audioTimeRef.current = currentTime;
  }, []);

  // Mock transcript segments - in real app, fetch from API
  const transcriptSegments = useMemo(() => {
    return [
      { id: '1', startTime: 0, endTime: 5, text: 'Welcome to the VSTEP listening test.', speaker: 'Narrator' },
      { id: '2', startTime: 5, endTime: 12, text: 'In this section, you will hear several conversations and monologues.', speaker: 'Narrator' },
      { id: '3', startTime: 12, endTime: 18, text: 'For each question, choose the best answer from the options given.', speaker: 'Narrator' },
      // Add more segments...
    ];
  }, []);

  // Get audio URL from current question context
  const audioUrl = useMemo(() => {
    // In real implementation, get from session/question data
    return currentQuestion?.audioUrl || '/audio/sample-listening.mp3';
  }, [currentQuestion]);

  // Computed sets
  const answeredQuestions = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id]?.answer || answers[q.id]?.selectedOptionId) {
        set.add(i);
      }
    });
    return set;
  }, [questions, answers]);

  const flaggedQuestions = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id]?.isFlagged) {
        set.add(i);
      }
    });
    return set;
  }, [questions, answers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !session || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Session not found'}</p>
          <button
            onClick={() => router.push('/practice')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isPaused = session.status === 'paused';

  return (
    <ListeningLayout
      toolbar={
        <ReadingToolbar
          timeSpent={timeSpent}
          timeLimit={session.timeLimit || undefined}
          isPaused={isPaused}
          progress={{
            answered: progress.answered,
            flagged: progress.flagged,
            total: progress.total,
          }}
          onPause={pauseSession}
          onResume={resumeSession}
          onSubmit={completeSession}
          onExit={async () => {
            if (confirm('Bạn có chắc muốn thoát?')) {
              await pauseSession();
              router.push('/practice');
            }
          }}
        />
      }
      audioPlayer={
        <AudioPlayer
          src={audioUrl}
          title={`Listening - Part ${currentQuestion.partNumber || 1}`}
          onTimeUpdate={handleTimeUpdate}
          disabled={isPaused}
          autoPlay={false}
          // For mock test mode, limit plays
          maxPlays={session.mode === 'mock_test' ? 2 : undefined}
        />
      }
      transcript={
        session.mode === 'practice' ? (
          <TranscriptViewer
            segments={transcriptSegments}
            currentTime={audioTime}
            showByDefault={false}
            onSeek={(time) => {
              // Implement seek through audio player ref
            }}
          />
        ) : null // Hide transcript in mock test mode
      }
      questions={
        <QuestionRenderer
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          currentAnswer={currentAnswer || undefined}
          onAnswer={(answer) => submitAnswer(answer)}
          onFlag={toggleFlag}
          disabled={isPaused}
        />
      }
      navigator={
        <QuestionNavigator
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestions}
          flaggedQuestions={flaggedQuestions}
          onNavigate={goToQuestion}
          onPrevious={goPrevious}
          onNext={goNext}
        />
      }
    />
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Audio player với full controls (play/pause, seek, volume, speed)
- [ ] Progress bar có thể click để seek
- [ ] Playback speed từ 0.5x đến 2x
- [ ] Transcript collapsible và có thể ẩn/hiện
- [ ] Click vào transcript segment để seek đến thời điểm đó
- [ ] Current segment được highlight và auto-scroll
- [ ] Mock test mode: giới hạn số lần phát, ẩn transcript
- [ ] Auto-save answer khi chuyển câu

---

## 🧪 Test Cases

```tsx
// src/__tests__/listening/AudioPlayer.test.tsx
describe('AudioPlayer', () => {
  it('should show loading state initially', () => {
    render(<AudioPlayer src="/test.mp3" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should toggle play/pause', async () => {
    render(<AudioPlayer src="/test.mp3" />);
    const playButton = screen.getByRole('button', { name: /play/i });
    
    await userEvent.click(playButton);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('should enforce max plays limit', async () => {
    render(<AudioPlayer src="/test.mp3" maxPlays={2} />);
    
    // Play twice
    await userEvent.click(screen.getByRole('button', { name: /play/i }));
    // Wait for audio to end or pause
    await userEvent.click(screen.getByRole('button', { name: /pause/i }));
    await userEvent.click(screen.getByRole('button', { name: /play/i }));
    
    // Third play should be disabled
    await userEvent.click(screen.getByRole('button', { name: /pause/i }));
    await userEvent.click(screen.getByRole('button', { name: /play/i }));
    
    expect(screen.getByText('2/2 lần')).toBeInTheDocument();
  });
});
```

---

## ⏭️ Next Task

→ `FE-012_AUDIO_PLAYER.md` - Audio Player Component (đã implement inline, extract nếu cần)
