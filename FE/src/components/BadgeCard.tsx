import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BadgeCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  size?: 'small' | 'medium' | 'large';
}

export function BadgeCard({
  name,
  description,
  icon: Icon,
  color,
  isUnlocked,
  unlockedAt,
  size = 'medium',
}: BadgeCardProps) {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  const iconSizes = {
    small: 'size-6',
    medium: 'size-8',
    large: 'size-12',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
      className={`${sizeClasses[size]} rounded-2xl border-2 transition-all duration-300 ${
        isUnlocked
          ? `bg-gradient-to-br ${color} border-transparent shadow-lg hover:shadow-xl`
          : 'bg-gray-50 border-gray-200 opacity-50'
      }`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon with glow effect */}
        <div
          className={`relative ${
            isUnlocked ? 'text-white' : 'text-gray-300'
          }`}
        >
          <Icon className={iconSizes[size]} />
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 bg-white/30 rounded-full blur-xl`}
            />
          )}
        </div>

        {/* Badge Name */}
        <div>
          <h4
            className={`font-semibold ${
              size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'
            } ${isUnlocked ? 'text-white' : 'text-gray-400'}`}
          >
            {name}
          </h4>
          <p
            className={`text-xs mt-1 ${
              isUnlocked ? 'text-white/80' : 'text-gray-400'
            }`}
          >
            {description}
          </p>
        </div>

        {/* Unlock Date */}
        {isUnlocked && unlockedAt && (
          <p className="text-xs text-white/60 mt-1">
            Mở khóa: {new Date(unlockedAt).toLocaleDateString('vi-VN')}
          </p>
        )}

        {/* Lock Icon */}
        {!isUnlocked && (
          <div className="mt-2 text-gray-400 text-xs">🔒 Chưa mở khóa</div>
        )}
      </div>
    </motion.div>
  );
}
