import * as jwt from 'jsonwebtoken';
import { UserSession, UserSessionPayload } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'development_refresh_secret';

export const generateAccessToken = (user: UserSessionPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): UserSession => {
  return jwt.verify(token, JWT_SECRET) as UserSession;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};
