"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Settings, Crown, Shield, Eye, TrendingUp } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  plan: string;
  members: Array<{
    id: string;
    role: string;
    user: {
      name: string;
      image?: string;
      walletAddress?: string;
    };
  }>;
  _count: {
    members: number;
    templates: number;
  };
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const org = await response.json();
        setOrganizations([...organizations, org]);
        setShowCreateDialog(false);
        setFormData({ name: "", slug: "", description: "", website: "" });
        router.push(`/organizations/${org.slug}`);
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown size={16} className="text-yellow-500" />;
      case "admin":
        return <Shield size={16} className="text-blue-500" />;
      case "member":
        return <Users size={16} className="text-green-500" />;
      default:
        return <Eye size={16} className="text-gray-500" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    const variants: Record<string, any> = {
      free: { label: "Free", className: "bg-gray-500" },
      pro: { label: "Pro", className: "bg-blue-500" },
      enterprise: { label: "Enterprise", className: "bg-purple-500" },
    };
    const variant = variants[plan] || variants.free;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Organizations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage teams, templates, and billing for your projects
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="mr-2" size={16} />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Set up a new organization to collaborate with your team
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="My Awesome DAO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="my-awesome-dao"
                />
                <p className="text-xs text-gray-500 mt-1">
                  polybuilder.com/org/{formData.slug || "your-slug"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  rows={3}
                  placeholder="Building the future of Web3..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website (optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createOrganization}
                disabled={!formData.name || !formData.slug}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Create Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-16">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No organizations yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first organization to start collaborating with your team
          </p>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Plus className="mr-2" size={16} />
            Create Organization
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card
              key={org.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/organizations/${org.slug}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="flex items-center gap-2">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="w-8 h-8 rounded" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {org.name[0]}
                      </div>
                    )}
                    {org.name}
                  </CardTitle>
                  {getPlanBadge(org.plan)}
                </div>
                <CardDescription className="line-clamp-2">
                  {org.description || "No description"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{org._count.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} />
                    <span>{org._count.templates} templates</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {org.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="relative" title={member.user.name}>
                      {member.user.image ? (
                        <img
                          src={member.user.image}
                          alt={member.user.name}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium">
                          {member.user.name[0]}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1">
                        {getRoleIcon(member.role)}
                      </div>
                    </div>
                  ))}
                  {org._count.members > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                      +{org._count.members - 3}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/organizations/${org.slug}/settings`);
                  }}
                >
                  <Settings size={16} className="mr-2" />
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

