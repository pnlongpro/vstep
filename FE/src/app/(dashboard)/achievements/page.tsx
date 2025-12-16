"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Flame, Star, Award, Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  requirement: string;
  category: "practice" | "exam" | "streak" | "special";
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: Date;
  status: "active" | "completed" | "expired";
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("badges");

  const badges: Badge[] = [
    {
      id: "1",
      name: "Người mới bắt đầu",
      description: "Hoàn thành bài luyện tập đầu tiên",
      icon: Star,
      unlocked: true,
      unlockedAt: new Date(2024, 10, 1),
      requirement: "Hoàn thành 1 bài luyện tập",
      category: "practice",
    },
    {
      id: "2",
      name: "Chuỗi 7 ngày",
      description: "Học liên tục 7 ngày",
      icon: Flame,
      unlocked: true,
      unlockedAt: new Date(2024, 11, 13),
      requirement: "Học liên tục 7 ngày",
      category: "streak",
    },
    {
      id: "3",
      name: "Reading Master",
      description: "Đạt điểm 9.0+ trong Reading",
      icon: Award,
      unlocked: false,
      progress: 85,
      requirement: "Đạt điểm 9.0 trong Reading",
      category: "exam",
    },
    {
      id: "4",
      name: "100 bài luyện tập",
      description: "Hoàn thành 100 bài luyện tập",
      icon: Trophy,
      unlocked: false,
      progress: 65,
      requirement: "Hoàn thành 100 bài luyện tập (65/100)",
      category: "practice",
    },
    {
      id: "5",
      name: "Chuỗi 30 ngày",
      description: "Học liên tục 30 ngày",
      icon: Flame,
      unlocked: false,
      progress: 23,
      requirement: "Học liên tục 30 ngày (7/30)",
      category: "streak",
    },
    {
      id: "6",
      name: "VSTEP Master",
      description: "Đạt điểm 8.0+ tất cả kỹ năng",
      icon: Trophy,
      unlocked: false,
      progress: 50,
      requirement: "Đạt 8.0+ trong tất cả 4 kỹ năng",
      category: "special",
    },
  ];

  const goals: Goal[] = [
    {
      id: "1",
      title: "Đạt VSTEP B2",
      description: "Đạt điểm 5.0+ trong kỳ thi VSTEP",
      progress: 70,
      target: 100,
      deadline: new Date(2025, 2, 30),
      status: "active",
    },
    {
      id: "2",
      title: "Hoàn thành 50 bài Reading",
      description: "Luyện tập Reading mỗi ngày",
      progress: 35,
      target: 50,
      deadline: new Date(2025, 0, 31),
      status: "active",
    },
    {
      id: "3",
      title: "Cải thiện Speaking",
      description: "Tăng điểm Speaking lên 7.0",
      progress: 65,
      target: 100,
      deadline: new Date(2025, 1, 15),
      status: "active",
    },
  ];

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thành tựu & Mục tiêu</h1>
        <p className="text-muted-foreground">
          Theo dõi tiến trình và đạt được những thành tựu
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Huy hiệu đã đạt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedBadges.length}/{badges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mục tiêu đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter((g) => g.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Chuỗi học hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 ngày 🔥</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="badges">Huy hiệu</TabsTrigger>
          <TabsTrigger value="goals">Mục tiêu</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {/* Unlocked Badges */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Đã mở khóa ({unlockedBadges.length})</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {unlockedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card key={badge.id} className="text-center">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <Icon className="h-8 w-8 text-yellow-600" />
                      </div>
                      <CardTitle className="text-base">{badge.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {badge.unlockedAt && (
                        <p className="text-xs text-muted-foreground">
                          Mở khóa: {badge.unlockedAt.toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Chưa mở khóa ({lockedBadges.length})</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {lockedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card key={badge.id} className="text-center opacity-60">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 relative">
                        <Icon className="h-8 w-8 text-gray-400" />
                        <Lock className="absolute top-0 right-0 h-4 w-4 text-gray-600" />
                      </div>
                      <CardTitle className="text-base">{badge.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {badge.description}
                      </p>
                      {badge.progress && (
                        <div className="space-y-1">
                          <Progress value={badge.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {badge.requirement}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                  </div>
                  <Badge variant={goal.status === "active" ? "default" : "secondary"}>
                    {goal.status === "active" ? "Đang hoạt động" : "Hoàn thành"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Hạn chót: {goal.deadline.toLocaleDateString("vi-VN")}</span>
                  <span>{goal.progress}/{goal.target}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
