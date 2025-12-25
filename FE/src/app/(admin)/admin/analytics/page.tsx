"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Brain,
  Calendar,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

// Mock analytics data
const overviewStats = [
  {
    title: "Tổng người dùng",
    value: "12,450",
    change: "+18%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Doanh thu tháng",
    value: "₫245,680,000",
    change: "+24%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Bài thi hoàn thành",
    value: "8,520",
    change: "+12%",
    trend: "up",
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "AI Requests",
    value: "45,230",
    change: "-2%",
    trend: "down",
    icon: Brain,
    color: "from-orange-500 to-orange-600",
  },
];

const userGrowthData = [
  { month: "T1", newUsers: 450, activeUsers: 2500 },
  { month: "T2", newUsers: 520, activeUsers: 2800 },
  { month: "T3", newUsers: 680, activeUsers: 3200 },
  { month: "T4", newUsers: 750, activeUsers: 3600 },
  { month: "T5", newUsers: 890, activeUsers: 4100 },
  { month: "T6", newUsers: 1020, activeUsers: 4800 },
  { month: "T7", newUsers: 1150, activeUsers: 5400 },
  { month: "T8", newUsers: 1280, activeUsers: 6100 },
  { month: "T9", newUsers: 1420, activeUsers: 6900 },
  { month: "T10", newUsers: 1580, activeUsers: 7800 },
  { month: "T11", newUsers: 1750, activeUsers: 8800 },
  { month: "T12", newUsers: 1920, activeUsers: 9900 },
];

const revenueData = [
  { month: "T1", revenue: 85000000, subscriptions: 320 },
  { month: "T2", revenue: 92000000, subscriptions: 380 },
  { month: "T3", revenue: 108000000, subscriptions: 420 },
  { month: "T4", revenue: 125000000, subscriptions: 485 },
  { month: "T5", revenue: 142000000, subscriptions: 550 },
  { month: "T6", revenue: 168000000, subscriptions: 620 },
  { month: "T7", revenue: 185000000, subscriptions: 695 },
  { month: "T8", revenue: 198000000, subscriptions: 760 },
  { month: "T9", revenue: 215000000, subscriptions: 830 },
  { month: "T10", revenue: 228000000, subscriptions: 890 },
  { month: "T11", revenue: 238000000, subscriptions: 945 },
  { month: "T12", revenue: 245680000, subscriptions: 1020 },
];

const skillDistribution = [
  { skill: "Reading", percentage: 35, count: 4340 },
  { skill: "Listening", percentage: 30, count: 3726 },
  { skill: "Writing", percentage: 20, count: 2484 },
  { skill: "Speaking", percentage: 15, count: 1863 },
];

const levelDistribution = [
  { level: "A2", percentage: 15, count: 1868, color: "bg-green-500" },
  { level: "B1", percentage: 35, count: 4358, color: "bg-blue-500" },
  { level: "B2", percentage: 40, count: 4980, color: "bg-purple-500" },
  { level: "C1", percentage: 10, count: 1245, color: "bg-red-500" },
];

const topExams = [
  { name: "VSTEP B2 - Đề 01", attempts: 1520, avgScore: 7.2 },
  { name: "VSTEP B1 - Đề 03", attempts: 1380, avgScore: 6.8 },
  { name: "VSTEP B2 - Đề 05", attempts: 1250, avgScore: 7.0 },
  { name: "VSTEP C1 - Đề 02", attempts: 890, avgScore: 6.5 },
  { name: "VSTEP A2 - Đề 01", attempts: 760, avgScore: 7.5 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
  }).format(amount);
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Phân tích và thống kê hoạt động hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="size-4 mr-2" />
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày</SelectItem>
              <SelectItem value="month">30 ngày</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      )}
                      {stat.change} so với tháng trước
                    </p>
                  </div>
                  <Icon className="size-12 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="size-4" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="size-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="exams" className="gap-2">
            <BookOpen className="size-4" />
            Bài thi
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Brain className="size-4" />
            AI Performance
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="size-5" />
                  Tăng trưởng người dùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="size-12 mx-auto mb-2 opacity-50" />
                    <p>Chart Component</p>
                    <p className="text-sm">Tích hợp Recharts/Chart.js</p>
                  </div>
                </div>
                {/* Simple data display */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Người dùng mới (tháng này)
                    </p>
                    <p className="text-2xl font-bold text-blue-600">1,920</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Active users
                    </p>
                    <p className="text-2xl font-bold text-green-600">9,900</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="size-5" />
                  Phân bố Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levelDistribution.map((level, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${level.color} text-white`}
                          >
                            {level.level}
                          </Badge>
                          <span className="text-muted-foreground">
                            {level.count.toLocaleString()} users
                          </span>
                        </div>
                        <span className="font-medium">{level.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${level.color} h-3 rounded-full transition-all`}
                          style={{ width: `${level.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Doanh thu theo tháng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="size-12 mx-auto mb-2 opacity-50" />
                    <p>Revenue Chart</p>
                    <p className="text-sm">Tích hợp Recharts/Chart.js</p>
                  </div>
                </div>
                {/* Monthly data table */}
                <div className="mt-4 overflow-x-auto">
                  <div className="flex gap-2">
                    {revenueData.slice(-6).map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 min-w-[80px] p-2 bg-gray-50 rounded-lg text-center"
                      >
                        <p className="text-xs text-muted-foreground">
                          {item.month}
                        </p>
                        <p className="font-semibold text-sm">
                          {formatCurrency(item.revenue)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Tổng năm nay</p>
                  <p className="text-xl font-bold text-green-600">
                    ₫1,985,680,000
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3" />
                    +45% so với năm trước
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Subscriptions
                  </p>
                  <p className="text-xl font-bold text-blue-600">1,020</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3" />
                    +35% so với năm trước
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">ARPU</p>
                  <p className="text-xl font-bold text-purple-600">₫240,000</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3" />
                    +8% so với năm trước
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Skill Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5" />
                  Phân bố kỹ năng luyện tập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillDistribution.map((skill, index) => {
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                    ];
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <span className="text-muted-foreground">
                            {skill.count.toLocaleString()} lượt ({skill.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${colors[index]} h-3 rounded-full transition-all`}
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  Đề thi phổ biến nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topExams.map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.attempts.toLocaleString()} lượt thi
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        TB: {exam.avgScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Performance Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng requests
                    </p>
                    <p className="text-2xl font-bold">45,230</p>
                  </div>
                  <Brain className="size-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Thời gian TB
                    </p>
                    <p className="text-2xl font-bold">2.3s</p>
                  </div>
                  <Activity className="size-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tỷ lệ thành công
                    </p>
                    <p className="text-2xl font-bold">99.2%</p>
                  </div>
                  <Target className="size-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Điểm TB Writing
                    </p>
                    <p className="text-2xl font-bold">6.8</p>
                  </div>
                  <TrendingUp className="size-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* AI Processing Time */}
            <Card>
              <CardHeader>
                <CardTitle>Thời gian xử lý AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Writing Scoring</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "60%" }}
                        />
                      </div>
                      <span className="font-medium">2.1s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Speaking Scoring</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "80%" }}
                        />
                      </div>
                      <span className="font-medium">3.5s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Grammar Check</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: "40%" }}
                        />
                      </div>
                      <span className="font-medium">0.8s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Feedback Generation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: "50%" }}
                        />
                      </div>
                      <span className="font-medium">1.2s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Error Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ lỗi theo loại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span>Model timeout</span>
                    <Badge className="bg-red-100 text-red-800">0.4%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span>Audio quality issues</span>
                    <Badge className="bg-orange-100 text-orange-800">0.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span>Input validation errors</span>
                    <Badge className="bg-yellow-100 text-yellow-800">0.15%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Other errors</span>
                    <Badge className="bg-gray-100 text-gray-800">0.05%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
