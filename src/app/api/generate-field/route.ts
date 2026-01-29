import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { fieldLabel, instanceTitle, criterionName, keyPoints, metrics, userWords } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are helping someone fill out a field for their O-1 visa application.

Criterion: ${criterionName}
Instance: ${instanceTitle}
Field to fill: ${fieldLabel}

The user provided these details:
- Key points they want to convey: ${keyPoints}
- Relevant metrics or numbers: ${metrics || 'None provided'}
- Their own words / tone preference: ${userWords || 'None provided'}

Write a clear, professional, and compelling 2-4 sentence response for this field.
It should read naturally — not like a template. Be specific, use the metrics provided,
and frame it in a way that strengthens an O-1 visa case.
Respond with ONLY the written text. No preamble, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ generated: text });
  } catch (error) {
    console.error('Generate field error:', error);
    return NextResponse.json({ error: 'Failed to generate text', details: (error as Error).message }, { status: 500 });
  }
}
