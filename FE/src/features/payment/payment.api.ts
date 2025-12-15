import { apiClient } from "@/lib/axios";
import {
  PaymentMethod,
  CheckoutRequest,
  CheckoutResponse,
  Transaction,
  Subscription,
} from "./payment.types";

export const paymentApi = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get("/payment/methods");
    return response.data;
  },

  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await apiClient.post("/payment/checkout", data);
    return response.data;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get("/payment/transactions");
    return response.data;
  },

  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get("/payment/subscription");
    return response.data;
  },

  async cancelSubscription(): Promise<void> {
    await apiClient.post("/payment/subscription/cancel");
  },
};
