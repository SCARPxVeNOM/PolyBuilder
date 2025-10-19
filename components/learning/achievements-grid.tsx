"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACHIEVEMENTS, Achievement } from "@/lib/learning/progress";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

interface AchievementsGridProps {
  unlockedIds: string[];
}

export function AchievementsGrid({ unlockedIds }: AchievementsGridProps) {
  const achievements = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          Unlock badges by completing challenges and milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-lg border-2 text-center transition-all ${
                achievement.unlocked
                  ? "border-polygon-purple bg-polygon-purple/10 hover:bg-polygon-purple/20"
                  : "border-white/10 bg-white/5 opacity-50"
              }`}
            >
              {!achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-sm font-semibold mb-1">{achievement.name}</p>
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <Badge
                variant={achievement.unlocked ? "gradient" : "outline"}
                className="text-xs"
              >
                +{achievement.xpReward} XP
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

