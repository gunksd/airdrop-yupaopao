"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Twitter, Github, Coffee, FileSpreadsheet } from "lucide-react"
import Image from "next/image"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <div className="relative h-8 w-8 overflow-hidden rounded-full mr-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V5mxq70ZjiiRLppAyW22t00G5DEtG5.png"
                alt="鱼泡泡"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-bold">鱼泡泡空投</span>
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-4 px-7">
          <Link
            href="/"
            className={cn(
              "text-lg font-medium transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            首页
          </Link>
          <Link
            href="/airdrops"
            className={cn(
              "text-lg font-medium transition-colors hover:text-foreground/80",
              pathname?.startsWith("/airdrops") ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            空投项目
          </Link>
          <Link
            href="/discussions"
            className={cn(
              "text-lg font-medium transition-colors hover:text-foreground/80",
              pathname?.startsWith("/discussions") ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            讨论区
          </Link>
          <Link
            href="/donate"
            className={cn(
              "text-lg font-medium transition-colors hover:text-foreground/80",
              pathname?.startsWith("/donate") ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Sponsor
            </div>
          </Link>
          <div className="flex gap-4 mt-2">
            <Link
              href="https://docs.google.com/spreadsheets/d/1gnu7hOAF3FxivkPJk3yypyLKGrIoSfHF8vB1nOwyemI/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span className="sr-only">Google Sheets</span>
            </Link>
            <Link
              href="https://x.com/yupaopao0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://github.com/gunksd/airdrop-yupaopao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
