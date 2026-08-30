import { Server } from 'socket.io';
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
/**
 * Attach Socket.io to the HTTP server.
 * NOTE: For local dev the client (:3000) and server (:5000) are cross-origin and
 * better-auth uses sameSite:"lax" cookies, so cookie-based socket auth would
 * silently fail. We therefore join every connection to `admin-room` (permissive
 * for dev). Replace with token/session auth before production.
 */
export declare const initSocket: (httpServer: HTTPServer) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server;
/** Persist (optional) + broadcast a notification to all admins. */
export declare const emitAdminNotification: (payload: AdminNotification) => void;
//# sourceMappingURL=socketManager.d.ts.map