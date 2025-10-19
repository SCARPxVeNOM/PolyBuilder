export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}

export interface UserProgress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: string[];
  achievementsUnlocked: string[];
  lastActivityDate?: Date;
}

const XP_PER_LEVEL = 1000;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL;
}

export function getXpProgress(xp: number, level: number): number {
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-deploy",
    name: "First Deploy",
    description: "Deploy your first smart contract",
    icon: "🚀",
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "token-creator",
    name: "Token Creator",
    description: "Deploy an ERC-20 token contract",
    icon: "🪙",
    xpReward: 150,
    unlocked: false,
  },
  {
    id: "nft-artist",
    name: "NFT Artist",
    description: "Deploy an NFT collection",
    icon: "🎨",
    xpReward: 150,
    unlocked: false,
  },
  {
    id: "dao-builder",
    name: "DAO Builder",
    description: "Deploy a DAO governance system",
    icon: "🏛️",
    xpReward: 200,
    unlocked: false,
  },
  {
    id: "verified",
    name: "Verified Developer",
    description: "Verify a contract on Polygonscan",
    icon: "✅",
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete 5 lessons in one day",
    icon: "⚡",
    xpReward: 250,
    unlocked: false,
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    xpReward: 300,
    unlocked: false,
  },
  {
    id: "solidity-expert",
    name: "Solidity Expert",
    description: "Complete all Solidity lessons",
    icon: "🧠",
    xpReward: 500,
    unlocked: false,
  },
  {
    id: "master-builder",
    name: "Master Builder",
    description: "Complete all learning paths",
    icon: "👑",
    xpReward: 1000,
    unlocked: false,
  },
];

export const LESSONS: Lesson[] = [
  {
    id: "intro-blockchain",
    title: "Introduction to Blockchain",
    description: "Learn the basics of blockchain technology",
    category: "Fundamentals",
    difficulty: "beginner",
    xpReward: 50,
    completed: false,
  },
  {
    id: "intro-polygon",
    title: "What is Polygon?",
    description: "Understanding Polygon and Layer 2 solutions",
    category: "Fundamentals",
    difficulty: "beginner",
    xpReward: 50,
    completed: false,
  },
  {
    id: "solidity-basics",
    title: "Solidity Basics",
    description: "Learn the fundamentals of Solidity programming",
    category: "Solidity",
    difficulty: "beginner",
    xpReward: 100,
    completed: false,
  },
  {
    id: "erc20-standard",
    title: "ERC-20 Token Standard",
    description: "Understanding fungible tokens and the ERC-20 standard",
    category: "Tokens",
    difficulty: "intermediate",
    xpReward: 150,
    completed: false,
  },
  {
    id: "nft-basics",
    title: "NFTs and ERC-721",
    description: "Learn about non-fungible tokens and the ERC-721 standard",
    category: "NFTs",
    difficulty: "intermediate",
    xpReward: 150,
    completed: false,
  },
  {
    id: "dao-governance",
    title: "DAO Governance",
    description: "Understanding decentralized autonomous organizations",
    category: "DeFi",
    difficulty: "advanced",
    xpReward: 200,
    completed: false,
  },
  {
    id: "security-basics",
    title: "Smart Contract Security",
    description: "Learn common vulnerabilities and how to avoid them",
    category: "Security",
    difficulty: "intermediate",
    xpReward: 200,
    completed: false,
  },
  {
    id: "gas-optimization",
    title: "Gas Optimization",
    description: "Techniques to reduce gas costs in your contracts",
    category: "Optimization",
    difficulty: "advanced",
    xpReward: 250,
    completed: false,
  },
];

export class ProgressManager {
  private storageKey = "polygon-scaffold-progress";

  getProgress(): UserProgress {
    if (typeof window === "undefined") {
      return this.getDefaultProgress();
    }

    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return this.getDefaultProgress();
    }

    try {
      return JSON.parse(stored);
    } catch {
      return this.getDefaultProgress();
    }
  }

  saveProgress(progress: UserProgress): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  addXP(amount: number): UserProgress {
    const progress = this.getProgress();
    progress.xp += amount;
    progress.level = calculateLevel(progress.xp);
    progress.lastActivityDate = new Date();
    this.saveProgress(progress);
    return progress;
  }

  completeLesson(lessonId: string): UserProgress {
    const progress = this.getProgress();
    if (!progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted.push(lessonId);
      const lesson = LESSONS.find((l) => l.id === lessonId);
      if (lesson) {
        progress.xp += lesson.xpReward;
        progress.level = calculateLevel(progress.xp);
      }
    }
    progress.lastActivityDate = new Date();
    this.updateStreak(progress);
    this.saveProgress(progress);
    return progress;
  }

  unlockAchievement(achievementId: string): UserProgress {
    const progress = this.getProgress();
    if (!progress.achievementsUnlocked.includes(achievementId)) {
      progress.achievementsUnlocked.push(achievementId);
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (achievement) {
        progress.xp += achievement.xpReward;
        progress.level = calculateLevel(progress.xp);
      }
    }
    this.saveProgress(progress);
    return progress;
  }

  private updateStreak(progress: UserProgress): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!progress.lastActivityDate) {
      progress.currentStreak = 1;
    } else {
      const lastActivity = new Date(progress.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        progress.currentStreak += 1;
      } else {
        progress.currentStreak = 1;
      }
    }

    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }
  }

  private getDefaultProgress(): UserProgress {
    return {
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lessonsCompleted: [],
      achievementsUnlocked: [],
    };
  }

  resetProgress(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.storageKey);
  }
}

