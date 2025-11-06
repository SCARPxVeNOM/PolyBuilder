"use client"

import { useState } from "react"
import { FileExplorer } from "./file-explorer"
import { CodeEditor } from "./code-editor"
import { ConsolePanel } from "./console-panel"
import { PreviewPanel } from "./preview-panel"
import { TemplateSelector } from "./template-selector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, Download, Settings, Terminal, Eye, FolderOpen, Sparkles, Shield } from "lucide-react"
import { ProgressManager } from "@/lib/learning/progress"
import { triggerConfetti } from "@/lib/utils/confetti"
import { QuickActions } from "./quick-actions"
import { StatusBar } from "./status-bar"
import { AIChat } from "@/components/ai/ai-chat"
import { CodeAnalyzer } from "@/components/ai/code-analyzer"

interface StudioLayoutProps {
  initialTemplate?: string
}

export function StudioLayout({ initialTemplate = "erc20" }: StudioLayoutProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>("contracts/Token.sol")
  const [showPreview, setShowPreview] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [template, setTemplate] = useState(initialTemplate)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null)
  const [currentCode, setCurrentCode] = useState("")

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    addLog("🚀 Starting deployment process...")
    addLog("📝 Preparing contract files...")

    try {
      // Import the deployment service
      const { DeploymentService } = await import("@/lib/services/deployment-service")
      const { templates } = await import("@/lib/templates")

      const currentTemplate = templates[template]
      if (!currentTemplate) {
        throw new Error("Template not found")
      }

      // Prepare files for deployment
      const files = Object.entries(currentTemplate.files)
        .filter(([path]) => path.endsWith(".sol"))
        .map(([path, content]) => ({ path, content }))

      // Determine main contract name based on template
      const mainContract = template === "erc20" 
        ? "MyToken" 
        : template === "nft" 
        ? "MyNFT" 
        : "MyGovernor"

      // Create deployment service
      const deploymentService = new DeploymentService(
        (status) => setDeploymentStatus(status),
        (log) => addLog(log)
      )

      // Deploy
      const result = await deploymentService.deployFullProject({
        files,
        mainContract,
        constructorArgs: template === "erc20" ? ["My Token", "MTK"] : [],
        network: "mumbai",
        autoVerify: true,
      })

      if (result.stage === "completed") {
        addLog("🎉 Deployment completed successfully!")
        addLog(`📍 Contract Address: ${result.contractAddress}`)
        addLog(`🔗 Explorer: ${result.explorerUrl}`)
        
        // Unlock achievements
        const progressManager = new ProgressManager()
        
        // First deploy achievement
        const currentProgress = progressManager.getProgress()
        if (currentProgress.achievementsUnlocked.length === 0) {
          progressManager.unlockAchievement("first-deploy")
          addLog("🏆 Achievement Unlocked: First Deploy (+100 XP)")
        }
        
        // Template-specific achievements
        if (template === "erc20") {
          progressManager.unlockAchievement("token-creator")
          addLog("🏆 Achievement Unlocked: Token Creator (+150 XP)")
        } else if (template === "nft") {
          progressManager.unlockAchievement("nft-artist")
          addLog("🏆 Achievement Unlocked: NFT Artist (+150 XP)")
        } else if (template === "dao") {
          progressManager.unlockAchievement("dao-builder")
          addLog("🏆 Achievement Unlocked: DAO Builder (+200 XP)")
        }
        
        // Verification achievement
        if (result.verified) {
          progressManager.unlockAchievement("verified")
          addLog("🏆 Achievement Unlocked: Verified Developer (+100 XP)")
        }
        
        // Trigger confetti celebration
        triggerConfetti();
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <>
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={(newTemplate) => {
            setTemplate(newTemplate)
            setSelectedFile(null)
            setLogs([])
          }}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      <div className="flex h-screen pt-16 bg-background">
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 border-r border-white/10 flex flex-col bg-background/50 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-sm">File Explorer</h2>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="p-1 hover:bg-white/5 rounded transition-colors"
              title="Change Template"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
          <FileExplorer
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            template={template}
          />
        </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedFile || "No file selected"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="gradient" 
              size="sm"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Deploy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>
        </div>

        {/* Editor + Preview Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className={showPreview ? "w-1/2" : "w-full"}>
            <CodeEditor 
              selectedFile={selectedFile} 
              template={template}
              onCodeChange={setCurrentCode}
            />
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 border-l border-white/10">
              <PreviewPanel />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Console/Logs */}
      <div className="w-96 border-l border-white/10 flex flex-col bg-background/50 backdrop-blur-sm">
        <Tabs defaultValue="ai" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent">
            <TabsTrigger value="ai" className="data-[state=active]:bg-polygon-purple/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="data-[state=active]:bg-polygon-purple/20">
              <Shield className="w-4 h-4 mr-2" />
              Analyzer
            </TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-polygon-purple/20">
              <Terminal className="w-4 h-4 mr-2" />
              Console
            </TabsTrigger>
            <TabsTrigger value="contract" className="data-[state=active]:bg-polygon-purple/20">
              <Settings className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="flex-1 m-0">
            <AIChat currentCode={currentCode} />
          </TabsContent>
          <TabsContent value="analyzer" className="flex-1 m-0">
            <CodeAnalyzer code={currentCode} />
          </TabsContent>
          <TabsContent value="console" className="flex-1 m-0">
            <ConsolePanel logs={logs} />
          </TabsContent>
          <TabsContent value="contract" className="flex-1 m-0 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Contract Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>Mumbai Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compiler:</span>
                    <span>Solidity 0.8.20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={deploymentStatus?.stage === "completed" ? "text-green-500" : ""}>
                      {deploymentStatus?.stage === "completed" ? "✓ Deployed" : "Not deployed"}
                    </span>
                  </div>

                  {deploymentStatus?.contractAddress && (
                    <>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="text-xs font-semibold mb-2">Deployment Info</div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground text-xs">Contract Address:</span>
                        <span className="font-mono text-xs break-all">{deploymentStatus.contractAddress}</span>
                      </div>
                      {deploymentStatus.transactionHash && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-muted-foreground text-xs">Transaction:</span>
                          <span className="font-mono text-xs break-all">{deploymentStatus.transactionHash}</span>
                        </div>
                      )}
                      {deploymentStatus.gasUsed && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Used:</span>
                          <span>{deploymentStatus.gasUsed}</span>
                        </div>
                      )}
                      {deploymentStatus.explorerUrl && (
                        <a
                          href={deploymentStatus.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-polygon-purple hover:text-polygon-blue text-xs underline"
                        >
                          View on Polygonscan →
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
    </>
  )
}

