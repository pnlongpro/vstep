"use client";

import { useSession } from "next-auth/react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LearningProgress } from "@/components/dashboard/learning-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Xin chào, {session?.user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Chào mừng bạn quay trở lại với VSTEPRO
        </p>
      </div>

      <DashboardStats />
      <QuickActions />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <LearningProgress />
        <RecentActivity />
      </div>
    </div>
  );
}
