"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Send,
  Loader2,
  Code,
  Shield,
  Zap,
  FileCode,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  currentCode?: string;
  onInsertCode?: (code: string) => void;
}

export function AIChat({ currentCode, onInsertCode }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickPrompts = [
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Review Security",
      prompt: "Review this contract for security vulnerabilities",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Optimize Gas",
      prompt: "Suggest gas optimization improvements",
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: "Explain Code",
      prompt: "Explain what this code does",
    },
    {
      icon: <FileCode className="w-4 h-4" />,
      label: "Generate Tests",
      prompt: "Generate Hardhat tests for this contract",
    },
  ];

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          codeContext: currentCode,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please make sure your OpenAI API key is configured.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const extractCode = (content: string): string | null => {
    const codeMatch = content.match(/```(?:solidity|javascript|typescript)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : null;
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-gray-400 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                AI Code Assistant
              </h4>
              <p className="text-gray-400 text-sm mb-6">
                Ask me anything about your smart contract
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(prompt.prompt)}
                    className="flex items-center gap-2 text-left h-auto py-3"
                  >
                    {prompt.icon}
                    <span className="text-xs">{prompt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-[85%] p-4 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-black/40 border-purple-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === "assistant" && (
                    <div className="p-1.5 rounded-md bg-purple-500/20 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code
                                className="px-1.5 py-0.5 rounded bg-black/40 text-purple-300"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className="block p-3 rounded-lg bg-black/60 text-sm overflow-x-auto"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-500/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(message.content, index)
                          }
                          className="h-7 text-xs"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          {copiedIndex === index ? "Copied" : "Copy"}
                        </Button>
                        {onInsertCode && extractCode(message.content) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const code = extractCode(message.content);
                              if (code) onInsertCode(code);
                            }}
                            className="h-7 text-xs"
                          >
                            <FileCode className="w-3 h-3 mr-1" />
                            Insert Code
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[85%] p-4 bg-black/40 border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-purple-500/20">
        {currentCode && (
          <Badge
            variant="outline"
            className="mb-2 text-xs bg-purple-500/10 border-purple-500/20"
          >
            <Code className="w-3 h-3 mr-1" />
            Analyzing current code
          </Badge>
        )}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your code, request optimizations, or get help..."
            className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-purple-500/20 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

