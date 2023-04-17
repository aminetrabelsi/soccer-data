import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserAttributes } from '../models/User';
import config from '../utils/Configuration';

const salt = 8;

export const signUpUser = async ({ username, password }: UserAttributes): Promise<User> => {
  const pwd = await bcrypt.hash(password!, salt);
  const user = User.build({ username, password: pwd });
  return await user.save();
};

export const signInUser = async ({ username, password }: UserAttributes): Promise<{token: string}> => {
  const user = await findByUsername(username!);
  if (!user) {
    throw new Error(`${username} is unregistered`);
  }

  const isMatch = bcrypt.compareSync(password!, user.password);

  if (isMatch) {
    const token = jwt.sign({ id: user.id?.toString(), usernamename: user.username }, config.jwtSecret!, {
      expiresIn: '2 hours',
    });

    return { token: token };
  } else {
    throw new Error('Wrong Password');
  }
};

export const findById = async (id: number): Promise<User | null> => {
  return await User.findByPk(id);
};

export const findByUsername = async (username: string): Promise<User | null> => {
  return await User.findOne({
    where: { username },
  });
};
