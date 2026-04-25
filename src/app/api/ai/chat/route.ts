import { NextResponse } from 'next/server';
import { groq } from '@/lib/config';

// Simple in-memory rate limiter
const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 5000; // 5 seconds between AI requests

export async function POST(request: Request) {
  try {
    const { message, userId, format } = await request.json();

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
    const isJson = format === 'json';
    const systemPrompt = isJson 
      ? `You are HealthForge AI. Analyze the user's daily data and provide exactly 3 short, actionable health insights. You MUST return ONLY a JSON object with this exact format: {"insights": ["insight 1", "insight 2", "insight 3"]}. Do not use markdown.`
      : `You are HealthForge AI. Concise & helpful health coach. Max 2 sentences. Use Neobrutalist tone: bold, direct, and energetic.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: isJson ? { type: 'json_object' } : undefined,
      max_tokens: isJson ? 300 : 150, 
      temperature: 0.7,
    });

    let responseData: any = chatCompletion.choices[0].message.content;
    
    if (isJson) {
       try {
         // Clean up markdown block if present
         let cleanData = responseData || '{}';
         if (cleanData.includes('```')) {
            cleanData = cleanData.replace(/```json/g, '').replace(/```/g, '').trim();
         }
         responseData = JSON.parse(cleanData);
       } catch (e) {
         responseData = { insights: ["Eat more protein", "Drink more water", "Get 8 hours of sleep"] };
       }
    }

    return NextResponse.json({ response: responseData });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'AI Assistant is resting. Try again later.' }, { status: 500 });
  }
}
