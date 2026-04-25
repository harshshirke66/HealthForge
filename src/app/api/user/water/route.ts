import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, amount_ml } = await request.json();

    if (!userId || amount_ml === undefined) {
      return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 });
    }

    // Upsert today's habits entry
    await query(`
      INSERT INTO daily_habits (user_id, logged_at, water_intake_ml)
      VALUES ($1, CURRENT_DATE, $2)
      ON CONFLICT (user_id, logged_at)
      DO UPDATE SET water_intake_ml = GREATEST(0, daily_habits.water_intake_ml + $2)
    `, [userId, amount_ml]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Water Log Error:', error);
    return NextResponse.json({ error: 'Failed to log water' }, { status: 500 });
  }
}
