"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { StudioLayout } from "@/components/studio/studio-layout"
import { Loader2 } from "lucide-react"

function StudioContent() {
  const searchParams = useSearchParams()
  const template = searchParams.get("template") || "erc20"

  return <StudioLayout initialTemplate={template} />
}

export default function StudioPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-polygon-purple mx-auto" />
            <p className="text-muted-foreground">Loading Studio...</p>
          </div>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  )
}

