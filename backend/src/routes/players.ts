import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createPlayer, findAll, findById, updatePlayer } from '../repositories/PlayerRepository';
import { findByPlayer, findByPlayerAndMatch } from '../repositories/StatRepository';
import { CreatePlayerRequest, UpdatePlayerRequest } from '../middlewares/validation/PlayerRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const players = await findAll();
  res.status(200).send(players);
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const player = await findById(id);
    if (player) {
      res.status(200).send(player);
    } else {
      res.status(404).send('Player not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Player id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const stats = await findByPlayer(id);
    if (stats) {
      res.status(200).send(stats);
    } else {
      res.status(404).send('Player not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Player id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id/match/:match/stats', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const match: number = parseInt(req.params.match);
    const stat = await findByPlayerAndMatch(id, match);
    if (stat) {
      res.status(200).send(stat);
    } else {
      res.status(404).send('Player not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/', RequestValidator.validate(CreatePlayerRequest), auth, async (req: Request, res: Response) => {
  const { firstname, lastname, numero, birthdate, country, position, teamId } = req.body;
  const player = await createPlayer({ firstname, lastname, numero, birthdate, country, position, teamId });
  logger.info(JSON.stringify(player));
  res.status(200).send(player);
});

router.put('/:id', RequestValidator.validate(UpdatePlayerRequest), auth, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const { country, numero, position, teamId } = req.body;
    await updatePlayer({ id, country, numero, position, teamId });
    res.status(200).send({
      message: `Player ${id} updated!`,
    });
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`Player id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

export { router as playersRouter };
