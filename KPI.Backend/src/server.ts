import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

const start = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.port, '0.0.0.0', () => {
    logger.info(`Server running on http://localhost:${env.port}`);
    logger.info(`Swagger docs: http://localhost:${env.port}/api/docs`);
    logger.info(`Environment: ${env.nodeEnv}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
