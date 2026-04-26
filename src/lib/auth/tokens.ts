import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt';
import { UserSessionPayload } from '@/types/user';

export const createTokenPair = (user: UserSessionPayload) => {
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

// Create account creation token for guest users (24h expiry)
export const createAccountCreationToken = async (orderId: string, email: string): Promise<string> => {
  const payload = {
    type: 'account_creation',
    orderId,
    email,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  return generateAccessToken(payload as any);
};

// Verify account creation token
export const verifyAccountCreationToken = (token: string) => {
  try {
    const payload = verifyRefreshToken(token); // Using refresh token verification for longer expiry
    if (payload.type !== 'account_creation') {
      throw new Error('Invalid token type');
    }
    return {
      success: true,
      orderId: payload.orderId,
      email: payload.email,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid or expired account creation token',
    };
  }
};
