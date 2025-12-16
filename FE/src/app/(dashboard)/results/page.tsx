"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Download, BarChart3 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Result {
  id: string;
  type: "practice" | "exam" | "assignment";
  title: string;
  skill: string;
  score: number;
  maxScore: number;
  date: Date;
  status: "graded" | "pending" | "in-progress";
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const results: Result[] = [
    {
      id: "1",
      type: "exam",
      title: "Mock Test B2 - Full Test",
      skill: "All Skills",
      score: 7.5,
      maxScore: 10,
      date: new Date(2024, 11, 10),
      status: "graded",
    },
    {
      id: "2",
      type: "practice",
      title: "Reading Full Test",
      skill: "Reading",
      score: 8.5,
      maxScore: 10,
      date: new Date(2024, 11, 14),
      status: "graded",
    },
    {
      id: "3",
      type: "assignment",
      title: "Writing Task 1 - Letter",
      skill: "Writing",
      score: 0,
      maxScore: 10,
      date: new Date(2024, 11, 15),
      status: "pending",
    },
    {
      id: "4",
      type: "practice",
      title: "Listening Part 1 Practice",
      skill: "Listening",
      score: 7.0,
      maxScore: 10,
      date: new Date(2024, 11, 13),
      status: "graded",
    },
    {
      id: "5",
      type: "exam",
      title: "Mock Test B2 - Listening Only",
      skill: "Listening",
      score: 8.0,
      maxScore: 10,
      date: new Date(2024, 11, 8),
      status: "graded",
    },
  ];

  const filteredResults = results.filter((result) => {
    if (activeTab === "all") return true;
    if (activeTab === "practice") return result.type === "practice";
    if (activeTab === "exam") return result.type === "exam";
    if (activeTab === "assignment") return result.type === "assignment";
    return true;
  });

  const getStatusBadge = (status: Result["status"]) => {
    switch (status) {
      case "graded":
        return <Badge variant="default">Đã chấm</Badge>;
      case "pending":
        return <Badge variant="secondary">Chờ chấm</Badge>;
      case "in-progress":
        return <Badge variant="outline">Đang làm</Badge>;
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateAverage = (type?: string) => {
    const filtered = type
      ? results.filter((r) => r.type === type && r.status === "graded")
      : results.filter((r) => r.status === "graded");
    
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, r) => acc + r.score, 0);
    return (sum / filtered.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kết quả học tập</h1>
        <p className="text-muted-foreground">
          Xem lại điểm số và phân tích chi tiết
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB tổng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage()}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bài tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage("practice")}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đề thi thử</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage("exam")}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bài</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({results.length})</TabsTrigger>
          <TabsTrigger value="practice">
            Luyện tập ({results.filter((r) => r.type === "practice").length})
          </TabsTrigger>
          <TabsTrigger value="exam">
            Đề thi ({results.filter((r) => r.type === "exam").length})
          </TabsTrigger>
          <TabsTrigger value="assignment">
            Bài tập ({results.filter((r) => r.type === "assignment").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách kết quả</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài thi/Bài tập</TableHead>
                    <TableHead>Kỹ năng</TableHead>
                    <TableHead>Ngày làm</TableHead>
                    <TableHead>Điểm số</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.title}</TableCell>
                      <TableCell>{result.skill}</TableCell>
                      <TableCell>
                        {format(result.date, "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        {result.status === "graded" ? (
                          <span className={`font-bold ${getScoreColor(result.score, result.maxScore)}`}>
                            {result.score}/{result.maxScore}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/results/${result.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Link>
                          </Button>
                          {result.status === "graded" && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Tải
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
