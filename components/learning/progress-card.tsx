"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Target } from "lucide-react";
import { UserProgress, calculateLevel, getXpForNextLevel, getXpProgress } from "@/lib/learning/progress";

interface ProgressCardProps {
  progress: UserProgress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  const xpForNext = getXpForNextLevel(progress.level);
  const progressPercent = getXpProgress(progress.xp, progress.level);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Progress</CardTitle>
          <Badge variant="gradient" className="text-lg px-4 py-2">
            Level {progress.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">XP</span>
            <span className="font-semibold">
              {progress.xp} / {xpForNext}
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.ceil(xpForNext - progress.xp)} XP to level {progress.level + 1}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-polygon-purple/10">
            <div className="w-10 h-10 rounded-lg bg-polygon-purple/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-polygon-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.xp}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-polygon-blue/10">
            <div className="w-10 h-10 rounded-lg bg-polygon-blue/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-polygon-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.lessonsCompleted.length}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-500/10">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/10">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.achievementsUnlocked.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

