import express, { Request, Response } from 'express';
import { Logger } from '../utils/Logger';
import { signUpUser, signInUser } from '../repositories/UserRepository';
import RequestValidator from '../utils/RequestValidator';
import { SignInRequest, SignUpRequest } from '../middlewares/validation/UserRequests';

const logger = Logger.getInstance();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         name: tifoso
 *         password: ForzaRagazz1
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/AuthRequest'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *             type: number
 *             description: The auto-generated id of the user
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The Authentication managing endpoints
 * /signup:
 *   post:
 *     summary: Sign up to have more privileges
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Confirmation message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : User registered
 * /signin:
 *   post:
 *     summary: Sign in to have more privileges
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: xTYH15Fghol89mlop
 *       500:
 *         description: Some server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example : Error name message occured
 */

router.post('/signup', RequestValidator.validate(SignUpRequest), async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await signUpUser({ username, password });
    res.status(200).send('User registered');
  } catch (err) {
    logger.error(err);
    res.status(500).send(`Error ${err.name} ${err.message} occured`);
  }
});

router.post('/signin', RequestValidator.validate(SignInRequest), async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await signInUser({ username, password });
    res.status(200).send(token);
  } catch (err) {
    logger.error(err);
    res.status(500).send(`Error occured : ${err.message}`);
  }
});

export { router as authRouter };
