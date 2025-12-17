# FE-058: User Management UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-058 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-055, FE-057 |

---

## 🎯 Objective

Implement admin user management interface:
- User list with advanced filters
- User detail modal
- Edit user form
- Ban/unban actions
- Role management
- Export users

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   └── AdminDashboard.tsx         # Contains user list example
```

### Hướng dẫn:
- **TẠO MỚI** trong `FE/src/features/admin/users/`
- Follow admin color scheme (red-600 primary)

---

## 📝 Implementation

### 1. hooks/useAdminUsers.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUserService } from '@/services/adminUserService';

export interface UserQueryParams {
  search?: string;
  status?: 'active' | 'banned' | 'deleted';
  role?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const useAdminUsers = (params: UserQueryParams) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminUserService.getUsers(params),
    keepPreviousData: true,
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminUserService.getUser(id),
    enabled: !!id,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: () => adminUserService.getStats(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminUserService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason, duration }: { id: string; reason?: string; duration?: number }) =>
      adminUserService.banUser(id, { reason, duration }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminUserService.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) =>
      adminUserService.updateRoles(id, roles),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminUserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
```

### 2. components/UserListContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit2,
  Ban,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminUsers, useUserStats, UserQueryParams } from '../hooks/useAdminUsers';
import { UserDetailModal } from './UserDetailModal';
import { BanUserModal } from './BanUserModal';
import { formatDate } from '@/utils/date';

export function UserListContainer() {
  const [params, setParams] = useState<UserQueryParams>({
    page: 1,
    limit: 20,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { data: users, isLoading } = useAdminUsers(params);
  const { data: stats } = useUserStats();

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleViewUser = (id: string) => {
    setSelectedUserId(id);
    setShowDetailModal(true);
  };

  const handleBanUser = (id: string) => {
    setSelectedUserId(id);
    setShowBanModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Tổng người dùng"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={UserCheck}
          label="Đang hoạt động"
          value={stats?.active || 0}
          color="green"
        />
        <StatCard
          icon={UserX}
          label="Bị cấm"
          value={stats?.banned || 0}
          color="red"
        />
        <StatCard
          icon={UserPlus}
          label="Mới tháng này"
          value={stats?.newThisMonth || 0}
          color="purple"
        />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách người dùng</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            <Select
              value={params.status || 'all'}
              onValueChange={(v) => handleFilterChange('status', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="banned">Bị cấm</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.role || 'all'}
              onValueChange={(v) => handleFilterChange('role', v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="student">Học sinh</SelectItem>
                <SelectItem value="teacher">Giáo viên</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.items.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles?.map((role: any) => (
                          <Badge
                            key={role.name || role}
                            variant="outline"
                            className={getRoleBadgeColor(role.name || role)}
                          >
                            {role.name || role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isBanned ? 'destructive' : 'secondary'}
                        className={
                          user.isBanned
                            ? ''
                            : 'bg-green-100 text-green-700'
                        }
                      >
                        {user.isBanned ? 'Bị cấm' : 'Hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.lastLoginAt
                        ? formatDate(user.lastLoginAt)
                        : 'Chưa đăng nhập'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Quản lý vai trò
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isBanned ? (
                            <DropdownMenuItem className="text-green-600">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Bỏ cấm
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-orange-600"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Cấm người dùng
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Hiển thị {users?.items.length || 0} / {users?.total || 0} người dùng
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={params.page === 1}
                onClick={() =>
                  setParams((prev) => ({ ...prev, page: prev.page! - 1 }))
                }
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={params.page === users?.totalPages}
                onClick={() =>
                  setParams((prev) => ({ ...prev, page: prev.page! + 1 }))
                }
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailModal
        userId={selectedUserId}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUserId(null);
        }}
      />

      <BanUserModal
        userId={selectedUserId}
        open={showBanModal}
        onClose={() => {
          setShowBanModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}

// Helper components
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'border-red-300 text-red-600';
    case 'teacher':
      return 'border-purple-300 text-purple-600';
    default:
      return 'border-blue-300 text-blue-600';
  }
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
```

### 3. components/UserDetailModal.tsx

```tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Target,
  Activity,
  Shield,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminUser } from '../hooks/useAdminUsers';

interface Props {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailModal({ userId, open, onClose }: Props) {
  const { data: user, isLoading } = useAdminUser(userId || '');

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-48" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profile?.avatarUrl} />
                <AvatarFallback className="text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  {user.roles?.map((role: any) => (
                    <Badge key={role.name} variant="outline">
                      {role.name}
                    </Badge>
                  ))}
                  <Badge variant={user.isBanned ? 'destructive' : 'secondary'}>
                    {user.isBanned ? 'Bị cấm' : 'Hoạt động'}
                  </Badge>
                </div>
              </div>
            </div>

            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="stats">Thống kê</TabsTrigger>
                <TabsTrigger value="activity">Hoạt động</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow
                  icon={Phone}
                  label="Số điện thoại"
                  value={user.profile?.phone || 'Chưa cập nhật'}
                />
                <InfoRow
                  icon={Calendar}
                  label="Ngày đăng ký"
                  value={format(new Date(user.createdAt), 'dd/MM/yyyy', {
                    locale: vi,
                  })}
                />
                <InfoRow
                  icon={Clock}
                  label="Đăng nhập cuối"
                  value={
                    user.lastLoginAt
                      ? format(new Date(user.lastLoginAt), 'dd/MM/yyyy HH:mm', {
                          locale: vi,
                        })
                      : 'Chưa đăng nhập'
                  }
                />
                <InfoRow
                  icon={Target}
                  label="Level hiện tại"
                  value={user.profile?.currentLevel || 'Chưa xác định'}
                />
                <InfoRow
                  icon={Target}
                  label="Level mục tiêu"
                  value={user.profile?.targetLevel || 'Chưa đặt'}
                />
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 mt-4">
                {user.stats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem
                      label="Giờ học"
                      value={user.stats.totalHours?.toFixed(1) || 0}
                    />
                    <StatItem
                      label="Bài test hoàn thành"
                      value={user.stats.testsCompleted || 0}
                    />
                    <StatItem
                      label="Streak hiện tại"
                      value={`${user.stats.currentStreak || 0} ngày`}
                    />
                    <StatItem
                      label="Điểm trung bình"
                      value={user.stats.averageScore?.toFixed(1) || 0}
                    />
                    <StatItem label="XP" value={user.stats.xp || 0} />
                    <StatItem label="Level" value={user.stats.level || 1} />
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có thống kê</p>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <p className="text-gray-500">Hoạt động gần đây sẽ hiển thị ở đây</p>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <p>Không tìm thấy người dùng</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
```

### 4. components/BanUserModal.tsx

```tsx
'use client';

import { useState } from 'react';
import { Ban } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBanUser } from '../hooks/useAdminUsers';
import { toast } from 'sonner';

interface Props {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

export function BanUserModal({ userId, open, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState<string>('permanent');

  const banMutation = useBanUser();

  const handleBan = async () => {
    if (!userId) return;

    try {
      await banMutation.mutateAsync({
        id: userId,
        reason,
        duration: duration === 'permanent' ? undefined : parseInt(duration),
      });
      toast.success('Đã cấm người dùng');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cấm người dùng');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Ban className="w-5 h-5" />
            Cấm người dùng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Thời hạn</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ngày</SelectItem>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
                <SelectItem value="90">90 ngày</SelectItem>
                <SelectItem value="permanent">Vĩnh viễn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Lý do (không bắt buộc)</Label>
            <Textarea
              placeholder="Nhập lý do cấm..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleBan}
            disabled={banMutation.isPending}
          >
            Xác nhận cấm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] User list displays correctly
- [ ] Search by name/email works
- [ ] Filter by status works
- [ ] Filter by role works
- [ ] Pagination works
- [ ] View user detail modal
- [ ] Ban user with reason/duration
- [ ] Unban user works
- [ ] Export to Excel works
- [ ] Stats cards show correct data

---

## 🧪 Test Cases

```typescript
describe('UserListContainer', () => {
  it('searches users correctly', async () => {
    // Enter search term
    // Click search
    // Verify filtered results
  });

  it('filters by role', async () => {
    // Select teacher role
    // Verify only teachers shown
  });

  it('bans user successfully', async () => {
    // Open ban modal
    // Select duration
    // Enter reason
    // Confirm
    // Verify user banned
  });

  it('paginates correctly', async () => {
    // Click next page
    // Verify new users loaded
  });
});
```
