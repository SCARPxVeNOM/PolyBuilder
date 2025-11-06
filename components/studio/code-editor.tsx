"use client"

import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { templates } from "@/lib/templates"

interface CodeEditorProps {
  selectedFile: string | null
  template: string
  onCodeChange?: (code: string) => void
}

export function CodeEditor({ selectedFile, template, onCodeChange }: CodeEditorProps) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("solidity")

  useEffect(() => {
    if (selectedFile) {
      // Get the template content
      const templateContent = templates[template]
      const fileContent = templateContent?.files[selectedFile]
      
      if (fileContent) {
        setCode(fileContent)
      } else {
        setCode(`// File: ${selectedFile}\n// Content will be loaded here`)
      }

      // Determine language from file extension
      if (selectedFile.endsWith(".sol")) {
        setLanguage("solidity")
      } else if (selectedFile.endsWith(".ts") || selectedFile.endsWith(".tsx")) {
        setLanguage("typescript")
      } else if (selectedFile.endsWith(".js") || selectedFile.endsWith(".jsx")) {
        setLanguage("javascript")
      } else if (selectedFile.endsWith(".json")) {
        setLanguage("json")
      } else {
        setLanguage("plaintext")
      }
    }
  }, [selectedFile, template])

  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <p>No file selected</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => {
          const newCode = value || "";
          setCode(newCode);
          onCodeChange?.(newCode);
        }}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          lineNumbers: "on",
          rulers: [80, 120],
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          quickSuggestions: true,
          snippetSuggestions: "inline",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  )
}

