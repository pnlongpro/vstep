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
  Search,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  RefreshCw,
} from "lucide-react";

// Mock data
const transactionStats = [
  {
    title: "Tổng doanh thu",
    value: "₫245,680,000",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    trend: "+18% so với tháng trước",
  },
  {
    title: "Giao dịch thành công",
    value: "1,245",
    icon: CheckCircle,
    color: "from-blue-500 to-blue-600",
    trend: "98.5% tỷ lệ",
  },
  {
    title: "Đang chờ xử lý",
    value: "12",
    icon: Clock,
    color: "from-orange-500 to-orange-600",
    trend: "Cần kiểm tra",
  },
  {
    title: "Khách hàng mới",
    value: "156",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    trend: "+24% so với tháng trước",
  },
];

const transactions = [
  {
    id: "TXN-2024-001",
    userId: "user-001",
    userName: "Nguyễn Văn A",
    email: "nguyen.a@email.com",
    package: "Premium 6 tháng",
    amount: 990000,
    paymentMethod: "VNPay",
    status: "success",
    createdAt: "2024-01-15 14:30:00",
    vnpayRef: "VNP14123456",
  },
  {
    id: "TXN-2024-002",
    userId: "user-002",
    userName: "Trần Thị B",
    email: "tran.b@email.com",
    package: "Basic 1 tháng",
    amount: 199000,
    paymentMethod: "MoMo",
    status: "success",
    createdAt: "2024-01-15 13:45:00",
    vnpayRef: "MOMO-87654",
  },
  {
    id: "TXN-2024-003",
    userId: "user-003",
    userName: "Lê Văn C",
    email: "le.c@email.com",
    package: "VIP 12 tháng",
    amount: 1990000,
    paymentMethod: "Bank Transfer",
    status: "pending",
    createdAt: "2024-01-15 12:30:00",
    vnpayRef: null,
  },
  {
    id: "TXN-2024-004",
    userId: "user-004",
    userName: "Phạm Thị D",
    email: "pham.d@email.com",
    package: "Premium 6 tháng",
    amount: 990000,
    paymentMethod: "VNPay",
    status: "failed",
    createdAt: "2024-01-15 11:20:00",
    vnpayRef: "VNP14123457",
    error: "Insufficient balance",
  },
  {
    id: "TXN-2024-005",
    userId: "user-005",
    userName: "Hoàng Văn E",
    email: "hoang.e@email.com",
    package: "Premium 6 tháng",
    amount: 990000,
    paymentMethod: "VNPay",
    status: "success",
    createdAt: "2024-01-15 10:15:00",
    vnpayRef: "VNP14123458",
  },
  {
    id: "TXN-2024-006",
    userId: "user-006",
    userName: "Mai Thị F",
    email: "mai.f@email.com",
    package: "Basic 3 tháng",
    amount: 499000,
    paymentMethod: "MoMo",
    status: "success",
    createdAt: "2024-01-15 09:30:00",
    vnpayRef: "MOMO-87655",
  },
  {
    id: "TXN-2024-007",
    userId: "user-007",
    userName: "Đặng Văn G",
    email: "dang.g@email.com",
    package: "VIP 12 tháng",
    amount: 1990000,
    paymentMethod: "Bank Transfer",
    status: "refunded",
    createdAt: "2024-01-14 16:45:00",
    vnpayRef: null,
    refundReason: "Yêu cầu hoàn tiền trong 7 ngày",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="size-3 mr-1" />
          Thành công
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="size-3 mr-1" />
          Chờ xử lý
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="size-3 mr-1" />
          Thất bại
        </Badge>
      );
    case "refunded":
      return (
        <Badge className="bg-purple-100 text-purple-800">
          <RefreshCw className="size-3 mr-1" />
          Hoàn tiền
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "VNPay":
      return <CreditCard className="size-4 text-blue-500" />;
    case "MoMo":
      return <Wallet className="size-4 text-pink-500" />;
    case "Bank Transfer":
      return <DollarSign className="size-4 text-green-500" />;
    default:
      return <CreditCard className="size-4" />;
  }
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
    const matchesPayment =
      filterPaymentMethod === "all" ||
      txn.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate totals
  const totalRevenue = filteredTransactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý giao dịch</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý thanh toán từ người dùng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transactionStats.map((stat, index) => {
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
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
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
                  placeholder="Tìm kiếm theo ID, tên, email..."
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
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterPaymentMethod}
              onValueChange={setFilterPaymentMethod}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="VNPay">VNPay</SelectItem>
                <SelectItem value="MoMo">MoMo</SelectItem>
                <SelectItem value="Bank Transfer">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày</SelectItem>
                <SelectItem value="month">30 ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách giao dịch</span>
            <Badge variant="secondary">
              Tổng: {formatCurrency(totalRevenue)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Giao dịch</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm font-medium">{txn.id}</p>
                      {txn.vnpayRef && (
                        <p className="text-xs text-muted-foreground">
                          Ref: {txn.vnpayRef}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{txn.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.package}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {formatCurrency(txn.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(txn.paymentMethod)}
                      <span className="text-sm">{txn.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {getStatusBadge(txn.status)}
                      {txn.error && (
                        <p className="text-xs text-red-500 mt-1">{txn.error}</p>
                      )}
                      {txn.refundReason && (
                        <p className="text-xs text-purple-500 mt-1">
                          {txn.refundReason}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {txn.createdAt}
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Theo gói</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "25%" }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Premium</span>
                <span className="font-medium">55%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "55%" }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VIP</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "20%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Theo phương thức</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-blue-500" />
                  <span>VNPay</span>
                </div>
                <span className="font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-pink-500" />
                  <span>MoMo</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-green-500" />
                  <span>Chuyển khoản</span>
                </div>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tỷ lệ giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500" />
                  <span>Thành công</span>
                </div>
                <span className="font-medium text-green-600">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-yellow-500" />
                  <span>Chờ xử lý</span>
                </div>
                <span className="font-medium text-yellow-600">0.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="size-4 text-red-500" />
                  <span>Thất bại</span>
                </div>
                <span className="font-medium text-red-600">1.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
