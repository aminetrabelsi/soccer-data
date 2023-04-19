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
 *     UpdatePlayerRequest:
 *       type: object
 *       properties:
 *         numero:
 *           type: number
 *           description: The T-shirt num
 *         country:
 *           type: string
 *           description: The player country
 *         position:
 *           type: string
 *           description: The position in the pitch
 *         teamId:
 *           type: string
 *           description: The team ID
 *       example:
 *         numero: 10
 *         country: Argentina
 *         position: Midfield
 *         teamId: 1
 *     PlayerRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/UpdatePlayerRequest'
 *         - type: object
 *           required:
 *             - firstname
 *             - lastname
 *             - numero
 *             - birthdate
 *           properties:
 *             firstname:
 *               type: string
 *               description: The first name of the player
 *             lastname:
 *               type: string
 *               description: The last name of the player
 *             birthdate:
 *               type: string
 *               format: date
 *               description: The birth date of the player in ISO 8601
 *       example:
 *         firstname: Diego
 *         lastname: Maradona
 *         numero: 10
 *         birthdate: 1960-10-30
 *         country: Argentina
 *         position: Midfield
 *         teamId: 1
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
 *       example:
 *         id: 1
 *         firstname: Diego
 *         lastname: Maradona
 *         numero: 10
 *         birthdate: 1960-10-30
 *         country: Argentina
 *         position: Midfield
 *         teamId: 1
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
 *               $ref: '#/components/schemas/Player'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *               type: string
 *               example : Request validation failed!
 *       401:
 *         description: Unauthorized access
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Please authenticate
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 * /players/{id}:
 *   get:
 *     summary: Get the player by id
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
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
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 *   put:
 *     summary: Update a player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlayerRequest'
 *     responses:
 *       200:
 *         description: Confirmation message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Player id updated!
 *       400:
 *         description: Bad player ID
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Player id should be a number
 *       401:
 *         description: Unauthorized access
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Please authenticate
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 * /players/{id}/stats:
 *   get:
 *     summary: Get the statistics of the given player id
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The player id
 *     responses:
 *       200:
 *         description: The list of player statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stat'
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
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 * /players/{id}/match/{match}/stats:
 *   get:
 *     summary: Get the statistics of the given player id for the given match
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The player id
 *       - in: path
 *         name: match
 *         schema:
 *           type: number
 *         required: true
 *         description: The match id
 *     responses:
 *       200:
 *         description: The list of player statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stat'
 *       404:
 *         description: The player was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Player 1 not found !
 *       400:
 *         description: Bad player or match id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : id should be a number
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
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
      res.status(404).send(`Player ${id} not found !`);
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
