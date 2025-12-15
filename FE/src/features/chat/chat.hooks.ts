import { useQuery, useMutation, useQueryClient } from "@tantml:react-query";
import { chatApi } from "./chat.api";
import { SendMessageRequest } from "./chat.types";
import { useSocket, onMessage } from "./chat.socket";
import { useEffect } from "react";

export function useChatRooms() {
  return useQuery({
    queryKey: ["chat-rooms"],
    queryFn: () => chatApi.getRooms(),
  });
}

export function useChatMessages(roomId: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (socket && roomId) {
      const cleanup = onMessage("new_message", (message) => {
        if (message.roomId === roomId) {
          queryClient.setQueryData(["chat-messages", roomId], (old: any) => {
            return [...(old || []), message];
          });
        }
      });

      return cleanup;
    }
  }, [socket, roomId, queryClient]);

  return useQuery({
    queryKey: ["chat-messages", roomId],
    queryFn: () => chatApi.getMessages(roomId),
    enabled: !!roomId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: SendMessageRequest;
    }) => chatApi.sendMessage(roomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
  });
}
