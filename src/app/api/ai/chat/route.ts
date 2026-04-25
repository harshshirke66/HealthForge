import { NextResponse } from 'next/server';
import { groq } from '@/lib/config';

// Simple in-memory rate limiter
const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 5000; // 5 seconds between AI requests

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    // 1. Rate Limiting Check
    const now = Date.now();
    const lastTime = lastRequestTime.get(userId || 'anonymous') || 0;
    if (now - lastTime < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: 'Please wait a few seconds between messages.' }, 
        { status: 429 }
      );
    }
    lastRequestTime.set(userId || 'anonymous', now);

    // 2. Optimized Prompt (Lower Token Usage)
    const systemPrompt = `You are HealthForge AI. Concise & helpful health coach. 
    Max 2 sentences. Use Neobrutalist tone: bold, direct, and energetic.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 150, // Strict limit to save tokens
      temperature: 0.7,
    });

    const response = chatCompletion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'AI Assistant is resting. Try again later.' }, { status: 500 });
  }
}
