import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export const authenticateRequest = (request: NextRequest): AuthenticatedRequest => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return request;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const user = verifyAccessToken(token);
    (request as AuthenticatedRequest).user = user;
  } catch (error) {
    // Token is invalid, but we don't throw error here
    // The route handler can decide what to do
  }

  return request as AuthenticatedRequest;
};

export const requireAuth = (request: AuthenticatedRequest): NextResponse | null => {
  if (!request.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  return null;
};

export const requireAdmin = (request: AuthenticatedRequest): NextResponse | null => {
  if (!request.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (request.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return null;
};