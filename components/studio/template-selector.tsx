"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Image, Users, ShoppingCart, FileCode, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TemplateSelectorProps {
  onSelectTemplate: (template: string) => void
  onClose: () => void
}

const templates = [
  {
    id: "erc20",
    icon: Coins,
    title: "ERC-20 Token",
    description: "Fungible token with mint, burn, and pause capabilities",
    color: "from-polygon-purple to-purple-600",
  },
  {
    id: "nft",
    icon: Image,
    title: "NFT Collection",
    description: "ERC-721 NFT collection with metadata and marketplace",
    color: "from-polygon-blue to-blue-600",
  },
  {
    id: "dao",
    icon: Users,
    title: "DAO Governance",
    description: "Decentralized organization with voting and proposals",
    color: "from-polygon-pink to-pink-600",
  },
  {
    id: "marketplace",
    icon: ShoppingCart,
    title: "NFT Marketplace",
    description: "Buy and sell NFTs with listings and auctions",
    color: "from-purple-500 to-polygon-purple",
  },
  {
    id: "custom",
    icon: FileCode,
    title: "Custom Contract",
    description: "Start from scratch with a blank canvas",
    color: "from-blue-500 to-polygon-blue",
  },
]

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border border-white/10 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background">
            <div>
              <h2 className="text-2xl font-bold">Choose a Template</h2>
              <p className="text-muted-foreground">
                Select a template to start building your dApp
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="glass-effect cursor-pointer hover:border-polygon-purple/50 transition-all h-full"
                    onClick={() => {
                      onSelectTemplate(template.id)
                      onClose()
                    }}
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

