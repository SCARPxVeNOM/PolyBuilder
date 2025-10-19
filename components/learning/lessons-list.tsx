"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LESSONS, Lesson } from "@/lib/learning/progress";
import { Check, Lock, Play, Star } from "lucide-react";
import { motion } from "framer-motion";

interface LessonsListProps {
  completedIds: string[];
  onStartLesson: (lessonId: string) => void;
}

export function LessonsList({ completedIds, onStartLesson }: LessonsListProps) {
  const lessons = LESSONS.map((lesson) => ({
    ...lesson,
    completed: completedIds.includes(lesson.id),
  }));

  const categories = [...new Set(lessons.map((l) => l.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-500";
      case "intermediate":
        return "text-yellow-500";
      case "advanced":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category} className="glass-effect">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {lessons.filter((l) => l.category === category && l.completed).length}/
              {lessons.filter((l) => l.category === category).length} completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons
              .filter((l) => l.category === category)
              .map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    lesson.completed
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-white/10 hover:border-polygon-purple/50 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        lesson.completed
                          ? "bg-green-500/20"
                          : "bg-polygon-purple/20"
                      }`}
                    >
                      {lesson.completed ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Play className="w-5 h-5 text-polygon-purple" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(lesson.difficulty)}
                        >
                          {lesson.difficulty}
                        </Badge>
                        <Badge variant="gradient" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          +{lesson.xpReward} XP
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={lesson.completed ? "outline" : "gradient"}
                    size="sm"
                    onClick={() => onStartLesson(lesson.id)}
                    disabled={lesson.completed}
                  >
                    {lesson.completed ? "Completed" : "Start"}
                  </Button>
                </motion.div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

