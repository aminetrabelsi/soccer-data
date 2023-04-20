import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createStat, findAll, findById } from '../repositories/StatRepository';
import { CreateStatRequest } from '../middlewares/validation/StatRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StatRequest:
 *       type: object
 *       required:
 *         - goals
 *         - assists
 *         - saves
 *         - yellow
 *         - red
 *         - minutes
 *         - playerId
 *         - matchId
 *       properties:
 *         goals:
 *           type: number
 *           description: how many goals
 *         assists:
 *           type: number
 *           description: how many assists
 *         saves:
 *           type: number
 *           description: how many saves
 *         yellow:
 *           type: number
 *           description: how many yellow cards
 *         red:
 *           type: number
 *           description: how many red cards
 *         minutes:
 *           type: number
 *           description: time played in minutes
 *         matchId:
 *           type: number
 *           description: The match ID
 *         playerId:
 *           type: number
 *           description: The player ID
 *     Stat:
 *       allOf:
 *         - $ref: '#/components/schemas/StatRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the stat
 *       example:
 *         id: 12345
 *         goals: 1
 *         assists: 4
 *         saves: 3
 *         yellow: 1
 *         red: 0
 *         minutes: 85
 *         matchId: 123
 *         playerId: 456
 */

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: The stats managing endpoints
 * /stats:
 *   get:
 *     summary: Lists all the stats
 *     tags: [Stats]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaginationRequest'
 *     responses:
 *       200:
 *         description: The list of the stats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stat'
 * /stats/{id}:
 *   get:
 *     summary: Get the stat by id
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The stat id
 *     responses:
 *       200:
 *         description: The requested stat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
 *       404:
 *         description: The stat was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Stat 1 not found !
 *       400:
 *         description: Bad stat id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Stat id should be a number
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 *   post:
 *     summary: Create a new stat
 *     tags: [Stats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatRequest'
 *     responses:
 *       200:
 *         description: The created stat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
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
 */

router.get('/', async (req: Request, res: Response) => {
  try {
    const offset: number = parseInt(req.body.offset) || 0;
    const limit: number = parseInt(req.body.limit) || 10;
    const stats = await findAll(offset, limit);
    res.status(200).send(stats);
  } catch (err) {
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const stat = await findById(id);
    if (stat) {
      res.status(200).send(stat);
    } else {
      res.status(404).send(`Stat ${id} not found !`);
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
  try {
    const { goals, assists, saves, yellow, red, minutes, matchId, playerId } = req.body;
    const stat = await createStat({ goals, assists, saves, yellow, red, minutes, matchId, playerId });
    logger.info(JSON.stringify(stat));
    res.status(200).send(stat);
  } catch (err) {
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

export { router as statsRouter };
