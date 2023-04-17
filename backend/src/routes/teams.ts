import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createTeam, findAll, findById } from '../repositories/TeamRepository';
import { CreateTeamRequest } from '../middlewares/validation/TeamRequests';
import { findByTeam } from '../repositories/PlayerRepository';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const teams = await findAll();
  res.status(200).send(teams);
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const team = await findById(id);
    if (team) {
      res.status(200).send(team);
    } else {
      res.status(404).send('Team not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Team id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id/players', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const players = await findByTeam(id);
    if (players) {
      res.status(200).send(players);
    } else {
      res.status(404).send('Team not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Team id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/', RequestValidator.validate(CreateTeamRequest), auth, async (req: Request, res: Response) => {
  const { name, venue, founded, city, country } = req.body;
  const team = await createTeam({ name, venue, founded, city, country });
  logger.info(JSON.stringify(team));
  res.status(200).send(team);
});

export { router as teamsRouter };
