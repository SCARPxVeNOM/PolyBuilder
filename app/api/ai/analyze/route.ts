import { NextRequest, NextResponse } from 'next/server';
import { geminiAssistant } from '@/lib/ai/gemini-assistant';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const analysis = await geminiAssistant.analyzeCode(code);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code. Please check your Gemini API key.' },
      { status: 500 }
    );
  }
}

