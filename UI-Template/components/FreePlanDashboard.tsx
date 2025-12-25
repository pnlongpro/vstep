import { useState, useEffect } from 'react';
import { Book, Headphones, PenTool, Mic, Trophy, Clock, Zap, Lock, Crown, CheckCircle, XCircle, ArrowRight, Sparkles, Target, TrendingUp, Calendar, Award, Star, Flame, Gift, ChevronRight, Shield, History, Eye } from 'lucide-react';
import { PremiumModal } from './PremiumModal';

interface FreePlanDashboardProps {
  onBack: () => void;
  userEmail: string;
  onStartMockExam?: (testId: number) => void;
  onStartReading?: () => void;
  onStartListening?: () => void;
  onStartSpeaking?: () => void;
  onStartWriting?: () => void;
}

interface Voucher {
  code: string;
  discount: string;
  description: string;
  expiry: string;
  color: string;
  status: 'unused' | 'used';
  receivedDate: string;
}

export function FreePlanDashboard({ onBack, userEmail, onStartMockExam, onStartReading, onStartListening, onStartSpeaking, onStartWriting }: FreePlanDashboardProps) {
  // Debug: Log userEmail
  console.log('FreePlanDashboard userEmail:', userEmail);
  console.log('Is Demo?', userEmail === 'demo@vstepro.com');
  
  // Navigation state for tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  
  // Load Admin Preset Configs from localStorage
  const [freePlanLimits] = useState(() => {
    // Load active preset type
    const activePreset = localStorage.getItem('vstep_admin_active_free_preset') || 'standard';
    
    // Load preset configurations
    const savedConfigs = localStorage.getItem('vstep_admin_preset_configs');
    let presetConfigs;
    
    if (savedConfigs) {
      try {
        presetConfigs = JSON.parse(savedConfigs);
      } catch (e) {
        console.error('Failed to parse preset configs:', e);
        presetConfigs = null;
      }
    }
    
    // Fallback to defaults if no configs found
    if (!presetConfigs) {
      presetConfigs = {
        basic: {
          reading: 5,
          listening: 5,
          writing: 2,
          speaking: 2,
          mockTest: 1,
          aiWriting: '1/2 ngày',
          aiSpeaking: '1/2 ngày',
          duration: 7
        },
        standard: {
          reading: 10,
          listening: 10,
          writing: 5,
          speaking: 5,
          mockTest: 3,
          aiWriting: '1/ngày',
          aiSpeaking: '1/ngày',
          duration: 30
        },
        extended: {
          reading: 15,
          listening: 15,
          writing: 8,
          speaking: 8,
          mockTest: 5,
          aiWriting: '2/ngày',
          aiSpeaking: '2/ngày',
          duration: 60
        }
      };
    }
    
    // Return active preset config
    return presetConfigs[activePreset as 'basic' | 'standard' | 'extended'];
  });
  
  // Mock Test State - Dynamic based on preset
  const [mockTests] = useState(() => {
    const allTests = [
      { 
        id: 1, 
        title: 'VSTEP Mock Test 1', 
        level: 'B1-B2',
        completed: false,
        score: null,
        parts: ['Reading', 'Listening', 'Writing', 'Speaking']
      },
      { 
        id: 2, 
        title: 'VSTEP Mock Test 2', 
        level: 'B2-C1',
        completed: false,
        score: null,
        parts: ['Reading', 'Listening', 'Writing', 'Speaking']
      },
      { 
        id: 3, 
        title: 'VSTEP Mock Test 3', 
        level: 'C1',
        completed: false,
        score: null,
        parts: ['Reading', 'Listening', 'Writing', 'Speaking']
      },
      { 
        id: 4, 
        title: 'VSTEP Mock Test 4', 
        level: 'B2',
        completed: false,
        score: null,
        parts: ['Reading', 'Listening', 'Writing', 'Speaking']
      },
      { 
        id: 5, 
        title: 'VSTEP Mock Test 5', 
        level: 'C1',
        completed: false,
        score: null,
        parts: ['Reading', 'Listening', 'Writing', 'Speaking']
      }
    ];
    
    // Return only the number of tests allowed by preset
    return allTests.slice(0, freePlanLimits.mockTest);
  });

  // History state
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Daily quota state
  const [dailyQuota, setDailyQuota] = useState(() => {
    const saved = localStorage.getItem('vstep_free_daily_quota');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      
      // Reset nếu đã qua ngày mới
      if (data.date !== today) {
        const resetData = { 
          date: today, 
          readingUsed: 0,
          listeningUsed: 0,
          speakingUsed: 0, 
          writingUsed: 0 
        };
        localStorage.setItem('vstep_free_daily_quota', JSON.stringify(resetData));
        return resetData;
      }
      
      // Ensure old data has new fields
      if (!data.hasOwnProperty('readingUsed')) data.readingUsed = 0;
      if (!data.hasOwnProperty('listeningUsed')) data.listeningUsed = 0;
      
      return data;
    }
    
    const initialData = { 
      date: new Date().toDateString(), 
      readingUsed: 0,
      listeningUsed: 0,
      speakingUsed: 0, 
      writingUsed: 0 
    };
    localStorage.setItem('vstep_free_daily_quota', JSON.stringify(initialData));
    return initialData;
  });

  // Countdown to next reset
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // Voucher Management
  const [userVouchers, setUserVouchers] = useState<Voucher[]>(() => {
    const storageKey = `vstep_user_vouchers_${userEmail}`;
    
    // Load vouchers từ localStorage (nhận từ admin hoặc default)
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing vouchers:', e);
      }
    }
    
    // Default demo vouchers chỉ cho lần đầu (nếu chưa có gì)
    const defaultVouchers: Voucher[] = [
      {
        code: 'WELCOME',
        discount: '20%',
        description: 'Giảm 20% cho lần đầu nâng cấp Premium',
        expiry: '31/12/2025',
        color: 'green',
        status: 'unused',
        receivedDate: new Date().toISOString()
      }
    ];
    
    // Lưu default vouchers lần đầu
    localStorage.setItem(storageKey, JSON.stringify(defaultVouchers));
    console.log(`🎁 Initialized default vouchers for ${userEmail}`);
    
    return defaultVouchers;
  });

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  
  // Premium Modal State
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'1month' | '3months' | '6months' | '1year'>('6months');
  const [selectedPlanType, setSelectedPlanType] = useState<'premium' | 'pro'>('premium');
  const [voucherCode, setVoucherCode] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  // Product Type Toggle: 'plan' (Gói tự học) or 'course' (Khóa học)
  const [productType, setProductType] = useState<'plan' | 'course'>('plan');

  // Courses Data - 10 khóa học VSTEP
  const allCourses = [
    { 
      id: 1, 
      name: '📚 VSTEP Complete', 
      level: 'A2-C1',
      duration: '6 tháng',
      price: 4500000, 
      features: ['120 giờ học', '50 đề thi thử', 'Chấm AI không giới hạn', '1-on-1 coaching', 'Cam kết đầu ra'],
      badge: 'Bán chạy nhất',
      badgeColor: 'orange'
    },
    { 
      id: 2, 
      name: '🎯 VSTEP Foundation', 
      level: 'A2-B1',
      duration: '4 tháng',
      price: 3000000, 
      features: ['80 giờ học', '30 đề thi thử', 'Chấm AI Writing/Speaking', 'Lộ trình cá nhân hóa'],
      badge: 'Phổ biến',
      badgeColor: 'blue'
    },
    { 
      id: 3, 
      name: '🚀 VSTEP Intensive', 
      level: 'B2-C1',
      duration: '3 tháng',
      price: 5500000, 
      features: ['100 giờ học', '60 đề thi độc quyền', 'Coaching 1-on-1', 'Đề dự đoán', 'Cam kết C1'],
      badge: 'Cao cấp',
      badgeColor: 'purple'
    },
    { 
      id: 4, 
      name: '💼 VSTEP Business', 
      level: 'B1-B2',
      duration: '5 tháng',
      price: 3800000, 
      features: ['90 giờ học', '40 đề thi', 'Tiếng Anh thương mại', 'Mock interview'],
      badge: null,
      badgeColor: null
    },
    { 
      id: 5, 
      name: '🎓 VSTEP Academic', 
      level: 'B2-C1',
      duration: '6 tháng',
      price: 4200000, 
      features: ['110 giờ học', '45 đề thi', 'Academic Writing', 'Research skills'],
      badge: null,
      badgeColor: null
    },
    { 
      id: 6, 
      name: '⚡ VSTEP Express', 
      level: 'B1-B2',
      duration: '2 tháng',
      price: 2500000, 
      features: ['60 giờ học', '20 đề thi', 'Lộ trình nhanh', 'Cam kết B2'],
      badge: 'Giá tốt',
      badgeColor: 'green'
    },
    { 
      id: 7, 
      name: '🏆 VSTEP Master', 
      level: 'C1',
      duration: '8 tháng',
      price: 6000000, 
      features: ['150 giờ học', '70 đề thi', 'Native speaker coaching', 'Chứng nhận quốc tế'],
      badge: null,
      badgeColor: null
    },
    { 
      id: 8, 
      name: '📖 VSTEP Reading Pro', 
      level: 'B1-C1',
      duration: '3 tháng',
      price: 1800000, 
      features: ['40 giờ học', 'Chuyên sâu Reading', '500+ bài tập', 'Kỹ thuật làm bài'],
      badge: null,
      badgeColor: null
    },
    { 
      id: 9, 
      name: '🎤 VSTEP Speaking Pro', 
      level: 'B1-C1',
      duration: '3 tháng',
      price: 2800000, 
      features: ['50 giờ học', 'Chuyên sâu Speaking', 'AI feedback chi tiết', '1-on-1 practice'],
      badge: null,
      badgeColor: null
    },
    { 
      id: 10, 
      name: '✍️ VSTEP Writing Pro', 
      level: 'B1-C1',
      duration: '3 tháng',
      price: 2000000, 
      features: ['45 giờ học', 'Chuyên sâu Writing', 'Chấm bài chi tiết', 'Templates chuyên nghiệp'],
      badge: null,
      badgeColor: null
    }
  ];

  // Top 3 courses for display
  const topCourses = [allCourses[1], allCourses[0], allCourses[2]]; // Foundation, Complete, Intensive

  // Pricing data
  const pricingData = {
    '1month': { price: 299000, label: '1 Tháng', discount: 0 },
    '3months': { price: 799000, label: '3 Tháng', discount: 10 },
    '6months': { price: 1499000, label: '6 Tháng', discount: 16 },
    '1year': { price: 2699000, label: '1 Năm', discount: 25 }
  };

  // Load history data
  useEffect(() => {
    const loadHistory = () => {
      const readingHistory = JSON.parse(localStorage.getItem('reading_history') || '[]');
      const listeningHistory = JSON.parse(localStorage.getItem('listening_history') || '[]');
      const writingHistory = JSON.parse(localStorage.getItem('writing_history') || '[]');
      const speakingHistory = JSON.parse(localStorage.getItem('speaking_history') || '[]');
      const examHistory = JSON.parse(localStorage.getItem('exam_history') || '[]');
      
      // Combine all histories
      const allHistory = [
        ...readingHistory.map((h: any) => ({ ...h, type: 'reading' })),
        ...listeningHistory.map((h: any) => ({ ...h, type: 'listening' })),
        ...writingHistory.map((h: any) => ({ ...h, type: 'writing' })),
        ...speakingHistory.map((h: any) => ({ ...h, type: 'speaking' })),
        ...examHistory.map((h: any) => ({ ...h, type: 'exam' }))
      ];
      
      // Sort by date (newest first) and take only 5 most recent
      const sortedHistory = allHistory
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      setHistoryData(sortedHistory);
    };
    
    loadHistory();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Auto-reload vouchers khi Admin gửi mới
  useEffect(() => {
    const storageKey = `vstep_user_vouchers_${userEmail}`;
    
    const checkForNewVouchers = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const newVouchers = JSON.parse(saved);
          
          // Kiểm tra xem có voucher mới không (so sánh length)
          if (newVouchers.length > userVouchers.length) {
            const newVoucherCount = newVouchers.length - userVouchers.length;
            const newVoucherCodes = newVouchers
              .slice(0, newVoucherCount)
              .map((v: Voucher) => v.code)
              .join(', ');
            
            setUserVouchers(newVouchers);
            console.log(`🎁 Nhận ${newVoucherCount} voucher mới: ${newVoucherCodes}`);
            
            // Show notification (optional - có thể thêm toast library sau)
            // alert(`🎉 Bạn vừa nhận ${newVoucherCount} voucher mới!\n\nMã: ${newVoucherCodes}`);
          } else if (JSON.stringify(newVouchers) !== JSON.stringify(userVouchers)) {
            // Cập nhật nếu có thay đổi status (used/unused)
            setUserVouchers(newVouchers);
          }
        } catch (e) {
          console.error('Error checking vouchers:', e);
        }
      }
    };

    // Check every 2 seconds for new vouchers from Admin
    const interval = setInterval(checkForNewVouchers, 2000);
    return () => clearInterval(interval);
  }, [userEmail, userVouchers]);

  // Use Speaking
  const handleUseSpeaking = () => {
    if (dailyQuota.speakingUsed >= aiSpeakingLimit) {
      alert(`❌ Bạn đã sử dụng hết lượt AI Speaking hôm nay!\n\nGiới hạn: ${freePlanLimits.aiSpeaking}\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
      return;
    }
    
    const newQuota = { ...dailyQuota, speakingUsed: dailyQuota.speakingUsed + 1 };
    setDailyQuota(newQuota);
    localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
    alert(`🎤 Bắt đầu luyện AI Speaking!\n\nBạn còn lại: ${aiSpeakingLimit - newQuota.speakingUsed}/${aiSpeakingLimit} lượt hôm nay.`);
  };

  // Use Writing
  const handleUseWriting = () => {
    if (dailyQuota.writingUsed >= aiWritingLimit) {
      alert(`❌ Bạn đã sử dụng hết lượt AI Writing hôm nay!\n\nGiới hạn: ${freePlanLimits.aiWriting}\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
      return;
    }
    
    const newQuota = { ...dailyQuota, writingUsed: dailyQuota.writingUsed + 1 };
    setDailyQuota(newQuota);
    localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
    alert(`✍️ Bắt đầu luyện AI Writing!\n\nBạn còn lại: ${aiWritingLimit - newQuota.writingUsed}/${aiWritingLimit} lượt hôm nay.`);
  };

  // Start Mock Test
  const handleStartMockTest = (testId: number) => {
    if (onStartMockExam) {
      onStartMockExam(testId);
    } else {
      alert(`🎯 Bắt đầu Mock Test ${testId}!\n\nBài thi bao gồm 4 kỹ năng:\n✅ Reading\n✅ Listening\n✅ Writing\n✅ Speaking\n\nThời gian: 150 phút`);
    }
  };

  // Voucher Handlers
  const handleClaimVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(true);
  };

  const handleUseVoucher = () => {
    if (!selectedVoucher) return;
    
    // Mark voucher as used
    const updatedVouchers = userVouchers.map(v => 
      v.code === selectedVoucher.code ? { ...v, status: 'used' as const } : v
    );
    setUserVouchers(updatedVouchers);
    localStorage.setItem(`vstep_user_vouchers_${userEmail}`, JSON.stringify(updatedVouchers));
    
    alert(`🎉 Đã sử dụng voucher ${selectedVoucher.code}!\n\n${selectedVoucher.discount} OFF đã được áp dụng.`);
    setShowVoucherModal(false);
    setSelectedVoucher(null);
  };

  // Premium Modal Handlers
  const handleUpgradePremium = (planType: 'premium' | 'pro' = 'premium') => {
    setSelectedPlanType(planType);
    setShowPremiumModal(true);
  };

  const handleApplyVoucherCode = () => {
    if (!voucherCode.trim()) {
      alert('⚠️ Vui lòng nhập mã voucher!');
      return;
    }

    // Tìm voucher trong danh sách
    const foundVoucher = userVouchers.find(v => 
      v.code.toLowerCase() === voucherCode.toUpperCase() && v.status === 'unused'
    );

    if (foundVoucher) {
      alert(`✅ Áp dụng voucher thành công!\n\n${foundVoucher.discount} OFF cho gói ${selectedPlan === '1month' ? '1 tháng' : selectedPlan === '3months' ? '3 tháng' : selectedPlan === '6months' ? '6 tháng' : '1 năm'}`);
    } else {
      alert('❌ Mã voucher không hợp lệ hoặc đã hết hạn!');
    }
  };

  const handleConfirmUpgrade = () => {
    // Chuyển sang màn thanh toán thay vì đóng modal
    setShowPaymentInfo(true);
  };

  const handleBackToPlanSelection = () => {
    setShowPaymentInfo(false);
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
    setShowPaymentInfo(false);
    setVoucherCode('');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const calculateTimeLeft = (expiryDate: string) => {
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Hết hạn';
    if (days === 0) return 'Hết hạn hôm nay!';
    if (days === 1) return '1 ngày';
    if (days < 7) return `${days} ngày`;
    return `${Math.floor(days / 7)} tuần`;
  };

  // Parse AI limits from string format (e.g., "1/ngày" -> 1, "2/ngày" -> 2, "1/2 ngày" -> 0.5)
  const parseAILimit = (limitStr: string): number => {
    if (limitStr === 'Không giới hạn') return 999;
    if (limitStr.includes('/2 ngày')) return 0.5;
    const match = limitStr.match(/^(\d+)\//);
    return match ? parseInt(match[1]) : 1;
  };

  const aiWritingLimit = parseAILimit(freePlanLimits.aiWriting);
  const aiSpeakingLimit = parseAILimit(freePlanLimits.aiSpeaking);

  const skills = [
    {
      id: 'reading',
      name: 'Đọc hiểu',
      icon: Book,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: `${freePlanLimits.reading} bài miễn phí`,
      freeAccess: true
    },
    {
      id: 'listening',
      name: 'Nghe hiểu',
      icon: Headphones,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: `${freePlanLimits.listening} bài miễn phí`,
      freeAccess: true
    },
    {
      id: 'writing',
      name: 'Viết',
      icon: PenTool,
      color: 'from-violet-400 to-violet-500',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      description: `${freePlanLimits.aiWriting} AI Writing`,
      freeAccess: true,
      limited: true,
      quota: `${dailyQuota.writingUsed}/${aiWritingLimit}`
    },
    {
      id: 'speaking',
      name: 'Nói',
      icon: Mic,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: `${freePlanLimits.aiSpeaking} AI Speaking`,
      freeAccess: true,
      limited: true,
      quota: `${dailyQuota.speakingUsed}/${aiSpeakingLimit}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-blue-900 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3 overflow-hidden px-6 py-2">
          <span className="text-yellow-300 text-lg animate-pulse flex-shrink-0">📢</span>
          <div className="overflow-hidden flex-1">
            <div className="flex animate-marquee">
              <span className="text-sm font-medium text-white whitespace-nowrap pr-20">
                🎉 Chào mừng đến với VSTEPRO! 
                <span className="mx-4">•</span>
                ✨ Tính năng mới: Chấm AI cho Writing & Speaking 
                <span className="mx-4">•</span>
                🎯 Cập nhật: 500+ đề thi mới đã được thêm vào ngân hàng đề
                <span className="mx-4">•</span>
                📚 Khóa học VSTEP B2 giảm 30% - Chỉ còn 3 ngày!
              </span>
              {/* Duplicate for seamless loop */}
              <span className="text-sm font-medium text-white whitespace-nowrap pr-20">
                🎉 Chào mừng đến với VSTEPRO! 
                <span className="mx-4">•</span>
                ✨ Tính năng mới: Chấm AI cho Writing & Speaking 
                <span className="mx-4">•</span>
                🎯 Cập nhật: 500+ đề thi mới đã được thêm vào ngân hàng đề
                <span className="mx-4">•</span>
                📚 Khóa học VSTEP B2 giảm 30% - Chỉ còn 3 ngày!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col z-30 pt-[44px]">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Trophy className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VSTEPRO</h1>
              <p className="text-xs text-gray-400">Gói Miễn Phí</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userEmail}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Gift className="size-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">FREE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Trophy className="size-5" />
              <span className="font-medium">Trang chủ</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'history' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <History className="size-5" />
              <span className="font-medium">Lịch sử</span>
            </button>
          </div>
        </div>

        {/* Upgrade to Premium */}
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="size-5" />
              <span className="font-semibold">Nâng cấp Premium</span>
            </div>
            <p className="text-xs text-white/90 mb-3">Học không giới hạn với tất cả tính năng!</p>
            <button 
              onClick={() => handleUpgradePremium('premium')}
              className="w-full py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors"
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8 pt-[76px]">
        <div className="max-w-[1360px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === 'dashboard' && 'Chào mừng đến với VSTEPRO! 🎉'}
                  {activeTab === 'history' && 'Lịch sử luyện tập'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'dashboard' && 'Bạn đang sử dụng gói Miễn Phí với 3 bài Mock Test và luyện AI hàng ngày'}
                  {activeTab === 'history' && 'Xem lại tất cả các bài luyện tập và thi thử của bạn'}
                </p>
              </div>
              {activeTab === 'dashboard' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <Clock className="size-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Reset sau</p>
                    <p className="text-sm font-bold text-blue-700">{timeUntilReset}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Free Plan Overview - 5 Skills Cards */}
              <div className="grid grid-cols-5 gap-4 mb-8">
            {/* Reading */}
            <div 
              onClick={() => {
                if (dailyQuota.readingUsed >= freePlanLimits.reading) {
                  alert(`❌ Bạn đã sử dụng hết lượt Reading hôm nay!\n\nGiới hạn: ${freePlanLimits.reading} bài\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
                  return;
                }
                
                const newQuota = { ...dailyQuota, readingUsed: dailyQuota.readingUsed + 1 };
                setDailyQuota(newQuota);
                localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
                
                if (onStartReading) {
                  onStartReading();
                } else {
                  alert('✅ Đã ghi nhận 1 bài Reading!');
                }
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Book className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Reading</h3>
                  <p className="text-xs text-gray-600">{freePlanLimits.reading} bài</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{Math.max(0, freePlanLimits.reading - dailyQuota.readingUsed)}</span>
                <span className="text-gray-600 mb-0.5 text-sm">/ {freePlanLimits.reading}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all" 
                  style={{ width: `${Math.min(100, (dailyQuota.readingUsed / freePlanLimits.reading) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Listening */}
            <div 
              onClick={() => {
                if (dailyQuota.listeningUsed >= freePlanLimits.listening) {
                  alert(`❌ Bạn đã sử dụng hết lượt Listening hôm nay!\n\nGiới hạn: ${freePlanLimits.listening} bài\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
                  return;
                }
                
                const newQuota = { ...dailyQuota, listeningUsed: dailyQuota.listeningUsed + 1 };
                setDailyQuota(newQuota);
                localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
                
                if (onStartListening) {
                  onStartListening();
                } else {
                  alert('✅ Đã ghi nhận 1 bài Listening!');
                }
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <Headphones className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Listening</h3>
                  <p className="text-xs text-gray-600">{freePlanLimits.listening} bài</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{Math.max(0, freePlanLimits.listening - dailyQuota.listeningUsed)}</span>
                <span className="text-gray-600 mb-0.5 text-sm">/ {freePlanLimits.listening}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all" 
                  style={{ width: `${Math.min(100, (dailyQuota.listeningUsed / freePlanLimits.listening) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Writing */}
            <div 
              onClick={() => {
                console.log('✍️ AI Writing clicked!');
                
                if (dailyQuota.writingUsed >= aiWritingLimit) {
                  alert(`❌ Bạn đã sử dụng hết lượt AI Writing hôm nay!\n\nGiới hạn: ${freePlanLimits.aiWriting}\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
                  return;
                }
                
                const newQuota = { ...dailyQuota, writingUsed: dailyQuota.writingUsed + 1 };
                setDailyQuota(newQuota);
                localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
                
                if (onStartWriting) {
                  onStartWriting();
                }
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center">
                  <PenTool className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Writing</h3>
                  <p className="text-xs text-gray-600">{freePlanLimits.aiWriting}</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{Math.max(0, aiWritingLimit - dailyQuota.writingUsed)}</span>
                <span className="text-gray-600 mb-0.5 text-sm">/ {aiWritingLimit}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-400 to-violet-500 transition-all" 
                  style={{ width: `${Math.min(100, (dailyQuota.writingUsed / aiWritingLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Speaking */}
            <div 
              onClick={() => {
                console.log('🎤 AI Speaking clicked!');
                
                if (dailyQuota.speakingUsed >= aiSpeakingLimit) {
                  alert(`❌ Bạn đã sử dụng hết lượt AI Speaking hôm nay!\n\nGiới hạn: ${freePlanLimits.aiSpeaking}\n\n🎯 Nâng cấp lên Premium để sử dụng không giới hạn!`);
                  return;
                }
                
                const newQuota = { ...dailyQuota, speakingUsed: dailyQuota.speakingUsed + 1 };
                setDailyQuota(newQuota);
                localStorage.setItem('vstep_free_daily_quota', JSON.stringify(newQuota));
                
                if (onStartSpeaking) {
                  onStartSpeaking();
                }
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center">
                  <Mic className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Speaking</h3>
                  <p className="text-xs text-gray-600">{freePlanLimits.aiSpeaking}</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{Math.max(0, aiSpeakingLimit - dailyQuota.speakingUsed)}</span>
                <span className="text-gray-600 mb-0.5 text-sm">/ {aiSpeakingLimit}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all" 
                  style={{ width: `${Math.min(100, (dailyQuota.speakingUsed / aiSpeakingLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Mock Test */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl flex items-center justify-center">
                  <Trophy className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Mock Test</h3>
                  <p className="text-xs text-gray-600">{freePlanLimits.mockTest} bài</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{mockTests.length}</span>
                <span className="text-gray-600 mb-0.5 text-sm">/ {freePlanLimits.mockTest}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-500" 
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mock Tests Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Đề thi thử Mock Test</h2>
            <div className="grid grid-cols-3 gap-6">
              {mockTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="size-6" />
                        <span className="font-semibold">{test.title}</span>
                      </div>
                      {test.completed ? (
                        <CheckCircle className="size-5 text-green-300" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-white/50 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="size-4" />
                      <span className="text-sm">Cấp độ: {test.level}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900 text-sm mb-3">Bao gồm 4 kỹ năng:</h4>
                      {test.parts.map((part, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-semibold">{idx + 1}</span>
                          </div>
                          <span>{part}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleStartMockTest(test.id)}
                      disabled={test.completed}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        test.completed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {test.completed ? (
                        <>
                          <CheckCircle className="size-5" />
                          Đã hoàn thành
                        </>
                      ) : (
                        <>
                          Bắt đầu thi
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>

                    {test.score && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Điểm:</span> {test.score}/10
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 💎 Pricing Plans Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn gói phù hợp với bạn</h2>
              <p className="text-gray-600">Nâng cấp để mở khóa toàn bộ tính năng và học không giới hạn</p>
            </div>

            {/* Toggle: Gói tự học vs Khóa học */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setProductType('plan')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  productType === 'plan'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📦 Gói tự học
              </button>
              <button
                onClick={() => setProductType('course')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  productType === 'course'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎓 Khóa học
              </button>
            </div>

            {/* Display Plans or Courses based on toggle */}
            {productType === 'plan' ? (
              <div className="grid grid-cols-3 gap-6">
              {/* FREE PLAN - Current Plan */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-semibold mb-3">
                    <Star className="size-3" />
                    Gói hiện tại
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">0đ</span>
                  </div>
                  <p className="text-sm text-gray-600">Miễn phí mãi mãi</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>1 lượt AI Speaking/ngày</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>1 lượt AI Writing/ngày</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>3 đề thi thử Mock Test</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-400">
                      <XCircle className="size-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      <span>Không có AI feedback chi tiết</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-400">
                      <XCircle className="size-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      <span>Không có ngân hàng đề thi</span>
                    </li>
                  </ul>

                  <button
                    disabled
                    className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Gói hiện tại
                  </button>
                </div>
              </div>

              {/* PREMIUM PLAN - Most Popular */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-500 overflow-hidden relative transform scale-105">
                {/* Popular Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Flame className="size-3" />
                    Phổ biến nhất
                  </div>
                </div>

                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-center text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
                    <Crown className="size-3" />
                    Premium
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">199K</span>
                    <span className="text-lg opacity-90 mb-1">/tháng</span>
                  </div>
                  <p className="text-sm text-white/80">Tiết kiệm 20% khi mua 6 tháng</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Không giới hạn AI Speaking</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Không giới hạn AI Writing</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>1000+ đề thi thử chất lượng cao</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>AI feedback chi tiết cho từng bài</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>Theo dõi tiến độ học tập</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>Hỗ trợ ưu tiên 24/7</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradePremium('premium')}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="size-5" />
                    Nâng cấp ngay
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">Dùng thử 7 ngày - Hủy bất kỳ lúc nào</p>
                </div>
              </div>

              {/* PRO PLAN - Advanced */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-purple-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-center text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
                    <Award className="size-3" />
                    Pro
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">299K</span>
                    <span className="text-lg opacity-90 mb-1">/tháng</span>
                  </div>
                  <p className="text-sm text-white/80">Dành cho người học nghiêm túc</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Tất cả tính năng Premium</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Lộ trình học cá nhân hóa AI</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>1-on-1 coaching với giáo viên</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Đề thi độc quyền & dự đoán</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Chứng nhận hoàn thành khóa học</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Truy cập trọn đời tài liệu</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradePremium('pro')}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="size-5" />
                    Nâng cấp Pro
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">Cam kết đạt mục tiêu hoặc hoàn tiền</p>
                </div>
              </div>
            </div>
            ) : (
              /* 🎓 COURSES DISPLAY */
              <div className="grid grid-cols-3 gap-6">
                {topCourses.map((course, index) => {
                  const isPopular = index === 1; // Middle card (VSTEP Complete)
                  const badgeColors: Record<string, { bg: string; text: string }> = {
                    orange: { bg: 'bg-gradient-to-r from-orange-500 to-red-500', text: 'text-white' },
                    blue: { bg: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'text-white' },
                    purple: { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white' },
                    green: { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-white' }
                  };
                  const headerColors: Record<number, string> = {
                    0: 'from-blue-500 to-indigo-500',
                    1: 'from-orange-500 to-red-500',
                    2: 'from-purple-500 to-pink-500'
                  };

                  return (
                    <div 
                      key={course.id}
                      className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden relative ${
                        isPopular ? 'border-orange-500 shadow-xl transform scale-105' : 'border-gray-200'
                      }`}
                    >
                      {/* Badge */}
                      {course.badge && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className={`${badgeColors[course.badgeColor!]?.bg || 'bg-gray-500'} ${badgeColors[course.badgeColor!]?.text || 'text-white'} px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                            <Flame className="size-3" />
                            {course.badge}
                          </div>
                        </div>
                      )}

                      {/* Header */}
                      <div className={`bg-gradient-to-br ${headerColors[index]} p-6 text-center text-white`}>
                        <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                        <div className="flex items-center justify-center gap-4 text-sm mb-3">
                          <span>📊 {course.level}</span>
                          <span>⏱️ {course.duration}</span>
                        </div>
                        <div className="flex items-end justify-center gap-1">
                          <span className="text-3xl font-bold">{(course.price / 1000000).toFixed(1)}tr</span>
                        </div>
                        <p className="text-xs text-white/80 mt-1">Thanh toán 1 lần</p>
                      </div>

                      {/* Features */}
                      <div className="p-6">
                        <ul className="space-y-3 mb-6">
                          {course.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${
                                index === 0 ? 'text-blue-500' : index === 1 ? 'text-orange-500' : 'text-purple-500'
                              }`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => alert(`🎓 Đăng ký khóa học: ${course.name}\n\nGiá: ${(course.price / 1000000).toFixed(1)}tr\n\nVui lòng liên hệ: support@vstepro.com hoặc 1900-xxxx để hoàn tất đăng ký!`)}
                          className={`w-full py-3 bg-gradient-to-r ${headerColors[index]} text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2`}
                        >
                          <Book className="size-5" />
                          Đăng ký ngay
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-2">💳 Hỗ trợ trả góp 0%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">🎁 Ưu đãi đặc biệt!</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {productType === 'plan' ? (
                      <>
                        Nâng cấp hôm nay để nhận ngay <span className="font-semibold text-orange-600">30% OFF</span> cho gói 6 tháng hoặc 1 năm. 
                        Sử dụng mã voucher bên dưới khi thanh toán!
                      </>
                    ) : (
                      <>
                        Đăng ký khóa học hôm nay để nhận ngay <span className="font-semibold text-orange-600">giảm 20%</span> và tặng kèm tài liệu độc quyền trị giá 500K!
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => productType === 'plan' ? handleUpgradePremium('premium') : alert('📞 Liên hệ: support@vstepro.com hoặc 1900-xxxx để được tư vấn chi tiết về các khóa học!')}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Sparkles className="size-4" />
                      {productType === 'plan' ? 'Xem chi tiết gói' : 'Tư vấn ngay'}
                    </button>
                    <span className="text-xs text-gray-600">⏰ Ưu đãi có hạn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎁 Vouchers Section */}
          {userVouchers.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">Ưu đãi dành cho bạn</h2>
                  {userVouchers.filter(v => v.status === 'unused').length > 0 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full animate-pulse">
                      {userVouchers.filter(v => v.status === 'unused').length} mã mới
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {userVouchers.map((voucher, index) => {
                  const getGradient = () => {
                    switch (voucher.color) {
                      case 'green': return 'from-emerald-500 to-teal-500';
                      case 'blue': return 'from-blue-500 to-indigo-500';
                      case 'purple': return 'from-purple-500 to-pink-500';
                      case 'orange': return 'from-orange-500 to-red-500';
                      case 'yellow': return 'from-yellow-500 to-orange-500';
                      default: return 'from-gray-500 to-gray-600';
                    }
                  };

                  const timeLeft = calculateTimeLeft(voucher.expiry);
                  const isExpiringSoon = timeLeft.includes('ngày') && parseInt(timeLeft) <= 3;
                  const isExpired = timeLeft === 'Hết hạn' || timeLeft === 'Hết hạn hôm nay!';

                  return (
                    <div
                      key={index}
                      className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all ${
                        voucher.status === 'unused' 
                          ? 'border-transparent hover:shadow-2xl hover:scale-[1.02]' 
                          : 'border-gray-200 opacity-60'
                      }`}
                    >
                      {/* Gradient Header */}
                      <div className={`bg-gradient-to-r ${getGradient()} p-6 text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Gift className="size-8" />
                              <div>
                                <p className="text-sm opacity-90">Mã giảm giá</p>
                                <p className="text-2xl font-bold tracking-wider">{voucher.code}</p>
                              </div>
                            </div>
                            {voucher.status === 'unused' ? (
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30 animate-pulse">
                                MỚI
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-900/30 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                ĐÃ DÙNG
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold">{voucher.discount}</span>
                            <span className="text-lg">OFF</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-700 mb-4 min-h-[48px]">{voucher.description}</p>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Hết hạn</p>
                            <p className={`font-semibold ${
                              isExpired ? 'text-red-600' : 
                              isExpiringSoon ? 'text-orange-600' : 
                              'text-gray-900'
                            }`}>
                              {voucher.expiry}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Còn lại</p>
                            <p className={`font-bold ${
                              isExpired ? 'text-red-600' : 
                              isExpiringSoon ? 'text-orange-600 animate-pulse' : 
                              'text-green-600'
                            }`}>
                              {timeLeft}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleClaimVoucher(voucher)}
                          disabled={voucher.status === 'used' || isExpired}
                          className={`w-full py-3 rounded-xl font-bold transition-all ${
                            voucher.status === 'used' || isExpired
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : `bg-gradient-to-r ${getGradient()} text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                          }`}
                        >
                          {voucher.status === 'used' ? (
                            <>
                              <CheckCircle className="size-5 inline mr-2" />
                              Đã sử dụng
                            </>
                          ) : isExpired ? (
                            <>
                              <XCircle className="size-5 inline mr-2" />
                              Đã hết hạn
                            </>
                          ) : (
                            <>
                              Sử dụng ngay
                              <Sparkles className="size-5 inline ml-2" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Decorative Corner */}
                      {voucher.status === 'unused' && !isExpired && (
                        <div className="absolute top-0 right-0">
                          <div className={`w-16 h-16 bg-gradient-to-br ${getGradient()} opacity-20`}
                            style={{
                              clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Voucher Info Banner */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">💎 Mã ưu đãi từ Admin</h4>
                    <p className="text-sm text-blue-700">
                      Các mã giảm giá này được gửi riêng cho bạn! Sử dụng ngay để nhận ưu đãi đặc biệt khi nâng cấp Premium.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
            
            {historyData.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="size-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Chưa có lịch sử</h3>
                <p className="text-gray-600 text-sm">
                  Bắt đầu luyện tập hoặc thi thử để xem lịch sử tại đây
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyData.map((item, index) => {
                  const getSkillIcon = () => {
                    switch (item.type) {
                      case 'reading': return <Book className="size-5 text-blue-600" />;
                      case 'listening': return <Headphones className="size-5 text-emerald-600" />;
                      case 'writing': return <PenTool className="size-5 text-violet-600" />;
                      case 'speaking': return <Mic className="size-5 text-amber-600" />;
                      case 'exam': return <Trophy className="size-5 text-rose-600" />;
                      default: return <Book className="size-5 text-gray-600" />;
                    }
                  };

                  const getSkillColor = () => {
                    switch (item.type) {
                      case 'reading': return 'bg-blue-50 border-blue-100';
                      case 'listening': return 'bg-emerald-50 border-emerald-100';
                      case 'writing': return 'bg-violet-50 border-violet-100';
                      case 'speaking': return 'bg-amber-50 border-amber-100';
                      case 'exam': return 'bg-rose-50 border-rose-100';
                      default: return 'bg-gray-50 border-gray-100';
                    }
                  };

                  const getSkillName = () => {
                    switch (item.type) {
                      case 'reading': return 'Đọc hiểu';
                      case 'listening': return 'Nghe hiểu';
                      case 'writing': return 'Viết';
                      case 'speaking': return 'Nói';
                      case 'exam': return 'Mock Test';
                      default: return item.type;
                    }
                  };

                  const formatDate = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);

                    if (diffMins < 60) return `${diffMins} phút trước`;
                    if (diffHours < 24) return `${diffHours} giờ trước`;
                    if (diffDays < 7) return `${diffDays} ngày trước`;
                    return date.toLocaleDateString('vi-VN');
                  };

                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all ${getSkillColor()}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {getSkillIcon()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {item.title || `${getSkillName()} - ${item.level || 'B1'}`}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5" />
                              {formatDate(item.date)}
                            </span>
                            {item.duration && (
                              <span>• {item.duration} phút</span>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        {item.score !== undefined && item.score !== null && (
                          <div className="flex-shrink-0">
                            <div className={`px-4 py-2 rounded-lg ${
                              item.score >= 8 ? 'bg-green-100 text-green-700' :
                              item.score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              <span className="font-bold text-lg">{item.score}</span>
                              <span className="text-sm">/10</span>
                            </div>
                          </div>
                        )}

                        {/* View Button */}
                        <button
                          onClick={() => alert(`Xem chi tiết bài: ${item.title || getSkillName()}`)}
                          className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                          <Eye className="size-4" />
                          Xem lại
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Premium CTA - Show on both tabs */}
      <div className="ml-64 px-8 pb-8">
        <div className="max-w-[1360px] mx-auto">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="size-8" />
                    <h3 className="text-2xl font-bold">Nâng cấp lên Premium</h3>
                  </div>
                  <p className="text-white/90 mb-6 text-lg max-w-2xl">
                    Mở khóa tất cả tính năng: Mock Test không giới hạn, AI Speaking & Writing không giới hạn, và nhiều hơn nữa!
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Zap className="size-5 text-yellow-300" />
                      <span className="text-sm">Không giới hạn lượt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="size-5 text-yellow-300" />
                      <span className="text-sm">1000+ đề thi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-yellow-300" />
                      <span className="text-sm">AI feedback chi tiết</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUpgradePremium('premium')}
                    className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    Xem gói Premium →
                  </button>
                </div>
                
                <div className="w-32 h-32 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                  <Crown className="size-16 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎫 Voucher Details Modal */}
      {showVoucherModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header with Gradient */}
            <div className={`bg-gradient-to-r ${
              selectedVoucher.color === 'green' ? 'from-emerald-500 to-teal-500' :
              selectedVoucher.color === 'blue' ? 'from-blue-500 to-indigo-500' :
              selectedVoucher.color === 'purple' ? 'from-purple-500 to-pink-500' :
              selectedVoucher.color === 'orange' ? 'from-orange-500 to-red-500' :
              selectedVoucher.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
              'from-gray-500 to-gray-600'
            } p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  <Gift className="size-10" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{selectedVoucher.code}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold">{selectedVoucher.discount}</span>
                  <span className="text-2xl">OFF</span>
                </div>
                <p className="text-white/90 text-lg">{selectedVoucher.description}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Voucher Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ngày hết hạn</p>
                      <p className="font-semibold text-gray-900">{selectedVoucher.expiry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Còn lại</p>
                    <p className={`font-bold ${
                      calculateTimeLeft(selectedVoucher.expiry).includes('ngày') && 
                      parseInt(calculateTimeLeft(selectedVoucher.expiry)) <= 3
                        ? 'text-orange-600 animate-pulse'
                        : 'text-green-600'
                    }`}>
                      {calculateTimeLeft(selectedVoucher.expiry)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trạng thái</p>
                      <p className="font-semibold text-gray-900">
                        {selectedVoucher.status === 'unused' ? 'Chưa sử dụng' : 'Đã sử dụng'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Điều khoản sử dụng:</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Mã chỉ áp dụng khi nâng cấp lên gói Premium</li>
                      <li>• Không thể kết hợp với các ưu đãi khác</li>
                      <li>• Mã chỉ sử dụng được 1 lần duy nhất</li>
                      <li>• Hết hạn vào {selectedVoucher.expiry}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={handleUseVoucher}
                  disabled={selectedVoucher.status === 'used'}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                    selectedVoucher.status === 'used'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${
                          selectedVoucher.color === 'green' ? 'from-emerald-500 to-teal-500' :
                          selectedVoucher.color === 'blue' ? 'from-blue-500 to-indigo-500' :
                          selectedVoucher.color === 'purple' ? 'from-purple-500 to-pink-500' :
                          selectedVoucher.color === 'orange' ? 'from-orange-500 to-red-500' :
                          selectedVoucher.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
                          'from-gray-500 to-gray-600'
                        } text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                  }`}
                >
                  {selectedVoucher.status === 'used' ? 'Đã sử dụng' : (
                    <>
                      Sử dụng ngay
                      <Sparkles className="size-5 inline ml-2" />
                    </>
                  )}
                </button>
              </div>

              {/* Info Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                💡 Mã sẽ được tự động áp dụng khi bạn nâng cấp Premium
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal
        showPremiumModal={showPremiumModal}
        showPaymentInfo={showPaymentInfo}
        selectedPlan={selectedPlan}
        planType={selectedPlanType}
        voucherCode={voucherCode}
        userEmail={userEmail}
        onClose={handleClosePremiumModal}
        onSelectPlan={setSelectedPlan}
        onSelectPlanType={setSelectedPlanType}
        onVoucherChange={setVoucherCode}
        onApplyVoucher={handleApplyVoucherCode}
        onConfirmUpgrade={handleConfirmUpgrade}
        onBackToPlanSelection={handleBackToPlanSelection}
      />
    </div>
  );
}