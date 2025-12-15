"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExamRoom } from "@/components/exam/exam-room";

export default function ExamDetailPage({
  params,
}: {
  params: { examId: string };
}) {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-card p-8 rounded-lg border">
          <h1 className="text-3xl font-bold mb-4">VSTEP B2 - Đề số 1</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Cấp độ:</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                B2
              </span>
            </div>
            <div>
              <span className="font-semibold">Thời gian:</span> 150 phút
            </div>
            <div>
              <span className="font-semibold">Số câu hỏi:</span> 100 câu
            </div>
            <div>
              <span className="font-semibold">Kỹ năng:</span> Reading, Listening,
              Writing, Speaking
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">⚠️ Lưu ý quan trọng:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Đề thi sẽ được auto-save mỗi 10 giây</li>
              <li>• Không được thoát ra giữa chừng</li>
              <li>• Bạn cần hoàn thành tất cả 4 kỹ năng</li>
              <li>• Kết quả sẽ được chấm tự động sau khi nộp bài</li>
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setIsStarted(true)}
          >
            Bắt đầu làm bài
          </Button>
        </div>
      </div>
    );
  }

  return <ExamRoom examId={params.examId} />;
}
