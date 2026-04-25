import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, weight } = await request.json();

    if (!userId || !weight) {
      return NextResponse.json({ error: 'Missing userId or weight' }, { status: 400 });
    }

    // Insert new weight log
    await query(`
      INSERT INTO weight_logs (user_id, weight, logged_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `, [userId, weight]);

    // Also update user's current starting_weight in users table for consistency
    await query('UPDATE users SET starting_weight = $1 WHERE id = $2', [weight, userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Weight Log Error:', error);
    return NextResponse.json({ error: 'Failed to log weight' }, { status: 500 });
  }
}
