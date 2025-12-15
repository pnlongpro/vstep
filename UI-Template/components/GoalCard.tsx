import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { Goal, ICON_MAP } from '../utils/goalService';

interface GoalCardProps {
  goal: Goal;
  onDelete?: (goalId: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export function GoalCard({ goal, onDelete, size = 'medium' }: GoalCardProps) {
  const Icon = ICON_MAP[goal.icon];
  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  const periodLabels = {
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${sizeClasses[size]} bg-white rounded-2xl border-2 transition-all duration-300 relative group ${
        goal.isCompleted
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(goal.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="size-4 text-red-500" />
        </button>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`bg-gradient-to-br ${goal.color} p-3 rounded-xl text-white flex-shrink-0`}>
          <Icon className="size-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 truncate">{goal.title}</h4>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
            {goal.isCompleted && (
              <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
            )}
          </div>

          {/* Progress */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {goal.currentValue}/{goal.targetValue} {goal.unit}
              </span>
              <span className={`font-semibold ${goal.isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${
                  goal.isCompleted ? 'from-green-400 to-green-600' : goal.color
                }`}
              />
            </div>
          </div>

          {/* Period Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              📅 {periodLabels[goal.period]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}