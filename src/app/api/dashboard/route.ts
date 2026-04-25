import { NextResponse } from 'next/server';
import { query } from '@/lib/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '1'; // Default for demo

  try {
    // 1. Get today's total nutrition from meals
    const nutritionResult = await query(`
      SELECT 
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(SUM(protein), 0) as total_protein
      FROM meals 
      WHERE user_id = $1 AND logged_at::date = CURRENT_DATE
    `, [userId]);

    // 2. Get today's habits (water)
    const habitsResult = await query(`
      SELECT water_intake_ml 
      FROM daily_habits 
      WHERE user_id = $1 AND logged_at = CURRENT_DATE
    `, [userId]);

    // 3. Get recent weight trend
    const weightResult = await query(`
      SELECT weight, TO_CHAR(logged_at, 'Dy') as day
      FROM weight_logs 
      WHERE user_id = $1 
      ORDER BY logged_at ASC 
      LIMIT 7
    `, [userId]);

    // 4. Get recent meals
    const mealsResult = await query(`
      SELECT name, calories, protein, TO_CHAR(logged_at, 'HH12:MI AM') as time
      FROM meals 
      WHERE user_id = $1 
      ORDER BY logged_at DESC 
      LIMIT 5
    `, [userId]);

    // 5. Get user's onboarding status
    const userResult = await query('SELECT onboarded FROM users WHERE id = $1', [userId]);

    // 6. Get nutrition breakdown by category
    const categoryResult = await query(`
      SELECT 
        category,
        COALESCE(SUM(calories), 0) as calories,
        COALESCE(SUM(protein), 0) as protein
      FROM meals 
      WHERE user_id = $1 AND logged_at::date = CURRENT_DATE
      GROUP BY category
    `, [userId]);

    return NextResponse.json({
      summary: {
        calories: nutritionResult.rows[0].total_calories,
        protein: nutritionResult.rows[0].total_protein,
        water: (habitsResult.rows[0]?.water_intake_ml || 0) / 1000, // Convert to Liters
      },
      weightTrend: weightResult.rows,
      recentMeals: mealsResult.rows,
      onboarded: userResult.rows[0]?.onboarded ?? true,
      categoryBreakdown: categoryResult.rows
    });
  } catch (error) {
    console.error('Dashboard Data Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
