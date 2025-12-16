"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

interface ClassSession {
  id: string;
  title: string;
  teacher: string;
  startTime: Date;
  endTime: Date;
  type: "online" | "offline";
  location: string;
  students: number;
  status: "upcoming" | "ongoing" | "completed";
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");

  const sessions: ClassSession[] = [
    {
      id: "1",
      title: "VSTEP B2 - Evening Class",
      teacher: "Nguyễn Văn A",
      startTime: new Date(2024, 11, 15, 19, 0),
      endTime: new Date(2024, 11, 15, 21, 0),
      type: "online",
      location: "Zoom Meeting",
      students: 28,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Speaking Practice Session",
      teacher: "Trần Thị B",
      startTime: new Date(2024, 11, 16, 18, 0),
      endTime: new Date(2024, 11, 16, 19, 30),
      type: "online",
      location: "Google Meet",
      students: 15,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Writing Workshop",
      teacher: "Lê Văn C",
      startTime: new Date(2024, 11, 17, 14, 0),
      endTime: new Date(2024, 11, 17, 16, 0),
      type: "offline",
      location: "Phòng 301, Tầng 3",
      students: 20,
      status: "upcoming",
    },
    {
      id: "4",
      title: "Mock Test Review",
      teacher: "Phạm Thị D",
      startTime: new Date(2024, 11, 18, 20, 0),
      endTime: new Date(2024, 11, 18, 21, 30),
      type: "online",
      location: "Zoom Meeting",
      students: 25,
      status: "upcoming",
    },
  ];

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => isSameDay(session.startTime, date));
  };

  const getStatusColor = (status: ClassSession["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch học</h1>
          <p className="text-muted-foreground">
            Xem lịch học và buổi học sắp tới
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            onClick={() => setViewMode("day")}
          >
            Ngày
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
          >
            Tuần
          </Button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Buổi học sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions
              .filter((s) => s.status === "upcoming")
              .slice(0, 3)
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold">
                      {format(session.startTime, "dd", { locale: vi })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(session.startTime, "MMM", { locale: vi })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Giảng viên: {session.teacher}
                        </p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status === "upcoming" && "Sắp diễn ra"}
                        {session.status === "ongoing" && "Đang diễn ra"}
                        {session.status === "completed" && "Đã kết thúc"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(session.startTime, "HH:mm")} -{" "}
                        {format(session.endTime, "HH:mm")}
                      </div>
                      <div className="flex items-center gap-1">
                        {session.type === "online" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {session.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.students} học viên
                      </div>
                    </div>
                  </div>

                  <Button variant="default">
                    {session.type === "online" ? "Tham gia" : "Xem chi tiết"}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="grid gap-4 md:grid-cols-7">
          {getWeekDays().map((day, index) => {
            const daySessions = getSessionsForDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <Card key={index} className={isToday ? "border-primary" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-center">
                    <div className="font-normal text-muted-foreground">
                      {format(day, "EEE", { locale: vi })}
                    </div>
                    <div className={`text-2xl ${isToday ? "text-primary" : ""}`}>
                      {format(day, "dd")}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {daySessions.length > 0 ? (
                    daySessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-2 bg-secondary rounded text-xs"
                      >
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="text-muted-foreground">
                          {format(session.startTime, "HH:mm")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-4">
                      Không có lịch học
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
