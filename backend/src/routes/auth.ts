import express, { Request, Response } from 'express';
import { Logger } from '../utils/Logger';
import { signUpUser, signInUser } from '../repositories/UserRepository';
import RequestValidator from '../utils/RequestValidator';
import { SignInRequest, SignUpRequest } from '../middlewares/validation/UserRequests';

const logger = Logger.getInstance();
const router = express.Router();

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
