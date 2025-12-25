'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Download,
  Plus,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Eye,
  Edit,
  Lock,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Trash2,
  Calendar,
  Smartphone,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userManagementApi, AdminUser, UserFilter, UserStatistics } from '@/services/admin.service';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

// Import modal components
import { ResetLoginModal } from '@/components/admin/ResetLoginModal';
import { AccountExpiryModal } from '@/components/admin/AccountExpiryModal';
import { DeviceLimitModal } from '@/components/admin/DeviceLimitModal';

// Statistics Card component
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  colorClass,
  isLoading,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  colorClass: string;
  isLoading?: boolean;
}) {
  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="size-10 opacity-80" />
        {change && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{change}</span>}
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-white/30 rounded w-20 mb-1"></div>
          <div className="h-4 bg-white/20 rounded w-24"></div>
        </div>
      ) : (
        <>
          <h3 className="text-3xl mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          <p className="text-sm opacity-90">{title}</p>
        </>
      )}
    </div>
  );
}

// Role badge colors
const getRoleBadgeClass = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'teacher':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'uploader':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

// Status badge colors
const getStatusBadgeClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'inactive':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    case 'suspended':
    case 'banned':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'pending':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Role display name
const getRoleDisplayName = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'Quản trị';
    case 'teacher':
      return 'Giáo viên';
    case 'uploader':
      return 'Uploader';
    case 'student':
      return 'Học viên';
    default:
      return role;
  }
};

// Status display name
const getStatusDisplayName = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Tạm ngưng';
    case 'suspended':
    case 'banned':
      return 'Đã cấm';
    case 'pending':
      return 'Chờ duyệt';
    default:
      return status;
  }
};

export default function UserManagementPage() {
  // State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<{
    userId: string;
    newStatus: string;
    userName: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // New Action Modals
  const [showResetLoginModal, setShowResetLoginModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showDeviceLimitModal, setShowDeviceLimitModal] = useState(false);
  const [resetLoginUser, setResetLoginUser] = useState<AdminUser | null>(null);
  const [expiryUser, setExpiryUser] = useState<AdminUser | null>(null);
  const [deviceLimitUser, setDeviceLimitUser] = useState<AdminUser | null>(null);

  // Device management data
  const [devices, setDevices] = useState<any[]>([]);
  const [maxDevices, setMaxDevices] = useState(2);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  // Expiry data
  const [expiryData, setExpiryData] = useState<{
    currentExpiry: string | null;
    daysRemaining: number;
    planDays: number;
    plan: string;
  } | null>(null);

  // Edit/Delete modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Add user form state
  const [addUserForm, setAddUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    status: 'active',
  });

  // Edit user form state
  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
  });

  const t = useTranslations('common');

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filter: UserFilter = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };

      const response = await userManagementApi.getUsers(filter);
      const responseData = response.data;
      const usersData = Array.isArray(responseData) ? responseData : responseData.items || [];
      const total = Array.isArray(responseData) ? responseData.length : responseData.total || 0;
      setUsers(usersData);
      setTotalPages(Math.ceil(total / itemsPerPage));
      setTotalUsers(total);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Không thể tải danh sách người dùng');
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterRole, filterStatus]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const response = await userManagementApi.getStatistics();
      setStatistics(response.data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Fetch devices for a user
  const fetchDevicesForUser = useCallback(async (userId: string) => {
    setIsLoadingDevices(true);
    try {
      const response = await userManagementApi.getUserDevices(userId);
      setDevices(response.data?.devices || []);
      setMaxDevices(response.data?.maxDevices || 2);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setDevices([]);
    } finally {
      setIsLoadingDevices(false);
    }
  }, []);

  // Fetch expiry data for a user
  const fetchExpiryForUser = useCallback(async (userId: string) => {
    try {
      const response = await userManagementApi.getUserExpiry(userId);
      setExpiryData(response.data);
    } catch (err: any) {
      console.error('Error fetching expiry:', err);
      setExpiryData(null);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [fetchUsers, fetchStatistics]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterRole, filterStatus]);

  // Update user status
  const handleUpdateStatus = async () => {
    if (!statusAction) return;

    setIsUpdating(true);
    try {
      await userManagementApi.updateStatus(statusAction.userId, statusAction.newStatus);
      toast.success(`Đã cập nhật trạng thái người dùng ${statusAction.userName}`);
      setShowStatusModal(false);
      setStatusAction(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset login sessions
  const handleResetLogin = async () => {
    if (!resetLoginUser) return;
    setIsUpdating(true);
    try {
      const response = await userManagementApi.resetLoginSessions(resetLoginUser.id);
      const affected = response.data?.affected || 0;
      toast.success(`Đã reset ${affected} phiên đăng nhập cho ${getFullName(resetLoginUser)}`);
      setShowResetLoginModal(false);
      setResetLoginUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Không thể reset phiên đăng nhập');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update account expiry
  const handleUpdateExpiry = async (mode: 'extend' | 'set', value: number | string) => {
    if (!expiryUser) return;
    setIsUpdating(true);
    try {
      await userManagementApi.updateExpiry(expiryUser.id, mode, value);
      toast.success(`Đã cập nhật hạn tài khoản cho ${getFullName(expiryUser)}`);
      setShowExpiryModal(false);
      setExpiryUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật hạn tài khoản');
    } finally {
      setIsUpdating(false);
    }
  };

  // Logout device
  const handleLogoutDevice = async (deviceId: string) => {
    if (!deviceLimitUser) return;
    try {
      await userManagementApi.logoutDevice(deviceLimitUser.id, deviceId);
      toast.success(`Đã đăng xuất thiết bị`);
      // Refresh device list
      await fetchDevicesForUser(deviceLimitUser.id);
    } catch (err: any) {
      toast.error(err.message || 'Không thể đăng xuất thiết bị');
    }
  };

  // Logout all devices
  const handleLogoutAllDevices = async () => {
    if (!deviceLimitUser) return;
    try {
      const response = await userManagementApi.logoutAllDevices(deviceLimitUser.id);
      const affected = response.data?.affected || 0;
      toast.success(`Đã đăng xuất ${affected} thiết bị cho ${getFullName(deviceLimitUser)}`);
      // Refresh device list
      await fetchDevicesForUser(deviceLimitUser.id);
    } catch (err: any) {
      toast.error(err.message || 'Không thể đăng xuất thiết bị');
    }
  };

  // Update device limit
  const handleUpdateDeviceLimit = async (newLimit: number) => {
    if (!deviceLimitUser) return;
    try {
      await userManagementApi.updateDeviceLimit(deviceLimitUser.id, newLimit);
      toast.success(`Đã cập nhật giới hạn thiết bị thành ${newLimit}`);
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật giới hạn thiết bị');
    }
  };

  // Add new user
  const handleAddUser = async () => {
    if (!addUserForm.email || !addUserForm.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsUpdating(true);
    try {
      await userManagementApi.createUser({
        email: addUserForm.email,
        password: addUserForm.password,
        firstName: addUserForm.firstName,
        lastName: addUserForm.lastName,
        role: addUserForm.role,
      });
      toast.success('Đã thêm người dùng mới');
      setShowAddModal(false);
      setAddUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        status: 'active',
      });
      fetchUsers();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Không thể thêm người dùng');
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit user
  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      await userManagementApi.updateUser(editingUser.id, {
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        email: editUserForm.email,
      });

      // Update role if changed
      if (editUserForm.role !== editingUser.role?.name?.toLowerCase()) {
        await userManagementApi.updateRole(editingUser.id, editUserForm.role);
      }

      // Update status if changed
      if (editUserForm.status !== editingUser.status) {
        await userManagementApi.updateStatus(editingUser.id, editUserForm.status);
      }

      toast.success(`Đã cập nhật thông tin người dùng`);
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật người dùng');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsUpdating(true);
    try {
      await userManagementApi.deleteUser(deletingUser.id);
      toast.success(`Đã xóa người dùng ${getFullName(deletingUser)}`);
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa người dùng');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open edit modal
  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.profile?.phone || '',
      role: user.role?.name?.toLowerCase() || 'student',
      status: user.status || 'active',
    });
    setShowEditModal(true);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Format last login
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Chưa đăng nhập';
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return dateString;
    }
  };

  // Get user initials
  const getUserInitials = (user: AdminUser) => {
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  // Get full name
  const getFullName = (user: AdminUser) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email.split('@')[0];
  };

  // Format change percentage
  const formatChange = (value: number | undefined): string => {
    if (value === undefined || value === null) return '0%';
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  // Calculate stats from API response
  const statsData = [
    {
      title: 'Tổng người dùng',
      value: statistics?.totalUsers || totalUsers,
      change: formatChange(statistics?.changes?.newUsers),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Đang hoạt động',
      value: statistics?.activeUsers || 0,
      change: formatChange(statistics?.changes?.activeUsers),
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Không hoạt động',
      value: (statistics?.totalUsers || 0) - (statistics?.activeUsers || 0),
      change: '-',
      icon: UserX,
      color: 'from-gray-500 to-gray-600',
    },
    {
      title: 'Mới 7 ngày',
      value: statistics?.newUsersThisWeek || 0,
      change: formatChange(statistics?.changes?.newUsers),
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  // Export handler (download CSV from backend)
  const handleExportUsers = async () => {
    try {
      const response = await userManagementApi.exportUsers({
        search: searchQuery,
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t('export') + ' thành công!');
    } catch (err) {
      toast.error(t('export') + ' thất bại!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:bg-gray-50">
          <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            colorClass={stat.color}
            isLoading={isStatsLoading}
          />
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px] border-gray-300 bg-white text-gray-700">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="student">Học viên</SelectItem>
              <SelectItem value="teacher">Giáo viên</SelectItem>
              <SelectItem value="admin">Quản trị</SelectItem>
              <SelectItem value="uploader">Uploader</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-gray-300 bg-white text-gray-700">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="suspended">Đã cấm</SelectItem>
            </SelectContent>
          </Select>

          {/* Add User Button */}
          <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="size-4 mr-2" />
            Thêm người dùng
          </Button>

          {/* Export Button */}
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={handleExportUsers}>
            <Download className="size-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Người dùng</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Số điện thoại</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vai trò</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày tạo</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Đăng nhập</TableHead>
                <TableHead className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Loader2 className="size-8 animate-spin text-blue-500 mx-auto" />
                    <p className="text-gray-500 mt-2">Đang tải...</p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <AlertCircle className="size-8 text-red-400 mx-auto" />
                    <p className="text-red-500 mt-2">{error}</p>
                    <Button onClick={fetchUsers} variant="outline" size="sm" className="mt-4">
                      Thử lại
                    </Button>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Users className="size-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500 mt-2">Không tìm thấy người dùng nào</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getFullName(user)}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-gray-600">{user.profile?.phone || '-'}</TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(user.role?.name)}`}>{getRoleDisplayName(user.role?.name)}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(user.status)}`}>{getStatusDisplayName(user.status)}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-gray-600">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="py-3 px-4 text-sm text-gray-600">{formatLastLogin(user.lastLoginAt)}</TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedUser(user)} className="p-1 hover:bg-gray-200 rounded" title="Xem chi tiết">
                          <Eye className="size-4 text-gray-600" />
                        </button>
                        <button onClick={() => openEditModal(user)} className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                          <Edit className="size-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => {
                            setResetLoginUser(user);
                            setShowResetLoginModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Reset đăng nhập"
                        >
                          <Lock className="size-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => {
                            setExpiryUser(user);
                            fetchExpiryForUser(user.id);
                            setShowExpiryModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Quản lý hạn tài khoản"
                        >
                          <Calendar className="size-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setDeviceLimitUser(user);
                            fetchDevicesForUser(user.id);
                            setShowDeviceLimitModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Quản lý số thiết bị"
                        >
                          <Smartphone className="size-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => {
                              setStatusAction({
                                userId: user.id,
                                newStatus: 'suspended',
                                userName: getFullName(user),
                              });
                              setShowStatusModal(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Cấm người dùng"
                          >
                            <UserX className="size-4 text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setStatusAction({
                                userId: user.id,
                                newStatus: 'active',
                                userName: getFullName(user),
                              });
                              setShowStatusModal(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Kích hoạt người dùng"
                          >
                            <CheckCircle className="size-4 text-green-600" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalUsers)} trong tổng số {totalUsers} người dùng
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Sidebar */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedUser(null)} />
          <div className="fixed right-0 top-0 h-full w-full lg:w-[600px] bg-white z-50 overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Info */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <Avatar className="size-20 mx-auto mb-4 border-4 border-white/20">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">{getUserInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">{getFullName(selectedUser)}</h2>
                <p className="opacity-90 mb-1">{selectedUser.email}</p>
                <p className="opacity-90">{selectedUser.profile?.phone || 'Chưa có SĐT'}</p>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Vai trò</label>
                  <Select defaultValue={selectedUser.role?.name?.toLowerCase()}>
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="student">Học viên</SelectItem>
                      <SelectItem value="teacher">Giáo viên</SelectItem>
                      <SelectItem value="admin">Quản trị</SelectItem>
                      <SelectItem value="uploader">Uploader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm ngưng</SelectItem>
                      <SelectItem value="suspended">Đã cấm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* User Stats */}
              {selectedUser.stats && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Thống kê học tập</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bài thi đã làm</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedUser.stats.testsCompleted}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Điểm trung bình</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedUser.stats.averageScore?.toFixed(1) || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Tổng giờ học</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedUser.stats.totalHours}h</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">XP</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedUser.stats.xp?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Thông tin tài khoản</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày tạo</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đăng nhập gần nhất</span>
                    <span className="text-sm font-medium text-gray-900">{formatLastLogin(selectedUser.lastLoginAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Level hiện tại</span>
                    <span className="text-sm font-medium text-gray-900">{selectedUser.profile?.currentLevel || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mục tiêu</span>
                    <span className="text-sm font-medium text-gray-900">{selectedUser.profile?.targetLevel || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Lưu thay đổi</button>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Reset mật khẩu</button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cấm người dùng</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Status Update Confirmation Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Xác nhận thay đổi trạng thái</DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn có chắc muốn {statusAction?.newStatus === 'active' ? 'kích hoạt' : 'cấm'} người dùng <strong>{statusAction?.userName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)} className="border-gray-300 text-gray-700">
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating}
              className={statusAction?.newStatus === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
            >
              {isUpdating && <Loader2 className="size-4 mr-2 animate-spin" />}
              {statusAction?.newStatus === 'active' ? 'Kích hoạt' : 'Cấm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Thêm người dùng mới</DialogTitle>
            <DialogDescription className="text-gray-600">Điền thông tin để tạo tài khoản mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Họ</label>
                <Input
                  placeholder="VD: Nguyễn"
                  className="border-gray-300"
                  value={addUserForm.firstName}
                  onChange={(e) => setAddUserForm((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên</label>
                <Input
                  placeholder="VD: Văn A"
                  className="border-gray-300"
                  value={addUserForm.lastName}
                  onChange={(e) => setAddUserForm((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="border-gray-300"
                value={addUserForm.email}
                onChange={(e) => setAddUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
              <Input
                type="tel"
                placeholder="0901234567"
                className="border-gray-300"
                value={addUserForm.phone}
                onChange={(e) => setAddUserForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="border-gray-300"
                value={addUserForm.password}
                onChange={(e) => setAddUserForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vai trò</label>
                <Select value={addUserForm.role} onValueChange={(value) => setAddUserForm((prev) => ({ ...prev, role: value }))}>
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="student">Học viên</SelectItem>
                    <SelectItem value="teacher">Giáo viên</SelectItem>
                    <SelectItem value="admin">Quản trị</SelectItem>
                    <SelectItem value="uploader">Uploader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
                <Select value={addUserForm.status} onValueChange={(value) => setAddUserForm((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm ngưng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-gray-300 text-gray-700">
              Hủy
            </Button>
            <Button onClick={handleAddUser} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">
              {isUpdating && <Loader2 className="size-4 mr-2 animate-spin" />}
              Thêm người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription className="text-gray-600">Cập nhật thông tin tài khoản</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Họ</label>
                <Input
                  placeholder="VD: Nguyễn"
                  className="border-gray-300"
                  value={editUserForm.firstName}
                  onChange={(e) => setEditUserForm((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên</label>
                <Input
                  placeholder="VD: Văn A"
                  className="border-gray-300"
                  value={editUserForm.lastName}
                  onChange={(e) => setEditUserForm((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="border-gray-300"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
              <Input
                type="tel"
                placeholder="0901234567"
                className="border-gray-300"
                value={editUserForm.phone}
                onChange={(e) => setEditUserForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vai trò</label>
                <Select value={editUserForm.role} onValueChange={(value) => setEditUserForm((prev) => ({ ...prev, role: value }))}>
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="student">Học viên</SelectItem>
                    <SelectItem value="teacher">Giáo viên</SelectItem>
                    <SelectItem value="admin">Quản trị</SelectItem>
                    <SelectItem value="uploader">Uploader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
                <Select value={editUserForm.status} onValueChange={(value) => setEditUserForm((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm ngưng</SelectItem>
                    <SelectItem value="suspended">Đã cấm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              className="border-gray-300 text-gray-700"
            >
              Hủy
            </Button>
            <Button onClick={handleEditUser} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isUpdating && <Loader2 className="size-4 mr-2 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn có chắc muốn xóa người dùng <strong>{deletingUser ? getFullName(deletingUser) : ''}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingUser(null);
              }}
              className="border-gray-300 text-gray-700"
            >
              Hủy
            </Button>
            <Button onClick={handleDeleteUser} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white">
              {isUpdating && <Loader2 className="size-4 mr-2 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Login Modal */}
      <ResetLoginModal
        isOpen={showResetLoginModal}
        userName={resetLoginUser ? getFullName(resetLoginUser) : ''}
        onClose={() => {
          setShowResetLoginModal(false);
          setResetLoginUser(null);
        }}
        onConfirm={handleResetLogin}
      />

      {/* Account Expiry Modal */}
      <AccountExpiryModal
        isOpen={showExpiryModal}
        userName={expiryUser ? getFullName(expiryUser) : ''}
        currentExpiry={
          expiryData?.currentExpiry
            ? new Date(expiryData.currentExpiry).toLocaleDateString('vi-VN')
            : expiryUser?.userPackage?.endDate
            ? new Date(expiryUser.userPackage.endDate).toLocaleDateString('vi-VN')
            : 'Chưa có gói'
        }
        daysRemaining={
          expiryData?.daysRemaining ??
          (expiryUser?.userPackage?.endDate
            ? Math.max(0, Math.ceil((new Date(expiryUser.userPackage.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : 0)
        }
        planDays={expiryData?.planDays ?? 30}
        onClose={() => {
          setShowExpiryModal(false);
          setExpiryUser(null);
          setExpiryData(null);
        }}
        onSave={handleUpdateExpiry}
      />

      {/* Device Limit Modal */}
      <DeviceLimitModal
        isOpen={showDeviceLimitModal}
        userName={deviceLimitUser ? getFullName(deviceLimitUser) : ''}
        userEmail={deviceLimitUser?.email || ''}
        devices={devices}
        maxDevices={maxDevices}
        isLoading={isLoadingDevices}
        onClose={() => {
          setShowDeviceLimitModal(false);
          setDeviceLimitUser(null);
          setDevices([]);
        }}
        onLogoutDevice={handleLogoutDevice}
        onLogoutAll={handleLogoutAllDevices}
        onUpdateLimit={handleUpdateDeviceLimit}
      />
    </div>
  );
}
