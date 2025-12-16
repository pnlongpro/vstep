"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  level: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  instructor: string;
  thumbnail: string;
  status: "in-progress" | "completed" | "not-started";
}

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const courses: Course[] = [
    {
      id: "1",
      title: "VSTEP B2 - Listening Skills",
      level: "B2",
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      instructor: "Nguyễn Văn A",
      thumbnail: "/courses/listening-b2.jpg",
      status: "in-progress",
    },
    {
      id: "2",
      title: "VSTEP B2 - Reading Comprehension",
      level: "B2",
      progress: 80,
      totalLessons: 15,
      completedLessons: 12,
      instructor: "Trần Thị B",
      thumbnail: "/courses/reading-b2.jpg",
      status: "in-progress",
    },
    {
      id: "3",
      title: "VSTEP B2 - Writing Mastery",
      level: "B2",
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      instructor: "Lê Văn C",
      thumbnail: "/courses/writing-b2.jpg",
      status: "in-progress",
    },
    {
      id: "4",
      title: "VSTEP A2 - Foundation Course",
      level: "A2",
      progress: 100,
      totalLessons: 25,
      completedLessons: 25,
      instructor: "Phạm Thị D",
      thumbnail: "/courses/foundation-a2.jpg",
      status: "completed",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return course.status === "in-progress";
    if (activeTab === "completed") return course.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tiến độ học tập
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({courses.length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang học ({courses.filter((c) => c.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn thành ({courses.filter((c) => c.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant={course.status === "completed" ? "default" : "secondary"}>
                      {course.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Giảng viên: {course.instructor}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {course.completedLessons}/{course.totalLessons} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{course.totalLessons * 45}p
                      </span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      {course.status === "completed" ? (
                        <>Xem lại khóa học</>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Tiếp tục học
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
