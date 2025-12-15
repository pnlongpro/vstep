import { apiClient } from "@/lib/axios";
import { ChatMessage, ChatRoom, SendMessageRequest } from "./chat.types";

export const chatApi = {
  async getRooms(): Promise<ChatRoom[]> {
    const response = await apiClient.get("/chat/rooms");
    return response.data;
  },

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(`/chat/rooms/${roomId}/messages`);
    return response.data;
  },

  async sendMessage(roomId: string, data: SendMessageRequest): Promise<ChatMessage> {
    const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, data);
    return response.data;
  },

  async createRoom(userId: string): Promise<ChatRoom> {
    const response = await apiClient.post("/chat/rooms", { userId });
    return response.data;
  },
};
