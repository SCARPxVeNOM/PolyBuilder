"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Code, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ContractAnalytic {
  id: string;
  contractName: string;
  contractAddress: string;
  blockchain: string;
  optimizationScore?: number;
  securityScore?: number;
  totalGasSpent: number;
  totalTransactions: number;
  createdAt: string;
  metadata?: any;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ContractAnalytic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ContractAnalytic | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/contract");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageScores = analytics.length > 0 ? {
    optimization: Math.round(analytics.reduce((acc: number, a) => acc + (a.optimizationScore || 0), 0) / analytics.length),
    security: Math.round(analytics.reduce((acc: number, a) => acc + (a.securityScore || 0), 0) / analytics.length),
  } : { optimization: 0, security: 0 };

  const totalGasSpent = analytics.reduce((acc: number, a) => acc + a.totalGasSpent, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Contract Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Performance insights, gas optimization, and quality metrics for your smart contracts
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <Code className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.length}</div>
                <p className="text-xs text-gray-500 mt-1">Analyzed contracts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Optimization</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{averageScores.optimization}%</div>
                <p className="text-xs text-gray-500 mt-1">Gas efficiency score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Security</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{averageScores.security}%</div>
                <p className="text-xs text-gray-500 mt-1">Security score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Gas Spent</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalGasSpent.toFixed(2)}</div>
                <p className="text-xs text-gray-500 mt-1">Total gas costs</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Optimization & security scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.slice(-10).map((a, i) => ({
                    name: a.contractName,
                    optimization: a.optimizationScore || 0,
                    security: a.securityScore || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="optimization" stroke="#8b5cf6" name="Optimization" />
                    <Line type="monotone" dataKey="security" stroke="#3b82f6" name="Security" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gas Usage by Contract</CardTitle>
                <CardDescription>Total gas spent per contract</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.slice(0, 10).map(a => ({
                    name: a.contractName,
                    gas: a.totalGasSpent,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="gas" fill="#8b5cf6" name="Gas ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Contract List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contracts</CardTitle>
              <CardDescription>Click on a contract to view detailed analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{contract.contractName}</h3>
                      <p className="text-sm text-gray-500">
                        {contract.contractAddress.slice(0, 10)}...{contract.contractAddress.slice(-8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">Optimization</div>
                        <Badge variant={contract.optimizationScore && contract.optimizationScore > 70 ? "default" : "destructive"}>
                          {contract.optimizationScore || 0}%
                        </Badge>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-medium">Security</div>
                        <Badge variant={contract.securityScore && contract.securityScore > 70 ? "default" : "destructive"}>
                          {contract.securityScore || 0}%
                        </Badge>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">Gas Spent</div>
                        <div className="font-semibold">${contract.totalGasSpent.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {analytics.length === 0 && (
                  <div className="text-center py-12">
                    <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No analytics yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Analyze your first contract to see performance insights
                    </p>
                    <Button onClick={() => window.location.href = "/studio"}>
                      Go to Studio
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

