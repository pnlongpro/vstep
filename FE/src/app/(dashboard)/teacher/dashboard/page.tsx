"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  const stats = [
    {
      title: "Tổng học viên",
      value: "156",
      change: "+12",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Lớp học đang dạy",
      value: "5",
      change: "+1",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Bài chờ chấm",
      value: "23",
      change: "+5",
      icon: ClipboardList,
      color: "text-orange-600",
    },
    {
      title: "Điểm TB lớp",
      value: "7.8/10",
      change: "+0.3",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const pendingTasks = [
    {
      id: "1",
      student: "Nguyễn Văn A",
      assignment: "Writing Task 1",
      skill: "Writing",
      submittedAt: "2 giờ trước",
      urgent: true,
    },
    {
      id: "2",
      student: "Trần Thị B",
      assignment: "Speaking Part 2",
      skill: "Speaking",
      submittedAt: "5 giờ trước",
      urgent: true,
    },
    {
      id: "3",
      student: "Lê Văn C",
      assignment: "Reading Comprehension",
      skill: "Reading",
      submittedAt: "1 ngày trước",
      urgent: false,
    },
  ];

  const upcomingClasses = [
    {
      id: "1",
      name: "VSTEP B2 - Evening Class",
      time: "Hôm nay, 19:00 - 21:00",
      students: 28,
      location: "Zoom",
    },
    {
      id: "2",
      name: "VSTEP B1 - Morning Class",
      time: "Ngày mai, 09:00 - 11:00",
      students: 25,
      location: "Phòng 301",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Giáo viên</h1>
        <p className="text-muted-foreground">Chào mừng trở lại!</p>
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
                  <span className="text-green-600">{stat.change}</span> so với tuần trước
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Grading */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bài chờ chấm</CardTitle>
              <Badge variant="destructive">{pendingTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{task.student}</p>
                    <p className="text-sm text-muted-foreground">{task.assignment}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.skill}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.submittedAt}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/teacher/grading/${task.id}`}>Chấm</Link>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/teacher/grading">Xem tất cả ({pendingTasks.length})</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch dạy sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">{cls.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cls.students} học viên • {cls.location}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/teacher/classes/${cls.id}`}>Chi tiết</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/teacher/classes">Xem tất cả lớp học</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20" asChild>
              <Link href="/teacher/assignments/create">
                <div className="flex flex-col items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  <span className="text-sm">Tạo bài tập</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <Link href="/teacher/attendance">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Điểm danh</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <Link href="/teacher/materials">
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Tài liệu</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <Link href="/teacher/statistics">
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Thống kê</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
