import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Web3Provider } from "@/lib/web3/providers"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Polygon Scaffold Platform - Build dApps in Minutes",
  description: "An interactive developer platform that automates Polygon dApp creation, deployment, and learning. Zero setup required.",
  keywords: ["Polygon", "Web3", "dApp", "Blockchain", "Ethereum", "Smart Contracts", "Developer Tools"],
  authors: [{ name: "Polygon Scaffold Team" }],
  openGraph: {
    type: "website",
    title: "Polygon Scaffold Platform",
    description: "Build, deploy, and learn Polygon dApps with zero setup",
    siteName: "Polygon Scaffold Platform",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Web3Provider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  )
}

