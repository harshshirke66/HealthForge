import { NextResponse } from 'next/server';
import { groq } from '@/lib/config';

export async function POST(req: Request) {
  try {
    const { level = 'beginner' } = await req.json();

    const prompt = `You are an expert personal trainer. Generate a daily home workout for a ${level} level user. 
    The workout MUST require NO EQUIPMENT (bodyweight only). 
    It should take around 15-20 minutes.
    
    Return the response ONLY as a valid JSON object with the following structure:
    {
      "title": "String (e.g. Full Body HIIT, Core Burner, etc.)",
      "description": "String (short motivational description)",
      "warmup": ["String", "String"],
      "exercises": [
        {
          "name": "String",
          "reps": "String (e.g. 10 reps or 30 seconds)",
          "sets": "Number"
        }
      ],
      "cooldown": ["String", "String"]
    }
    
    Do not use markdown wrappers. Output only the JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      max_tokens: 600,
      temperature: 0.7,
    });

    let responseData = chatCompletion.choices[0].message.content;
    
    if (!responseData) {
      throw new Error("No response from AI");
    }

    // Parse the JSON
    let cleanData = responseData.trim();
    if (cleanData.includes('```')) {
        cleanData = cleanData.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    const workoutPlan = JSON.parse(cleanData);

    return NextResponse.json({ success: true, workout: workoutPlan });
  } catch (error) {
    console.error('AI Fitness Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
