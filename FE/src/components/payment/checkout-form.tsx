"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CheckoutForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Chọn phương thức thanh toán</p>
          <Button>Thanh toán</Button>
        </div>
      </CardContent>
    </Card>
  );
}
