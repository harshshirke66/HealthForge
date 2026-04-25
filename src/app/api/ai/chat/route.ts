import { NextResponse } from 'next/server';
import { groq, query } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Context Gathering: Fetch recent user data to personalize the AI response
    const recentMeals = await query(
      'SELECT name, calories FROM meals WHERE user_id = $1 ORDER BY id DESC LIMIT 3',
      [userId]
    );
    
    const latestWeight = await query(
      'SELECT weight FROM weight_logs WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
      [userId]
    );

    const context = `
      User Stats:
      - Latest weight: ${latestWeight.rows[0]?.weight || 'Not logged'} kg
      - Recent meals: ${recentMeals.rows.map(m => `${m.name} (${m.calories}kcal)`).join(', ') || 'None logged today'}
    `;

    const systemPrompt = `
      You are HealthForge AI, a premium personalized health coach. 
      Use the provided user context to give specific, encouraging, and science-based health advice.
      Be concise and maintain a professional yet friendly tone.
      
      ${context}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama3-70b-8192',
    });

    return NextResponse.json({
      response: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
