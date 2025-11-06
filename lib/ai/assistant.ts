import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CodeSuggestion {
  line: number;
  suggestion: string;
  reason: string;
  severity: 'info' | 'warning' | 'error';
}

export interface SecurityIssue {
  line: number;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface GasOptimization {
  line: number;
  current: string;
  optimized: string;
  gasSaved: string;
}

export class AIAssistant {
  private conversationHistory: AIMessage[] = [];

  constructor() {
    this.conversationHistory = [
      {
        role: 'system',
        content: `You are an expert Solidity and smart contract developer assistant for PolyBuilder, a Polygon development platform. 
        
Your expertise includes:
- Solidity smart contract development and best practices
- Polygon PoS, zkEVM, and Ethereum development
- Security auditing (reentrancy, overflow, access control)
- Gas optimization techniques
- ERC standards (20, 721, 1155, 4626)
- DeFi protocols and patterns
- Testing with Hardhat and Foundry

Provide concise, actionable advice. When reviewing code:
- Identify security vulnerabilities
- Suggest gas optimizations
- Recommend best practices
- Explain complex concepts simply

Always prioritize security and efficiency.`,
      },
    ];
  }

  async chat(userMessage: string, codeContext?: string): Promise<string> {
    try {
      const contextMessage = codeContext
        ? `\n\nCurrent code context:\n\`\`\`solidity\n${codeContext}\n\`\`\``
        : '';

      this.conversationHistory.push({
        role: 'user',
        content: userMessage + contextMessage,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using gpt-4o-mini (faster, cheaper, available to all)
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 1500,
      });

      const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get AI response. Please check your API key.');
    }
  }

  async analyzeCode(code: string): Promise<{
    security: SecurityIssue[];
    optimizations: GasOptimization[];
    suggestions: CodeSuggestion[];
  }> {
    try {
      const prompt = `Analyze this Solidity smart contract and provide:
1. Security issues (line number, issue, severity, recommendation)
2. Gas optimization opportunities (line number, current code, optimized version, estimated gas saved)
3. Code quality suggestions (line number, suggestion, reason, severity)

Format as JSON with keys: security, optimizations, suggestions

Contract:
\`\`\`solidity
${code}
\`\`\``;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a smart contract security auditor. Respond only with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const analysis = JSON.parse(response.choices[0]?.message?.content || '{}');

      return {
        security: analysis.security || [],
        optimizations: analysis.optimizations || [],
        suggestions: analysis.suggestions || [],
      };
    } catch (error) {
      console.error('Code Analysis Error:', error);
      return { security: [], optimizations: [], suggestions: [] };
    }
  }

  async generateCode(prompt: string, template?: string): Promise<string> {
    try {
      const templateContext = template
        ? `\n\nBased on this template:\n\`\`\`solidity\n${template}\n\`\`\``
        : '';

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Solidity developer. Generate clean, secure, well-documented smart contract code.',
          },
          {
            role: 'user',
            content: `Generate a Solidity smart contract for: ${prompt}${templateContext}\n\nReturn only the code, no explanations.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Code Generation Error:', error);
      throw new Error('Failed to generate code.');
    }
  }

  async explainCode(code: string, question?: string): Promise<string> {
    try {
      const prompt = question
        ? `Explain this code with focus on: ${question}\n\nCode:\n\`\`\`solidity\n${code}\n\`\`\``
        : `Explain what this code does:\n\`\`\`solidity\n${code}\n\`\`\``;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a smart contract educator. Explain code clearly and concisely.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Code Explanation Error:', error);
      throw new Error('Failed to explain code.');
    }
  }

  async fixCode(code: string, error: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a debugging expert. Fix code errors and return corrected code.' },
          {
            role: 'user',
            content: `Fix this error: ${error}\n\nCode:\n\`\`\`solidity\n${code}\n\`\`\`\n\nReturn only the corrected code.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || code;
    } catch (error) {
      console.error('Code Fix Error:', error);
      throw new Error('Failed to fix code.');
    }
  }

  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep system message
  }
}

export const aiAssistant = new AIAssistant();

