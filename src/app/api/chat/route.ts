import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message, strategy } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let systemPrompt = `You are speaking to the user named in the strategy directly. Please keep your responses relatively brief and mostly to the point. Include relevant information by all means, but this is a live chat application with plenty of back and forth, and not a lot of screen space to render exorbitant amounts of text. The "why" is very important. When a question is asked about something, provide as much reassuring detail as you can in a succinct format.---\n\n`;

    systemPrompt = strategy
      ? systemPrompt +
        `You are a helpful O-1 visa assistant. The user is applying with the following strategy: ${JSON.stringify(strategy)}. Help them understand their case, what evidence they need, and answer questions about the O-1 visa process.`
      : systemPrompt + `You are a helpful O-1 visa assistant. Help users understand the O-1 visa process and requirements.`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
