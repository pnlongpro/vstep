import { useState, useEffect } from 'react';
import { Package, Crown, Award, Edit, Save, X, Plus, Trash2, TrendingUp, Users, DollarSign, Calendar, Info } from 'lucide-react';

interface PlanFeature {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface PricingOption {
  duration: '1month' | '3months' | '6months' | '1year';
  price: number;
  discount: number;
}

interface Plan {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  features: PlanFeature[];
  pricing: PricingOption[];
  statistics: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    growth: number;
  };
  isDefault?: boolean; // Đánh dấu gói mặc định (không thể xoá)
}

export function PricingPlansManagement() {
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  
  // Load Admin Preset Configs from localStorage
  const getFreePlanFromPreset = () => {
    const activePreset = localStorage.getItem('vstep_admin_active_free_preset') || 'standard';
    const savedConfigs = localStorage.getItem('vstep_admin_preset_configs');
    
    let presetConfigs;
    if (savedConfigs) {
      try {
        presetConfigs = JSON.parse(savedConfigs);
      } catch (e) {
        presetConfigs = null;
      }
    }
    
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
    
    const config = presetConfigs[activePreset as 'basic' | 'standard' | 'extended'];
    
    return {
      id: 'free',
      name: 'Free',
      icon: Package,
      color: 'gray',
      gradient: 'from-gray-500 to-gray-600',
      description: 'Dùng thử miễn phí với giới hạn',
      features: [
        { id: '1', title: 'Reading', description: `${config.reading} bài`, enabled: true },
        { id: '2', title: 'Listening', description: `${config.listening} bài`, enabled: true },
        { id: '3', title: 'Writing', description: `${config.writing} bài`, enabled: true },
        { id: '4', title: 'Speaking', description: `${config.speaking} bài`, enabled: true },
        { id: '5', title: 'Mock Test', description: `${config.mockTest} bài`, enabled: true },
        { id: '6', title: 'AI Writing', description: config.aiWriting, enabled: true },
        { id: '7', title: 'AI Speaking', description: config.aiSpeaking, enabled: true },
        { id: '8', title: 'Thời hạn', description: `${config.duration} ngày`, enabled: true }
      ],
      pricing: [],
      statistics: {
        totalUsers: 15420,
        activeUsers: 8934,
        revenue: 0,
        growth: 12.5
      },
      isDefault: true
    };
  };
  
  const [plans, setPlans] = useState<Plan[]>([
    getFreePlanFromPreset(),
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      description: 'Học không giới hạn với tất cả tính năng',
      features: [
        { id: '1', title: 'Không giới hạn', description: 'AI Speaking & Writing', enabled: true },
        { id: '2', title: '1000+ đề thi', description: 'Mock Test đầy đủ', enabled: true },
        { id: '3', title: 'AI Feedback', description: 'Chi tiết từng câu', enabled: true },
        { id: '4', title: 'Hỗ trợ 24/7', description: 'Tư vấn miễn phí', enabled: true }
      ],
      pricing: [
        { duration: '1month', price: 299000, discount: 0 },
        { duration: '3months', price: 799000, discount: 10 },
        { duration: '6months', price: 1499000, discount: 16 },
        { duration: '1year', price: 2699000, discount: 25 }
      ],
      statistics: {
        totalUsers: 3245,
        activeUsers: 2987,
        revenue: 487500000,
        growth: 28.3
      },
      isDefault: true
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Award,
      color: 'purple',
      gradient: 'from-purple-600 to-indigo-600',
      description: 'Dành cho người học nghiêm túc',
      features: [
        { id: '1', title: 'Không giới hạn', description: 'AI Speaking & Writing', enabled: true },
        { id: '2', title: '1000+ đề thi', description: 'Mock Test đầy đủ', enabled: true },
        { id: '3', title: 'AI Feedback', description: 'Chi tiết từng câu', enabled: true },
        { id: '4', title: '1-on-1 Coaching', description: 'Với giáo viên', enabled: true },
        { id: '5', title: 'Lộ trình AI', description: 'Cá nhân hóa', enabled: true },
        { id: '6', title: 'Chứng nhận', description: 'Hoàn thành khóa học', enabled: true }
      ],
      pricing: [
        { duration: '1month', price: 399000, discount: 0 },
        { duration: '3months', price: 1099000, discount: 8 },
        { duration: '6months', price: 1999000, discount: 16 },
        { duration: '1year', price: 3599000, discount: 25 }
      ],
      statistics: {
        totalUsers: 1156,
        activeUsers: 1098,
        revenue: 231200000,
        growth: 45.7
      },
      isDefault: true
    }
  ]);

  // Auto-refresh Free plan when admin changes preset
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedFreePlan = getFreePlanFromPreset();
      setPlans(currentPlans => 
        currentPlans.map(plan => 
          plan.id === 'free' ? updatedFreePlan : plan
        )
      );
    };

    // Listen to storage events (when localStorage is updated in another tab/component)
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up a periodic check every 500ms for same-tab updates
    const interval = setInterval(() => {
      const currentPreset = localStorage.getItem('vstep_admin_active_free_preset');
      const currentConfigs = localStorage.getItem('vstep_admin_preset_configs');
      
      // Check if there are changes and update
      handleStorageChange();
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // New plan form state
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    pricing: [
      { duration: '1month' as const, price: 0, discount: 0 },
      { duration: '3months' as const, price: 0, discount: 0 },
      { duration: '6months' as const, price: 0, discount: 0 },
      { duration: '1year' as const, price: 0, discount: 0 }
    ]
  });

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  const getDurationLabel = (duration: string) => {
    const labels: any = {
      '1month': '1 Tháng',
      '3months': '3 Tháng',
      '6months': '6 Tháng',
      '1year': '1 Năm'
    };
    return labels[duration] || duration;
  };

  const handleUpdatePrice = (planId: string, duration: string, newPrice: number) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          pricing: plan.pricing.map(p => 
            p.duration === duration ? { ...p, price: newPrice } : p
          )
        };
      }
      return plan;
    }));
  };

  const handleUpdateDiscount = (planId: string, duration: string, newDiscount: number) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          pricing: plan.pricing.map(p => 
            p.duration === duration ? { ...p, discount: newDiscount } : p
          )
        };
      }
      return plan;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Gói học</h1>
          <p className="text-sm text-gray-600 mt-1">Cấu hình giá và tính năng cho từng gói học</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Thêm gói mới
        </button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Tổng người dùng</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(plans.reduce((acc, p) => acc + p.statistics.totalUsers, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Người dùng hoạt động</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(plans.reduce((acc, p) => acc + p.statistics.activeUsers, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Doanh thu tháng này</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(plans.reduce((acc, p) => acc + p.statistics.revenue, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Gói đang hoạt động</p>
              <p className="text-xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Management */}
      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isEditing = editingPlan === plan.id;

          return (
            <div key={plan.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${plan.gradient} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                      <Icon className="size-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-white/90 text-sm mt-1">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPlan(isEditing ? null : plan.id)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <Save className="size-4" />
                          Lưu
                        </>
                      ) : (
                        <>
                          <Edit className="size-4" />
                          Chỉnh sửa
                        </>
                      )}
                    </button>
                    
                    {!plan.isDefault && (
                      <button
                        onClick={() => {
                          setPlanToDelete(plan.id);
                          setShowDeleteModal(true);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-red-500/90 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="size-4" />
                        Xoá
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan Statistics */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">Tổng người dùng</p>
                    <p className="text-xl font-bold">{formatNumber(plan.statistics.totalUsers)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">Đang hoạt động</p>
                    <p className="text-xl font-bold">{formatNumber(plan.statistics.activeUsers)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">Doanh thu</p>
                    <p className="text-lg font-bold">{formatCurrency(plan.statistics.revenue)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">Tăng trưởng</p>
                    <p className="text-xl font-bold">+{plan.statistics.growth}%</p>
                  </div>
                </div>
              </div>

              {/* Plan Body */}
              <div className="p-6">
                {/* Pricing Section */}
                {plan.pricing.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="size-5 text-blue-600" />
                      Cấu hình giá
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      {plan.pricing.map((option) => (
                        <div key={option.duration} className="border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">{getDurationLabel(option.duration)}</p>
                          
                          {isEditing ? (
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-500">Giá gốc (VNĐ)</label>
                                <input
                                  type="number"
                                  value={option.price}
                                  onChange={(e) => handleUpdatePrice(plan.id, option.duration, parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Giảm giá (%)</label>
                                <input
                                  type="number"
                                  value={option.discount}
                                  onChange={(e) => handleUpdateDiscount(plan.id, option.duration, parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(option.price * (1 - option.discount / 100))}
                              </p>
                              {option.discount > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs line-through text-gray-500">
                                    {formatCurrency(option.price)}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                                    -{option.discount}%
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Section */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="size-5 text-blue-600" />
                    Tính năng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.enabled ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {feature.enabled && (
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Thay đổi giá sẽ được áp dụng ngay lập tức cho người dùng mới</li>
              <li>• Người dùng hiện tại vẫn giữ nguyên giá đã thanh toán</li>
              <li>• Nên thông báo trước khi thay đổi giá để tránh khiếu nại</li>
              <li>• Kiểm tra kỹ trước khi lưu thay đổi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="size-5" />
                </div>
                <h3 className="text-xl font-bold">Thêm Gói Học Mới</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Tên Gói Học *</label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      placeholder="Vd: Enterprise"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Màu sắc</label>
                    <select
                      value={newPlan.color}
                      onChange={(e) => {
                        const color = e.target.value;
                        const gradients: any = {
                          'blue': 'from-blue-500 to-blue-600',
                          'green': 'from-green-500 to-emerald-600',
                          'purple': 'from-purple-500 to-indigo-600',
                          'red': 'from-red-500 to-rose-600',
                          'yellow': 'from-yellow-500 to-orange-600',
                          'pink': 'from-pink-500 to-rose-600',
                          'indigo': 'from-indigo-500 to-purple-600'
                        };
                        setNewPlan({ ...newPlan, color, gradient: gradients[color] || 'from-blue-500 to-blue-600' });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blue">Xanh dương (Blue)</option>
                      <option value="green">Xanh lá (Green)</option>
                      <option value="purple">Tím (Purple)</option>
                      <option value="red">Đỏ (Red)</option>
                      <option value="yellow">Vàng (Yellow)</option>
                      <option value="pink">Hồng (Pink)</option>
                      <option value="indigo">Chàm (Indigo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Mô Tả *</label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về gói học"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Giá và Giảm giá (VNĐ)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {newPlan.pricing.map((option) => (
                      <div key={option.duration} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700 mb-2">{getDurationLabel(option.duration)}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-500">Giá gốc</label>
                            <input
                              type="number"
                              value={option.price}
                              onChange={(e) => setNewPlan({
                                ...newPlan,
                                pricing: newPlan.pricing.map(p => 
                                  p.duration === option.duration ? { ...p, price: parseInt(e.target.value) || 0 } : p
                                )
                              })}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Giảm giá (%)</label>
                            <input
                              type="number"
                              value={option.discount}
                              onChange={(e) => setNewPlan({
                                ...newPlan,
                                pricing: newPlan.pricing.map(p => 
                                  p.duration === option.duration ? { ...p, discount: parseInt(e.target.value) || 0 } : p
                                )
                              })}
                              placeholder="0"
                              min="0"
                              max="100"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Lưu ý:</strong> Tính năng sẽ được tạo mặc định, bạn có thể chỉnh sửa sau khi tạo gói.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newPlan.name.trim()) {
                    alert('Vui lòng nhập tên gói học!');
                    return;
                  }
                  setPlans([...plans, {
                    id: `plan-${Date.now()}`,
                    name: newPlan.name,
                    icon: Package,
                    color: newPlan.color,
                    gradient: newPlan.gradient,
                    description: newPlan.description,
                    features: [
                      { id: '1', title: 'AI Speaking & Writing', description: 'Không giới hạn', enabled: true },
                      { id: '2', title: 'Mock Test', description: '1000+ đề thi', enabled: true },
                      { id: '3', title: 'AI Feedback', description: 'Chi tiết', enabled: true },
                      { id: '4', title: 'Hỗ trợ', description: '24/7 Support', enabled: true }
                    ],
                    pricing: newPlan.pricing,
                    statistics: {
                      totalUsers: 0,
                      activeUsers: 0,
                      revenue: 0,
                      growth: 0
                    },
                    isDefault: false
                  }]);
                  setShowAddModal(false);
                  setNewPlan({
                    name: '',
                    description: '',
                    color: 'blue',
                    gradient: 'from-blue-500 to-blue-600',
                    pricing: [
                      { duration: '1month' as const, price: 0, discount: 0 },
                      { duration: '3months' as const, price: 0, discount: 0 },
                      { duration: '6months' as const, price: 0, discount: 0 },
                      { duration: '1year' as const, price: 0, discount: 0 }
                    ]
                  });
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="size-4" />
                Thêm gói
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Plan Modal */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trash2 className="size-5" />
                </div>
                <h3 className="text-xl font-bold">Xoá Gói Học</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xoá gói học{' '}
                <strong className="text-gray-900">{plans.find(p => p.id === planToDelete)?.name}</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <strong>⚠️ Cảnh báo:</strong> Hành động này không thể hoàn tác!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPlanToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setPlans(plans.filter(plan => plan.id !== planToDelete));
                  setShowDeleteModal(false);
                  setPlanToDelete(null);
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Xoá gói
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}