"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, Wallet } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-polygon-purple/20 via-polygon-blue/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-polygon-purple/30 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-12 rounded-2xl max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Build on <span className="text-gradient">Polygon</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers building the future of Web3. Start learning, building, and
              deploying today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-polygon-purple/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-polygon-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <p className="text-sm text-muted-foreground">
                Interactive lessons and coding challenges
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-polygon-blue/20 flex items-center justify-center">
                <Code className="w-8 h-8 text-polygon-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build</h3>
              <p className="text-sm text-muted-foreground">
                Use our Web IDE with templates and tools
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-polygon-pink/20 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-polygon-pink" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Deploy</h3>
              <p className="text-sm text-muted-foreground">
                One-click deployment to Polygon networks
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio">
              <Button variant="gradient" size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" size="lg">
                Explore Learning Paths
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

