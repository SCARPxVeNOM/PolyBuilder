"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressCard } from "@/components/learning/progress-card"
import { ProgressManager, UserProgress, ACHIEVEMENTS, LESSONS } from "@/lib/learning/progress"
import { Trophy, Target, Zap, BookOpen, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const router = useRouter()

  useEffect(() => {
    const manager = new ProgressManager()
    setProgress(manager.getProgress())
  }, [])

  if (!progress) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-polygon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const completionRate = Math.round((progress.lessonsCompleted.length / LESSONS.length) * 100)

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Welcome back, <span className="text-gradient">Developer</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your progress and continue building amazing dApps
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Level</p>
                      <p className="text-3xl font-bold">{progress.level}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-polygon-purple to-purple-600 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                      <p className="text-3xl font-bold">{progress.xp}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-polygon-blue to-blue-600 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Lessons</p>
                      <p className="text-3xl font-bold">{progress.lessonsCompleted.length}/{LESSONS.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-polygon-pink to-pink-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Progress</p>
                      <p className="text-3xl font-bold">{completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-polygon-purple flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Card */}
            <div className="lg:col-span-2">
              <ProgressCard progress={progress} />
            </div>

            {/* Quick Actions */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into learning or building</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="gradient"
                  className="w-full justify-between group"
                  onClick={() => router.push("/learn")}
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between group"
                  onClick={() => router.push("/studio")}
                >
                  Open Studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between group"
                  onClick={() => router.push("/contracts")}
                >
                  Interact with Contracts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>
                    {progress.achievementsUnlocked.length} of {ACHIEVEMENTS.length} unlocked
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/learn")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACHIEVEMENTS.slice(0, 4).map((achievement) => {
                  const unlocked = progress.achievementsUnlocked.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg text-center transition-all ${
                        unlocked
                          ? "bg-polygon-purple/20 border border-polygon-purple/50"
                          : "bg-white/5 border border-white/10 opacity-50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

