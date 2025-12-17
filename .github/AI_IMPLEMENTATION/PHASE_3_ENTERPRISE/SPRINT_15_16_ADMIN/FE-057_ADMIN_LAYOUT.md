# FE-057: Admin Layout & Navigation

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-057 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-054 |

---

## 🎯 Objective

Implement admin panel layout and navigation:
- Admin-specific sidebar with menu
- Admin header with user info
- Route protection for admin pages
- Responsive layout
- Breadcrumb navigation

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── AdminDashboard.tsx         # Admin dashboard layout
│   └── Sidebar.tsx                # Main sidebar component
```

### Các file FE đã tồn tại (EXTEND):
```
FE/src/
├── features/teacher/
│   └── layout/
│       └── TeacherLayout.tsx      # Teacher layout (similar pattern)
```

### Hướng dẫn:
- **THAM KHẢO** `AdminDashboard.tsx` cho layout structure
- **FOLLOW** teacher layout pattern
- **TẠO MỚI** trong `FE/src/features/admin/layout/`

---

## 📝 Implementation

### 1. types.ts

```typescript
export interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  badge?: number;
  children?: AdminNavItem[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
}
```

### 2. constants/admin-nav.ts

```typescript
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  ScrollText,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { AdminNavItem } from '../types';
import { AdminPermission } from '@/lib/permissions';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    permission: AdminPermission.VIEW_USERS,
  },
  {
    label: 'Quản lý đề thi',
    href: '/admin/exams',
    icon: FileText,
    permission: AdminPermission.VIEW_EXAMS,
    children: [
      {
        label: 'Bộ đề',
        href: '/admin/exams',
        icon: FileText,
      },
      {
        label: 'Ngân hàng câu hỏi',
        href: '/admin/exams/questions',
        icon: BookOpen,
      },
    ],
  },
  {
    label: 'Thống kê',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: AdminPermission.VIEW_ANALYTICS,
  },
  {
    label: 'Cài đặt hệ thống',
    href: '/admin/settings',
    icon: Settings,
    permission: AdminPermission.VIEW_SETTINGS,
  },
  {
    label: 'Nhật ký hệ thống',
    href: '/admin/logs',
    icon: ScrollText,
    permission: AdminPermission.VIEW_LOGS,
  },
];
```

### 3. layout/AdminLayout.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  children: React.ReactNode;
}

export function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check admin access
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login?callbackUrl=' + pathname);
      return;
    }

    const roles = session.user?.roles || [];
    const isAdmin = roles.some((r: string) =>
      ['admin', 'super_admin'].includes(r)
    );

    if (!isAdmin) {
      router.push('/unauthorized');
    }
  }, [session, status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Skeleton className="w-64 h-screen" />
        <div className="flex-1 p-6">
          <Skeleton className="h-16 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <AdminHeader user={session.user as any} />

        <main className="flex-1 p-6">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 4. layout/AdminSidebar.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ADMIN_NAV_ITEMS } from '../constants/admin-nav';
import type { AdminNavItem } from '../types';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: AdminNavItem, level = 0) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const Icon = item.icon;

    const content = (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
          active
            ? 'bg-red-100 text-red-700'
            : 'text-gray-600 hover:bg-gray-100',
          level > 0 && 'ml-6'
        )}
        onClick={() => hasChildren && toggleExpand(item.href)}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {hasChildren && (
              <span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            )}
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </div>
    );

    const wrappedContent = hasChildren ? (
      content
    ) : (
      <Link href={item.href}>{content}</Link>
    );

    return (
      <div key={item.href}>
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={item.href}>{content}</Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          wrappedContent
        )}

        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r shadow-sm z-30 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-600" />
            <span className="text-lg font-bold text-gray-900">Admin</span>
          </Link>
        )}
        {collapsed && (
          <Shield className="w-8 h-8 text-red-600 mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        {ADMIN_NAV_ITEMS.map((item) => renderNavItem(item))}
      </nav>

      {/* Collapse toggle */}
      <div className="absolute bottom-4 right-0 translate-x-1/2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md bg-white"
          onClick={onToggle}
        >
          <ChevronLeft
            className={cn(
              'w-4 h-4 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>
    </aside>
  );
}
```

### 5. layout/AdminHeader.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AdminUser } from '../types';

interface Props {
  user: AdminUser;
}

export function AdminHeader({ user }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.roles?.[0] || 'Admin'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### 6. layout/AdminBreadcrumb.tsx

```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const BREADCRUMB_MAP: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  users: 'Người dùng',
  exams: 'Đề thi',
  questions: 'Câu hỏi',
  analytics: 'Thống kê',
  settings: 'Cài đặt',
  logs: 'Nhật ký',
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = BREADCRUMB_MAP[segment] || segment;
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className="mb-4 flex items-center text-sm text-gray-500">
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-gray-700"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.slice(1).map((crumb, index) => (
        <span key={crumb.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2" />
          {crumb.isLast ? (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-gray-700">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
```

### 7. Page Route: app/(admin)/admin/layout.tsx

```tsx
import { AdminLayout } from '@/features/admin/layout/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
```

### 8. Page Route: app/(admin)/admin/page.tsx

```tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/dashboard');
}
```

---

## ✅ Acceptance Criteria

- [ ] Sidebar displays all nav items
- [ ] Active item highlighted
- [ ] Collapsible sidebar works
- [ ] Collapsed shows icons with tooltips
- [ ] Header shows user info
- [ ] Dropdown menu works
- [ ] Breadcrumb shows current path
- [ ] Non-admin users redirected
- [ ] Responsive on mobile
- [ ] Logout works

---

## 🧪 Test Cases

```typescript
describe('AdminLayout', () => {
  it('redirects non-admin users', async () => {
    // Set user without admin role
    // Navigate to /admin
    // Verify redirect to /unauthorized
  });

  it('shows correct active nav item', async () => {
    // Navigate to /admin/users
    // Verify Users nav item active
  });

  it('collapses sidebar', async () => {
    // Click collapse button
    // Verify sidebar width changes
    // Verify tooltips appear
  });

  it('shows breadcrumb correctly', async () => {
    // Navigate to /admin/exams/questions
    // Verify breadcrumb: Admin > Đề thi > Câu hỏi
  });
});
```
