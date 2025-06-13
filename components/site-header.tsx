"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AuthButton } from "@/components/auth-button"
import { Twitter, Github, Coffee, FileSpreadsheet, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import { isAdmin } from "@/lib/auth-utils"

export function SiteHeader() {
  const { data: session } = useSession()
  const userIsAdmin = session?.user?.name && isAdmin(session.user.name)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="https://docs.google.com/spreadsheets/d/1gnu7hOAF3FxivkPJk3yypyLKGrIoSfHF8vB1nOwyemI/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span className="sr-only">Google Sheets</span>
            </Link>
            <Link
              href="https://x.com/yupaopao0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://github.com/gunksd/airdrop-yupaopao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="/donate">
              <Button variant="ghost" size="sm" className="gap-1">
                <Coffee className="h-4 w-4" />
                <span className="hidden sm:inline-block">Sponsor</span>
              </Button>
            </Link>
            {userIsAdmin && (
              <Link href="/admin/airdrops">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline-block">管理</span>
                </Button>
              </Link>
            )}
            <ModeToggle />
            <AuthButton />
            <Link href="/discussions">
              <Button variant="outline" size="sm">
                讨论区
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
