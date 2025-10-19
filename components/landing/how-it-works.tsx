"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileCode, Settings, Rocket, GraduationCap } from "lucide-react"

const steps = [
  {
    icon: FileCode,
    title: "Choose Template",
    description: "Select from pre-built dApp templates or start from scratch",
    step: "01",
  },
  {
    icon: Settings,
    title: "Customize",
    description: "Edit smart contracts and frontend code in our interactive IDE",
    step: "02",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "One-click deploy to Polygon testnet with automatic verification",
    step: "03",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    description: "Follow interactive tutorials and level up your Web3 skills",
    step: "04",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background to-polygon-purple/5">
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
            How It <span className="text-gradient">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            From zero to deployed dApp in just four simple steps
          </motion.p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-polygon-purple to-transparent -z-10" />
                  )}

                  <Card className="glass-effect text-center h-full hover:border-polygon-purple/50 transition-all duration-300">
                    <CardHeader className="space-y-4">
                      <div className="relative mx-auto">
                        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-polygon-purple/20 blur-xl" />
                        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-polygon-purple to-polygon-blue flex items-center justify-center mx-auto">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-gradient mb-2">
                          {step.step}
                        </div>
                        <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

