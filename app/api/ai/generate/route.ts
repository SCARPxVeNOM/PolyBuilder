import { NextRequest, NextResponse } from 'next/server';
import { geminiAssistant } from '@/lib/ai/gemini-assistant';

export async function POST(request: NextRequest) {
  try {
    const { prompt, template } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const code = await geminiAssistant.generateCode(prompt, template);

    return NextResponse.json({ code });
  } catch (error) {
    console.error('AI Generation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code. Please check your Gemini API key.' },
      { status: 500 }
    );
  }
}

