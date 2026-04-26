import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/auth/tokens';
import { generateAccessToken } from '@/lib/auth/jwt';
import { query } from '@/lib/db';
import { UserSessionPayload } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const refreshResult = refreshAccessToken(refreshToken);
    if (!refreshResult.success) {
      return NextResponse.json(
        { error: refreshResult.error },
        { status: 401 }
      );
    }

    const { userId } = refreshResult;

    // Get user data
    const userResult = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Generate new access token
    const userSession: UserSessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(userSession);

    return NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
