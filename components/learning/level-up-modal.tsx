"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap } from "lucide-react";
import { triggerConfetti } from "@/lib/utils/confetti";
import { useEffect } from "react";

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-br from-polygon-purple/20 to-polygon-blue/20 border-2 border-polygon-purple rounded-2xl p-12 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-polygon-purple/30 via-transparent to-polygon-blue/30 animate-pulse" />
        </div>

        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-polygon-purple to-polygon-blue flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Level Up Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold mb-2 text-gradient">Level Up!</h2>
          <p className="text-muted-foreground mb-6">
            Congratulations! You&apos;ve reached level
          </p>
          <div className="text-7xl font-bold text-gradient mb-6">{level}</div>
          
          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-semibold">+50 Bonus XP</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <Zap className="w-6 h-6 mx-auto mb-2 text-polygon-purple" />
              <p className="text-sm font-semibold">New Features</p>
            </div>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            Continue Learning
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

