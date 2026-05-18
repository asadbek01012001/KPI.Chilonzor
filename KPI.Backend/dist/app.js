"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const swagger_1 = require("./config/swagger");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const region_routes_1 = __importDefault(require("./modules/regions/region.routes"));
const direction_routes_1 = __importDefault(require("./modules/directions/direction.routes"));
const indicator_routes_1 = __importDefault(require("./modules/indicators/indicator.routes"));
const indicator_value_routes_1 = __importDefault(require("./modules/indicator-values/indicator-value.routes"));
const crime_routes_1 = __importDefault(require("./modules/crimes/crime.routes"));
const emergency102_routes_1 = __importDefault(require("./modules/emergency102/emergency102.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const report_routes_1 = __importDefault(require("./modules/reports/report.routes"));
const work_done_routes_1 = __importDefault(require("./modules/work-done/work-done.routes"));
const frontendPath = path_1.default.join(__dirname, "../../KPI.Frontend/build");
const app = (0, express_1.default)();
// ── Security ─────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (/^http:\/\/localhost:\d+$/.test(origin))
            return callback(null, true);
        callback(null, true);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// ── Parsing ──────────────────────────────────────────────────
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ── Logging ──────────────────────────────────────────────────
app.use((0, morgan_1.default)(env_1.env.isDev ? "dev" : "combined", {
    stream: { write: (msg) => logger_1.logger.info(msg.trim()) },
}));
// ── Health ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});
// ── Swagger ──────────────────────────────────────────────────
app.get("/api/docs/swagger.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger_1.swaggerSpec);
});
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customSiteTitle: "KPI API Docs",
    swaggerOptions: { persistAuthorization: true },
}));
// ── API Routes ───────────────────────────────────────────────
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/regions", region_routes_1.default);
app.use("/api/v1/directions", direction_routes_1.default);
app.use("/api/v1/indicators", indicator_routes_1.default);
app.use("/api/v1/indicator-values", indicator_value_routes_1.default);
app.use("/api/v1/crimes", crime_routes_1.default);
app.use("/api/v1/emergency102", emergency102_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use("/api/v1/reports", report_routes_1.default);
app.use("/api/v1/work-done", work_done_routes_1.default);
// ── API 404 handler (faqat /api uchun) ───────────────────────
app.use("/api", error_middleware_1.notFoundHandler);
// ── Frontend static ──────────────────────────────────────────
app.use(express_1.default.static(frontendPath));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "index.html"));
});
// ── Error handler ────────────────────────────────────────────
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map