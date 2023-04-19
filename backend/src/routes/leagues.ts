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
 *     League:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - country
 *         - season
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the league
 *         name:
 *           type: string
 *           description: The name of the league
 *         country:
 *           type: string
 *           description: The league country
 *         season:
 *           type: string
 *           description: The league season
 *       example:
 *         id: 12345
 *         name: Serie A
 *         country: Italy
 *         season: 2022-2023
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
 *           type: string
 *         required: true
 *         description: The league id
 *     responses:
 *       200:
 *         description: The league response by id
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
 *   post:
 *     summary: Create a new league
 *     tags: [Leagues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/League'
 *     responses:
 *       200:
 *         description: The created league.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
 *       500:
 *         description: Some server error
 *   put:
 *    summary: Update the league by the id
 *    tags: [Leagues]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The league id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/League'
 *    responses:
 *      200:
 *        description: The league was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/League'
 *      404:
 *        description: The league was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the league by id
 *     tags: [Leagues]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The league id
 *
 *     responses:
 *       200:
 *         description: The league was deleted
 *       404:
 *         description: The league was not found
 */

router.get('/', async (req: Request, res: Response) => {
  const leagues = await findAll();
  res.status(200).send(leagues);
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
  const { name, country, season } = req.body;
  const league = await createLeague({ name, country, season });
  logger.info(JSON.stringify(league));
  res.status(200).send(league);
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
