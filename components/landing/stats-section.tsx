"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Zap, Users, Rocket } from "lucide-react";

const stats = [
  {
    icon: Code,
    value: "8+",
    label: "Interactive Lessons",
    description: "Learn blockchain development",
    color: "from-polygon-purple to-purple-600",
  },
  {
    icon: Zap,
    value: "4+",
    label: "Code Challenges",
    description: "Practice Solidity skills",
    color: "from-polygon-blue to-blue-600",
  },
  {
    icon: Users,
    value: "3+",
    label: "Smart Contract Templates",
    description: "Deploy in one click",
    color: "from-polygon-pink to-pink-600",
  },
  {
    icon: Rocket,
    value: "9+",
    label: "Achievement Badges",
    description: "Unlock as you learn",
    color: "from-purple-500 to-polygon-purple",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Master Polygon</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete platform for learning, building, and deploying on Polygon
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:border-polygon-purple/50 transition-all group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold mb-2 text-gradient">{stat.value}</div>
                    <div className="text-lg font-semibold mb-1">{stat.label}</div>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

