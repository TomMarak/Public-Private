import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt';
import { UserSession } from '@/types/user';

export const createTokenPair = (user: UserSession) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user.userId),
  };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const { userId } = verifyRefreshToken(refreshToken);
    return {
      success: true,
      userId,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid or expired refresh token',
    };
  }
};
