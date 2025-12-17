# FE-017: Level Selection Modal

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-017 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 2h |
| **Dependencies** | FE-016 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `components/PracticeHome.tsx` có thể đã có level selection UI
> - Check trước khi tạo mới

**Action:**
- ✅ CHECK existing `PracticeHome.tsx` xem đã có level selection chưa
- ✅ EXTRACT to separate modal component nếu cần
- ✅ Sử dụng shadcn/ui Dialog component

---

## 🎯 Objective

EXTRACT/CREATE Level Selection Modal:
- VSTEP level options (A2, B1, B2, C1)
- Mode selection (Practice vs Mock Test)
- Part selection (for practice mode)
- Difficulty indicators

---

## 💻 Implementation

### Step 1: Level Selection Modal

```tsx
// src/features/practice/components/LevelSelectionModal.tsx
'use client';

import { FC, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { SkillType, VstepLevel, PracticeMode } from '@/types/practice';

interface LevelSelectionModalProps {
  skill: SkillType;
  onSelect: (level: VstepLevel, mode: PracticeMode, parts?: number[]) => void;
  onClose: () => void;
}

const LEVELS: {
  id: VstepLevel;
  name: string;
  description: string;
  cefrEquivalent: string;
  difficulty: 1 | 2 | 3 | 4;
}[] = [
  {
    id: 'A2',
    name: 'A2',
    description: 'Elementary',
    cefrEquivalent: 'CEFR A2',
    difficulty: 1,
  },
  {
    id: 'B1',
    name: 'B1',
    description: 'Intermediate',
    cefrEquivalent: 'CEFR B1',
    difficulty: 2,
  },
  {
    id: 'B2',
    name: 'B2',
    description: 'Upper Intermediate',
    cefrEquivalent: 'CEFR B2',
    difficulty: 3,
  },
  {
    id: 'C1',
    name: 'C1',
    description: 'Advanced',
    cefrEquivalent: 'CEFR C1',
    difficulty: 4,
  },
];

const SKILL_INFO: Record<SkillType, {
  fullTestDuration: number;
  partCount: number;
  parts: { name: string; duration: number; questions: number }[];
}> = {
  reading: {
    fullTestDuration: 60,
    partCount: 4,
    parts: [
      { name: 'Part 1: Sentence Completion', duration: 10, questions: 10 },
      { name: 'Part 2: Short Passages', duration: 15, questions: 10 },
      { name: 'Part 3: Long Passage', duration: 15, questions: 10 },
      { name: 'Part 4: Academic Text', duration: 20, questions: 10 },
    ],
  },
  listening: {
    fullTestDuration: 40,
    partCount: 3,
    parts: [
      { name: 'Part 1: Short Conversations', duration: 10, questions: 8 },
      { name: 'Part 2: Long Conversations', duration: 15, questions: 12 },
      { name: 'Part 3: Academic Lecture', duration: 15, questions: 15 },
    ],
  },
  writing: {
    fullTestDuration: 60,
    partCount: 2,
    parts: [
      { name: 'Task 1: Email/Letter', duration: 20, questions: 1 },
      { name: 'Task 2: Essay', duration: 40, questions: 1 },
    ],
  },
  speaking: {
    fullTestDuration: 12,
    partCount: 3,
    parts: [
      { name: 'Part 1: Introduction', duration: 3, questions: 4 },
      { name: 'Part 2: Presentation', duration: 4, questions: 1 },
      { name: 'Part 3: Discussion', duration: 5, questions: 3 },
    ],
  },
};

export const LevelSelectionModal: FC<LevelSelectionModalProps> = ({
  skill,
  onSelect,
  onClose,
}) => {
  const [step, setStep] = useState<'level' | 'mode' | 'parts'>('level');
  const [selectedLevel, setSelectedLevel] = useState<VstepLevel | null>(null);
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('practice');
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

  const skillInfo = SKILL_INFO[skill];

  const handleLevelSelect = (level: VstepLevel) => {
    setSelectedLevel(level);
    setStep('mode');
  };

  const handleModeSelect = (mode: PracticeMode) => {
    setSelectedMode(mode);
    if (mode === 'mock_test') {
      // For mock test, start immediately with all parts
      onSelect(selectedLevel!, mode, undefined);
    } else {
      // For practice, show part selection
      setStep('parts');
    }
  };

  const handlePartToggle = (partIndex: number) => {
    setSelectedParts(prev => 
      prev.includes(partIndex)
        ? prev.filter(p => p !== partIndex)
        : [...prev, partIndex]
    );
  };

  const handleStart = () => {
    if (selectedLevel) {
      const parts = selectedParts.length > 0 ? selectedParts : undefined;
      onSelect(selectedLevel, selectedMode, parts);
    }
  };

  const goBack = () => {
    if (step === 'mode') {
      setStep('level');
      setSelectedLevel(null);
    } else if (step === 'parts') {
      setStep('mode');
      setSelectedParts([]);
    }
  };

  const renderDifficultyBars = (level: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-2 h-4 rounded-sm ${
            i <= level ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

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
              <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {step !== 'level' && (
                      <button
                        onClick={goBack}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        ←
                      </button>
                    )}
                    <Dialog.Title className="text-xl font-semibold text-gray-900 capitalize">
                      {skill} Practice
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Step 1: Level Selection */}
                {step === 'level' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 mb-4">
                      Select your target VSTEP level
                    </p>
                    {LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => handleLevelSelect(level.id)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {level.name}
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">
                              {level.description}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {level.cefrEquivalent}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-400">Difficulty</span>
                          {renderDifficultyBars(level.difficulty)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Mode Selection */}
                {step === 'mode' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Choose your practice mode
                    </p>
                    
                    {/* Practice Mode */}
                    <button
                      onClick={() => handleModeSelect('practice')}
                      className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <span className="text-2xl">📝</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Practice Mode
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Practice specific parts at your own pace. No time pressure, instant feedback.
                          </p>
                          <ul className="mt-2 text-xs text-gray-400 space-y-1">
                            <li>✓ Choose specific parts</li>
                            <li>✓ No time limit</li>
                            <li>✓ See answers immediately</li>
                          </ul>
                        </div>
                      </div>
                    </button>

                    {/* Mock Test Mode */}
                    <button
                      onClick={() => handleModeSelect('mock_test')}
                      className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Mock Test
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Simulate the real VSTEP exam with time limits and full scoring.
                          </p>
                          <ul className="mt-2 text-xs text-gray-400 space-y-1">
                            <li className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {skillInfo.fullTestDuration} minutes
                            </li>
                            <li>✓ Timed like real exam</li>
                            <li>✓ Complete score report</li>
                          </ul>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Step 3: Part Selection (Practice Mode only) */}
                {step === 'parts' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Select parts to practice (or leave empty for all)
                    </p>

                    <div className="space-y-2">
                      {skillInfo.parts.map((part, index) => (
                        <button
                          key={index}
                          onClick={() => handlePartToggle(index)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                            selectedParts.includes(index)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedParts.includes(index)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedParts.includes(index) && (
                                <CheckIcon className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900">
                              {part.name}
                            </span>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div>{part.questions} Q</div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {part.duration}m
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Start Button */}
                    <button
                      onClick={handleStart}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors mt-4"
                    >
                      {selectedParts.length === 0
                        ? 'Start All Parts'
                        : `Start ${selectedParts.length} Part${selectedParts.length > 1 ? 's' : ''}`
                      }
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

### Step 2: Updated Types

```typescript
// src/types/practice.ts (additions)
export type PracticeMode = 'practice' | 'mock_test';

export interface PracticeConfig {
  skill: SkillType;
  level: VstepLevel;
  mode: PracticeMode;
  parts?: number[];
  timeLimit?: number;
}
```

### Step 3: Integration with Practice Home

```tsx
// Update in PracticeHome.tsx

const handleLevelSelect = (
  level: VstepLevel, 
  mode: PracticeMode, 
  parts?: number[]
) => {
  setShowLevelModal(false);
  
  const queryParams = new URLSearchParams({
    level,
    mode,
  });
  
  if (parts && parts.length > 0) {
    queryParams.set('parts', parts.join(','));
  }
  
  router.push(`/practice/${selectedSkill}?${queryParams.toString()}`);
};
```

### Step 4: Skill Page Entry

```tsx
// src/app/practice/[skill]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PracticeSession } from '@/features/practice/components/PracticeSession';

interface Props {
  params: { skill: string };
  searchParams: { 
    level?: string; 
    mode?: string; 
    parts?: string;
  };
}

const VALID_SKILLS = ['reading', 'listening', 'writing', 'speaking'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.skill.charAt(0).toUpperCase() + params.skill.slice(1)} Practice | VSTEPRO`,
  };
}

export default function SkillPracticePage({ params, searchParams }: Props) {
  if (!VALID_SKILLS.includes(params.skill)) {
    notFound();
  }

  const config = {
    skill: params.skill as any,
    level: (searchParams.level || 'B1') as any,
    mode: (searchParams.mode || 'practice') as any,
    parts: searchParams.parts?.split(',').map(Number),
  };

  return <PracticeSession config={config} />;
}
```

---

## ✅ Acceptance Criteria

- [ ] 4 levels displayed with difficulty indicator
- [ ] Practice vs Mock Test modes work
- [ ] Part selection works for practice mode
- [ ] Smooth step transitions
- [ ] Back navigation between steps
- [ ] Correct routing with parameters

---

## ⏭️ Next Task

→ `FE-018_PRACTICE_HISTORY.md` - Practice History Page
