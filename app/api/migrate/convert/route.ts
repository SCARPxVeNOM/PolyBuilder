import { NextRequest, NextResponse } from 'next/server';
import { geminiMigrationAnalyzer } from '@/lib/ai/gemini-migration';

export async function POST(request: NextRequest) {
  try {
    const { code, sourceChain, targetChain, config } = await request.json();

    if (!code || !sourceChain) {
      return NextResponse.json(
        { error: 'Code and source chain are required' },
        { status: 400 }
      );
    }

    // Convert the contract
    const converted = await geminiMigrationAnalyzer.convertContract(
      code,
      sourceChain,
      targetChain || 'polygon',
      config
    );

    // Analyze for migration guide
    const analysis = await geminiMigrationAnalyzer.analyzeContract(
      code,
      sourceChain,
      targetChain || 'polygon'
    );

    // Generate migration guide
    const guide = await geminiMigrationAnalyzer.generateMigrationGuide(analysis);

    return NextResponse.json({
      convertedCode: converted.convertedCode,
      changes: converted.changes,
      configUpdates: converted.configUpdates,
      guide,
    });
  } catch (error) {
    console.error('Migration Conversion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to convert contract.' },
      { status: 500 }
    );
  }
}

