"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Upload,
  Search,
  Code,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  Download,
  ExternalLink,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MigrationStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface MigrationAnalysis {
  sourceChain: string;
  targetChain: string;
  contractType: string;
  dependencies: string[];
  issues: Array<{
    severity: string;
    issue: string;
    solution: string;
    autoFixable: boolean;
  }>;
  estimatedGas: string;
  recommendations: string[];
}

export function MigrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceCode, setSourceCode] = useState("");
  const [sourceChain, setSourceChain] = useState("Ethereum");
  const [targetNetwork, setTargetNetwork] = useState<"mumbai" | "amoy" | "polygon">("amoy");
  const [analyzing, setAnalyzing] = useState(false);
  const [converting, setConverting] = useState(false);
  const [analysis, setAnalysis] = useState<MigrationAnalysis | null>(null);
  const [convertedCode, setConvertedCode] = useState("");
  const [migrationGuide, setMigrationGuide] = useState("");

  const steps: MigrationStep[] = [
    {
      id: 0,
      title: "Upload Contract",
      description: "Paste your smart contract code",
      icon: <Upload className="w-5 h-5" />,
    },
    {
      id: 1,
      title: "Analyze",
      description: "AI analyzes compatibility",
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Convert",
      description: "Auto-convert for Polygon",
      icon: <Code className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Deploy",
      description: "Deploy to Polygon testnet",
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  const supportedChains = [
    { name: "Ethereum", icon: "⟠" },
    { name: "Binance Smart Chain", icon: "🟡" },
    { name: "Avalanche", icon: "🔺" },
    { name: "Arbitrum", icon: "🔷" },
    { name: "Optimism", icon: "🔴" },
    { name: "Fantom", icon: "👻" },
    { name: "Base", icon: "🔵" },
  ];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/migrate/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: sourceCode,
          sourceChain,
          targetChain: targetNetwork,
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setAnalysis(data.analysis);
      setCurrentStep(2);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const response = await fetch("/api/migrate/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: sourceCode,
          sourceChain,
          targetChain: targetNetwork,
        }),
      });

      if (!response.ok) throw new Error("Conversion failed");

      const data = await response.json();
      setConvertedCode(data.convertedCode);
      setMigrationGuide(data.guide);
      setCurrentStep(3);
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setConverting(false);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([convertedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MigratedContract.sol";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep >= step.id
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500"
                      : "bg-black/40 border-purple-500/20"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 transition-all ${
                    currentStep > step.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-purple-500/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-black/40 border-purple-500/20 p-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Upload Your Smart Contract
              </h3>
              <p className="text-gray-400">
                Paste your existing smart contract code to migrate to Polygon
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Source Blockchain
              </label>
              <div className="grid grid-cols-4 gap-2">
                {supportedChains.map((chain) => (
                  <Button
                    key={chain.name}
                    variant={sourceChain === chain.name ? "default" : "outline"}
                    onClick={() => setSourceChain(chain.name)}
                    className="h-16 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{chain.icon}</span>
                    <span className="text-xs">{chain.name.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Target Network
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={targetNetwork === "mumbai" ? "default" : "outline"}
                  onClick={() => setTargetNetwork("mumbai")}
                >
                  Mumbai (Testnet)
                </Button>
                <Button
                  variant={targetNetwork === "amoy" ? "default" : "outline"}
                  onClick={() => setTargetNetwork("amoy")}
                >
                  Amoy (Testnet)
                </Button>
                <Button
                  variant={targetNetwork === "polygon" ? "default" : "outline"}
                  onClick={() => setTargetNetwork("polygon")}
                >
                  Polygon PoS
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contract Code
              </label>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your contract code here&#10;}"
                className="w-full h-64 px-4 py-3 rounded-lg bg-black/40 border border-purple-500/20 text-white placeholder-gray-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <Button
              onClick={() => setCurrentStep(1)}
              disabled={!sourceCode.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                AI Analysis in Progress
              </h3>
              <p className="text-gray-400 mb-6">
                Analyzing your contract for Polygon compatibility...
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm text-white">Detecting contract type</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm text-white">Analyzing dependencies</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                <span className="text-sm text-white">Checking compatibility issues</span>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Start Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {currentStep === 2 && analysis && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Analysis Complete
              </h3>
              <p className="text-gray-400">
                Review the compatibility analysis before converting
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">Contract Type</div>
                <div className="text-lg font-bold text-white">
                  {analysis.contractType}
                </div>
              </Card>
              <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">Estimated Gas</div>
                <div className="text-lg font-bold text-white">
                  {analysis.estimatedGas}
                </div>
              </Card>
            </div>

            {analysis.dependencies.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.dependencies.map((dep, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-300">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.issues.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Compatibility Issues
                </h4>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <Card
                        key={index}
                        className={`p-4 ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={`text-xs uppercase ${getSeverityColor(
                                  issue.severity
                                )}`}
                              >
                                {issue.severity}
                              </Badge>
                              {issue.autoFixable && (
                                <Badge className="text-xs bg-green-500/20 text-green-300">
                                  Auto-fixable
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-white mb-1">
                              {issue.issue}
                            </p>
                            <p className="text-xs text-gray-400">
                              {issue.solution}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleConvert}
              disabled={converting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {converting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  Convert to Polygon
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {currentStep === 3 && convertedCode && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Migration Complete! 🎉
              </h3>
              <p className="text-gray-400">
                Your contract has been optimized for Polygon
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">
                  Converted Contract
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCode}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <ScrollArea className="h-64 w-full">
                <pre className="p-4 rounded-lg bg-black/60 text-sm text-white font-mono overflow-x-auto">
                  {convertedCode}
                </pre>
              </ScrollArea>
            </div>

            {migrationGuide && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Migration Guide
                </h4>
                <Card className="p-4 bg-black/40 border-purple-500/20">
                  <ScrollArea className="h-48">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {migrationGuide}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => window.open("/studio", "_blank")}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Code className="w-4 h-4 mr-2" />
                Open in Studio
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setCurrentStep(0);
                  setSourceCode("");
                  setAnalysis(null);
                  setConvertedCode("");
                }}
              >
                Migrate Another
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

