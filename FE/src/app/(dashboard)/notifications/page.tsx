"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, Clock, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Notification {
  id: string;
  type: "assignment" | "grade" | "achievement" | "system" | "class";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "assignment",
      title: "Bài tập mới",
      message: "Giáo viên đã giao bài tập Reading Week 2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionUrl: "/assignments/123",
    },
    {
      id: "2",
      type: "grade",
      title: "Điểm mới",
      message: "Bài Writing của bạn đã được chấm: 8.5/10",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      actionUrl: "/results/456",
    },
    {
      id: "3",
      type: "achievement",
      title: "Thành tựu mới",
      message: "Chúc mừng! Bạn đã mở khóa huy hiệu '7 Day Streak'",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/achievements",
    },
    {
      id: "4",
      type: "class",
      title: "Lịch học sắp tới",
      message: "Lớp VSTEP B2 - Evening Class bắt đầu lúc 19:00 hôm nay",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/schedule",
    },
    {
      id: "5",
      type: "system",
      title: "Bảo trì hệ thống",
      message: "Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày 16/12",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "grade":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "achievement":
        return <Badge className="h-5 w-5 text-yellow-600" />;
      case "class":
        return <Bell className="h-5 w-5 text-purple-600" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.read;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thông báo</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : "Bạn đã đọc hết thông báo"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Chưa đọc ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="assignment">Bài tập</TabsTrigger>
          <TabsTrigger value="grade">Điểm số</TabsTrigger>
          <TabsTrigger value="achievement">Thành tựu</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không có thông báo nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-secondary"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">
                              Mới
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </p>
                          {notification.actionUrl && (
                            <Button variant="link" size="sm" asChild>
                              <a href={notification.actionUrl}>Xem chi tiết →</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
