import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { userId, weight } = await request.json();

    if (!weight) {
      return NextResponse.json({ error: 'Weight is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO weight_logs (user_id, weight) VALUES ($1, $2) RETURNING *',
      [userId, weight]
    );

    return NextResponse.json({ message: 'Weight logged successfully', data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log weight' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const result = await query(
            'SELECT weight, logged_at FROM weight_logs WHERE user_id = $1 ORDER BY logged_at ASC LIMIT 30',
            [userId]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weight logs' }, { status: 500 });
    }
}
