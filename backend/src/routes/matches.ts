import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createMatch, findAll, findById } from '../repositories/MatchRepository';
import { CreateMatchRequest } from '../middlewares/validation/MatchRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const matches = await findAll();
  res.status(200).send(matches);
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const match = await findById(id);
    if (match) {
      res.status(200).send(match);
    } else {
      res.status(404).send('Match not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Match id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id/teams', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const match = await findById(id);
    if (match) {
      res.status(200).send({ host: match.host, guest: match.guest });
    } else {
      res.status(404).send('Match not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Match id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/', RequestValidator.validate(CreateMatchRequest), auth, async (req: Request, res: Response) => {
  const { played, venue, score, outcome, leagueId, host, guest } = req.body;
  const match = await createMatch({ played, venue, score, outcome, leagueId, host, guest });
  logger.info(JSON.stringify(match));
  res.status(200).send(match);
});

export { router as matchesRouter };
