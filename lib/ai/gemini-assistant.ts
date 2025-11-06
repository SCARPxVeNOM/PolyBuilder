import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export class GeminiAssistant {
  private conversationHistory: AIMessage[] = [];
  private model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

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

      // Build conversation context for Gemini
      const conversationText = this.conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');

      const fullPrompt = `${conversationText}\n\nUser: ${userMessage}${contextMessage}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      this.conversationHistory.push({
        role: 'user',
        content: userMessage + contextMessage,
      });

      this.conversationHistory.push({
        role: 'assistant',
        content: text,
      });

      return text;
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      throw new Error('Failed to get AI response. Please check your Gemini API key.');
    }
  }

  async analyzeCode(code: string): Promise<{
    security: SecurityIssue[];
    optimizations: GasOptimization[];
    suggestions: CodeSuggestion[];
  }> {
    try {
      const prompt = `Analyze this Solidity smart contract and provide a detailed analysis in JSON format.

Return ONLY valid JSON with this exact structure:
{
  "security": [
    {
      "line": <number>,
      "issue": "<description>",
      "severity": "low|medium|high|critical",
      "recommendation": "<fix recommendation>"
    }
  ],
  "optimizations": [
    {
      "line": <number>,
      "current": "<current code>",
      "optimized": "<optimized code>",
      "gasSaved": "<estimated savings>"
    }
  ],
  "suggestions": [
    {
      "line": <number>,
      "suggestion": "<suggestion>",
      "reason": "<reason>",
      "severity": "info|warning|error"
    }
  ]
}

Contract:
\`\`\`solidity
${code}
\`\`\`

Respond with ONLY the JSON, no other text.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response (Gemini might add extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonText);

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

      const fullPrompt = `You are an expert Solidity developer. Generate a clean, secure, well-documented smart contract.

Task: Generate a Solidity smart contract for: ${prompt}${templateContext}

Return ONLY the Solidity code, no explanations or markdown formatting.`;

      const result = await this.model.generateContent(fullPrompt);
      const text = result.response.text();
      
      // Clean up response - remove markdown if present
      const codeMatch = text.match(/```(?:solidity)?\n([\s\S]*?)\n```/);
      return codeMatch ? codeMatch[1] : text;
    } catch (error) {
      console.error('Code Generation Error:', error);
      throw new Error('Failed to generate code.');
    }
  }

  async explainCode(code: string, question?: string): Promise<string> {
    try {
      const promptText = question
        ? `Explain this Solidity code with focus on: ${question}\n\nCode:\n\`\`\`solidity\n${code}\n\`\`\``
        : `Explain what this Solidity code does:\n\`\`\`solidity\n${code}\n\`\`\``;

      const result = await this.model.generateContent(promptText);
      return result.response.text();
    } catch (error) {
      console.error('Code Explanation Error:', error);
      throw new Error('Failed to explain code.');
    }
  }

  async fixCode(code: string, error: string): Promise<string> {
    try {
      const prompt = `You are a debugging expert. Fix this Solidity error and return the corrected code.

Error: ${error}

Code:
\`\`\`solidity
${code}
\`\`\`

Return ONLY the corrected Solidity code, no explanations.`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean up response
      const codeMatch = text.match(/```(?:solidity)?\n([\s\S]*?)\n```/);
      return codeMatch ? codeMatch[1] : text;
    } catch (error) {
      console.error('Code Fix Error:', error);
      throw new Error('Failed to fix code.');
    }
  }

  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep system message
  }
}

export const geminiAssistant = new GeminiAssistant();

