import { X, Sparkles, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal } from '../utils/goalService';

interface GoalAchievedModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export function GoalAchievedModal({ isOpen, onClose, goal }: GoalAchievedModalProps) {
  if (!goal) return null;

  const Icon = goal.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-2 hover:bg-black/30"
              >
                <X className="size-5" />
              </button>

              {/* Animated Background */}
              <div className={`relative bg-gradient-to-br ${goal.color} p-8 text-white text-center overflow-hidden`}>
                {/* Confetti Effects */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 left-4"
                >
                  <PartyPopper className="size-8 text-yellow-300" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: 45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="size-7 text-yellow-200" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-6 left-8"
                >
                  <Sparkles className="size-6 text-yellow-300" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 right-8"
                >
                  <Sparkles className="size-5 text-yellow-200" />
                </motion.div>

                {/* Celebration Text */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="text-3xl mb-2">Xuất sắc!</h2>
                  <p className="text-white/90 text-sm">Bạn đã hoàn thành mục tiêu</p>
                </motion.div>

                {/* Goal Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="my-8 mx-auto w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative"
                >
                  <Icon className="size-16 text-white" />
                  {/* Glow effect */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/30 rounded-full blur-2xl"
                  />
                </motion.div>

                {/* Goal Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl mb-2">{goal.title}</h3>
                  <p className="text-white/90 text-sm mb-1">{goal.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mt-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Stats & CTA */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                {/* Mini Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-3 mb-4"
                >
                  <div className="text-center p-3 bg-white rounded-xl border border-gray-100">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs text-gray-500">Mục tiêu</div>
                    <div className="text-sm font-semibold text-gray-700">Đạt</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-gray-100">
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="text-xs text-gray-500">Tiến độ</div>
                    <div className="text-sm font-semibold text-gray-700">100%</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-gray-100">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs text-gray-500">Thành tích</div>
                    <div className="text-sm font-semibold text-gray-700">+1</div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className={`w-full py-3 rounded-xl text-white bg-gradient-to-r ${goal.color} hover:shadow-lg transition-all duration-300 font-semibold`}
                >
                  Tuyệt vời! Tiếp tục phát huy
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
