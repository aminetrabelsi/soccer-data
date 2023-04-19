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

const specs = swaggerJsdoc(swaggerDocument);
if (process.env.NODE_ENV==='development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
} else {
  // serve the swagger ui in a temporary directory
  app.use('/backend/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  // swagger-ui-express middleware that redirect user to /api-docs will not be aware the prefix of path by ngnix
  const apiDocsRedirectPath = '/backend'.concat('/api-docs/');
  app.get('/api-docs', function (req, res) {
    res.redirect(apiDocsRedirectPath);
  });
}

app.use('/leagues', leaguesRouter);
app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/matches', matchesRouter);
app.use('/stats', statsRouter);
app.use('/auth', authRouter);

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
