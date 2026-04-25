import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, name, calories, protein, carbs, fat, category } = await request.json();

    if (!userId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await query(`
      INSERT INTO meals (user_id, name, calories, protein, carbs, fat, category, logged_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    `, [userId, name, calories, protein, carbs, fat, category || 'Other']);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Meal Error:', error);
    return NextResponse.json({ error: 'Failed to save meal' }, { status: 500 });
  }
}
