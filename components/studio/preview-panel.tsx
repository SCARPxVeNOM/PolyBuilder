"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DeviceType = "desktop" | "tablet" | "mobile"

export function PreviewPanel() {
  const [device, setDevice] = useState<DeviceType>("desktop")

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Device selector toolbar */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDevice("desktop")}
            className={cn(
              device === "desktop" && "bg-polygon-purple/20"
            )}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDevice("tablet")}
            className={cn(
              device === "tablet" && "bg-polygon-purple/20"
            )}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDevice("mobile")}
            className={cn(
              device === "mobile" && "bg-polygon-purple/20"
            )}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-gradient-to-br from-background to-polygon-purple/5">
        <div
          className="bg-white h-full transition-all duration-300 rounded-lg shadow-2xl"
          style={{ width: deviceWidths[device], maxWidth: "100%" }}
        >
          <iframe
            title="Preview"
            className="w-full h-full rounded-lg"
            srcDoc={`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>dApp Preview</title>
                <style>
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    padding: 2rem;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .container {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 100%;
                  }
                  h1 {
                    color: #8247e5;
                    margin: 0 0 1rem;
                  }
                  p {
                    color: #666;
                    line-height: 1.6;
                  }
                  button {
                    background: linear-gradient(135deg, #8247e5 0%, #2891f9 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                  }
                  button:hover {
                    transform: scale(1.05);
                  }
                  .info {
                    background: #f3f4f6;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>🚀 dApp Preview</h1>
                  <p>This is a live preview of your dApp frontend. Deploy your contract to see it in action!</p>
                  
                  <div class="info">
                    <strong>Status:</strong> Not connected<br>
                    <strong>Network:</strong> Mumbai Testnet<br>
                    <strong>Contract:</strong> Not deployed
                  </div>
                  
                  <button onclick="alert('Connect your wallet and deploy the contract first!')">
                    Connect Wallet
                  </button>
                </div>
              </body>
              </html>
            `}
          />
        </div>
      </div>
    </div>
  )
}

