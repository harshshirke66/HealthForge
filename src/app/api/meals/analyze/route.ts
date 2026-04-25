import { NextResponse } from 'next/server';
import { groq, query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { mealDescription, userId } = await request.json();

    if (!mealDescription) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    const prompt = `
      Analyze the following meal description and provide nutritional information in JSON format.
      Meal: "${mealDescription}"
      
      Respond only with a JSON object containing:
      {
        "name": "string",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "reasoning": "string"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
    });

    const nutritionData = JSON.parse(chatCompletion.choices[0].message.content || '{}');

    // Save to database
    const dbResult = await query(
      'INSERT INTO meals (user_id, name, calories, protein, carbs, fat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, nutritionData.name, nutritionData.calories, nutritionData.protein, nutritionData.carbs, nutritionData.fat]
    );

    return NextResponse.json({
      message: 'Meal analyzed and saved',
      data: dbResult.rows[0],
      ai_reasoning: nutritionData.reasoning
    });
  } catch (error) {
    console.error('Meal analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze meal' }, { status: 500 });
  }
}
