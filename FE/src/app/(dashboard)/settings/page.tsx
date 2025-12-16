"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Globe, Palette } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    classReminders: true,
    gradeNotifications: true,
    
    // Preferences
    language: "vi",
    theme: "light",
    timezone: "Asia/Ho_Chi_Minh",
    
    // Privacy
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
  });

  const handleSave = () => {
    // TODO: Implement save settings
    toast.success("Cài đặt đã được lưu!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Tùy chỉnh
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin hồ sơ và email của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleSave}>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Chọn loại thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email thông báo</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo đẩy</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo đẩy trên trình duyệt
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở bài tập</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận nhắc nhở về bài tập sắp đến hạn
                  </p>
                </div>
                <Switch
                  checked={settings.assignmentReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, assignmentReminders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở lịch học</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận nhắc nhở trước buổi học 30 phút
                  </p>
                </div>
                <Switch
                  checked={settings.classReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, classReminders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo điểm số</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi có điểm mới
                  </p>
                </div>
                <Switch
                  checked={settings.gradeNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, gradeNotifications: checked })
                  }
                />
              </div>
              <Button onClick={handleSave}>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preference Settings */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chỉnh giao diện</CardTitle>
              <CardDescription>
                Điều chỉnh ngôn ngữ, giao diện và múi giờ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    setSettings({ ...settings, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Giao diện</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) =>
                    setSettings({ ...settings, theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Múi giờ</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) =>
                    setSettings({ ...settings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Ho_Chi_Minh">
                      GMT+7 (Hà Nội, Bangkok)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">GMT+9 (Tokyo)</SelectItem>
                    <SelectItem value="America/New_York">
                      GMT-5 (New York)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave}>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật & Quyền riêng tư</CardTitle>
              <CardDescription>
                Quản lý quyền riêng tư và bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Hiển thị hồ sơ</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) =>
                    setSettings({ ...settings, profileVisibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Công khai</SelectItem>
                    <SelectItem value="friends">Bạn bè</SelectItem>
                    <SelectItem value="private">Riêng tư</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hiển thị tiến độ học tập</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác xem tiến độ của bạn
                  </p>
                </div>
                <Switch
                  checked={settings.showProgress}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showProgress: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hiển thị thành tựu</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác xem huy hiệu của bạn
                  </p>
                </div>
                <Switch
                  checked={settings.showAchievements}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showAchievements: checked })
                  }
                />
              </div>
              <Button onClick={handleSave}>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
