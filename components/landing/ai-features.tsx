"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Shield, 
  Zap, 
  MessageSquare, 
  ArrowRight,
  Code,
  FileCode,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

export function AIFeatures() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Code Assistant",
      description:
        "Get real-time code suggestions, explanations, and improvements powered by GPT-4",
      benefits: [
        "Context-aware suggestions",
        "Security vulnerability detection",
        "Gas optimization tips",
        "Code explanation & documentation",
      ],
      gradient: "from-purple-500 to-pink-500",
      link: "/studio",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Smart Contract Analyzer",
      description:
        "Comprehensive security auditing and best practices analysis for your contracts",
      benefits: [
        "Security vulnerability scanning",
        "Gas optimization opportunities",
        "Code quality suggestions",
        "Best practices enforcement",
      ],
      gradient: "from-blue-500 to-cyan-500",
      link: "/studio",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Cross-Chain Migration",
      description:
        "Migrate contracts from any blockchain to Polygon with AI assistance",
      benefits: [
        "Automatic compatibility analysis",
        "One-click conversion",
        "Polygon optimization",
        "Step-by-step migration guide",
      ],
      gradient: "from-green-500 to-emerald-500",
      link: "/migrate",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-purple-950/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Build Smarter with AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade AI tools that help you learn, build, and deploy
            faster than ever before
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <ul className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href={feature.link}>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-purple-500/10"
                  >
                    Try It Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Interactive Demo
                </Badge>
                <h3 className="text-3xl font-bold text-white mb-4">
                  See AI in Action
                </h3>
                <p className="text-gray-400 mb-6">
                  Experience the power of AI-assisted development. Our intelligent
                  assistant helps you write better code, catch bugs early, and
                  optimize for Polygon&apos;s ecosystem.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/studio">
                    <Button variant="gradient">
                      <Code className="w-4 h-4 mr-2" />
                      Try AI Studio
                    </Button>
                  </Link>
                  <Link href="/migrate">
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Migrate Contract
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-lg bg-black/60 border border-purple-500/20 p-4">
                  <div className="space-y-3">
                    {/* Mock AI Chat */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                        <p className="text-sm text-gray-300">
                          I found a reentrancy vulnerability on line 42. Consider
                          using the checks-effects-interactions pattern.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 ml-auto">
                        <p className="text-sm text-gray-300">
                          Can you suggest a gas optimization?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                        <p className="text-sm text-gray-300">
                          Use uint256 instead of uint8 to save gas on storage
                          operations. Estimated savings: ~2,000 gas per operation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-3xl -z-10" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: "AI Suggestions", value: "10K+" },
            { label: "Bugs Caught", value: "500+" },
            { label: "Gas Saved", value: "95%" },
            { label: "Migrations", value: "100+" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center bg-black/40 border-purple-500/20"
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

