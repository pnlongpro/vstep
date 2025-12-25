'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

// Types
export interface RealtimeNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionType?: 'NAVIGATE' | 'MODAL' | 'EXTERNAL';
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface UseRealtimeNotificationsOptions {
  /**
   * Auto connect when hook is mounted
   * @default true
   */
  autoConnect?: boolean;
  /**
   * Reconnection attempts
   * @default 3
   */
  reconnectionAttempts?: number;
  /**
   * Called when a new notification arrives
   */
  onNotification?: (notification: RealtimeNotification) => void;
  /**
   * Called when unread count changes
   */
  onUnreadCountChange?: (count: number) => void;
  /**
   * Called when connection status changes
   */
  onConnectionChange?: (connected: boolean) => void;
}

interface UseRealtimeNotificationsReturn {
  /** Current WebSocket connection status */
  isConnected: boolean;
  /** Unread notification count (real-time updated) */
  unreadCount: number;
  /** Latest notifications received via WebSocket */
  notifications: RealtimeNotification[];
  /** Manually connect to WebSocket */
  connect: () => void;
  /** Manually disconnect from WebSocket */
  disconnect: () => void;
  /** Mark a notification as read (emits to server) */
  markAsRead: (notificationId: string) => void;
  /** Mark all notifications as read */
  markAllAsRead: () => void;
  /** Clear local notifications list */
  clearNotifications: () => void;
}

const getSocketUrl = () => {
  // Use WS URL if provided, otherwise derive from API URL
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Convert http(s) to ws(s) if needed, but socket.io can handle http
  return apiUrl;
};

/**
 * Hook for real-time notifications via WebSocket
 * 
 * Use alongside useNotifications (React Query) for best results:
 * - useRealtimeNotifications: Real-time push updates
 * - useNotifications: Initial data fetch and REST operations
 * 
 * @example
 * ```tsx
 * const { isConnected, unreadCount, notifications } = useRealtimeNotifications({
 *   onNotification: (notification) => {
 *     toast.info(notification.title);
 *   },
 * });
 * ```
 */
export function useRealtimeNotifications(
  options: UseRealtimeNotificationsOptions = {}
): UseRealtimeNotificationsReturn {
  const {
    autoConnect = true,
    reconnectionAttempts = 3,
    onNotification,
    onUnreadCountChange,
    onConnectionChange,
  } = options;

  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  // Store callbacks in refs to avoid reconnecting on callback changes
  const onNotificationRef = useRef(onNotification);
  const onUnreadCountChangeRef = useRef(onUnreadCountChange);
  const onConnectionChangeRef = useRef(onConnectionChange);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    onUnreadCountChangeRef.current = onUnreadCountChange;
  }, [onUnreadCountChange]);

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
  }, [onConnectionChange]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!token || !isAuthenticated) {
      console.warn('[WS Notifications] Cannot connect: Not authenticated');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('[WS Notifications] Already connected');
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socketUrl = getSocketUrl();
    console.log('[WS Notifications] Connecting to:', socketUrl);

    const socket = io(`${socketUrl}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('[WS Notifications] Connected:', socket.id);
      setIsConnected(true);
      onConnectionChangeRef.current?.(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS Notifications] Disconnected:', reason);
      setIsConnected(false);
      onConnectionChangeRef.current?.(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WS Notifications] Connection error:', error.message);
      setIsConnected(false);
      onConnectionChangeRef.current?.(false);
    });

    // Server events
    socket.on('connected', (data: { userId: string; message: string }) => {
      console.log('[WS Notifications] Server confirmed:', data.message);
    });

    socket.on('notification', (notification: RealtimeNotification) => {
      console.log('[WS Notifications] New notification:', notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep max 50
      onNotificationRef.current?.(notification);
    });

    socket.on('unreadCount', (data: { count: number }) => {
      console.log('[WS Notifications] Unread count:', data.count);
      setUnreadCount(data.count);
      onUnreadCountChangeRef.current?.(data.count);
    });

    socket.on('error', (error: { message: string }) => {
      console.error('[WS Notifications] Server error:', error.message);
    });

    // Pong for heartbeat
    socket.on('pong', () => {
      // Heartbeat received
    });

    socketRef.current = socket;
  }, [token, isAuthenticated, reconnectionAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('[WS Notifications] Disconnecting...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('notificationRead', { notificationId });
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('allNotificationsRead');
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  }, []);

  // Clear local notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto connect/disconnect based on auth state
  useEffect(() => {
    if (autoConnect && isAuthenticated && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, token, connect, disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      socketRef.current?.emit('ping');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    isConnected,
    unreadCount,
    notifications,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}

export default useRealtimeNotifications;
