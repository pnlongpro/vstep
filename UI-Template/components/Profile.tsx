import { Award, Trophy, Target, Star, Zap, Crown, Medal, BookOpen, Headphones, PenTool, Mic, TrendingUp, Calendar, Flame, CheckCircle, ArrowLeft, Gift, User, GraduationCap, MapPin, Mail, Phone, Package, Lock, LogOut, Edit, Clock, FileText, Bell, Volume2, Globe, Moon, Sun, Shield, Sparkles, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BadgeCard } from './BadgeCard';
import { ToggleSwitch } from './ToggleSwitch';
import { incrementCompletedTests, getUserStats } from '../utils/badgeService';
import { ProfileMaterialsTab } from './ProfileMaterialsTab';

interface ProfileProps {
  onBack: () => void;
  onBadgeUnlocked?: (badge: any) => void;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'learning' | 'skill' | 'streak' | 'score';
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

type TabType = 'personal' | 'class' | 'materials' | 'goals' | 'badges' | 'settings';

export function Profile({ onBack }: ProfileProps) {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vstep_settings');
    return saved ? JSON.parse(saved) : {
      notifications: {
        email: true,
        push: true,
        dailyReminder: true,
        weeklyReport: false,
        newBadges: true,
      },
      ai: {
        enabled: true,
        autoFeedback: true,
        hints: true,
        detailedAnalysis: true,
      },
      display: {
        language: 'vi',
        theme: 'light',
        fontSize: 'medium',
      },
      sound: {
        enabled: true,
        volume: 70,
        correctAnswer: true,
        wrongAnswer: true,
      },
      learning: {
        autoSave: true,
        saveInterval: 10,
        showHints: true,
        skipConfirmation: false,
      },
      privacy: {
        shareProgress: false,
        publicProfile: false,
      }
    };
  });

  const handleSettingsChange = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    console.log('Settings changed:', category, key, value);
    console.log('New settings:', newSettings);
    setSettings(newSettings);
    localStorage.setItem('vstep_settings', JSON.stringify(newSettings));
    
    // Dispatch custom event to notify App.tsx
    window.dispatchEvent(new Event('vstep-settings-changed'));
  };
  
  // User profile data
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('vstep_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      age: 22,
      teacher: 'Thầy Trần Văn B',
      class: 'Lớp VSTEP B1 - K2024',
      goal: 'Đạt VSTEP B2 trong 3 tháng',
      location: 'TP. Hồ Chí Minh',
      package: 'Premium - 6 tháng',
      targetLevel: 'B2',
      expiryDate: '30/06/2025',
    };
  });

  // All available badges
  const allBadges: Badge[] = [
    // A. Theo hành vi học tập
    {
      id: 'new-starter',
      name: 'New Starter',
      description: 'Hoàn thành đề thi đầu tiên',
      icon: Star,
      color: 'from-blue-400 to-blue-600',
      category: 'learning',
      condition: 'complete_1_test',
      isUnlocked: false,
    },
    {
      id: 'cham-chi',
      name: 'Chăm chỉ',
      description: 'Hoàn thành 5 đề thi',
      icon: Trophy,
      color: 'from-green-400 to-green-600',
      category: 'learning',
      condition: 'complete_5_tests',
      isUnlocked: false,
    },
    {
      id: 'but-toc',
      name: 'Bứt tốc',
      description: 'Hoàn thành 10 đề thi',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-600',
      category: 'learning',
      condition: 'complete_10_tests',
      isUnlocked: false,
    },
    {
      id: 'vo-dich',
      name: 'Vô địch luyện đề',
      description: 'Hoàn thành 20 đề thi',
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
      category: 'learning',
      condition: 'complete_20_tests',
      isUnlocked: false,
    },

    // B. Theo kỹ năng
    {
      id: 'nghe-tot',
      name: 'Nghe tốt',
      description: 'Hoàn thành 3 bài Listening',
      icon: Headphones,
      color: 'from-green-500 to-emerald-600',
      category: 'skill',
      condition: 'complete_3_listening',
      isUnlocked: false,
    },
    {
      id: 'doc-hieu-vung',
      name: 'Đọc hiểu vững',
      description: 'Hoàn thành 3 bài Reading',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600',
      category: 'skill',
      condition: 'complete_3_reading',
      isUnlocked: false,
    },
    {
      id: 'viet-chuan',
      name: 'Viết chuẩn',
      description: 'Hoàn thành 3 bài Writing',
      icon: PenTool,
      color: 'from-purple-500 to-pink-600',
      category: 'skill',
      condition: 'complete_3_writing',
      isUnlocked: false,
    },
    {
      id: 'tu-tin-noi',
      name: 'Tự tin nói',
      description: 'Hoàn thành 3 bài Speaking',
      icon: Mic,
      color: 'from-orange-500 to-red-600',
      category: 'skill',
      condition: 'complete_3_speaking',
      isUnlocked: false,
    },

    // C. Theo chuỗi ngày học
    {
      id: 'giu-nhip',
      name: 'Giữ nhịp',
      description: '3 ngày học liên tục',
      icon: Flame,
      color: 'from-orange-400 to-red-500',
      category: 'streak',
      condition: 'streak_3_days',
      isUnlocked: false,
    },
    {
      id: 'ky-luat-cao',
      name: 'Kỷ luật cao',
      description: '7 ngày học liên tục',
      icon: Calendar,
      color: 'from-red-500 to-pink-600',
      category: 'streak',
      condition: 'streak_7_days',
      isUnlocked: false,
    },
    {
      id: 'sieu-cham-chi',
      name: 'Siêu chăm chỉ',
      description: '14 ngày học liên tục',
      icon: Medal,
      color: 'from-pink-500 to-purple-600',
      category: 'streak',
      condition: 'streak_14_days',
      isUnlocked: false,
    },

    // D. Theo điểm số
    {
      id: 'vuot-chuan',
      name: 'Vượt chuẩn',
      description: 'Đạt điểm trên 70%',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-600',
      category: 'score',
      condition: 'score_70',
      isUnlocked: false,
    },
    {
      id: 'xuat-sac',
      name: 'Xuất sắc',
      description: 'Đạt điểm trên 90%',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      category: 'score',
      condition: 'score_90',
      isUnlocked: false,
    },
    {
      id: 'hoan-hao',
      name: 'Hoàn hảo',
      description: 'Đạt 100% trong 1 đề thi',
      icon: Target,
      color: 'from-purple-600 to-pink-600',
      category: 'score',
      condition: 'score_100',
      isUnlocked: false,
    },
  ];

  // Load user badges from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem('vstep_user_badges');
    if (savedBadges) {
      const unlockedBadgeIds = JSON.parse(savedBadges);
      const updatedBadges = allBadges.map(badge => {
        const unlocked = unlockedBadgeIds.find((ub: any) => ub.id === badge.id);
        return {
          ...badge,
          isUnlocked: !!unlocked,
          unlockedAt: unlocked?.unlockedAt,
        };
      });
      setUserBadges(updatedBadges);
    } else {
      // Demo: unlock first badge by default
      const demoBadges = allBadges.map((badge, index) => ({
        ...badge,
        isUnlocked: index === 0,
        unlockedAt: index === 0 ? new Date().toISOString() : undefined,
      }));
      setUserBadges(demoBadges);
      
      localStorage.setItem('vstep_user_badges', JSON.stringify([
        { id: 'new-starter', unlockedAt: new Date().toISOString() }
      ]));
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('vstep_user_profile', JSON.stringify(userInfo));
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      alert('Đã đăng xuất!');
      onBack();
    }
  };

  const unlockedCount = userBadges.filter(b => b.isUnlocked).length;
  const totalCount = userBadges.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const categoryLabels = {
    learning: '🎯 Hành vi học tập',
    skill: '📚 Kỹ năng VSTEP',
    streak: '🔥 Chuỗi ngày học',
    score: '⭐ Điểm số xuất sắc',
  };

  const groupedBadges = {
    learning: userBadges.filter(b => b.category === 'learning'),
    skill: userBadges.filter(b => b.category === 'skill'),
    streak: userBadges.filter(b => b.category === 'streak'),
    score: userBadges.filter(b => b.category === 'score'),
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Thông tin cá nhân', icon: User },
    { id: 'class' as TabType, label: 'Lớp học', icon: GraduationCap },
    { id: 'materials' as TabType, label: 'Tài liệu', icon: FileText },
    { id: 'goals' as TabType, label: 'Mục tiêu học tập', icon: Target },
    { id: 'badges' as TabType, label: 'Huy hiệu', icon: Trophy },
    { id: 'settings' as TabType, label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl">
                👤
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl mb-2">{userInfo.name}</h1>
                <div className="space-y-1 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4" />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4" />
                    <span>{userInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{userInfo.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'personal' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="size-5 flex-shrink-0" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
                  <User className="size-6 text-blue-600" />
                  Thông tin cá nhân
                </h2>
                
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tuổi</label>
                      <input
                        type="number"
                        value={userInfo.age}
                        onChange={(e) => setUserInfo({ ...userInfo, age: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Giáo viên</label>
                      <input
                        type="text"
                        value={userInfo.teacher}
                        onChange={(e) => setUserInfo({ ...userInfo, teacher: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Lớp học</label>
                      <input
                        type="text"
                        value={userInfo.class}
                        onChange={(e) => setUserInfo({ ...userInfo, class: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
                      <input
                        type="text"
                        value={userInfo.location}
                        onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Mục tiêu học tập</label>
                      <textarea
                        value={userInfo.goal}
                        onChange={(e) => setUserInfo({ ...userInfo, goal: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Lưu thông tin
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tuổi</p>
                        <p className="text-gray-900">{userInfo.age} tuổi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giáo viên</p>
                        <p className="text-gray-900">{userInfo.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lớp học</p>
                        <p className="text-gray-900">{userInfo.class}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="size-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mục tiêu</p>
                        <p className="text-gray-900">{userInfo.goal}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl mb-4 flex items-center gap-2">
                    <Package className="size-5 text-purple-600" />
                    Gói học hiện tại
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl">💎</div>
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">PREMIUM</span>
                    </div>
                    <h3 className="text-lg mb-1 text-gray-900">{userInfo.package}</h3>
                    <p className="text-sm text-gray-600 mb-3">Không giới hạn truy cập tất cả tính năng</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="size-4 text-purple-600" />
                      <span>Hết hạn: <strong>{userInfo.expiryDate}</strong></span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">
                    Gia hạn / Nâng cấp gói
                  </button>
                </div>
              </div>
            )}

            {/* Class Tab */}
            {activeTab === 'class' && (
              <div className="space-y-6">
                {/* Thông tin chi tiết */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
                    <GraduationCap className="size-6 text-green-600" />
                    Thông tin lớp học
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giáo viên</p>
                        <p className="text-gray-900">{userInfo.teacher}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                        <p className="text-gray-900">15/01/2024</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="size-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày kết thúc</p>
                        <p className="text-gray-900">15/06/2024</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lịch học</p>
                        <p className="text-gray-900">Thứ 3, 5, 7 - 19:00 đến 21:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bài tập đã giao */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl mb-4 text-gray-800">Bài tập đã giao</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">Bài tập Reading Unit 1</p>
                          <p className="text-sm text-gray-500">Hạn nộp: 20/01/2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã nộp</span>
                        <span className="font-semibold text-gray-900">8.5/10</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <PenTool className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">Essay: Environmental Issues</p>
                          <p className="text-sm text-gray-500">Hạn nộp: 25/01/2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã nộp</span>
                        <span className="font-semibold text-gray-900">7.0/10</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <Headphones className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">Listening Exercise Set 2</p>
                          <p className="text-sm text-gray-500">Hạn nộp: 01/02/2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã nộp</span>
                        <span className="font-semibold text-gray-900">9.0/10</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Mic className="size-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">Speaking Practice Part 2</p>
                          <p className="text-sm text-gray-500">Hạn nộp: 10/02/2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Chưa nộp</span>
                        <span className="font-semibold text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thống kê học tập */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl mb-6 text-gray-800 flex items-center gap-2">
                    <TrendingUp className="size-6 text-blue-600" />
                    Thống kê học tập
                  </h3>
                  <div className="space-y-5">
                    {/* Điểm danh */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="size-5 text-green-600" />
                          <span className="text-sm text-gray-600">Điểm danh</span>
                        </div>
                        <span className="text-sm text-gray-900">28 / 36 buổi</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '78%' }} />
                      </div>
                    </div>

                    {/* Tiến độ */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="size-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Tiến độ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-600">72%</span>
                          <span className="text-xs text-gray-500">hoàn thành</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-600" style={{ width: '72%' }} />
                      </div>
                    </div>

                    {/* Xếp loại */}
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Medal className="size-5 text-yellow-600" />
                        <span className="text-sm text-gray-600">Xếp loại</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Khá (7.2/10)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && <ProfileMaterialsTab />}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
                  <Target className="size-6 text-orange-600" />
                  Mục tiêu học tập
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Chọn cấp độ mục tiêu VSTEP</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['B1', 'B2', 'C1'].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setUserInfo({ ...userInfo, targetLevel: level });
                            localStorage.setItem('vstep_user_profile', JSON.stringify({ ...userInfo, targetLevel: level }));
                          }}
                          className={`px-4 py-3 rounded-xl transition-all text-center ${
                            userInfo.targetLevel === level
                              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{level === 'B1' ? '🥉' : level === 'B2' ? '🥈' : '🥇'}</div>
                          <div className="font-semibold">{level}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong>Mục tiêu hiện tại:</strong> VSTEP {userInfo.targetLevel}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {userInfo.targetLevel === 'B1' && 'Cơ bản - Dành cho người bắt đầu'}
                        {userInfo.targetLevel === 'B2' && 'Trung cấp - Giao tiếp tốt trong công việc'}
                        {userInfo.targetLevel === 'C1' && 'Cao cấp - Sử dụng ngôn ngữ thành thạo'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg mb-4 text-gray-700">Mục tiêu cá nhân</h3>
                    <textarea
                      value={userInfo.goal}
                      onChange={(e) => setUserInfo({ ...userInfo, goal: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mục tiêu học tập của bạn..."
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Lưu mục tiêu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-gray-800 flex items-center gap-2">
                    <Trophy className="size-6 text-yellow-500" />
                    Huy hiệu của tôi
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Đã mở khóa</p>
                    <p className="text-2xl">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {unlockedCount}
                      </span>
                      <span className="text-gray-400">/{totalCount}</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tiến độ hoàn thành</span>
                    <span className="text-sm font-semibold text-gray-900">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Badges by Category */}
                <div className="space-y-8">
                  {Object.entries(groupedBadges).map(([category, badges]) => (
                    <div key={category}>
                      <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                          <BadgeCard
                            key={badge.id}
                            id={badge.id}
                            name={badge.name}
                            description={badge.description}
                            icon={badge.icon}
                            color={badge.color}
                            isUnlocked={badge.isUnlocked}
                            unlockedAt={badge.unlockedAt}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
                  <Settings className="size-6 text-gray-600" />
                  Cài đặt
                </h2>

                {/* Debug Panel - Remove in production */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Debug: AI Settings Status</p>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p>AI Enabled: <strong>{String(settings.ai.enabled)}</strong> (type: {typeof settings.ai.enabled})</p>
                    <p>Auto Feedback: <strong>{String(settings.ai.autoFeedback)}</strong></p>
                    <p>Settings object: {JSON.stringify(settings.ai)}</p>
                  </div>
                  <div className="mt-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Test button clicked!');
                        console.log('Current settings.ai:', settings.ai);
                        handleSettingsChange('ai', 'enabled', !settings.ai.enabled);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Test Toggle AI
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Direct setState test');
                        setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            enabled: !settings.ai.enabled
                          }
                        });
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Direct setState
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('vstep_settings');
                        window.location.reload();
                      }}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Reset Settings
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Notifications */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Bell className="size-5 text-blue-600" />
                      Thông báo
                    </h3>
                    <div className="space-y-4 pl-7">
                      <ToggleSwitch
                        enabled={settings.notifications.email}
                        onChange={(val) => handleSettingsChange('notifications', 'email', val)}
                        label="Thông báo qua Email"
                        description="Nhận thông báo về tiến trình học tập qua email"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.push}
                        onChange={(val) => handleSettingsChange('notifications', 'push', val)}
                        label="Thông báo đẩy"
                        description="Nhận thông báo đẩy trên trình duyệt"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.dailyReminder}
                        onChange={(val) => handleSettingsChange('notifications', 'dailyReminder', val)}
                        label="Nhắc nhở hàng ngày"
                        description="Nhắc nhở luyện tập mỗi ngày lúc 19:00"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.weeklyReport}
                        onChange={(val) => handleSettingsChange('notifications', 'weeklyReport', val)}
                        label="Báo cáo tuần"
                        description="Nhận báo cáo tiến độ hàng tuần"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.newBadges}
                        onChange={(val) => handleSettingsChange('notifications', 'newBadges', val)}
                        label="Thông báo huy hiệu mới"
                        description="Nhận thông báo khi mở khóa huy hiệu mới"
                      />
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Sparkles className="size-5 text-purple-600" />
                      Trợ lý AI
                    </h3>
                    <div className="space-y-4 pl-7">
                      <ToggleSwitch
                        enabled={settings.ai.enabled}
                        onChange={(val) => handleSettingsChange('ai', 'enabled', val)}
                        label="Bật trợ lý AI"
                        description="Sử dụng AI để hỗ trợ học tập và chấm bài"
                      />
                      <ToggleSwitch
                        enabled={settings.ai.autoFeedback}
                        onChange={(val) => handleSettingsChange('ai', 'autoFeedback', val)}
                        label="Phản hồi tự động"
                        description="Nhận phản hồi AI ngay sau khi hoàn thành bài"
                      />
                      <ToggleSwitch
                        enabled={settings.ai.hints}
                        onChange={(val) => handleSettingsChange('ai', 'hints', val)}
                        label="Gợi ý thông minh"
                        description="Hiển thị gợi ý khi gặp khó khăn"
                      />
                      <ToggleSwitch
                        enabled={settings.ai.detailedAnalysis}
                        onChange={(val) => handleSettingsChange('ai', 'detailedAnalysis', val)}
                        label="Phân tích chi tiết"
                        description="Nhận phân tích chi tiết về điểm mạnh/yếu"
                      />
                    </div>
                  </div>

                  {/* Display */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Globe className="size-5 text-green-600" />
                      Hiển thị
                    </h3>
                    <div className="space-y-4 pl-7">
                      <div>
                        <p className="text-sm text-gray-900 mb-2">Ngôn ngữ</p>
                        <select
                          value={settings.display.language}
                          onChange={(e) => handleSettingsChange('display', 'language', e.target.value)}
                          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-900 mb-2">Giao diện</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSettingsChange('display', 'theme', 'light')}
                            className={`flex-1 max-w-[150px] px-4 py-2 rounded-lg border-2 transition-all ${
                              settings.display.theme === 'light'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <Sun className="size-4 mx-auto mb-1" />
                            <span className="text-xs">Sáng</span>
                          </button>
                          <button
                            onClick={() => handleSettingsChange('display', 'theme', 'dark')}
                            className={`flex-1 max-w-[150px] px-4 py-2 rounded-lg border-2 transition-all ${
                              settings.display.theme === 'dark'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <Moon className="size-4 mx-auto mb-1" />
                            <span className="text-xs">Tối</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-900 mb-2">Cỡ chữ</p>
                        <select
                          value={settings.display.fontSize}
                          onChange={(e) => handleSettingsChange('display', 'fontSize', e.target.value)}
                          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="small">Nhỏ</option>
                          <option value="medium">Trung bình</option>
                          <option value="large">Lớn</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sound */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Volume2 className="size-5 text-orange-600" />
                      Âm thanh
                    </h3>
                    <div className="space-y-4 pl-7">
                      <ToggleSwitch
                        enabled={settings.sound.enabled}
                        onChange={(val) => handleSettingsChange('sound', 'enabled', val)}
                        label="Bật âm thanh"
                        description="Phát âm thanh khi tương tác với ứng dụng"
                      />
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-900">Âm lượng</p>
                          <span className="text-sm text-gray-600">{settings.sound.volume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.sound.volume}
                          onChange={(e) => handleSettingsChange('sound', 'volume', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.sound.volume}%, #e5e7eb ${settings.sound.volume}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>

                      <ToggleSwitch
                        enabled={settings.sound.correctAnswer}
                        onChange={(val) => handleSettingsChange('sound', 'correctAnswer', val)}
                        label="Âm thanh trả lời đúng"
                        description="Phát âm thanh khi chọn đáp án đúng"
                      />
                      <ToggleSwitch
                        enabled={settings.sound.wrongAnswer}
                        onChange={(val) => handleSettingsChange('sound', 'wrongAnswer', val)}
                        label="Âm thanh trả lời sai"
                        description="Phát âm thanh khi chọn đáp án sai"
                      />
                    </div>
                  </div>

                  {/* Learning */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <BookOpen className="size-5 text-indigo-600" />
                      Học tập
                    </h3>
                    <div className="space-y-4 pl-7">
                      <ToggleSwitch
                        enabled={settings.learning.autoSave}
                        onChange={(val) => handleSettingsChange('learning', 'autoSave', val)}
                        label="Tự động lưu"
                        description={`Tự động lưu tiến trình mỗi ${settings.learning.saveInterval} giây`}
                      />
                      
                      <div>
                        <p className="text-sm text-gray-900 mb-2">Khoảng thời gian tự động lưu</p>
                        <select
                          value={settings.learning.saveInterval}
                          onChange={(e) => handleSettingsChange('learning', 'saveInterval', parseInt(e.target.value))}
                          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={!settings.learning.autoSave}
                        >
                          <option value={5}>5 giây</option>
                          <option value={10}>10 giây</option>
                          <option value={30}>30 giây</option>
                          <option value={60}>1 phút</option>
                        </select>
                      </div>

                      <ToggleSwitch
                        enabled={settings.learning.showHints}
                        onChange={(val) => handleSettingsChange('learning', 'showHints', val)}
                        label="Hiển thị gợi ý"
                        description="Hiển thị gợi ý khi làm bài tập"
                      />
                      <ToggleSwitch
                        enabled={settings.learning.skipConfirmation}
                        onChange={(val) => handleSettingsChange('learning', 'skipConfirmation', val)}
                        label="Bỏ qua xác nhận"
                        description="Không hiển thị dialog xác nhận khi nộp bài"
                      />
                    </div>
                  </div>

                  {/* Privacy */}
                  <div>
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Shield className="size-5 text-red-600" />
                      Quyền riêng tư
                    </h3>
                    <div className="space-y-4 pl-7">
                      <ToggleSwitch
                        enabled={settings.privacy.shareProgress}
                        onChange={(val) => handleSettingsChange('privacy', 'shareProgress', val)}
                        label="Chia sẻ tiến độ"
                        description="Cho phép giáo viên và bạn bè xem tiến độ học tập"
                      />
                      <ToggleSwitch
                        enabled={settings.privacy.publicProfile}
                        onChange={(val) => handleSettingsChange('privacy', 'publicProfile', val)}
                        label="Hồ sơ công khai"
                        description="Hiển thị hồ sơ của bạn trong danh sách tìm kiếm"
                      />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg mb-4 text-gray-700 flex items-center gap-2">
                      <Lock className="size-5 text-red-600" />
                      Bảo mật
                    </h3>
                    <div className="space-y-4 pl-7">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          value={passwordData.current}
                          onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Đổi mật khẩu
                      </button>

                      <div className="pt-6 border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <LogOut className="size-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
