"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="h-6 bg-background/95 backdrop-blur-sm border-t border-white/10 flex items-center justify-between px-4 text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-green-500">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-500" />
              <span className="text-red-500">Offline</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-3 h-3 text-polygon-purple" />
          <span className="text-muted-foreground">Ready</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-muted-foreground">
          {time.toLocaleTimeString()}
        </span>
        <Badge variant="outline" className="text-xs">
          Polygon Studio v0.5.0
        </Badge>
      </div>
    </div>
  );
}

