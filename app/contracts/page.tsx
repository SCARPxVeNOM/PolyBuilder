"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContractInteraction } from "@/components/web3/contract-interaction";
import { NetworkSwitcher } from "@/components/web3/network-switcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Coins, Image, Users } from "lucide-react";

// Example ERC-20 ABI (simplified)
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function ContractsPage() {
  const { isConnected } = useAccount();
  const [customAddress, setCustomAddress] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              Contract <span className="text-gradient">Interactions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your wallet and interact with deployed smart contracts
            </p>
          </div>

          {/* Connect Wallet Section */}
          {!isConnected ? (
            <Card className="glass-effect">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Connect your wallet to interact with smart contracts on Polygon
                </p>
                <ConnectButton />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Custom Contract Input */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Interact with Contract</CardTitle>
                    <CardDescription>
                      Enter a contract address or select from examples
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Contract Address
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                          placeholder="0x..."
                          className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg focus:border-polygon-purple focus:outline-none"
                        />
                        <Button
                          variant="gradient"
                          onClick={() => setShowCustom(true)}
                          disabled={!customAddress || !customAddress.startsWith("0x")}
                        >
                          Load
                        </Button>
                      </div>
                    </div>

                    {/* Example Contracts */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Or try an example:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            setCustomAddress("0x0000000000000000000000000000000000001010");
                            setShowCustom(true);
                          }}
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          MATIC Token
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          disabled
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Example NFT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          disabled
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Example DAO
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contract Interaction */}
                {showCustom && customAddress && (
                  <ContractInteraction
                    contractAddress={customAddress as Address}
                    contractABI={ERC20_ABI}
                    contractName="Custom Contract"
                  />
                )}

                {!showCustom && (
                  <Card className="glass-effect">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground text-center">
                        Enter a contract address or deploy one from the Studio to get started
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Network Switcher */}
                <NetworkSwitcher />

                {/* Info Card */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Deploy contracts from the Studio</p>
                    <p>• Switch networks as needed</p>
                    <p>• Confirm transactions in your wallet</p>
                    <p>• Check transaction status on Polygonscan</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

