import { Pool } from '@neondatabase/serverless';
import Groq from 'groq-sdk';

// Database
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// AI
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
