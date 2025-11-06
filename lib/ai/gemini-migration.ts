import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export class GeminiMigrationAnalyzer {
  private model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

  async analyzeContract(
    code: string,
    sourceChain: string,
    targetChain: string = 'polygon'
  ): Promise<MigrationAnalysis> {
    try {
      const prompt = `Analyze this smart contract for migration from ${sourceChain} to Polygon ${targetChain}.

Provide a detailed analysis in JSON format with this structure:
{
  "sourceChain": "${sourceChain}",
  "targetChain": "${targetChain}",
  "contractType": "<ERC-20|ERC-721|DeFi|DAO|etc>",
  "dependencies": ["<list of dependencies>"],
  "issues": [
    {
      "severity": "low|medium|high|critical",
      "issue": "<issue description>",
      "solution": "<how to fix>",
      "autoFixable": true|false
    }
  ],
  "estimatedGas": "<gas estimate>",
  "recommendations": ["<list of recommendations>"]
}

Contract:
\`\`\`solidity
${code}
\`\`\`

Return ONLY valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : response;
      const analysis = JSON.parse(jsonText);

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

Return JSON with this structure:
{
  "originalCode": "<original contract>",
  "convertedCode": "<optimized contract for Polygon>",
  "changes": [
    {
      "line": <number>,
      "type": "modified|added|removed",
      "original": "<original code>",
      "updated": "<new code>",
      "reason": "<why changed>"
    }
  ],
  "configUpdates": {
    "<key>": "<value>"
  }
}

Contract:
\`\`\`solidity
${code}
\`\`\`

${config ? `\nCurrent config:\n${JSON.stringify(config, null, 2)}` : ''}

Return ONLY valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : response;
      const parsedResult = JSON.parse(jsonText);

      return {
        originalCode: code,
        convertedCode: parsedResult.convertedCode || code,
        changes: parsedResult.changes || [],
        configUpdates: parsedResult.configUpdates || {},
      };
    } catch (error) {
      console.error('Contract Conversion Error:', error);
      throw new Error('Failed to convert contract.');
    }
  }

  async generateMigrationGuide(analysis: MigrationAnalysis): Promise<string> {
    try {
      const prompt = `Generate a detailed step-by-step migration guide for moving a ${analysis.contractType} from ${analysis.sourceChain} to Polygon ${analysis.targetChain}.

Context:
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

      const result = await this.model.generateContent(prompt);
      return result.response.text();
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

export const geminiMigrationAnalyzer = new GeminiMigrationAnalyzer();

