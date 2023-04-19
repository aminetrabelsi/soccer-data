import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import toobusy from 'toobusy-js';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../swagger";
import connection from './utils/SequelizeClient';

import swaggerJsdoc from 'swagger-jsdoc';

import config from './utils/Configuration';

import { NotFoundError } from './utils/ApiError';
import ErrorHandler from './utils/ErrorHandler';
import { Logger } from './utils/Logger';

import { leaguesRouter } from './routes/leagues';
import { teamsRouter } from './routes/teams';
import { playersRouter } from './routes/players';
import { matchesRouter } from './routes/matches';
import { statsRouter } from './routes/stats';
import { authRouter } from './routes/auth';
import { stringify } from 'querystring';

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Logger.getHttpLoggerInstance());
app.use(helmet());
app.use(cors());
const logger = Logger.getInstance();

app.use(function (req: Request, res: Response, next: NextFunction) {
  if (toobusy()) {
    logger.error('Server too busy!');
    res.status(503).send('Server too busy!');
  } else {
    next();
  }
});

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello To Soccer API!',
  });
});

app.use('/healthcheck', require('express-healthcheck')());

const forwardedPrefixSwagger = async (req: Request, res: Response, next: NextFunction) => {
  req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
  next();
};
let pref = '';
if (process.env.NODE_ENV!=='development') {
  pref = '/backend';
}
const specs = swaggerJsdoc(swaggerDocument);
// app.use('/api-docs/', forwardedPrefixSwagger, swaggerUi.serve, swaggerUi.setup(specs));
app.use(`${pref}/api-docs`, swaggerUi.serve, swaggerUi.setup(specs));

app.use(`${pref}/leagues`, leaguesRouter);
app.use(`${pref}/teams`, teamsRouter);
app.use(`${pref}/players`, playersRouter);
app.use(`${pref}/matches`, matchesRouter);
app.use(`${pref}/stats`, statsRouter);
app.use(`${pref}/auth`, authRouter);

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
  app.listen(config.apiPort, (): void => {
    logger.info(`Connected successfully on api port ${config.apiPort}`);
    logger.info(`========> ${JSON.stringify(process.env)}`);
  });
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
