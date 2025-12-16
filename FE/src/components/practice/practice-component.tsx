"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PracticeComponentProps {
  sessionId: string;
}

export function PracticeComponent({ sessionId }: PracticeComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Luyện tập - Session ID: {sessionId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Đang tải bài luyện tập...</p>
      </CardContent>
    </Card>
  );
}
