"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Download, Settings, FileCode, Lightbulb } from "lucide-react";

interface QuickActionsProps {
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
}

export function QuickActions({ onSave, onExport, onSettings }: QuickActionsProps) {
  const actions = [
    {
      icon: Save,
      label: "Save Project",
      onClick: onSave,
      shortcut: "Ctrl+S",
    },
    {
      icon: Download,
      label: "Export Project",
      onClick: onExport,
      shortcut: "Ctrl+E",
    },
    {
      icon: FileCode,
      label: "Format Code",
      onClick: () => {},
      shortcut: "Ctrl+Shift+F",
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: onSettings,
      shortcut: "Ctrl+,",
    },
  ];

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-3">
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={action.onClick}
                      className="hover:bg-white/5"
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {action.label}
                      <span className="ml-2 text-muted-foreground">{action.shortcut}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            
            {/* Tips Button */}
            <div className="ml-auto pl-2 border-l border-white/10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-polygon-purple/20 border-polygon-purple/50 hover:bg-polygon-purple/30"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Tips
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">View helpful tips and shortcuts</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

