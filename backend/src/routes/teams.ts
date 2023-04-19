import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createTeam, findAll, findById } from '../repositories/TeamRepository';
import { CreateTeamRequest } from '../middlewares/validation/TeamRequests';
import { findByTeam } from '../repositories/PlayerRepository';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamRequest:
 *       type: object
 *       required:
 *         - name
 *         - venue
 *         - founded
 *         - city
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the team
 *         venue:
 *           type: string
 *           description: The venue/stadium of the team 
 *         founded:
 *           type: date
 *           description: The date on which the team was founded in ISO 8601
 *         city:
 *           type: string
 *           description: The team city
 *         country:
 *           type: string
 *           description: The team country
 *     Team:
 *       allOf:
 *         - $ref: '#/components/schemas/TeamRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the team
 *       example:
 *         id: 12345
 *         name: S.S.C. Napoli
 *         founded: 1926-08-25
 *         venue: Stadio Diego Armando Maradona
 *         city: Napoly
 *         country: Italy
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The player id
 *           example: 1
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
 *   name: Teams
 *   description: The teams managing endpoints
 * /teams:
 *   get:
 *     summary: Lists all the teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: The list of the teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 * /teams/{id}:
 *   get:
 *     summary: Get the team by id
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team id
 *     responses:
 *       200:
 *         description: The requested team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: The team was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Team 1 not found !
 *       400:
 *         description: Bad team id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Team id should be a number
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamRequest'
 *     responses:
 *       200:
 *         description: The created team.
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
 * /teams/{id}/players:
 *   get:
 *     summary: Get the players of the given team id
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team id
 *     responses:
 *       200:
 *         description: The list of team players
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: The team was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Team 1 not found !
 *       400:
 *         description: Bad team id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Team id should be a number
 *       500:
 *         description: Some server error
 */

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
