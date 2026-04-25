import { NextResponse } from 'next/server';
import { groq, query } from '@/lib/config';

// Simple in-memory rate limiter
const lastMealRequest = new Map<string, number>();
const RATE_LIMIT_MS = 3000; // 3 seconds

export async function POST(request: Request) {
  try {
    const { mealDescription, userId } = await request.json();

    // 1. Rate Limiting
    const now = Date.now();
    if (now - (lastMealRequest.get(userId) || 0) < RATE_LIMIT_MS) {
      return NextResponse.json({ error: 'Slow down! One meal at a time.' }, { status: 429 });
    }
    lastMealRequest.set(userId, now);

    if (!mealDescription) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    const prompt = `Analyze this meal: "${mealDescription}". 
    Provide highly accurate nutritional estimates based on standard portion sizes.
    Return a JSON object with: 
    - name: string (short, descriptive)
    - calories: number (kcal)
    - protein: number (grams)
    - carbs: number (grams)
    - fat: number (grams)
    - reasoning: string (max 12 words explaining the estimate)
    
    Ensure the numbers are realistic for the food described.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    const nutritionData = JSON.parse(chatCompletion.choices[0].message.content || '{}');

    return NextResponse.json({
      message: 'Meal analyzed',
      data: nutritionData,
      ai_reasoning: nutritionData.reasoning
    });
  } catch (error) {
    console.error('Meal analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze meal' }, { status: 500 });
  }
}
