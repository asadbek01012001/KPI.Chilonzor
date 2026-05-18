"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const start = async () => {
    await (0, database_1.connectDB)();
    const server = app_1.default.listen(env_1.env.port, '0.0.0.0', () => {
        logger_1.logger.info(`Server running on http://localhost:${env_1.env.port}`);
        logger_1.logger.info(`Swagger docs: http://localhost:${env_1.env.port}/api/docs`);
        logger_1.logger.info(`Environment: ${env_1.env.nodeEnv}`);
    });
    const shutdown = (signal) => {
        logger_1.logger.info(`${signal} received — shutting down gracefully`);
        server.close(() => {
            logger_1.logger.info('Server closed');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error('Unhandled Rejection:', reason);
        process.exit(1);
    });
};
start().catch((err) => {
    logger_1.logger.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map