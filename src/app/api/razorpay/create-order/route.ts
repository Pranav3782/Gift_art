
import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'Razorpay integration has been removed.' }, { status: 410 });
}
