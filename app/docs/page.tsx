"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code2, BookOpen, Rocket, Wrench, Wallet, Code, Zap, Shield, ArrowRight } from "lucide-react"

export default function DocsPage() {
  const sections = [
    {
      icon: Code2,
      title: "Getting Started",
      description: "Set up your development environment",
      link: "/studio",
      items: ["Launch Studio", "Choose Template", "Start Building"],
    },
    {
      icon: BookOpen,
      title: "Learning Path",
      description: "Interactive lessons and tutorials",
      link: "/learn",
      items: ["8+ Lessons", "Progress Tracking", "Earn XP & Badges"],
    },
    {
      icon: Code,
      title: "Code Challenges",
      description: "Practice Solidity programming",
      link: "/challenges",
      items: ["4+ Challenges", "Test Solutions", "Get Hints"],
    },
    {
      icon: Rocket,
      title: "Deployment",
      description: "Deploy to Polygon networks",
      link: "/studio",
      items: ["One-Click Deploy", "Auto Verification", "Track Status"],
    },
    {
      icon: Wallet,
      title: "Wallet Integration",
      description: "Connect and interact with contracts",
      link: "/contracts",
      items: ["RainbowKit", "Multiple Wallets", "Network Switching"],
    },
    {
      icon: Shield,
      title: "Best Practices",
      description: "Security and optimization",
      link: "/learn",
      items: ["Smart Contract Security", "Gas Optimization", "Testing"],
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="gradient" className="px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </Badge>
            <h1 className="text-5xl font-bold">
              <span className="text-gradient">Platform Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, learn, and deploy on Polygon
            </p>
          </div>

          {/* Quick Start */}
          <Card className="glass-effect border-polygon-purple/50">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-polygon-purple" />
                <CardTitle className="text-2xl">Quick Start</CardTitle>
              </div>
              <CardDescription>Get started in 3 simple steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-polygon-purple/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Choose a Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Select from ERC-20, NFT, or DAO templates
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-polygon-purple/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Customize Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Edit your smart contract in our Web IDE
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-polygon-purple/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Deploy</h3>
                  <p className="text-sm text-muted-foreground">
                    One-click deployment to Polygon
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/studio">
                  <Button variant="gradient" size="lg" className="group">
                    Start Building Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={section.link}>
                    <Card className="glass-effect hover:border-polygon-purple/50 transition-all cursor-pointer group h-full">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-polygon-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-polygon-purple" />
                        </div>
                        <CardTitle className="group-hover:text-gradient transition-colors">
                          {section.title}
                        </CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-polygon-purple mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Resources */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>External documentation and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://docs.polygon.technology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-polygon-purple/50 transition-all group"
                >
                  <div>
                    <p className="font-semibold group-hover:text-gradient transition-colors">
                      Polygon Documentation
                    </p>
                    <p className="text-sm text-muted-foreground">Official Polygon docs</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-polygon-purple group-hover:translate-x-1 transition-all" />
                </a>
                <a
                  href="https://docs.soliditylang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-polygon-purple/50 transition-all group"
                >
                  <div>
                    <p className="font-semibold group-hover:text-gradient transition-colors">
                      Solidity Documentation
                    </p>
                    <p className="text-sm text-muted-foreground">Learn Solidity language</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-polygon-purple group-hover:translate-x-1 transition-all" />
                </a>
                <a
                  href="https://hardhat.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-polygon-purple/50 transition-all group"
                >
                  <div>
                    <p className="font-semibold group-hover:text-gradient transition-colors">
                      Hardhat Documentation
                    </p>
                    <p className="text-sm text-muted-foreground">Development framework</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-polygon-purple group-hover:translate-x-1 transition-all" />
                </a>
                <a
                  href="https://www.rainbowkit.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-polygon-purple/50 transition-all group"
                >
                  <div>
                    <p className="font-semibold group-hover:text-gradient transition-colors">
                      RainbowKit Docs
                    </p>
                    <p className="text-sm text-muted-foreground">Wallet connection library</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-polygon-purple group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
