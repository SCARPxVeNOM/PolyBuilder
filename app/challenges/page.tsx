"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CHALLENGES, ChallengeManager } from "@/lib/learning/challenges";
import { ChallengeEditor } from "@/components/learning/challenge-editor";
import { Code, Check, Lock, Zap } from "lucide-react";

export default function ChallengesPage() {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    const manager = new ChallengeManager();
    setCompletedChallenges(manager.getCompletedChallenges());
  }, []);

  const handleComplete = () => {
    const manager = new ChallengeManager();
    setCompletedChallenges(manager.getCompletedChallenges());
    setSelectedChallenge(null);
  };

  const categories = [...new Set(CHALLENGES.map((c) => c.category))];
  const challenge = CHALLENGES.find((c) => c.id === selectedChallenge);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="gradient" className="px-4 py-2">
              <Code className="w-4 h-4 mr-2" />
              Code Challenges
            </Badge>
            <h1 className="text-5xl font-bold">
              Practice <span className="text-gradient">Smart Contracts</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solve coding challenges and master Solidity development
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-polygon-purple/20 flex items-center justify-center">
                    <Code className="w-6 h-6 text-polygon-purple" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{CHALLENGES.length}</p>
                    <p className="text-sm text-muted-foreground">Total Challenges</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedChallenges.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round((completedChallenges.length / CHALLENGES.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Challenges by Category */}
          {categories.map((category) => (
            <Card key={category} className="glass-effect">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {CHALLENGES.filter((c) => c.category === category && completedChallenges.includes(c.id)).length}/
                  {CHALLENGES.filter((c) => c.category === category).length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CHALLENGES.filter((c) => c.category === category).map((challenge, index) => {
                    const isCompleted = completedChallenges.includes(challenge.id);
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border transition-all ${
                          isCompleted
                            ? "border-green-500/50 bg-green-500/10"
                            : "border-white/10 hover:border-polygon-purple/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold mb-1 flex items-center">
                              {challenge.title}
                              {isCompleted && (
                                <Check className="w-4 h-4 ml-2 text-green-500" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.description}
                            </p>
                            <div className="flex items-center space-x-2">
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
                              <Badge variant="gradient" className="text-xs">
                                +{challenge.xpReward} XP
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={isCompleted ? "outline" : "gradient"}
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedChallenge(challenge.id)}
                        >
                          {isCompleted ? "Review" : "Start Challenge"}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Challenge Editor Modal */}
      {challenge && (
        <ChallengeEditor
          challenge={challenge}
          onClose={() => setSelectedChallenge(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

