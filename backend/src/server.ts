import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from './utils/ApiError';
import ErrorHandler from './utils/ErrorHandler';

import connection from './utils/SequelizeClient';

import config from './utils/Configuration';

import { Logger } from './utils/Logger';

const logger = Logger.getInstance();

import { app } from './app';

app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)));
app.use(ErrorHandler.handle());

const startServer = async () => {
  try {
    await connection.sync();
    app.listen(config.dbPort, (): void => {
      logger.info(`Connected successfully on DB port ${config.dbPort}`);
    });
  } catch (error: any) {
    logger.error(`Error occurred while connecting DB: ${error.message}`);
  }
};

startServer();

try {
  app.listen(config.apiPort, (): void => {});
} catch (error: any) {
  logger.error(`Error occured while listening API port: ${error.message}`);
}

process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  logger.error(reason.name, reason.message);
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  throw reason;
});

process.on('uncaughtException', (err: Error) => {
  logger.error(err.name, err.message);
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');

  process.exit(1);
});
