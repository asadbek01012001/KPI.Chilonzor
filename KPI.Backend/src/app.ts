import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";

import { swaggerSpec } from "./config/swagger";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

import authRoutes           from "./modules/auth/auth.routes";
import userRoutes           from "./modules/users/user.routes";
import regionRoutes         from "./modules/regions/region.routes";
import directionRoutes      from "./modules/directions/direction.routes";
import indicatorRoutes      from "./modules/indicators/indicator.routes";
import indicatorValueRoutes from "./modules/indicator-values/indicator-value.routes";
import crimeRoutes          from "./modules/crimes/crime.routes";
import emergency102Routes   from "./modules/emergency102/emergency102.routes";
import dashboardRoutes      from "./modules/dashboard/dashboard.routes";
import reportRoutes         from "./modules/reports/report.routes";
import workDoneRoutes       from "./modules/work-done/work-done.routes";

const frontendPath = path.join(__dirname, "../../KPI.Frontend/build");

const app = express();

// ── Security ─────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    callback(null, true);
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "userId"],
  exposedHeaders: ["Content-Disposition"],
  credentials: true,
}));

// ── Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────────
app.use(morgan(env.isDev ? "dev" : "combined", {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// ── Health ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// ── Swagger ──────────────────────────────────────────────────
app.get("/api/docs/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "KPI API Docs",
  swaggerOptions: { persistAuthorization: true },
}));

// ── API Routes ───────────────────────────────────────────────
app.use("/api/v1/auth",             authRoutes);
app.use("/api/v1/users",            userRoutes);
app.use("/api/v1/regions",          regionRoutes);
app.use("/api/v1/directions",       directionRoutes);
app.use("/api/v1/indicators",       indicatorRoutes);
app.use("/api/v1/indicator-values", indicatorValueRoutes);
app.use("/api/v1/crimes",           crimeRoutes);
app.use("/api/v1/emergency102",     emergency102Routes);
app.use("/api/v1/dashboard",        dashboardRoutes);
app.use("/api/v1/reports",          reportRoutes);
app.use("/api/v1/work-done",        workDoneRoutes);

// ── API 404 handler (faqat /api uchun) ───────────────────────
app.use("/api", notFoundHandler);

// ── Frontend static ──────────────────────────────────────────
app.use(express.static(frontendPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler);

export default app;
