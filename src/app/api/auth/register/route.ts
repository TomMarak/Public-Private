import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { registerSchema } from '@/validators/auth';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, ...registerData } = body;

    const validation = registerSchema.safeParse(registerData);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const payload = await getPayload({ config });

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUsers.docs.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0],
        role: 'customer',
      },
    });

    // If orderId is provided, assign existing guest orders to this user
    if (orderId) {
      const orders = await payload.find({
        collection: 'orders',
        where: {
          guestEmail: {
            equals: email,
          },
        },
      });

      // Update orders to link to the new user
      for (const order of orders.docs) {
        await payload.update({
          collection: 'orders',
          id: order.id,
          data: {
            customer: user.id,
            guestEmail: null, // Remove guest email since user now exists
          },
        });
      }
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}