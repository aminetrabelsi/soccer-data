import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import toobusy from 'toobusy-js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../swagger';
import swaggerJsdoc from 'swagger-jsdoc';

import { Logger } from './utils/Logger';

import { leaguesRouter } from './routes/leagues';
import { teamsRouter } from './routes/teams';
import { playersRouter } from './routes/players';
import { matchesRouter } from './routes/matches';
import { statsRouter } from './routes/stats';
import { authRouter } from './routes/auth';
const logger = Logger.getInstance();

export const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Logger.getHttpLoggerInstance());
app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    if (toobusy()) {
      logger.error('Server too busy!');
      res.status(503).send('Server too busy!');
    } else {
      next();
    }
  });
}

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello To Soccer API!',
  });
});

app.use('/healthcheck', require('express-healthcheck')());
const specs = swaggerJsdoc(swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/leagues', leaguesRouter);
app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/matches', matchesRouter);
app.use('/stats', statsRouter);
app.use('/auth', authRouter);
