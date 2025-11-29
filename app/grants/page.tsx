"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Award, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function GrantsPage() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    category: "DeFi",
    fundingAmount: 10000,
    milestones: [{ title: "", description: "", deadline: "", amount: 0 }],
    teamInfo: {
      size: 1,
      experience: "",
      githubUrl: "",
      previousWork: "",
    },
    technicalDetails: {
      contracts: [""],
      architecture: "",
      timeline: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: "", description: "", deadline: "", amount: 0 }],
    });
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  const submitApplication = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/grants/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Grant application submitted successfully!");
        // Reset form or redirect
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Polygon Grants
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Apply for funding to build your Web3 project on Polygon
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grant Pool</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$10M+</div>
            <p className="text-xs text-gray-500 mt-1">Available funding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects Funded</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">500+</div>
            <p className="text-xs text-gray-500 mt-1">Since launch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Grant</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$25K</div>
            <p className="text-xs text-gray-500 mt-1">Per project</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Grant Application</CardTitle>
          <CardDescription>
            Complete this form to apply for Polygon ecosystem grants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="DeFi Protocol X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="DeFi">DeFi</option>
                  <option value="NFT">NFT</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Tooling">Tooling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (min 100 words) *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  rows={6}
                  placeholder="Describe your project, its goals, and how it benefits the Polygon ecosystem..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.split(" ").filter((w) => w).length} words
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Funding Amount (USD) *</label>
                <input
                  type="number"
                  value={formData.fundingAmount}
                  onChange={(e) => setFormData({ ...formData, fundingAmount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  min="1000"
                  max="100000"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">Between $1,000 and $100,000</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Milestones</h3>
              <Button onClick={addMilestone} variant="outline" size="sm">
                Add Milestone
              </Button>
            </div>
            <div className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      placeholder="Milestone title"
                    />
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      rows={2}
                      placeholder="Milestone description"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={milestone.deadline}
                        onChange={(e) => updateMilestone(index, "deadline", e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                      <input
                        type="number"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, "amount", parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        placeholder="Amount ($)"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline">Save Draft</Button>
            <Button
              onClick={submitApplication}
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-500 mt-1" size={20} />
            <div>
              <p className="font-medium">At least 1 deployed contract</p>
              <p className="text-sm text-gray-600">Deploy and verify a contract on Polygon testnet</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Detailed project description</p>
              <p className="text-sm text-gray-600">Minimum 100 words explaining your project</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Clear milestones</p>
              <p className="text-sm text-gray-600">Break down your project into achievable goals</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="text-yellow-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Review period: 2-4 weeks</p>
              <p className="text-sm text-gray-600">Applications are reviewed on a rolling basis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

