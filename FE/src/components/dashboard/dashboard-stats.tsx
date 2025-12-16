"use client";

import { TrendingUp, TrendingDown, Users, BookOpen, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stat {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
}

export function DashboardStats() {
  const stats: Stat[] = [
    {
      title: "Bài tập đã hoàn thành",
      value: 156,
      change: 12,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Điểm trung bình",
      value: "7.8/10",
      change: 0.3,
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Chuỗi học liên tục",
      value: "7 ngày",
      change: 2,
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Huy hiệu đạt được",
      value: 12,
      change: 2,
      icon: Trophy,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {isPositive ? "+" : ""}{stat.change}
                </span>
                <span>so với tuần trước</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
