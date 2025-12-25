"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  FileText,
  Mic,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// Mock data
const aiStats = [
  {
    title: "Tổng request",
    value: "45,230",
    icon: Brain,
    color: "from-blue-500 to-blue-600",
    trend: "+12%",
  },
  {
    title: "Thành công",
    value: "44,850",
    icon: CheckCircle,
    color: "from-green-500 to-green-600",
    trend: "99.2%",
  },
  {
    title: "Thất bại",
    value: "380",
    icon: XCircle,
    color: "from-red-500 to-red-600",
    trend: "0.8%",
  },
  {
    title: "Thời gian TB",
    value: "2.3s",
    icon: Clock,
    color: "from-purple-500 to-purple-600",
    trend: "-0.2s",
  },
];

const writingLogs = [
  {
    id: "W001",
    userId: "user-001",
    userName: "Nguyễn Văn A",
    examId: "exam-b2-01",
    taskType: "Task 2",
    wordCount: 285,
    score: 7.5,
    processingTime: 2.1,
    status: "success",
    createdAt: "2024-01-15 14:30:00",
  },
  {
    id: "W002",
    userId: "user-002",
    userName: "Trần Thị B",
    examId: "exam-b1-02",
    taskType: "Task 1",
    wordCount: 165,
    score: 6.0,
    processingTime: 1.8,
    status: "success",
    createdAt: "2024-01-15 14:25:00",
  },
  {
    id: "W003",
    userId: "user-003",
    userName: "Lê Văn C",
    examId: "exam-c1-01",
    taskType: "Task 2",
    wordCount: 320,
    score: null,
    processingTime: 5.2,
    status: "failed",
    error: "Model timeout",
    createdAt: "2024-01-15 14:20:00",
  },
  {
    id: "W004",
    userId: "user-004",
    userName: "Phạm Thị D",
    examId: "exam-b2-03",
    taskType: "Task 2",
    wordCount: 245,
    score: 7.0,
    processingTime: 2.4,
    status: "success",
    createdAt: "2024-01-15 14:15:00",
  },
];

const speakingLogs = [
  {
    id: "S001",
    userId: "user-001",
    userName: "Nguyễn Văn A",
    examId: "exam-b2-01",
    part: "Part 2",
    duration: "90s",
    score: 7.0,
    processingTime: 3.5,
    status: "success",
    createdAt: "2024-01-15 15:30:00",
  },
  {
    id: "S002",
    userId: "user-005",
    userName: "Hoàng Văn E",
    examId: "exam-b1-05",
    part: "Part 3",
    duration: "180s",
    score: 6.5,
    processingTime: 4.2,
    status: "success",
    createdAt: "2024-01-15 15:25:00",
  },
  {
    id: "S003",
    userId: "user-006",
    userName: "Mai Thị F",
    examId: "exam-c1-02",
    part: "Part 1",
    duration: "60s",
    score: null,
    processingTime: 8.5,
    status: "failed",
    error: "Audio quality too low",
    createdAt: "2024-01-15 15:20:00",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="size-3 mr-1" />
          Thành công
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="size-3 mr-1" />
          Thất bại
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Clock className="size-3 mr-1" />
          Đang xử lý
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function AILogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Grading Logs</h1>
          <p className="text-muted-foreground">
            Theo dõi hoạt động chấm điểm của hệ thống AI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Xuất logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm opacity-80 mt-1 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      {stat.trend}
                    </p>
                  </div>
                  <Icon className="size-12 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo ID, user, exam..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày</SelectItem>
                <SelectItem value="month">30 ngày</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="writing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="writing" className="gap-2">
            <FileText className="size-4" />
            Writing Logs
          </TabsTrigger>
          <TabsTrigger value="speaking" className="gap-2">
            <Mic className="size-4" />
            Speaking Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="writing">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Bài thi</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Số từ</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Thời gian xử lý</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời điểm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {writingLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.userId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.examId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.taskType}</Badge>
                      </TableCell>
                      <TableCell>{log.wordCount}</TableCell>
                      <TableCell>
                        {log.score !== null ? (
                          <span className="font-semibold text-green-600">
                            {log.score}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{log.processingTime}s</TableCell>
                      <TableCell>
                        <div>
                          {getStatusBadge(log.status)}
                          {log.error && (
                            <p className="text-xs text-red-500 mt-1">
                              {log.error}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speaking">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Bài thi</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead>Thời lượng</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Thời gian xử lý</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời điểm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {speakingLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.userId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.examId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.part}</Badge>
                      </TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>
                        {log.score !== null ? (
                          <span className="font-semibold text-green-600">
                            {log.score}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{log.processingTime}s</TableCell>
                      <TableCell>
                        <div>
                          {getStatusBadge(log.status)}
                          {log.error && (
                            <p className="text-xs text-red-500 mt-1">
                              {log.error}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5 text-red-500" />
            Lỗi gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="size-5 text-red-500" />
                <div>
                  <p className="font-medium">Model timeout</p>
                  <p className="text-sm text-muted-foreground">
                    Writing Task - W003
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">14:20:00</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="size-5 text-red-500" />
                <div>
                  <p className="font-medium">Audio quality too low</p>
                  <p className="text-sm text-muted-foreground">
                    Speaking Part 1 - S003
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">15:20:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
