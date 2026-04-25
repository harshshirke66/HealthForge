import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, height, startingWeight, targetWeight, activityLevel } = await request.json();

    // 1. Update user profile
    await query(
      'UPDATE users SET height = $1, starting_weight = $2, target_weight = $3, onboarded = TRUE WHERE id = $4',
      [height, startingWeight, targetWeight, userId]
    );

    // 2. Insert initial weight log
    await query(
      'INSERT INTO weight_logs (user_id, weight) VALUES ($1, $2)',
      [userId, startingWeight]
    );

    return NextResponse.json({ message: 'Onboarding complete' });
  } catch (error) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
