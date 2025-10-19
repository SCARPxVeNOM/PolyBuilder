"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Challenge, ChallengeManager } from "@/lib/learning/challenges";
import { ProgressManager } from "@/lib/learning/progress";
import { triggerConfetti } from "@/lib/utils/confetti";
import { Check, Lightbulb, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

interface ChallengeEditorProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: () => void;
}

export function ChallengeEditor({ challenge, onClose, onComplete }: ChallengeEditorProps) {
  const [code, setCode] = useState(challenge.initialCode);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTest = () => {
    // Simple validation - check if code contains key elements
    const hasStateVariable = code.includes("uint") || code.includes("string") || code.includes("address");
    const hasFunction = code.includes("function");
    const hasVisibility = code.includes("public") || code.includes("private");

    if (!hasStateVariable || !hasFunction || !hasVisibility) {
      setTestResult({
        success: false,
        message: "Your code is missing some required elements. Check the hints!",
      });
      return;
    }

    // If all basic checks pass, consider it a success
    setTestResult({
      success: true,
      message: "Great job! Your solution passes all tests! 🎉",
    });
    
    triggerConfetti();
  };

  const handleSubmit = () => {
    const challengeManager = new ChallengeManager();
    const progressManager = new ProgressManager();

    challengeManager.completeChallenge(challenge.id);
    progressManager.addXP(challenge.xpReward);

    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background border border-white/10 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold">{challenge.title}</h2>
              <Badge
                variant="outline"
                className={
                  challenge.difficulty === "beginner"
                    ? "text-green-500"
                    : challenge.difficulty === "intermediate"
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {challenge.difficulty}
              </Badge>
              <Badge variant="gradient">+{challenge.xpReward} XP</Badge>
            </div>
            <p className="text-muted-foreground">{challenge.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold">Your Solution</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hints
                </Button>
                <Button variant="outline" size="sm" onClick={handleTest}>
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="sol"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-96 border-l border-white/10 flex flex-col overflow-hidden">
            <Tabs defaultValue="instructions" className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Challenge</h4>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>

                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-polygon-purple/10 border border-polygon-purple/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Hints
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          {challenge.hints.map((hint, i) => (
                            <li key={i}>• {hint}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 ${
                      testResult.success
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <p className="text-sm">{testResult.message}</p>
                    {testResult.success && (
                      <Button
                        variant="gradient"
                        size="sm"
                        className="w-full mt-3"
                        onClick={handleSubmit}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Submit Solution
                      </Button>
                    )}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="tests" className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Test Cases</h4>
                  <div className="space-y-3">
                    {challenge.testCases.map((test, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-lg p-3"
                      >
                        <p className="text-sm font-medium mb-1">Test {i + 1}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Input: {test.input}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expected: {test.expectedOutput}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-sm text-yellow-500">
                    ⚠️ Viewing the solution will reduce your XP reward by 50%
                  </p>
                </div>

                {!showSolution ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSolution(true)}
                  >
                    Show Solution
                  </Button>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs">
                      <code>{challenge.solution}</code>
                    </pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

