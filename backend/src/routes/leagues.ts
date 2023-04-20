import express, { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import RequestValidator from '../utils/RequestValidator';
import { createLeague, deleteLeague, findAll, findById } from '../repositories/LeagueRepository';
import { CreateLeagueRequest } from '../middlewares/validation/LeagueRequests';
import { auth } from '../middlewares/auth';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LeagueRequest:
 *       type: object
 *       required:
 *         - name
 *         - country
 *         - season
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the league
 *         country:
 *           type: string
 *           description: The league country
 *         season:
 *           type: string
 *           description: The league season
 *     League:
 *       allOf:
 *         - $ref: '#/components/schemas/LeagueRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the league
 *       example:
 *         id: 12345
 *         name: Serie A
 *         country: Italy
 *         season: 2022-2023
 *     PaginationRequest:
 *       type: object
 *       properties:
 *         offset:
 *           type: number
 *           description: Nbr of instances to be skipped (default nil)
 *         limit:
 *           type: number
 *           description: Max rows to be fetched (default 10)
 *       example:
 *         offset: 0
 *         limit: 20
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
 *   name: Leagues
 *   description: The leagues managing endpoints
 * /leagues:
 *   get:
 *     summary: Lists all the leagues
 *     tags: [Leagues]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaginationRequest'
 *     responses:
 *       200:
 *         description: The list of the leagues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/League'
 * /leagues/{id}:
 *   get:
 *     summary: Get the league by id
 *     tags: [Leagues]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The league id
 *     responses:
 *       200:
 *         description: The requested league
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
 *       404:
 *         description: The league was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : League 1 not found !
 *       400:
 *         description: Bad league id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : League id should be a number
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 *   post:
 *     summary: Create a new league
 *     tags: [Leagues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeagueRequest'
 *     responses:
 *       200:
 *         description: The created league.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
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
 *   delete:
 *     summary: Remove the league by id
 *     tags: [Leagues]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The league id
 *
 *     responses:
 *       200:
 *         description: The league was deleted
 *         content:
 *           text/plain:
 *             type: string
 *             example : League 1 deleted successfully
 *       400:
 *         description: Bad league id
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : League id should be a number
 *       401:
 *         description: Unauthorized access
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Please authenticate
 *       404:
 *         description: The league was not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : League 1 not found !
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
    const leagues = await findAll(offset, limit);
    res.status(200).send(leagues);
  } catch (err) {
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const league = await findById(id);
    if (league) {
      res.status(200).send(league);
    } else {
      res.status(404).send(`League ${id} not found !`);
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send('League id should be a number');
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/', RequestValidator.validate(CreateLeagueRequest), auth, async (req: Request, res: Response) => {
  try {
    const { name, country, season } = req.body;
    const league = await createLeague({ name, country, season });
    logger.info(JSON.stringify(league));
    res.status(200).send(league);
  } catch (err) {
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const league = await findById(id);
    if (league) {
      const deleted = deleteLeague(id);
      logger.info(`deleted ${deleted} league rows`);
      res.status(200).send(`League ${id} deleted successfully`);
    } else {
      res.status(404).send('League not found !');
    }
  } catch (err) {
    logger.error(err);
    if (err.message === 'column "nan" does not exist') {
      res.status(400).send(`League id should be a number`);
    }
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

export { router as leaguesRouter };
