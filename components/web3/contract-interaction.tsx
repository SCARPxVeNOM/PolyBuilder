"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContractRead, useContractWrite } from "@/lib/web3/hooks/useContract";
import { Address, formatEther, parseEther } from "viem";
import { Loader2, ExternalLink } from "lucide-react";

interface ContractInteractionProps {
  contractAddress: Address;
  contractABI: any[];
  contractName: string;
}

export function ContractInteraction({
  contractAddress,
  contractABI,
  contractName,
}: ContractInteractionProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // Read contract data
  const { data: name } = useContractRead(contractAddress, contractABI, "name");
  const { data: symbol } = useContractRead(contractAddress, contractABI, "symbol");
  const { data: totalSupply } = useContractRead(contractAddress, contractABI, "totalSupply");
  const { data: balance } = useContractRead(
    contractAddress,
    contractABI,
    "balanceOf",
    address ? [address] : undefined
  );

  // Write contract
  const { write, isPending, isConfirming, isConfirmed, error, hash } = useContractWrite();

  const handleTransfer = () => {
    if (!transferTo || !transferAmount) return;

    write({
      address: contractAddress,
      abi: contractABI,
      functionName: "transfer",
      args: [transferTo as Address, parseEther(transferAmount)],
    });
  };

  const explorerUrl =
    chainId === 80001
      ? "https://mumbai.polygonscan.com"
      : chainId === 80002
      ? "https://amoy.polygonscan.com"
      : "https://polygonscan.com";

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contract: {contractName}</CardTitle>
            <a
              href={`${explorerUrl}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-polygon-purple hover:text-polygon-blue transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {contractAddress}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Connect your wallet to interact</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold">{(name ? String(name) : "Loading...")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Symbol</p>
                  <p className="font-semibold">{(symbol ? String(symbol) : "Loading...")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Supply</p>
                  <p className="font-semibold">
                    {totalSupply ? formatEther(BigInt(String(totalSupply))) : "Loading..."}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
                  <p className="font-semibold">
                    {balance ? formatEther(BigInt(String(balance))) : "0"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="font-semibold mb-4">Transfer Tokens</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      To Address
                    </label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg focus:border-polygon-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg focus:border-polygon-purple focus:outline-none"
                    />
                  </div>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={handleTransfer}
                    disabled={!transferTo || !transferAmount || isPending || isConfirming}
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isPending ? "Confirm in wallet..." : "Confirming..."}
                      </>
                    ) : (
                      "Transfer"
                    )}
                  </Button>
                </div>
              </div>

              {isConfirmed && hash && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-sm text-green-400 mb-1">✓ Transaction successful!</p>
                  <a
                    href={`${explorerUrl}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-polygon-purple hover:text-polygon-blue flex items-center"
                  >
                    View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-400">Error: {error.message}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

