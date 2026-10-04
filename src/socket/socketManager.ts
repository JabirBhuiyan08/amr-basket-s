import { Server, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';

export type AdminNotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: AdminNotificationType;
  createdAt?: string;
  link?: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
}

let io: Server | null = null;

/**
 * Attach Socket.io to the HTTP server.
 * NOTE: For local dev the client (:3000) and server (:5000) are cross-origin and
 * better-auth uses sameSite:"lax" cookies, so cookie-based socket auth would
 * silently fail. We therefore join every connection to `admin-room` (permissive
 * for dev). Replace with token/session auth before production.
 */
export const initSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.CLIENT_URL || 'https://amrbucketclient.vercel.app,http://localhost:3000')
        .split(',')
        .map((o) => o.trim()),
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    // Dev simplification: everyone joins the admin broadcast room.
    socket.join('admin-room');

    socket.on('disconnect', () => {
      /* no-op */
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
};

/** Persist (optional) + broadcast a notification to all admins. */
export const emitAdminNotification = (payload: AdminNotification) => {
  if (!io) return;
  const data: Required<Pick<AdminNotification, 'createdAt'>> & AdminNotification = {
    ...payload,
    createdAt: payload.createdAt ?? new Date().toISOString(),
  };
  io.to('admin-room').emit('admin:notification', data);
};

export const emitOrderStatusUpdated = (payload: OrderStatusUpdate) => {
  if (!io) return;
  io.to('admin-room').emit('orderStatusUpdated', payload);
};
