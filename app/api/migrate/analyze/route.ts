import { NextRequest, NextResponse } from 'next/server';
import { geminiMigrationAnalyzer } from '@/lib/ai/gemini-migration';

export async function POST(request: NextRequest) {
  try {
    const { code, sourceChain, targetChain } = await request.json();

    if (!code || !sourceChain) {
      return NextResponse.json(
        { error: 'Code and source chain are required' },
        { status: 400 }
      );
    }

    const analysis = await geminiMigrationAnalyzer.analyzeContract(
      code,
      sourceChain,
      targetChain || 'polygon'
    );

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Migration Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze contract for migration.' },
      { status: 500 }
    );
  }
}

