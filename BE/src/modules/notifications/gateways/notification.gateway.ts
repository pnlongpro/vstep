import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000', process.env.FRONTEND_URL],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  
  // Map userId -> Set of socket ids (user có thể có nhiều tabs/devices)
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('🔌 Notification WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = this.extractToken(client);
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Attach user info to socket
      client.userId = payload.sub || payload.id;
      client.user = payload;

      // Add socket to user's socket set
      if (!this.userSockets.has(client.userId)) {
        this.userSockets.set(client.userId, new Set());
      }
      this.userSockets.get(client.userId)!.add(client.id);

      // Join user-specific room
      client.join(`user:${client.userId}`);

      this.logger.log(`✅ User ${client.userId} connected (socket: ${client.id})`);
      
      // Send connection confirmation
      client.emit('connected', { 
        message: 'Connected to notification service',
        userId: client.userId,
      });

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove socket from user's socket set
      const userSocketSet = this.userSockets.get(client.userId);
      if (userSocketSet) {
        userSocketSet.delete(client.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(client.userId);
        }
      }
      this.logger.log(`❌ User ${client.userId} disconnected (socket: ${client.id})`);
    }
  }

  // ==================== Public methods for sending notifications ====================

  /**
   * Gửi notification đến 1 user cụ thể
   */
  sendToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.debug(`📤 Sent notification to user ${userId}`);
  }

  /**
   * Gửi notification đến nhiều users
   */
  sendToUsers(userIds: string[], notification: any) {
    userIds.forEach(userId => {
      this.sendToUser(userId, notification);
    });
    this.logger.debug(`📤 Sent notification to ${userIds.length} users`);
  }

  /**
   * Gửi cập nhật unread count đến user
   */
  sendUnreadCount(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('unreadCount', { count });
  }

  /**
   * Broadcast đến tất cả users online
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.debug(`📢 Broadcast ${event} to all users`);
  }

  /**
   * Kiểm tra user có online không
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  /**
   * Lấy số users online
   */
  getOnlineUsersCount(): number {
    return this.userSockets.size;
  }

  // ==================== Client message handlers ====================

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: string },
  ) {
    this.logger.debug(`User ${client.userId} marked notification ${data.notificationId} as read`);
    // Có thể emit event để sync giữa các tabs
    this.server.to(`user:${client.userId}`).emit('notificationRead', {
      notificationId: data.notificationId,
    });
  }

  @SubscribeMessage('markAllAsRead')
  handleMarkAllAsRead(@ConnectedSocket() client: AuthenticatedSocket) {
    this.logger.debug(`User ${client.userId} marked all notifications as read`);
    this.server.to(`user:${client.userId}`).emit('allNotificationsRead', {});
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: Date.now() });
  }

  // ==================== Helper methods ====================

  private extractToken(client: Socket): string | null {
    // Try from auth header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try from query params
    const token = client.handshake.query.token;
    if (token && typeof token === 'string') {
      return token;
    }

    // Try from auth object
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }

    return null;
  }
}
