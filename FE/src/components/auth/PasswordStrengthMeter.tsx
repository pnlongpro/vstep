'use client';

import { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function calculatePasswordStrength(password: string): StrengthResult {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const getLabel = (score: number) => {
    if (score === 0) return '';
    if (score <= 2) return 'Yếu';
    if (score <= 3) return 'Trung bình';
    if (score <= 4) return 'Mạnh';
    return 'Rất mạnh';
  };

  const getColor = (score: number) => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return {
    score,
    label: getLabel(score),
    color: getColor(score),
    checks,
  };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Độ mạnh: {strength.label}</span>
      </div>

      {/* Requirements Checklist */}
      <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
        <li className={`flex items-center ${strength.checks.length ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.length ? '✓' : '○'}</span>
          Ít nhất 8 ký tự
        </li>
        <li className={`flex items-center ${strength.checks.lowercase ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.lowercase ? '✓' : '○'}</span>
          Chữ cái thường (a-z)
        </li>
        <li className={`flex items-center ${strength.checks.uppercase ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.uppercase ? '✓' : '○'}</span>
          Chữ cái in hoa (A-Z)
        </li>
        <li className={`flex items-center ${strength.checks.number ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.number ? '✓' : '○'}</span>
          Số (0-9)
        </li>
        <li className={`flex items-center ${strength.checks.special ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.special ? '✓' : '○'}</span>
          Ký tự đặc biệt (!@#$%...)
        </li>
      </ul>
    </div>
  );
}
