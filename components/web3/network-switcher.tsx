"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain, isPending } = useSwitchChain();

  const getNetworkName = (id: number) => {
    switch (id) {
      case 80001:
        return "Mumbai Testnet";
      case 80002:
        return "Amoy Testnet";
      case 137:
        return "Polygon Mainnet";
      default:
        return "Unknown Network";
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-lg">Network</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current:</span>
          <Badge variant="gradient">{getNetworkName(chainId)}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Switch to:</p>
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant={chainId === chain.id ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => switchChain({ chainId: chain.id })}
              disabled={isPending || chainId === chain.id}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                chain.name
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

