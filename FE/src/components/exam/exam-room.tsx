"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExamRoomProps {
  examId: string;
}

export function ExamRoom({ examId }: ExamRoomProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phòng thi - Exam ID: {examId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Đang tải phòng thi...</p>
      </CardContent>
    </Card>
  );
}
