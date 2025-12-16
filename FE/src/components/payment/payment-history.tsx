"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Chưa có giao dịch nào</p>
      </CardContent>
    </Card>
  );
}
