import express from "express";
import { productRouter } from "./modules/product/product.router";
import { categoryRouter } from "./modules/category/category.router";
import { reviewRouter } from "./modules/review/review.router";
import { cartRouter } from "./modules/cart/cart.router";
import { helpRouter } from "./modules/help-request/help.router";
import { orderRouter } from "./modules/order/order.router";
import { invoiceRouter } from "./modules/invoice/invoice.router";
import { visitorRouter } from "./modules/visitor/visitor.router";
import { settingsRouter } from "./modules/settings/settings.router";
import { userRouter } from "./modules/user/user.router";
import { authRouter } from "./modules/auth/auth.router";
import { emitAdminNotification } from "./socket/socketManager";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app = express();
// Global middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000,http://localhost:5000")
        .split(",")
        .map((value) => value.trim());
    if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Guest-Id");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});
// Better Auth handler - Express v5 catch-all syntax
app.all("/api/auth/{*any}", toNodeHandler(auth));
// Body parsing middleware - mount AFTER the Better Auth handler (so it does not
// consume the raw body Better Auth needs) but BEFORE the API routers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/reviews", reviewRouter);
app.use("/cart", cartRouter);
app.use("/help-request", helpRouter);
app.use("/orders", orderRouter);
app.use("/invoices", invoiceRouter);
app.use("/visitors", visitorRouter);
app.use("/settings", settingsRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
    res.json({
        message: "Hello World!",
        routes: {
            auth: "/api/auth",
            products: "/product",
            categories: "/category",
            reviews: "/reviews",
            cart: "/cart",
            helpRequest: "/help-request",
            orders: "/orders",
            invoices: "/invoices",
            visitors: "/visitors",
            settings: "/settings",
            user: "/user",
            customAuth: "/auth"
        }
    });
});
// Dev helper: trigger a test admin notification (toast) from the server.
// Remove or protect before production.
app.post("/notify-test", (req, res) => {
    const body = req.body || {};
    emitAdminNotification({
        id: String(Date.now()),
        title: body.title || "Test Notification",
        message: body.message || "This is a real-time admin toast!",
        type: body.type || "success",
    });
    res.json({ ok: true });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({
        success: false,
        error: err.message || "Internal server error"
    });
});
export default app;
//# sourceMappingURL=app.js.map