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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  Plus,
  MoreVertical,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Upload,
  Book,
  Headphones,
  PenTool,
  Mic,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Tổng đề thi",
    value: "342",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Đã xuất bản",
    value: "287",
    icon: CheckCircle,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Bản nháp",
    value: "43",
    icon: Clock,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Chờ duyệt",
    value: "12",
    icon: ClipboardCheck,
    color: "from-purple-500 to-purple-600",
  },
];

const readingExams = [
  {
    id: "R001",
    title: "Reading Test 01 - Climate Change",
    level: "B1",
    questions: 40,
    duration: 60,
    createdBy: "TS. Nguyễn Văn A",
    updated: "2024-12-10",
    status: "published",
    attempts: 145,
  },
  {
    id: "R002",
    title: "Reading Test 02 - Technology Impact",
    level: "B2",
    questions: 40,
    duration: 60,
    createdBy: "ThS. Trần Thị B",
    updated: "2024-12-09",
    status: "published",
    attempts: 128,
  },
  {
    id: "R003",
    title: "Reading Test 03 - Education System",
    level: "B1",
    questions: 40,
    duration: 60,
    createdBy: "TS. Lê Văn C",
    updated: "2024-12-08",
    status: "draft",
    attempts: 0,
  },
];

const listeningExams = [
  {
    id: "L001",
    title: "Listening Test 01 - Daily Conversations",
    level: "B1",
    questions: 35,
    duration: 40,
    createdBy: "TS. Nguyễn Văn A",
    updated: "2024-12-10",
    status: "published",
    attempts: 167,
  },
  {
    id: "L002",
    title: "Listening Test 02 - Academic Lectures",
    level: "B2",
    questions: 35,
    duration: 40,
    createdBy: "ThS. Trần Thị B",
    updated: "2024-12-09",
    status: "published",
    attempts: 143,
  },
];

const writingExams = [
  {
    id: "W001",
    title: "Writing Test 01 - Email + Essay",
    level: "B2",
    tasks: 2,
    duration: 60,
    createdBy: "TS. Nguyễn Văn A",
    updated: "2024-12-10",
    status: "published",
    attempts: 98,
  },
  {
    id: "W002",
    title: "Writing Test 02 - Letter + Essay",
    level: "B1",
    tasks: 2,
    duration: 60,
    createdBy: "ThS. Trần Thị B",
    updated: "2024-12-09",
    status: "published",
    attempts: 87,
  },
];

const speakingExams = [
  {
    id: "S001",
    title: "Speaking Test 01 - Personal + Topic",
    level: "B1",
    parts: 3,
    duration: 12,
    createdBy: "TS. Nguyễn Văn A",
    updated: "2024-12-10",
    status: "published",
    attempts: 134,
  },
  {
    id: "S002",
    title: "Speaking Test 02 - Interview + Discussion",
    level: "B2",
    parts: 3,
    duration: 12,
    createdBy: "ThS. Trần Thị B",
    updated: "2024-12-09",
    status: "published",
    attempts: 109,
  },
];

const pendingApprovals = [
  {
    id: "P001",
    title: "Writing Test - Business Communication",
    skill: "writing",
    level: "B2",
    submittedBy: "Uploader 01",
    submittedAt: "2024-12-18",
  },
  {
    id: "P002",
    title: "Listening Test - News Reports",
    skill: "listening",
    level: "C1",
    submittedBy: "Uploader 02",
    submittedAt: "2024-12-17",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>;
    case "draft":
      return <Badge className="bg-orange-100 text-orange-800">Bản nháp</Badge>;
    case "pending":
      return <Badge className="bg-purple-100 text-purple-800">Chờ duyệt</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getLevelBadge = (level: string) => {
  const colors: Record<string, string> = {
    A2: "bg-green-100 text-green-800",
    B1: "bg-blue-100 text-blue-800",
    B2: "bg-purple-100 text-purple-800",
    C1: "bg-red-100 text-red-800",
  };
  return <Badge className={colors[level] || "bg-gray-100"}>{level}</Badge>;
};

export default function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const skillTabs = [
    {
      id: "approvals",
      name: "Chờ duyệt",
      icon: ClipboardCheck,
      count: pendingApprovals.length,
    },
    { id: "reading", name: "Reading", icon: Book, count: readingExams.length },
    {
      id: "listening",
      name: "Listening",
      icon: Headphones,
      count: listeningExams.length,
    },
    { id: "writing", name: "Writing", icon: PenTool, count: writingExams.length },
    { id: "speaking", name: "Speaking", icon: Mic, count: speakingExams.length },
  ];

  const getExamsByTab = () => {
    switch (activeTab) {
      case "reading":
        return readingExams;
      case "listening":
        return listeningExams;
      case "writing":
        return writingExams;
      case "speaking":
        return speakingExams;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ngân hàng đề thi</h1>
          <p className="text-muted-foreground">
            Quản lý kho đề thi theo từng kỹ năng riêng biệt
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="size-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="size-4 mr-2" />
            Tạo đề thi mới
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              📋 Cơ chế Random Đề Thi
            </h3>
            <p className="text-sm opacity-90">
              Bài thi thử sẽ <strong>tự động random</strong> đề từ từng kỹ năng
              riêng biệt. Mỗi lần thi, hệ thống sẽ chọn ngẫu nhiên 1 đề từ mỗi
              kỹ năng. Không theo bộ 4 kỹ năng cố định → Đảm bảo đa dạng và công
              bằng!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
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
                  </div>
                  <Icon className="size-12 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skill Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              {skillTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50"
                  >
                    <Icon className="size-4" />
                    {tab.name}
                    <Badge variant="secondary" className="ml-1">
                      {tab.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Đề thi chờ duyệt</h3>
              {pendingApprovals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Không có đề thi nào chờ duyệt
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((exam) => (
                    <Card key={exam.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                exam.skill === "reading"
                                  ? "bg-blue-100"
                                  : exam.skill === "listening"
                                  ? "bg-green-100"
                                  : exam.skill === "writing"
                                  ? "bg-purple-100"
                                  : "bg-orange-100"
                              }`}
                            >
                              {exam.skill === "reading" && (
                                <Book className="size-6 text-blue-600" />
                              )}
                              {exam.skill === "listening" && (
                                <Headphones className="size-6 text-green-600" />
                              )}
                              {exam.skill === "writing" && (
                                <PenTool className="size-6 text-purple-600" />
                              )}
                              {exam.skill === "speaking" && (
                                <Mic className="size-6 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{exam.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Bởi: {exam.submittedBy}</span>
                                <span>•</span>
                                <span>{exam.submittedAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getLevelBadge(exam.level)}
                            <Button variant="outline" size="sm">
                              <Eye className="size-4 mr-2" />
                              Xem
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp className="size-4 mr-2" />
                              Duyệt
                            </Button>
                            <Button size="sm" variant="destructive">
                              <ThumbsDown className="size-4 mr-2" />
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skill Content Tabs */}
          {["reading", "listening", "writing", "speaking"].map((skill) => (
            <TabsContent key={skill} value={skill} className="p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm đề thi..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exams Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Người tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Lượt làm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getExamsByTab().map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-mono">{exam.id}</TableCell>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{getLevelBadge(exam.level)}</TableCell>
                      <TableCell>{exam.duration} phút</TableCell>
                      <TableCell>{exam.createdBy}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell>{exam.attempts}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="size-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="size-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {exam.status === "draft" ? (
                              <DropdownMenuItem>
                                <CheckCircle className="size-4 mr-2" />
                                Xuất bản
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <XCircle className="size-4 mr-2" />
                                Ẩn
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="size-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="size-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
