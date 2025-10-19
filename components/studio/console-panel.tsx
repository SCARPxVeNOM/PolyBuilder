"use client"

import { useEffect, useRef } from "react"
import { Terminal, CheckCircle, XCircle, Info, Loader2 } from "lucide-react"

interface ConsolePanelProps {
  logs: string[]
}

export function ConsolePanel({ logs }: ConsolePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const getLogIcon = (log: string) => {
    if (log.includes("✓") || log.includes("success")) {
      return <CheckCircle className="w-3 h-3 text-green-500" />
    }
    if (log.includes("✗") || log.includes("error")) {
      return <XCircle className="w-3 h-3 text-red-500" />
    }
    if (log.includes("⏳") || log.includes("...")) {
      return <Loader2 className="w-3 h-3 text-polygon-blue animate-spin" />
    }
    return <Info className="w-3 h-3 text-polygon-purple" />
  }

  return (
    <div className="h-full flex flex-col bg-black/20">
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <Terminal className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">Console output will appear here</p>
            </div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-2">
              {getLogIcon(log)}
              <span className="flex-1 text-foreground/80">{log}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

