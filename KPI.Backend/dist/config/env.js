"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireEnv = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required environment variable: ${key}`);
    return value;
};
exports.env = {
    port: parseInt(process.env.PORT || "4441", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV !== "production",
    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        name: process.env.DB_NAME || "kpi_api",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
    },
    jwt: {
        secret: requireEnv("JWT_SECRET"),
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
};
//# sourceMappingURL=env.js.map