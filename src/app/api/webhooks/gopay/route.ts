import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implementovat GoPay webhook
    return NextResponse.json({ message: 'GoPay webhook endpoint' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
