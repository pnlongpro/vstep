import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../auth/auth.store";

let socket: Socket | null = null;

export function useSocket() {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!socket && accessToken) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000", {
        auth: {
          token: accessToken,
        },
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [accessToken]);

  return socket;
}

export function emitMessage(event: string, data: any) {
  socket?.emit(event, data);
}

export function onMessage(event: string, callback: (data: any) => void) {
  socket?.on(event, callback);
  return () => {
    socket?.off(event, callback);
  };
}
