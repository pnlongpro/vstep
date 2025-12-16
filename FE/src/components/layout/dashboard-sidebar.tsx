"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Target,
  Trophy,
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  GraduationCap,
  Brain,
  Database,
  MessageSquare,
  FolderOpen,
  UserCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

const studentNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/home",
    icon: LayoutDashboard,
  },
  {
    title: "Khóa học của tôi",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Luyện tập",
    href: "/practice",
    icon: Target,
  },
  {
    title: "Đề thi thử",
    href: "/exams",
    icon: FileText,
  },
  {
    title: "Kết quả",
    href: "/results",
    icon: BarChart3,
  },
  {
    title: "Thành tựu",
    href: "/achievements",
    icon: Trophy,
  },
  {
    title: "Lịch học",
    href: "/schedule",
    icon: Calendar,
  },
];

const teacherNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lớp học của tôi",
    href: "/teacher/classes",
    icon: Users,
  },
  {
    title: "Chấm bài",
    href: "/teacher/grading",
    icon: ClipboardList,
  },
  {
    title: "Bài tập",
    href: "/teacher/assignments",
    icon: FileText,
  },
  {
    title: "Tài liệu",
    href: "/teacher/materials",
    icon: FolderOpen,
  },
  {
    title: "Điểm danh",
    href: "/teacher/attendance",
    icon: UserCheck,
  },
  {
    title: "Tin nhắn",
    href: "/teacher/messages",
    icon: MessageSquare,
  },
  {
    title: "Thống kê",
    href: "/teacher/statistics",
    icon: Activity,
  },
];

const adminNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Quản lý giáo viên",
    href: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    title: "Quản lý lớp học",
    href: "/admin/classes",
    icon: Users,
  },
  {
    title: "Ngân hàng đề thi",
    href: "/admin/exams",
    icon: FileText,
  },
  {
    title: "Ngân hàng câu hỏi",
    href: "/admin/questions",
    icon: Database,
  },
  {
    title: "Chấm điểm AI",
    href: "/admin/ai-grading",
    icon: Brain,
  },
  {
    title: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  // Determine navigation items based on user role
  const getNavItems = () => {
    const role = (session?.user as any)?.role;
    if (role === "admin") return adminNav;
    if (role === "teacher") return teacherNav;
    return studentNav;
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/home" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">VSTEPRO</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
