"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Image, Users, ShoppingCart, FileCode, ArrowRight } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    icon: Coins,
    title: "ERC-20 Token",
    description: "Create and deploy your own fungible token with custom supply and features",
    features: ["Mintable", "Burnable", "Pausable"],
    color: "from-polygon-purple to-purple-600",
  },
  {
    icon: Image,
    title: "NFT Collection",
    description: "Launch your NFT collection with metadata, minting, and marketplace integration",
    features: ["ERC-721", "IPFS Storage", "Royalties"],
    color: "from-polygon-blue to-blue-600",
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Build a decentralized organization with voting and proposal systems",
    features: ["Voting", "Proposals", "Treasury"],
    color: "from-polygon-pink to-pink-600",
  },
  {
    icon: ShoppingCart,
    title: "NFT Marketplace",
    description: "Create a full-featured marketplace for buying and selling NFTs",
    features: ["Listings", "Auctions", "Offers"],
    color: "from-purple-500 to-polygon-purple",
  },
  {
    icon: FileCode,
    title: "Custom Contract",
    description: "Start from scratch with a blank canvas and build anything you imagine",
    features: ["Full Control", "Custom Logic", "Your Rules"],
    color: "from-blue-500 to-polygon-blue",
  },
]

export function TemplateCards() {
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
            Choose Your <span className="text-gradient">Template</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Start with a pre-built template and customize it to your needs
          </motion.p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {templates.map((template, index) => {
            const Icon = template.icon
            return (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="glass-effect h-full flex flex-col group hover:border-polygon-purple/50 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{template.title}</CardTitle>
                    <CardDescription className="text-base">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      {template.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-polygon-purple mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link href={`/studio?template=${template.title.toLowerCase().replace(/\s+/g, '-')}`} className="w-full">
                      <Button variant="outline" className="w-full group/btn">
                        Start Building
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

