"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface SecurityIssue {
  line: number;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  recommendation: string;
}

interface GasOptimization {
  line: number;
  current: string;
  optimized: string;
  gasSaved: string;
}

interface CodeSuggestion {
  line: number;
  suggestion: string;
  reason: string;
  severity: "info" | "warning" | "error";
}

interface CodeAnalyzerProps {
  code: string;
  onJumpToLine?: (line: number) => void;
}

export function CodeAnalyzer({ code, onJumpToLine }: CodeAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [security, setSecurity] = useState<SecurityIssue[]>([]);
  const [optimizations, setOptimizations] = useState<GasOptimization[]>([]);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  const analyzeCode = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setSecurity(data.security || []);
      setOptimizations(data.optimizations || []);
      setSuggestions(data.suggestions || []);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (
    severity: "low" | "medium" | "high" | "critical" | "info" | "warning" | "error"
  ) => {
    switch (severity) {
      case "critical":
      case "error":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "high":
      case "warning":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
      case "info":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getSeverityIcon = (
    severity: "low" | "medium" | "high" | "critical" | "info" | "warning" | "error"
  ) => {
    switch (severity) {
      case "critical":
      case "error":
        return <XCircle className="w-4 h-4" />;
      case "high":
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const totalIssues = security.length + suggestions.filter(s => s.severity === 'error').length;
  const criticalIssues = security.filter(s => s.severity === 'critical' || s.severity === 'high').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Code Analyzer</h3>
              <p className="text-xs text-gray-400">
                {lastAnalyzed
                  ? `Last analyzed ${lastAnalyzed.toLocaleTimeString()}`
                  : "Not analyzed yet"}
              </p>
            </div>
          </div>
          <Button
            onClick={analyzeCode}
            disabled={analyzing || !code}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Analyze
          </Button>
        </div>

        {lastAnalyzed && (
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400">Security</span>
              </div>
              <div className="text-2xl font-bold text-white">{security.length}</div>
              {criticalIssues > 0 && (
                <Badge className="mt-1 text-xs bg-red-500/20 text-red-300">
                  {criticalIssues} critical
                </Badge>
              )}
            </Card>
            <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Gas</span>
              </div>
              <div className="text-2xl font-bold text-white">{optimizations.length}</div>
            </Card>
            <Card className="p-3 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Suggestions</span>
              </div>
              <div className="text-2xl font-bold text-white">{suggestions.length}</div>
            </Card>
          </div>
        )}
      </div>

      {/* Results */}
      <ScrollArea className="flex-1 p-4">
        {!lastAnalyzed && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">
              Ready to Analyze
            </h4>
            <p className="text-gray-400 text-sm">
              Click &quot;Analyze&quot; to check your code for security issues, gas
              optimizations, and best practices.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Security Issues */}
          {security.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                Security Issues
              </h4>
              <div className="space-y-2">
                {security.map((issue, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${getSeverityColor(
                      issue.severity
                    )}`}
                    onClick={() => onJumpToLine?.(issue.line)}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSeverityColor(issue.severity)}`}
                          >
                            Line {issue.line}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs uppercase ${getSeverityColor(
                              issue.severity
                            )}`}
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-white mb-2">
                          {issue.issue}
                        </p>
                        <p className="text-xs text-gray-400">
                          {issue.recommendation}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Gas Optimizations */}
          {optimizations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Gas Optimizations
              </h4>
              <div className="space-y-2">
                {optimizations.map((opt, index) => (
                  <Card
                    key={index}
                    className="p-4 bg-yellow-500/10 border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                    onClick={() => onJumpToLine?.(opt.line)}
                  >
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                          >
                            Line {opt.line}
                          </Badge>
                          <Badge className="text-xs bg-green-500/20 text-green-300">
                            Save {opt.gasSaved}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Current:</p>
                            <code className="text-xs bg-black/40 px-2 py-1 rounded block text-red-300">
                              {opt.current}
                            </code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Optimized:</p>
                            <code className="text-xs bg-black/40 px-2 py-1 rounded block text-green-300">
                              {opt.optimized}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Code Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Code Quality
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${getSeverityColor(
                      suggestion.severity
                    )}`}
                    onClick={() => onJumpToLine?.(suggestion.line)}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(suggestion.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSeverityColor(
                              suggestion.severity
                            )}`}
                          >
                            Line {suggestion.line}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-white mb-1">
                          {suggestion.suggestion}
                        </p>
                        <p className="text-xs text-gray-400">{suggestion.reason}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {lastAnalyzed && totalIssues === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">
                Looking Good!
              </h4>
              <p className="text-gray-400 text-sm">
                No major issues found in your code.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

