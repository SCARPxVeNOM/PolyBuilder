import { NextRequest, NextResponse } from 'next/server';
import { geminiAssistant } from '@/lib/ai/gemini-assistant';

export async function POST(request: NextRequest) {
  try {
    const { message, codeContext } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await geminiAssistant.chat(message, codeContext);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request. Please check your Gemini API key.' },
      { status: 500 }
    );
  }
}

