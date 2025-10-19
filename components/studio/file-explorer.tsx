"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FileCode, FileJson } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
}

interface FileExplorerProps {
  selectedFile: string | null
  onSelectFile: (path: string) => void
  template: string
}

// Template file structures
const templateFiles: Record<string, FileNode[]> = {
  erc20: [
    {
      name: "contracts",
      type: "folder",
      path: "contracts",
      children: [
        { name: "Token.sol", type: "file", path: "contracts/Token.sol" },
        { name: "TokenSale.sol", type: "file", path: "contracts/TokenSale.sol" },
      ],
    },
    {
      name: "frontend",
      type: "folder",
      path: "frontend",
      children: [
        { name: "App.tsx", type: "file", path: "frontend/App.tsx" },
        { name: "TokenInfo.tsx", type: "file", path: "frontend/TokenInfo.tsx" },
      ],
    },
    {
      name: "scripts",
      type: "folder",
      path: "scripts",
      children: [
        { name: "deploy.ts", type: "file", path: "scripts/deploy.ts" },
      ],
    },
    { name: "hardhat.config.ts", type: "file", path: "hardhat.config.ts" },
    { name: "package.json", type: "file", path: "package.json" },
  ],
  nft: [
    {
      name: "contracts",
      type: "folder",
      path: "contracts",
      children: [
        { name: "NFT.sol", type: "file", path: "contracts/NFT.sol" },
        { name: "Marketplace.sol", type: "file", path: "contracts/Marketplace.sol" },
      ],
    },
    {
      name: "frontend",
      type: "folder",
      path: "frontend",
      children: [
        { name: "App.tsx", type: "file", path: "frontend/App.tsx" },
        { name: "MintNFT.tsx", type: "file", path: "frontend/MintNFT.tsx" },
        { name: "Gallery.tsx", type: "file", path: "frontend/Gallery.tsx" },
      ],
    },
    {
      name: "scripts",
      type: "folder",
      path: "scripts",
      children: [
        { name: "deploy.ts", type: "file", path: "scripts/deploy.ts" },
      ],
    },
    { name: "hardhat.config.ts", type: "file", path: "hardhat.config.ts" },
    { name: "package.json", type: "file", path: "package.json" },
  ],
  dao: [
    {
      name: "contracts",
      type: "folder",
      path: "contracts",
      children: [
        { name: "Governor.sol", type: "file", path: "contracts/Governor.sol" },
        { name: "GovernanceToken.sol", type: "file", path: "contracts/GovernanceToken.sol" },
        { name: "Timelock.sol", type: "file", path: "contracts/Timelock.sol" },
      ],
    },
    {
      name: "frontend",
      type: "folder",
      path: "frontend",
      children: [
        { name: "App.tsx", type: "file", path: "frontend/App.tsx" },
        { name: "Proposals.tsx", type: "file", path: "frontend/Proposals.tsx" },
        { name: "Voting.tsx", type: "file", path: "frontend/Voting.tsx" },
      ],
    },
    {
      name: "scripts",
      type: "folder",
      path: "scripts",
      children: [
        { name: "deploy.ts", type: "file", path: "scripts/deploy.ts" },
      ],
    },
    { name: "hardhat.config.ts", type: "file", path: "hardhat.config.ts" },
    { name: "package.json", type: "file", path: "package.json" },
  ],
}

function FileIcon({ filename }: { filename: string }) {
  if (filename.endsWith(".sol")) {
    return <FileCode className="w-4 h-4 text-polygon-purple" />
  }
  if (filename.endsWith(".tsx") || filename.endsWith(".jsx") || filename.endsWith(".ts") || filename.endsWith(".js")) {
    return <FileCode className="w-4 h-4 text-polygon-blue" />
  }
  if (filename.endsWith(".json")) {
    return <FileJson className="w-4 h-4 text-yellow-500" />
  }
  return <File className="w-4 h-4 text-muted-foreground" />
}

function FileTreeNode({
  node,
  selectedFile,
  onSelectFile,
  level = 0,
}: {
  node: FileNode
  selectedFile: string | null
  onSelectFile: (path: string) => void
  level?: number
}) {
  const [isOpen, setIsOpen] = useState(level === 0)

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center space-x-2 px-2 py-1 hover:bg-white/5 rounded text-sm"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 text-polygon-blue" />
          <span>{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={cn(
        "w-full flex items-center space-x-2 px-2 py-1 hover:bg-white/5 rounded text-sm",
        selectedFile === node.path && "bg-polygon-purple/20"
      )}
      style={{ paddingLeft: `${level * 12 + 32}px` }}
    >
      <FileIcon filename={node.name} />
      <span>{node.name}</span>
    </button>
  )
}

export function FileExplorer({ selectedFile, onSelectFile, template }: FileExplorerProps) {
  const files = templateFiles[template] || templateFiles.erc20

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  )
}

