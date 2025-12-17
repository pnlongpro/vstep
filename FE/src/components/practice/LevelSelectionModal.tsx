'use client';

import { useState } from 'react';
import { VstepLevel, PracticeMode } from '@/types/practice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LevelSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (level: VstepLevel, mode: PracticeMode) => void;
  skill: string;
}

const levels: { value: VstepLevel; label: string; description: string }[] = [
  { value: 'A2', label: 'A2', description: 'Sơ cấp - Pre-intermediate' },
  { value: 'B1', label: 'B1', description: 'Trung cấp - Intermediate' },
  { value: 'B2', label: 'B2', description: 'Trung cao cấp - Upper Intermediate' },
  { value: 'C1', label: 'C1', description: 'Cao cấp - Advanced' },
];

const modes: { value: PracticeMode; label: string; description: string }[] = [
  { value: 'practice', label: 'Luyện tập', description: 'Không giới hạn thời gian, xem đáp án ngay' },
  { value: 'mock_test', label: 'Thi thử', description: 'Có giới hạn thời gian, chấm điểm sau khi nộp' },
];

export default function LevelSelectionModal({ open, onClose, onSelect, skill }: LevelSelectionModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<VstepLevel>('B1');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('practice');

  const handleStart = () => {
    onSelect(selectedLevel, selectedMode);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">Chọn cấp độ {skill}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Level selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Cấp độ</Label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(level.value)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-left transition-colors',
                    selectedLevel === level.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                  )}
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-xs text-gray-500">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Chế độ</Label>
            <RadioGroup value={selectedMode} onValueChange={(v) => setSelectedMode(v as PracticeMode)}>
              {modes.map((mode) => (
                <div
                  key={mode.value}
                  className={cn(
                    'flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer',
                    selectedMode === mode.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700',
                  )}
                  onClick={() => setSelectedMode(mode.value)}
                >
                  <RadioGroupItem value={mode.value} id={mode.value} />
                  <div>
                    <Label htmlFor={mode.value} className="font-medium cursor-pointer">
                      {mode.label}
                    </Label>
                    <p className="text-xs text-gray-500">{mode.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleStart}>Bắt đầu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
