import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createMatch, findAll, findById } from '../repositories/MatchRepository';
import { CreateMatchRequest } from '../middlewares/validation/MatchRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MatchRequest:
 *       type: object
 *       required:
 *         - played
 *         - venue
 *         - score
 *         - outcome
 *         - leagueId
 *         - host
 *         - guest
 *       properties:
 *         played:
 *           type: string
 *           format: date
 *           description: When the match was played
 *         venue:
 *           type: string
 *           description: The stadium where the match was played
 *         score:
 *           type: string
 *           description: The match score
 *         outcome:
 *           type: number
 *           description: match result as 1 0 2
 *         leagueId:
 *           type: string
 *           description: The league to which the match belongs
 *         host:
 *           type: string
 *           description: The host team ID
 *         guest:
 *           type: string
 *           description: The guest team ID
 *       example:
 *         played: 1985-05-05
 *         venue: Menzah
 *         score: 5-1
 *         outcome: 1
 *         leagueId: 151
 *         host: 346
 *         guest: 928
 *     Match:
 *       allOf:
 *         - $ref: '#/components/schemas/MatchRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the match
 *       example:
 *         id: 12345
 *         played: 1985-05-05
 *         venue: Menzah
 *         score: 5-1
 *         outcome: 1
 *         leagueId: 151
 *         host: 346
 *         guest: 928
 *     MatchTeams:
 *       type: object
 *       properties:
 *         host:
 *           type: number
 *           description: The host team ID
 *         guest:
 *           type: number
 *           description: The guest team ID
 *       example:
 *         host: 123
 *         guest: 456
 */

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: The matches managing endpoints
 * /matches:
 *   get:
 *     summary: Lists all the matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: The list of the matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *   post:
 *     summary: Create a new match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchRequest'
 *     responses:
 *       200:
 *         description: The created match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
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
 * /matches/{id}:
 *   get:
 *     summary: Get the match by id
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The match id
 *     responses:
 *       200:
 *         description: The requested match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: The match was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Match 1 not found !
 *       400:
 *         description: Bad league id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Match id should be a number
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 * /matches/{id}/teams:
 *   get:
 *     summary: Get the teams playing the given match id
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The match id
 *     responses:
 *       200:
 *         description: The teams playing match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchTeams'
 *       404:
 *         description: The match was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Match 1 not found !
 *       400:
 *         description: Bad match id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Match id should be a number
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 */

router.get('/', async (req: Request, res: Response) => {
  const matches = await findAll();
  res.status(200).send(matches);
});

router.post('/', RequestValidator.validate(CreateMatchRequest), auth, async (req: Request, res: Response) => {
  try {
    const { played, venue, score, outcome, leagueId, host, guest } = req.body;
    const match = await createMatch({ played, venue, score, outcome, leagueId, host, guest });
    logger.info(JSON.stringify(match));
    res.status(200).send(match);    
  } catch (err) {
    res.status(500).send(`Error ${err.name} ${err.message} occured`);    
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const match = await findById(id);
    if (match) {
      res.status(200).send(match);
    } else {
      res.status(404).send(`Match ${id} not found !`);
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

export { router as matchesRouter };
