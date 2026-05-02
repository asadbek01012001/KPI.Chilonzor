import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, env.bcryptRounds);

export const comparePassword = (plain: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(plain, hashed);
