import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date'); // Expected YYYY-MM-DD

  if (!userId || !date) {
    return NextResponse.json({ error: 'UserId and Date are required' }, { status: 400 });
  }

  try {
    // 1. Get meals for the day
    const mealsResult = await query(`
      SELECT id, name, calories, protein, category, logged_at
      FROM meals
      WHERE user_id = $1 AND logged_at::date = $2
      ORDER BY logged_at ASC
    `, [userId, date]);

    // 2. Get sleep for the day
    const sleepResult = await query(`
      SELECT sleep_time, wake_time, quality
      FROM sleep_logs
      WHERE user_id = $1 AND logged_at = $2
    `, [userId, date]);

    // 3. Get total macros for the day
    const summaryResult = await query(`
      SELECT 
        SUM(calories) as total_calories,
        SUM(protein) as total_protein
      FROM meals
      WHERE user_id = $1 AND logged_at::date = $2
    `, [userId, date]);

    return NextResponse.json({
      meals: mealsResult.rows,
      sleep: sleepResult.rows[0] || null,
      summary: summaryResult.rows[0] || { total_calories: 0, total_protein: 0 }
    });
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
