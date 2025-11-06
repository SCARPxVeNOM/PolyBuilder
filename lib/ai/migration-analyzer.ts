import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface MigrationAnalysis {
  sourceChain: string;
  targetChain: 'polygon' | 'polygonAmoy' | 'polygonMumbai';
  contractType: string;
  dependencies: string[];
  issues: MigrationIssue[];
  estimatedGas: string;
  recommendations: string[];
}

export interface MigrationIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  solution: string;
  autoFixable: boolean;
}

export interface ConvertedContract {
  originalCode: string;
  convertedCode: string;
  changes: CodeChange[];
  configUpdates: Record<string, any>;
}

export interface CodeChange {
  line: number;
  type: 'modified' | 'added' | 'removed';
  original?: string;
  updated: string;
  reason: string;
}

export class MigrationAnalyzer {
  async analyzeContract(
    code: string,
    sourceChain: string,
    targetChain: string = 'polygon'
  ): Promise<MigrationAnalysis> {
    try {
      const prompt = `Analyze this smart contract for migration from ${sourceChain} to Polygon ${targetChain}.

Identify:
1. Contract type (ERC-20, ERC-721, DeFi, etc.)
2. External dependencies
3. Potential compatibility issues
4. Required changes for Polygon
5. Estimated gas differences
6. Migration recommendations

Format as JSON with keys: sourceChain, targetChain, contractType, dependencies, issues, estimatedGas, recommendations

Contract:
\`\`\`solidity
${code}
\`\`\``;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain migration expert specializing in Polygon. Respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const analysis = JSON.parse(response.choices[0]?.message?.content || '{}');

      return {
        sourceChain: analysis.sourceChain || sourceChain,
        targetChain: targetChain as any,
        contractType: analysis.contractType || 'Unknown',
        dependencies: analysis.dependencies || [],
        issues: analysis.issues || [],
        estimatedGas: analysis.estimatedGas || 'N/A',
        recommendations: analysis.recommendations || [],
      };
    } catch (error) {
      console.error('Migration Analysis Error:', error);
      throw new Error('Failed to analyze contract for migration.');
    }
  }

  async convertContract(
    code: string,
    sourceChain: string,
    targetChain: string = 'polygon',
    config?: Record<string, any>
  ): Promise<ConvertedContract> {
    try {
      const prompt = `Convert this smart contract from ${sourceChain} to Polygon ${targetChain}.

Requirements:
- Update network-specific addresses (if any)
- Optimize for Polygon gas costs
- Ensure EIP-1559 compatibility
- Update any chain-specific features
- Maintain functionality and security
- Add Polygon-specific optimizations

Return JSON with keys: originalCode, convertedCode, changes (array of {line, type, original, updated, reason}), configUpdates

Contract:
\`\`\`solidity
${code}
\`\`\`

${config ? `\n\nCurrent config:\n${JSON.stringify(config, null, 2)}` : ''}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a smart contract migration expert. Convert contracts for optimal Polygon performance. Respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');

      return {
        originalCode: code,
        convertedCode: result.convertedCode || code,
        changes: result.changes || [],
        configUpdates: result.configUpdates || {},
      };
    } catch (error) {
      console.error('Contract Conversion Error:', error);
      throw new Error('Failed to convert contract.');
    }
  }

  async generateMigrationGuide(analysis: MigrationAnalysis): Promise<string> {
    try {
      const prompt = `Generate a step-by-step migration guide for moving a ${analysis.contractType} from ${analysis.sourceChain} to Polygon ${analysis.targetChain}.

Analysis:
- Dependencies: ${analysis.dependencies.join(', ')}
- Issues found: ${analysis.issues.length}
- Estimated gas: ${analysis.estimatedGas}

Include:
1. Pre-migration checklist
2. Step-by-step instructions
3. Testing recommendations
4. Deployment steps
5. Post-migration verification

Format in markdown.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a technical writer specializing in blockchain migration guides.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Guide Generation Error:', error);
      return '# Migration Guide\n\nFailed to generate guide. Please try again.';
    }
  }

  detectSourceChain(code: string): string {
    // Simple heuristic detection
    if (code.includes('BSC') || code.includes('BNB') || code.includes('Binance')) return 'Binance Smart Chain';
    if (code.includes('Avalanche') || code.includes('AVAX')) return 'Avalanche';
    if (code.includes('Fantom') || code.includes('FTM')) return 'Fantom';
    if (code.includes('Arbitrum')) return 'Arbitrum';
    if (code.includes('Optimism')) return 'Optimism';
    if (code.includes('Base')) return 'Base';
    return 'Ethereum';
  }

  async estimateGasDifference(sourceChain: string, contractType: string): Promise<{
    sourceCost: string;
    polygonCost: string;
    savings: string;
  }> {
    // Rough estimates based on average gas costs
    const gasCosts: Record<string, number> = {
      Ethereum: 50,
      'Binance Smart Chain': 5,
      Avalanche: 25,
      Fantom: 1,
      Arbitrum: 0.5,
      Optimism: 0.5,
      Polygon: 0.02,
    };

    const sourceGas = gasCosts[sourceChain] || 50;
    const polygonGas = gasCosts.Polygon;
    const savings = ((sourceGas - polygonGas) / sourceGas) * 100;

    return {
      sourceCost: `$${sourceGas.toFixed(2)}`,
      polygonCost: `$${polygonGas.toFixed(4)}`,
      savings: `${savings.toFixed(1)}%`,
    };
  }
}

export const migrationAnalyzer = new MigrationAnalyzer();

