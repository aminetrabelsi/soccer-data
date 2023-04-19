import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createPlayer, findAll, findById, updatePlayer } from '../repositories/PlayerRepository';
import { findByPlayer, findByPlayerAndMatch } from '../repositories/StatRepository';
import { CreatePlayerRequest, UpdatePlayerRequest } from '../middlewares/validation/PlayerRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerRequest:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: The player first name
 *           example: Diego
 *         lastname:
 *           type: string
 *           description: The player last name
 *           example: Maradona
 *         birthdate:
 *           type: date
 *           description: Date of birth
 *           example: 1960-10-30
 *         country:
 *           type: string
 *           description: The player country
 *           example: Argentina
 *         position:
 *           type: string
 *           description: position in pitch
 *           example: Midfield
 *         numero:
 *           type: number
 *           description: The T-shirt number
 *           example: 10
 *         teamId:
 *           type: number
 *           description: The team id
 *           example: 1
 *     Player:
 *       allOf:
 *         - $ref: '#/components/schemas/PlayerRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the player
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: string
 *           description: false indicating an error
 *         message:
 *           type: string
 *           description: General message
 *         rawErrors:
 *           type: array
 *           description: Raw errors detected by the API 
 *       example:
 *         success: false
 *         message: Request validation failed!
 *         rawErrors: ["country should not be null or undefined"]
 */

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: The players managing endpoints
 * /players:
 *   get:
 *     summary: Lists all the players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: The list of the players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerRequest'
 *     responses:
 *       200:
 *         description: The created player.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *               type: string
 *               example : Request validation failed!
 *       500:
 *         description: Some server error
 * /players/{id}:
 *   get:
 *     summary: Get the player by id
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The player id
 *     responses:
 *       200:
 *         description: The requested player
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: The player was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Player 1 not found !
 *       400:
 *         description: Bad player id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Player id should be a number
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update the player by the id
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The player id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: The player was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: The player was not found
 *       500:
 *         description: Some error happened
 */

router.get('/', async (req: Request, res: Response) => {
  const players = await findAll();
  res.status(200).send(players);
});

router.post('/', RequestValidator.validate(CreatePlayerRequest), auth, async (req: Request, res: Response) => {
  const { firstname, lastname, numero, birthdate, country, position, teamId } = req.body;
  const player = await createPlayer({ firstname, lastname, numero, birthdate, country, position, teamId });
  logger.info(JSON.stringify(player));
  res.status(200).send(player);
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

export { router as playersRouter };
