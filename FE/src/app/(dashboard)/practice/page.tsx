"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const skills = [
  {
    id: "reading",
    name: "Reading",
    description: "Luyện đọc hiểu với các bài đọc chuẩn VSTEP",
    icon: "📖",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "listening",
    name: "Listening",
    description: "Luyện nghe với audio chuẩn giọng bản ngữ",
    icon: "🎧",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "writing",
    name: "Writing",
    description: "Luyện viết với AI chấm điểm tự động",
    icon: "✍️",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "speaking",
    name: "Speaking",
    description: "Luyện nói với AI phân tích phát âm",
    icon: "🎤",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Luyện tập</h1>
        <p className="text-muted-foreground">
          Chọn kỹ năng bạn muốn luyện tập
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-full ${skill.color} flex items-center justify-center text-2xl mb-4`}>
              {skill.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
            <p className="text-muted-foreground mb-4">{skill.description}</p>
            <Link href={`/practice/${skill.id}`}>
              <Button className="w-full">Bắt đầu luyện tập</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Practice Sessions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Phiên luyện tập gần đây</h2>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-center text-muted-foreground py-8">
            Chưa có phiên luyện tập nào. Hãy bắt đầu ngay!
          </p>
        </div>
      </div>
    </div>
  );
}
