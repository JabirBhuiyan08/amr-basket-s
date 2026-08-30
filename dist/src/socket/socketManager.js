import { Server } from 'socket.io';
let io = null;
/**
 * Attach Socket.io to the HTTP server.
 * NOTE: For local dev the client (:3000) and server (:5000) are cross-origin and
 * better-auth uses sameSite:"lax" cookies, so cookie-based socket auth would
 * silently fail. We therefore join every connection to `admin-room` (permissive
 * for dev). Replace with token/session auth before production.
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((o) => o.trim()),
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        // Dev simplification: everyone joins the admin broadcast room.
        socket.join('admin-room');
        socket.on('disconnect', () => {
            /* no-op */
        });
    });
    return io;
};
export const getIO = () => {
    if (!io)
        throw new Error('Socket.io has not been initialized');
    return io;
};
/** Persist (optional) + broadcast a notification to all admins. */
export const emitAdminNotification = (payload) => {
    if (!io)
        return;
    const data = {
        ...payload,
        createdAt: payload.createdAt ?? new Date().toISOString(),
    };
    io.to('admin-room').emit('admin:notification', data);
};
//# sourceMappingURL=socketManager.js.map