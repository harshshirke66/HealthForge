import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, sleepTime, wakeTime, quality } = await request.json();

    if (!userId || !sleepTime || !wakeTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await query(`
      INSERT INTO sleep_logs (user_id, sleep_time, wake_time, quality, logged_at)
      VALUES ($1, $2, $3, $4, CURRENT_DATE)
      ON CONFLICT (user_id, logged_at)
      DO UPDATE SET sleep_time = $2, wake_time = $3, quality = $4
    `, [userId, sleepTime, wakeTime, quality || 3]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Sleep Error:', error);
    return NextResponse.json({ error: 'Failed to save sleep log' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
  }

  try {
    const result = await query(`
      SELECT sleep_time, wake_time, quality, logged_at
      FROM sleep_logs
      WHERE user_id = $1
      ORDER BY logged_at DESC
      LIMIT 1
    `, [userId]);

    return NextResponse.json(result.rows[0] || null);
  } catch (error: any) {
    console.error('Get Sleep Error details:', {
      message: error.message,
      detail: error.detail,
      code: error.code
    });
    return NextResponse.json({ 
      error: 'Failed to fetch sleep log',
      details: error.message 
    }, { status: 500 });
  }
}
