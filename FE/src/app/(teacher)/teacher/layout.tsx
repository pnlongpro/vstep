"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuth } from "@/features/auth/auth.hooks";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";

function TeacherHeader() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const userName = user ? `${user.firstName} ${user.lastName}` : "";
  const userInitial = user?.firstName?.charAt(0) || "T";

  return (
    <header className="bg-[#0F2A44] border-b border-[#1a3d5c]/50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8FA9C7]" />
          <Input
            type="search"
            placeholder="Tìm kiếm học sinh, lớp học..."
            className="pl-10 bg-[#1a3d5c]/50 border-[#1a3d5c] text-[#E6F0FF] placeholder:text-[#8FA9C7] focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-[#8FA9C7] hover:text-white hover:bg-[#1a3d5c]/50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#1a3d5c]/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[#E6F0FF]">{userName}</p>
                <p className="text-xs text-[#8FA9C7]">Giáo viên</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#0F2A44] border-[#1a3d5c]">
            <DropdownMenuLabel className="text-[#E6F0FF]">Tài khoản Giáo viên</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1a3d5c]" />
            <DropdownMenuItem asChild className="text-[#E6F0FF] focus:bg-[#1a3d5c]/50 focus:text-white">
              <Link href="/profile">
                <Settings className="mr-2 h-4 w-4" />
                Hồ sơ cá nhân
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1a3d5c]" />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-400 focus:bg-red-500/20 focus:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, user, checkAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1628]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-[#8FA9C7]">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  // Check teacher or admin role
  const userRole = user?.role?.name?.toLowerCase();
  if (userRole !== "teacher" && userRole !== "admin") {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <TeacherSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="lg:ml-64">
        <TeacherHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
