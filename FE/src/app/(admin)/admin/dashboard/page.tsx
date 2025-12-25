"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  TrendingUp,
  Brain,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Tổng học viên",
      value: "15,234",
      change: "+234",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Giáo viên",
      value: "156",
      change: "+12",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Khóa học",
      value: "45",
      change: "+3",
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      title: "Đề thi",
      value: "342",
      change: "+18",
      icon: FileText,
      color: "text-purple-600",
    },
  ];

  const systemAlerts = [
    {
      id: "1",
      type: "warning",
      message: "12 bài chấm AI cần duyệt",
      action: "Xem ngay",
      href: "/admin/ai-grading",
    },
    {
      id: "2",
      type: "info",
      message: "5 đề thi mới chờ phê duyệt",
      action: "Xem ngay",
      href: "/admin/exams/pending",
    },
    {
      id: "3",
      type: "success",
      message: "Backup hệ thống thành công (14/12/2024)",
      action: "Chi tiết",
      href: "/admin/settings/backup",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      user: "Nguyễn Văn A (Teacher)",
      action: "Tạo đề thi mới: VSTEP B2 Mock Test #45",
      time: "5 phút trước",
    },
    {
      id: "2",
      user: "Trần Thị B (Student)",
      action: "Hoàn thành khóa học: VSTEP B1 Foundation",
      time: "30 phút trước",
    },
    {
      id: "3",
      user: "Lê Văn C (Teacher)",
      action: "Upload tài liệu mới: Reading Strategies",
      time: "1 giờ trước",
    },
  ];

  const performanceMetrics = [
    { label: "Tỷ lệ hoàn thành khóa học", value: "78.5%", trend: "+2.3%" },
    { label: "Điểm trung bình hệ thống", value: "7.6/10", trend: "+0.4" },
    { label: "Độ hài lòng người dùng", value: "4.5/5", trend: "+0.2" },
    { label: "Tỷ lệ giữ chân học viên", value: "85.2%", trend: "+3.1%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống VSTEPRO</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> so với tháng trước
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Thông báo hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {alert.type === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  {alert.type === "info" && <Brain className="h-5 w-5 text-blue-600" />}
                  {alert.type === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={alert.href}>{alert.action}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hiệu suất hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {metric.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="border-b pb-3 last:border-0">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/activity-log">Xem tất cả</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-24" asChild>
              <Link href="/admin/users">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Quản lý người dùng</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-24" asChild>
              <Link href="/admin/exams">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Ngân hàng đề thi</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-24" asChild>
              <Link href="/admin/ai-grading">
                <div className="flex flex-col items-center gap-2">
                  <Brain className="h-6 w-6" />
                  <span className="text-sm">Chấm điểm AI</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-24" asChild>
              <Link href="/admin/analytics">
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Thống kê & Báo cáo</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Tình trạng hệ thống
            </div>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Cpu className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Bình thường</Badge>
              </div>
              <p className="text-sm text-muted-foreground">CPU</p>
              <p className="text-xl font-bold">23%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Bình thường</Badge>
              </div>
              <p className="text-sm text-muted-foreground">RAM</p>
              <p className="text-xl font-bold">45%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <HardDrive className="h-5 w-5 text-yellow-600" />
                <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Disk</p>
              <p className="text-xl font-bold">78%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Ổn định</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-xl font-bold">99.9%</p>
              <p className="text-xs text-muted-foreground mt-2">45 ngày liên tục</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold mt-1">₫12,450,000</p>
                <p className="text-sm mt-2 flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  +18% so với hôm qua
                </p>
              </div>
              <DollarSign className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Người dùng mới hôm nay</p>
                <p className="text-2xl font-bold mt-1">156</p>
                <p className="text-sm mt-2 flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  +24% so với hôm qua
                </p>
              </div>
              <Users className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Bài thi hoàn thành hôm nay</p>
                <p className="text-2xl font-bold mt-1">428</p>
                <p className="text-sm mt-2 flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  +12% so với hôm qua
                </p>
              </div>
              <BookOpen className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
