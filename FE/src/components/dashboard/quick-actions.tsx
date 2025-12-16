"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Target, Trophy } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: "Bắt đầu luyện tập",
      description: "Luyện tập các kỹ năng VSTEP",
      icon: BookOpen,
      href: "/practice",
      color: "text-blue-600",
    },
    {
      title: "Làm đề thi thử",
      description: "Thực hành với đề thi mô phỏng",
      icon: FileText,
      href: "/exams",
      color: "text-green-600",
    },
    {
      title: "Xem mục tiêu",
      description: "Theo dõi và cập nhật mục tiêu",
      icon: Target,
      href: "/goals",
      color: "text-orange-600",
    },
    {
      title: "Thành tựu",
      description: "Xem huy hiệu và thành tích",
      icon: Trophy,
      href: "/achievements",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Card key={action.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-secondary`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {action.description}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={action.href}>Bắt đầu</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
