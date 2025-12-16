import { X, Plus, BookOpen, Headphones, PenTool, Mic, Trophy, Clock, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { createGoal, GOAL_TEMPLATES, GoalType, GoalPeriod, SkillType, ICON_MAP } from '../utils/goalService';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
}

type Step = 'type' | 'template' | 'custom';

export function GoalSettingModal({ isOpen, onClose, onGoalCreated }: GoalSettingModalProps) {
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<GoalType | null>(null);

  const goalTypes = [
    {
      type: 'skill' as GoalType,
      icon: BookOpen,
      title: 'Theo kỹ năng',
      description: 'Luyện tập từng kỹ năng VSTEP',
      color: 'from-blue-500 to-cyan-600',
      examples: 'Listening, Reading, Writing, Speaking',
    },
    {
      type: 'quantity' as GoalType,
      icon: Trophy,
      title: 'Theo số lượng đề',
      description: 'Hoàn thành số đề mục tiêu',
      color: 'from-yellow-500 to-orange-600',
      examples: '5 đề/tuần, 20 đề/tháng',
    },
    {
      type: 'time' as GoalType,
      icon: Clock,
      title: 'Theo thời gian',
      description: 'Học đủ số giờ trong kỳ',
      color: 'from-purple-500 to-pink-600',
      examples: '30 phút/ngày, 2 giờ/tuần',
    },
    {
      type: 'streak' as GoalType,
      icon: Flame,
      title: 'Chuỗi ngày học',
      description: 'Học liên tục không nghỉ',
      color: 'from-orange-400 to-red-500',
      examples: '3 ngày, 7 ngày, 14 ngày',
    },
    {
      type: 'score' as GoalType,
      icon: TrendingUp,
      title: 'Theo điểm số',
      description: 'Đạt điểm mục tiêu',
      color: 'from-green-500 to-emerald-600',
      examples: '≥70%, ≥80%, ≥90%',
    },
  ];

  const handleSelectType = (type: GoalType) => {
    setSelectedType(type);
    setStep('template');
  };

  const handleSelectTemplate = (template: any) => {
    createGoal(
      selectedType!,
      template.targetValue,
      template.period,
      template.title,
      template.description,
      template.skill,
      template.icon,
      template.color,
      template.unit
    );
    
    onGoalCreated();
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setStep('type');
    setSelectedType(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[85vh] overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-2 hover:bg-white/20"
                >
                  <X className="size-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Plus className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl mb-1">Đặt mục tiêu học tập</h2>
                    <p className="text-blue-100 text-sm">
                      {step === 'type' && 'Chọn loại mục tiêu bạn muốn đặt'}
                      {step === 'template' && 'Chọn mục tiêu phù hợp với bạn'}
                    </p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mt-4">
                  <div className={`h-1 flex-1 rounded-full ${step === 'type' ? 'bg-white' : 'bg-white/30'}`} />
                  <div className={`h-1 flex-1 rounded-full ${step === 'template' ? 'bg-white' : 'bg-white/30'}`} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                {/* Step 1: Select Type */}
                {step === 'type' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goalTypes.map((goalType) => {
                      const Icon = goalType.icon;
                      return (
                        <motion.button
                          key={goalType.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectType(goalType.type)}
                          className="p-5 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-2xl text-left transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`bg-gradient-to-br ${goalType.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                              <Icon className="size-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{goalType.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{goalType.description}</p>
                              <p className="text-xs text-gray-500">
                                Ví dụ: {goalType.examples}
                              </p>
                            </div>
                            <ChevronRight className="size-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Select Template */}
                {step === 'template' && selectedType && (
                  <div>
                    <button
                      onClick={() => setStep('type')}
                      className="text-sm text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-1"
                    >
                      ← Quay lại chọn loại khác
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {GOAL_TEMPLATES[selectedType]?.map((template, index) => {
                        const Icon = ICON_MAP[template.icon];
                        return (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectTemplate(template)}
                            className="p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-blue-300 rounded-2xl text-left transition-all group"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`bg-gradient-to-br ${template.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                                <Icon className="size-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    Mục tiêu: {template.targetValue} {template.unit}
                                  </span>
                                  <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {template.period === 'daily' ? '📅 Hàng ngày' : 
                                     template.period === 'weekly' ? '📅 Hàng tuần' : 
                                     '📅 Hàng tháng'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom Goal Option */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl text-center text-gray-600 hover:text-blue-600 transition-all"
                      onClick={handleClose}
                    >
                      <Plus className="size-5 mx-auto mb-1" />
                      <span className="text-sm">Hoặc tạo mục tiêu tùy chỉnh (Coming soon)</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
