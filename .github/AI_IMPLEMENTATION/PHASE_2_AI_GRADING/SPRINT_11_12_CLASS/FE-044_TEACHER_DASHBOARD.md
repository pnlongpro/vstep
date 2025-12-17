# FE-044: Teacher Dashboard Layout

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-044 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-044 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `components/Sidebar.tsx` - ✅ Đã có sidebar (student theme)
> - `app/(dashboard)/layout.tsx` - ✅ Dashboard layout có sẵn

**Action:**
- ✅ CREATE `components/teacher/TeacherSidebar.tsx` - Purple theme
- ✅ CREATE `app/(teacher)/layout.tsx` - Teacher route group
- ✅ REUSE shadcn/ui components
- ❌ KHÔNG copy nguyên sidebar, chỉ extend với purple theme

---

## 🎯 Objective

Create Teacher Dashboard layout:
- Purple color theme (khác student blue)
- Sidebar với teacher-specific menu items
- Dashboard header với teacher info
- Responsive layout

---

## 📝 Implementation

### 1. app/(teacher)/layout.tsx

```tsx
import { TeacherSidebar } from '@/components/teacher/TeacherSidebar';
import { TeacherHeader } from '@/components/teacher/TeacherHeader';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 2. components/teacher/TeacherSidebar.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/auth.hooks';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'Lớp học',
    href: '/teacher/classes',
    icon: GraduationCap,
  },
  {
    title: 'Học viên',
    href: '/teacher/students',
    icon: Users,
  },
  {
    title: 'Bài tập',
    href: '/teacher/assignments',
    icon: ClipboardList,
  },
  {
    title: 'Tài liệu',
    href: '/teacher/materials',
    icon: FileText,
  },
  {
    title: 'Thống kê',
    href: '/teacher/analytics',
    icon: BarChart3,
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'flex flex-col bg-purple-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-purple-800">
        {!collapsed && (
          <Link href="/teacher" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-300" />
            <span className="font-bold text-xl">VSTEPRO</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-purple-300 hover:text-white hover:bg-purple-800"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Teacher Badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-purple-200">
            Giáo viên
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
                          pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-200 hover:bg-purple-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-purple-600">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-purple-700 text-white">
              {user?.name?.charAt(0) || 'T'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-purple-300 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="mt-4 space-y-1">
            <Link
              href="/teacher/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-800 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Cài đặt</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
```

### 3. components/teacher/TeacherHeader.tsx

```tsx
'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function TeacherHeader() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học viên, lớp học..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo mới
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/teacher/classes/new">Tạo lớp học</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/teacher/assignments/new">Tạo bài tập</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/teacher/materials/upload">Upload tài liệu</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </div>
    </header>
  );
}
```

### 4. app/(teacher)/page.tsx - Teacher Dashboard Home

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Giáo viên</h1>
        <p className="text-muted-foreground">
          Tổng quan về lớp học và học viên
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng lớp học</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12 tuần này</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bài cần chấm</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">8 từ hôm nay</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">+0.3 so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Bài nộp gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Add submission list */}
            <p className="text-muted-foreground text-sm">
              Các bài nộp cần chấm điểm sẽ hiển thị ở đây
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Lịch sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Add schedule list */}
            <p className="text-muted-foreground text-sm">
              Deadline bài tập và sự kiện sắp tới
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 5. Middleware Update

```typescript
// Update src/middleware.ts to handle teacher routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  // Teacher routes require teacher role
  if (pathname.startsWith('/teacher')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // TODO: Validate teacher role from token
  }

  // Student routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*', '/dashboard/:path*'],
};
```

---

## ✅ Acceptance Criteria

- [ ] Teacher layout renders correctly
- [ ] Purple theme applied to sidebar
- [ ] Menu items navigate correctly
- [ ] Responsive sidebar collapse works
- [ ] User info displays in sidebar
- [ ] Logout works
- [ ] Dashboard stats display
- [ ] Route protection works

---

## 🎨 Design Notes

### Color Palette (Purple Theme)
```css
--purple-50: #faf5ff;
--purple-100: #f3e8ff;
--purple-200: #e9d5ff;
--purple-300: #d8b4fe;
--purple-400: #c084fc;
--purple-500: #a855f7;
--purple-600: #9333ea;
--purple-700: #7c3aed;
--purple-800: #6b21a8;
--purple-900: #581c87;
```

### Sidebar Specs
- Width: 256px (expanded), 64px (collapsed)
- Background: purple-900
- Active item: purple-700
- Hover: purple-800
