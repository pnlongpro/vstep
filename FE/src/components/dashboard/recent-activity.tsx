"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Trophy, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Activity {
  id: string;
  type: "practice" | "exam" | "achievement" | "assignment";
  title: string;
  description: string;
  timestamp: Date;
  score?: number;
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "practice",
      title: "Hoàn thành Reading Full Test",
      description: "Điểm: 8.5/10",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      score: 8.5,
    },
    {
      id: "2",
      type: "assignment",
      title: "Nộp bài Listening Assignment",
      description: "Đang chờ chấm điểm",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: "3",
      type: "achievement",
      title: "Mở khóa huy hiệu '7 Day Streak'!",
      description: "Chúc mừng bạn đã học liên tục 7 ngày",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      type: "exam",
      title: "Hoàn thành Mock Test B2",
      description: "Điểm: 7.5/10",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      score: 7.5,
    },
  ];

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "practice":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "exam":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case "assignment":
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                    locale: vi,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
