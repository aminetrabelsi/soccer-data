import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createStat, findAll, findById } from '../repositories/StatRepository';
import { CreateStatRequest } from '../middlewares/validation/StatRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const stats = await findAll();
  res.status(200).send(stats);
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const stat = await findById(id);
    if (stat) {
      res.status(200).send(stat);
    } else {
      res.status(404).send('Stat not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Stat id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/', RequestValidator.validate(CreateStatRequest), auth, async (req: Request, res: Response) => {
  const { goals, assists, saves, yellow, red, minutes, matchId, playerId } = req.body;
  const stat = await createStat({ goals, assists, saves, yellow, red, minutes, matchId, playerId });
  logger.info(JSON.stringify(stat));
  res.status(200).send(stat);
});

export { router as statsRouter };
