"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockExams = [
  {
    id: "1",
    title: "VSTEP B2 - Đề số 1",
    level: "B2",
    duration: 150,
    questions: 100,
    status: "available",
  },
  {
    id: "2",
    title: "VSTEP B1 - Đề số 5",
    level: "B1",
    duration: 150,
    questions: 100,
    status: "available",
  },
  {
    id: "3",
    title: "VSTEP C1 - Đề số 3",
    level: "C1",
    duration: 150,
    questions: 100,
    status: "completed",
  },
];

export default function ExamsPage() {
  const [level, setLevel] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredExams = mockExams.filter((exam) => {
    if (level !== "all" && exam.level !== level) return false;
    if (search && !exam.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Đề thi</h1>
        <p className="text-muted-foreground">
          Danh sách các đề thi VSTEP đầy đủ 4 kỹ năng
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm đề thi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Cấp độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exam List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-card p-6 rounded-lg border">
            <div className="mb-4">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {exam.level}
              </span>
              {exam.status === "completed" && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Đã hoàn thành
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
            <div className="text-sm text-muted-foreground space-y-1 mb-4">
              <p>⏱️ {exam.duration} phút</p>
              <p>📝 {exam.questions} câu hỏi</p>
            </div>
            <Link href={`/exams/${exam.id}`}>
              <Button className="w-full">
                {exam.status === "completed" ? "Xem kết quả" : "Bắt đầu thi"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
