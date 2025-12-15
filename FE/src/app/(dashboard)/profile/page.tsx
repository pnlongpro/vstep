"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                {session?.user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
                <p className="text-muted-foreground">{session?.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ""}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="level">Trình độ hiện tại</Label>
                <Input id="level" defaultValue="B1" disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="target">Mục tiêu</Label>
                <Input id="target" defaultValue="B2" disabled={!isEditing} />
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={() => {
                      setIsEditing(false);
                      toast.success("Cập nhật thành công!");
                    }}>
                      Lưu thay đổi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="password">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current">Mật khẩu hiện tại</Label>
                <Input id="current" type="password" />
              </div>
              <div>
                <Label htmlFor="new">Mật khẩu mới</Label>
                <Input id="new" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                <Input id="confirm" type="password" />
              </div>
              <Button>Đổi mật khẩu</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Tùy chọn</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo email</p>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email
                  </p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo push</p>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo đẩy
                  </p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
