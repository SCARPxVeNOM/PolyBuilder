"use client"

import { Code2, Github, Twitter, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Studio", href: "/studio" },
        { name: "Templates", href: "/#templates" },
        { name: "Documentation", href: "/docs" },
        { name: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Learn", href: "/learn" },
        { name: "Examples", href: "/examples" },
        { name: "API Reference", href: "/api" },
        { name: "GitHub", href: "https://github.com/0xPolygon" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Discord", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "Forum", href: "#" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  ]

  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-polygon-purple to-polygon-blue flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                Polygon<span className="text-gradient">Scaffold</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Build, deploy, and learn Polygon dApps with zero setup. The future of Web3 development.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/0xPolygon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:border-polygon-purple/50 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:border-polygon-purple/50 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:border-polygon-purple/50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Polygon Scaffold Platform. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

