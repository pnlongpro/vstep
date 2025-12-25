'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Globe, Bell, Shield, Database, Palette, Mail, CreditCard, Brain, Save, RefreshCw, AlertTriangle } from 'lucide-react';

const generalSettings = [
  {
    key: 'site_name',
    label: 'Tên website',
    description: 'Tên hiển thị của website',
    value: 'VSTEPRO',
    type: 'text',
  },
  {
    key: 'site_description',
    label: 'Mô tả website',
    description: 'Mô tả ngắn về website',
    value: 'Nền tảng luyện thi VSTEP với AI',
    type: 'text',
  },
  {
    key: 'maintenance_mode',
    label: 'Chế độ bảo trì',
    description: 'Bật để đưa site vào chế độ bảo trì',
    value: false,
    type: 'boolean',
  },
  {
    key: 'registration_enabled',
    label: 'Cho phép đăng ký',
    description: 'Bật/tắt chức năng đăng ký tài khoản mới',
    value: true,
    type: 'boolean',
  },
];

const examSettings = [
  {
    key: 'max_mock_tests_per_day',
    label: 'Số bài thi thử/ngày (Free)',
    description: 'Giới hạn số bài thi thử cho user miễn phí mỗi ngày',
    value: 3,
    type: 'number',
  },
  {
    key: 'max_mock_tests_premium',
    label: 'Số bài thi thử/ngày (Premium)',
    description: 'Giới hạn cho user Premium',
    value: 10,
    type: 'number',
  },
  {
    key: 'auto_save_interval',
    label: 'Auto-save interval (giây)',
    description: 'Thời gian tự động lưu bài làm',
    value: 10,
    type: 'number',
  },
  {
    key: 'allow_resume_exam',
    label: 'Cho phép tiếp tục bài thi',
    description: 'Cho phép user tiếp tục bài thi bị gián đoạn',
    value: true,
    type: 'boolean',
  },
];

const aiSettings = [
  {
    key: 'ai_grading_enabled',
    label: 'Bật AI Grading',
    description: 'Cho phép chấm bài tự động bằng AI',
    value: true,
    type: 'boolean',
  },
  {
    key: 'ai_monthly_budget',
    label: 'Ngân sách AI/tháng ($)',
    description: 'Giới hạn chi phí AI hàng tháng',
    value: 500,
    type: 'number',
  },
  {
    key: 'ai_writing_model',
    label: 'AI Model cho Writing',
    description: 'Model AI sử dụng cho chấm Writing',
    value: 'gpt-4',
    type: 'select',
    options: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    key: 'ai_speaking_enabled',
    label: 'Bật AI Speaking',
    description: 'Cho phép chấm Speaking bằng AI (Whisper)',
    value: true,
    type: 'boolean',
  },
];

const notificationSettings = [
  {
    key: 'email_notifications',
    label: 'Gửi email thông báo',
    description: 'Gửi email cho các sự kiện quan trọng',
    value: true,
    type: 'boolean',
  },
  {
    key: 'push_notifications',
    label: 'Push notifications',
    description: 'Gửi push notification cho mobile/web',
    value: true,
    type: 'boolean',
  },
  {
    key: 'admin_alert_email',
    label: 'Email nhận cảnh báo',
    description: 'Email admin nhận thông báo hệ thống',
    value: 'admin@vstepro.com',
    type: 'text',
  },
];

const securitySettings = [
  {
    key: 'session_timeout',
    label: 'Session timeout (phút)',
    description: 'Thời gian tự động đăng xuất khi không hoạt động',
    value: 60,
    type: 'number',
  },
  {
    key: 'max_login_attempts',
    label: 'Số lần đăng nhập sai tối đa',
    description: 'Khóa tài khoản sau số lần sai này',
    value: 5,
    type: 'number',
  },
  {
    key: 'two_factor_required',
    label: 'Yêu cầu 2FA cho Admin',
    description: 'Bắt buộc xác thực 2 yếu tố cho admin',
    value: false,
    type: 'boolean',
  },
  {
    key: 'device_limit',
    label: 'Giới hạn thiết bị',
    description: 'Số thiết bị tối đa được đăng nhập đồng thời',
    value: 3,
    type: 'number',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const renderSettingInput = (setting: (typeof generalSettings)[0]) => {
    switch (setting.type) {
      case 'boolean':
        return <Switch defaultChecked={setting.value as boolean} onCheckedChange={() => setHasChanges(true)} />;
      case 'number':
        return <Input type="number" defaultValue={setting.value as number} className="w-[150px]" onChange={() => setHasChanges(true)} />;
      case 'select':
        return (
          <Select defaultValue={setting.value as string} onValueChange={() => setHasChanges(true)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(setting as any).options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input type="text" defaultValue={setting.value as string} className="w-[300px]" onChange={() => setHasChanges(true)} />;
    }
  };

  const renderSettings = (settings: typeof generalSettings) => (
    <div className="space-y-6">
      {settings.map((setting, index) => (
        <div key={setting.key}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">{setting.label}</label>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            {renderSettingInput(setting)}
          </div>
          {index < settings.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: Settings },
    { id: 'exam', label: 'Đề thi', icon: Database },
    { id: 'ai', label: 'AI & Chấm điểm', icon: Brain },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Quản lý cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <AlertTriangle className="size-3 mr-1" />
              Có thay đổi chưa lưu
            </Badge>
          )}
          <Button variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Reset
          </Button>
          <Button disabled={!hasChanges}>
            <Save className="size-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <Card className="w-[250px] h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tabs.find((t) => t.id === activeTab)?.icon &&
                (() => {
                  const Icon = tabs.find((t) => t.id === activeTab)!.icon;
                  return <Icon className="size-5" />;
                })()}
              {tabs.find((t) => t.id === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === 'general' && renderSettings(generalSettings)}
            {activeTab === 'exam' && renderSettings(examSettings)}
            {activeTab === 'ai' && renderSettings(aiSettings)}
            {activeTab === 'notifications' && renderSettings(notificationSettings)}
            {activeTab === 'security' && renderSettings(securitySettings)}
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Vùng nguy hiểm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Xóa tất cả dữ liệu cache</p>
              <p className="text-sm text-muted-foreground">Xóa cache sẽ làm chậm website tạm thời</p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600">
              Xóa cache
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reset toàn bộ cài đặt</p>
              <p className="text-sm text-muted-foreground">Khôi phục tất cả cài đặt về mặc định</p>
            </div>
            <Button variant="destructive">Reset cài đặt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
