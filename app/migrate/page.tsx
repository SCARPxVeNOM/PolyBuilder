"use client";

import { Suspense } from "react";
import { MigrationWizard } from "@/components/migrate/migration-wizard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function MigratePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-purple-950/10 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Migration
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Migrate to Polygon in Minutes
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Bring your smart contracts from any blockchain to Polygon with
            AI-assisted migration
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-400 text-sm">
              Our AI analyzes your contract and identifies compatibility issues
              automatically
            </p>
          </Card>

          <Card className="p-6 bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Optimized for Polygon
            </h3>
            <p className="text-gray-400 text-sm">
              Automatically optimize your contracts for Polygon&apos;s gas costs and
              features
            </p>
          </Card>

          <Card className="p-6 bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Security First
            </h3>
            <p className="text-gray-400 text-sm">
              Every migration includes a security audit and best practices review
            </p>
          </Card>
        </div>

        {/* Supported Chains */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Migrate From Any Chain
            </h2>
            <p className="text-gray-400">
              We support contracts from all major blockchains
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Ethereum", icon: "⟠" },
              { name: "BSC", icon: "🟡" },
              { name: "Avalanche", icon: "🔺" },
              { name: "Arbitrum", icon: "🔷" },
              { name: "Optimism", icon: "🔴" },
              { name: "Fantom", icon: "👻" },
              { name: "Base", icon: "🔵" },
            ].map((chain) => (
              <Card
                key={chain.name}
                className="px-6 py-3 bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chain.icon}</span>
                  <span className="text-white font-medium">{chain.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Migration Wizard */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
          }
        >
          <MigrationWizard />
        </Suspense>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Upload Contract",
                description: "Paste your smart contract code",
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI analyzes compatibility",
              },
              {
                step: "3",
                title: "Auto-Convert",
                description: "Contract optimized for Polygon",
              },
              {
                step: "4",
                title: "Deploy",
                description: "One-click deployment to testnet",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-purple-400 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div>
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="h-12 w-px bg-purple-500/20" />
            <div>
              <div className="text-3xl font-bold text-white mb-1">&lt; 5 min</div>
              <div className="text-sm text-gray-400">Avg Migration Time</div>
            </div>
            <div className="h-12 w-px bg-purple-500/20" />
            <div>
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-sm text-gray-400">Gas Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

