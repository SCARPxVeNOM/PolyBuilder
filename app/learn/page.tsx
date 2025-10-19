"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProgressCard } from "@/components/learning/progress-card";
import { AchievementsGrid } from "@/components/learning/achievements-grid";
import { LessonsList } from "@/components/learning/lessons-list";
import { LevelUpModal } from "@/components/learning/level-up-modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressManager, UserProgress, LESSONS } from "@/lib/learning/progress";
import { BookOpen, Trophy, Target, Sparkles, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LearnPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const manager = new ProgressManager();
    setProgress(manager.getProgress());
  }, []);

  const handleStartLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
    setShowLessonModal(true);
  };

  const handleCompleteLesson = () => {
    if (!currentLesson) return;

    const manager = new ProgressManager();
    const oldLevel = progress?.level || 1;
    const newProgress = manager.completeLesson(currentLesson);
    
    // Check for level up
    if (newProgress.level > oldLevel) {
      setNewLevel(newProgress.level);
      setShowLevelUp(true);
    }
    
    setProgress(newProgress);
    setShowLessonModal(false);
    setCurrentLesson(null);
  };

  const lesson = LESSONS.find((l) => l.id === currentLesson);

  if (!progress) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-polygon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

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
              <Sparkles className="w-4 h-4 mr-2" />
              Learning Platform
            </Badge>
            <h1 className="text-5xl font-bold">
              Learn <span className="text-gradient">Polygon Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master smart contract development with interactive lessons and earn XP
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-polygon-purple/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-polygon-purple" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{LESSONS.length}</p>
                    <p className="text-sm text-muted-foreground">Total Lessons</p>
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
                    <p className="text-2xl font-bold">{progress.lessonsCompleted.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-polygon-blue/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-polygon-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round((progress.lessonsCompleted.length / LESSONS.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{progress.achievementsUnlocked.length}</p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lessons */}
            <div className="lg:col-span-2">
              <LessonsList
                completedIds={progress.lessonsCompleted}
                onStartLesson={handleStartLesson}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ProgressCard progress={progress} />

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={() => router.push("/studio")}
                  >
                    Open Studio
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/docs")}
                  >
                    View Docs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievements */}
          <AchievementsGrid unlockedIds={progress.achievementsUnlocked} />
        </motion.div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && lesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background">
              <div>
                <h2 className="text-2xl font-bold">{lesson.title}</h2>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
              <button
                onClick={() => setShowLessonModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Lesson Content */}
              <div className="prose prose-invert max-w-none">
                <h3>Overview</h3>
                <p>
                  This is a {lesson.difficulty} level lesson about {lesson.title.toLowerCase()}.
                </p>

                <h3>What You&apos;ll Learn</h3>
                <ul>
                  <li>Core concepts and fundamentals</li>
                  <li>Practical examples and use cases</li>
                  <li>Best practices and tips</li>
                  <li>Hands-on exercises</li>
                </ul>

                <h3>Prerequisites</h3>
                <p>
                  {lesson.difficulty === "beginner"
                    ? "No prior knowledge required! This lesson is perfect for beginners."
                    : lesson.difficulty === "intermediate"
                    ? "Basic understanding of blockchain and Solidity recommended."
                    : "Advanced knowledge of smart contracts and Solidity required."}
                </p>

                <div className="bg-polygon-purple/10 border border-polygon-purple/20 rounded-lg p-4 not-prose">
                  <p className="text-sm">
                    <strong>💡 Note:</strong> This is a demo lesson. In the full version, you&apos;ll
                    find detailed content, code examples, interactive quizzes, and hands-on
                    challenges!
                  </p>
                </div>
              </div>

              {/* Complete Button */}
              <div className="flex space-x-3">
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={handleCompleteLesson}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Lesson (+{lesson.xpReward} XP)
                </Button>
                <Button variant="outline" onClick={() => setShowLessonModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          level={newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  );
}

