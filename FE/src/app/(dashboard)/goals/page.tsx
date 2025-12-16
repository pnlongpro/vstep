"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Plus, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "skill" | "exam" | "practice" | "custom";
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: "active" | "completed" | "expired";
  createdAt: Date;
}

export default function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Đạt VSTEP B2",
      description: "Đạt điểm 5.0+ trong kỳ thi VSTEP",
      category: "exam",
      target: 100,
      current: 70,
      unit: "%",
      deadline: new Date(2025, 2, 30),
      status: "active",
      createdAt: new Date(2024, 10, 1),
    },
    {
      id: "2",
      title: "Hoàn thành 50 bài Reading",
      description: "Luyện tập Reading mỗi ngày",
      category: "practice",
      target: 50,
      current: 35,
      unit: "bài",
      deadline: new Date(2025, 0, 31),
      status: "active",
      createdAt: new Date(2024, 10, 15),
    },
    {
      id: "3",
      title: "Cải thiện Speaking",
      description: "Tăng điểm Speaking lên 7.0",
      category: "skill",
      target: 100,
      current: 65,
      unit: "%",
      deadline: new Date(2025, 1, 15),
      status: "active",
      createdAt: new Date(2024, 11, 1),
    },
    {
      id: "4",
      title: "Học liên tục 30 ngày",
      description: "Duy trì streak 30 ngày",
      category: "custom",
      target: 30,
      current: 30,
      unit: "ngày",
      deadline: new Date(2024, 11, 10),
      status: "completed",
      createdAt: new Date(2024, 10, 10),
    },
  ]);

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const getCategoryColor = (category: Goal["category"]) => {
    switch (category) {
      case "skill":
        return "bg-blue-100 text-blue-700";
      case "exam":
        return "bg-green-100 text-green-700";
      case "practice":
        return "bg-orange-100 text-orange-700";
      case "custom":
        return "bg-purple-100 text-purple-700";
    }
  };

  const getCategoryLabel = (category: Goal["category"]) => {
    switch (category) {
      case "skill":
        return "Kỹ năng";
      case "exam":
        return "Thi cử";
      case "practice":
        return "Luyện tập";
      case "custom":
        return "Tùy chỉnh";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mục tiêu học tập</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý mục tiêu của bạn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo mục tiêu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo mục tiêu mới</DialogTitle>
              <DialogDescription>
                Đặt mục tiêu học tập và theo dõi tiến độ
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" placeholder="VD: Đạt VSTEP B2" />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết mục tiêu..."
                />
              </div>
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skill">Kỹ năng</SelectItem>
                    <SelectItem value="exam">Thi cử</SelectItem>
                    <SelectItem value="practice">Luyện tập</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target">Mục tiêu</Label>
                  <Input id="target" type="number" placeholder="100" />
                </div>
                <div>
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Input id="unit" placeholder="%, bài, điểm..." />
                </div>
              </div>
              <div>
                <Label htmlFor="deadline">Hạn chót</Label>
                <Input id="deadline" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Tạo mục tiêu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mục tiêu đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Đã hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tỷ lệ hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0
                ? Math.round((completedGoals.length / goals.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mục tiêu đang hoạt động ({activeGoals.length})</h2>
        {activeGoals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = Math.ceil(
            (goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <Badge className={getCategoryColor(goal.category)}>
                    {getCategoryLabel(goal.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium">
                      {goal.current}/{goal.target} {goal.unit} ({Math.round(progress)}%)
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Hạn chót: {format(goal.deadline, "dd/MM/yyyy", { locale: vi })}
                    </span>
                  </div>
                  <Badge variant={daysLeft < 7 ? "destructive" : "outline"}>
                    {daysLeft > 0
                      ? `Còn ${daysLeft} ngày`
                      : `Quá hạn ${Math.abs(daysLeft)} ngày`}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Đã hoàn thành ({completedGoals.length})</h2>
          {completedGoals.map((goal) => (
            <Card key={goal.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      {goal.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Hoàn thành
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Đạt được: {format(goal.deadline, "dd/MM/yyyy", { locale: vi })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
