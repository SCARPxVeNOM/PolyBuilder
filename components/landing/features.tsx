"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Code2, 
  Zap, 
  Shield, 
  BookOpen, 
  GitBranch, 
  Sparkles,
  Terminal,
  Award
} from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "Interactive IDE",
    description: "Monaco editor with syntax highlighting, auto-complete, and real-time error detection",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Deploy to Polygon testnet in under 2 minutes with automatic contract verification",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Built-in security checks and best practices for smart contract development",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Step-by-step tutorials with real-time feedback and progress tracking",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description: "Auto-generate repositories and deploy to Vercel with one click",
  },
  {
    icon: Sparkles,
    title: "Beautiful UI",
    description: "Modern, responsive interface built with Next.js and Tailwind CSS",
  },
  {
    icon: Terminal,
    title: "Live Console",
    description: "Real-time logs and debugging information during deployment",
  },
  {
    icon: Award,
    title: "Gamified Progress",
    description: "Earn XP, unlock badges, and level up as you build and learn",
  },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Everything You <span className="text-gradient">Need</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A complete developer platform for building on Polygon
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="glass-effect h-full hover:border-polygon-purple/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-polygon-purple/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-polygon-purple" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

