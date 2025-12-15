import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface BadgeUnlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
  } | null;
}

export function BadgeUnlockedModal({ isOpen, onClose, badge }: BadgeUnlockedModalProps) {
  if (!badge) return null;

  const Icon = badge.icon;

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
              <div className={`relative bg-gradient-to-br ${badge.color} p-8 text-white text-center overflow-hidden`}>
                {/* Sparkle Effects */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 left-4"
                >
                  <Sparkles className="size-6 text-yellow-300" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-8 right-8"
                >
                  <Sparkles className="size-5 text-yellow-200" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-6 left-8"
                >
                  <Sparkles className="size-4 text-yellow-300" />
                </motion.div>

                {/* Celebration Text */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h2 className="text-2xl mb-1">Chúc mừng!</h2>
                  <p className="text-white/90 text-sm">Bạn vừa nhận được huy hiệu mới</p>
                </motion.div>

                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="my-8 mx-auto w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative"
                >
                  <Icon className="size-16 text-white" />
                  {/* Glow effect */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/30 rounded-full blur-2xl"
                  />
                </motion.div>

                {/* Badge Name & Description */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl mb-2">✨ {badge.name} ✨</h3>
                  <p className="text-white/90 text-sm mb-6">{badge.description}</p>
                </motion.div>
              </div>

              {/* CTA Button */}
              <div className="p-6 bg-gray-50">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className={`w-full py-3 rounded-xl text-white bg-gradient-to-r ${badge.color} hover:shadow-lg transition-all duration-300`}
                >
                  Tuyệt vời! Tiếp tục học
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
